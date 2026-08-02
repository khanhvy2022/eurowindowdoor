// @ts-nocheck
import { convertToModelMessages } from 'ai';
import { getDocument, getLatestDocument } from '@/lib/document-store';
import { classifyTask, getRoutingSequence, optimizeMessages, optimizeDocumentContext } from '@/lib/ai/router';
import { streamTextWithFallback } from '@/lib/ai/fallback';
import { ProviderName } from '@/lib/ai/providers';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import { syncDatabaseToSandbox } from '@/lib/ai/sandbox';
import { bashTool, bashBatchTool } from '@/lib/ai/tools/shell';

// --- Enterprise V2 Architecture ---
import { analyzeAndContextualize } from '@/lib/ai/v2/orchestrator';
import { logTransaction, validateResponse } from '@/lib/ai/v2/observability';

// Showroom DB
import { showroomsData } from '@/data/showrooms';

// Pricing Engine
import { 
  pricing, pricingEA60i, pricingKommerling, pricingAsia,
  doorTypes, doorTypesEA60i, doorTypesKommerling, doorTypesAsia,
  glassTypes, glassTypesEA60i, glassTypesKommerling, glassTypesAsia,
  hardwareTypes
} from '@/app/bao-gia/pricing';

export const maxDuration = 60; // max duration for edge/serverless function (up to 60s for Hobby)

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }) as Promise<T>;
}

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn giải pháp cửa Eurowindow cao cấp. 
Nhiệm vụ của bạn là tư vấn cho khách hàng về các dòng sản phẩm cửa của Eurowindow như cửa nhôm (EA55, EA60i), cửa nhựa uPVC (Kommerling, Asia), cửa gỗ, vách kính lớn, kính cản nhiệt Low-E, và các phụ kiện chính hãng đi kèm.

Bạn có quyền truy cập vào các công cụ tìm kiếm tệp tin trong thư mục bảo mật sandbox/ (các file tài liệu nằm trong sandbox/files/ và tệp tin dữ liệu như blogs, projects nằm trong sandbox/data/).
Hãy sử dụng các câu lệnh Unix (ví dụ: 'grep -rn "kính Low-E" sandbox/', 'find sandbox/ -type f', 'cat sandbox/files/file_name') bằng công cụ \`bash\` hoặc \`bash_batch\` để chủ động tìm kiếm và đọc các tài liệu chính thống của Eurowindow khi cần trả lời về thông số kỹ thuật, hệ nhôm, giá cả hay dòng sản phẩm.

Các quy tắc cần tuân thủ nghiêm ngặt:
1. LUÔN LUÔN giao tiếp một cách chuyên nghiệp, lịch sự, tôn trọng khách hàng như một nhân viên tư vấn giải pháp cao cấp của Eurowindow.
2. Trả lời ngắn gọn, đúng trọng tâm câu hỏi của khách hàng, tuyệt đối KHÔNG viết lan man hay suy đoán thông tin.
3. ĐỐI CHIẾU VÀ SỬ DỤNG CHÍNH XÁC thông tin được trích xuất từ tài liệu của công ty trong [NGỮ CẢNH TỪ TÀI LIỆU CÔNG TY] hoặc qua công cụ sandbox để trả lời các thông số kỹ thuật (độ dày profile, chỉ số cách âm dB, hệ phụ kiện, kính hộp, kính Low-E, v.v.).
4. QUY TẮC NGUYÊN TẮC: NẾU THÔNG TIN KHÔNG CÓ TRONG [NGỮ CẢNH TỪ TÀI LIỆU CÔNG TY] HOẶC KHÔNG BẢO ĐẢM ĐỘ CHÍNH XÁC, hãy lịch sự xin lỗi khách hàng và trả lời: "Rất tiếc, tài liệu nội bộ của Eurowindow hiện chưa có thông tin chi tiết về chủ đề này. Anh/Chị vui lòng để lại số điện thoại hoặc email để chuyên viên kỹ thuật trực tiếp liên hệ hỗ trợ." TUYỆT ĐỐI KHÔNG tự bịa đặt hay sử dụng kiến thức bên ngoài không có trong tài liệu.
5. Thường xuyên đề xuất các giải pháp hệ cửa phù hợp theo đúng tài liệu dựa trên nhu cầu của khách (ví dụ: khu vực cần cách âm/cách nhiệt cao -> tư vấn cửa nhôm cầu cách nhiệt EA60i kết hợp kính hộp Low-E).
6. Định dạng câu trả lời rõ ràng, tự nhiên, thân thiện. Hạn chế lạm dụng quá nhiều ký tự đặc biệt hay dấu sao (**) không cần thiết. Trình bày ngắn gọn, súc tích để khách hàng dễ đọc trên điện thoại.
`;

/**
 * Thu thập thông tin khách hàng (lead) từ tin nhắn chat
 */
async function extractAndSaveLead(messages: any[]) {
  try {
    const userMessages = messages.filter((m: any) => m.role === 'user');
    if (userMessages.length === 0) return;

    // Lấy tối đa 2 tin nhắn gần nhất của user để phân tích thông tin
    const recentMessages = userMessages.slice(-2);
    const combinedText = recentMessages.map((m: any) => {
      if (!m) return '';
      if (typeof m.content === 'string') return m.content;
      if (Array.isArray(m.content)) {
        return m.content.map((p: any) => p.text || '').join(' ');
      }
      if (m.parts && Array.isArray(m.parts)) {
        return m.parts.map((p: any) => p.text || '').join(' ');
      }
      return '';
    }).join('\n');

    const phoneRegex = /(?:\+84|0)\s*[35789]\d(?:\s*[\s\.\-]?\s*\d){7}\b/g;
    const phoneMatches = combinedText.match(phoneRegex);

    if (phoneMatches && phoneMatches.length > 0) {
      const rawPhone = phoneMatches[0];
      const phoneNumber = rawPhone.replace(/[^\d\+]/g, '');

      const nameRegex = /(?:tên\s+(?:tôi|em|mình)\s+là|tên\s+là|tôi\s+là|gọi\s+tôi\s+là|xưng\s+hô\s+là|anh|chị)\s+([A-ZÀ-ỹ][a-zà-ỹ]*(\s+[A-ZÀ-ỹ][a-zà-ỹ]*){0,3})/i;
      const nameMatch = combinedText.match(nameRegex);
      let customerName = '';
      if (nameMatch && nameMatch[1]) {
        customerName = nameMatch[1].trim();
      }

      const addressKeywords = ['địa chỉ', 'ở', 'tại', 'giao tới', 'giao qua', 'quận', 'huyện', 'tỉnh', 'thành phố', 'số nhà'];
      let address = '';
      const addressRegex = /(?:địa\s+chỉ\s+(?:là|ở|tại)|ở\s+tại|ở|giao\s+(?:tới|qua))\s+([^,\.\n\?]+(?:,\s*[^,\.\n\?]+)*)/i;
      const addressMatch = combinedText.match(addressRegex);
      
      if (addressMatch && addressMatch[1]) {
        address = addressMatch[1].trim();
      } else {
        const lines = combinedText.split('\n');
        for (const line of lines) {
          if (addressKeywords.some(kw => line.toLowerCase().includes(kw))) {
            address = line.trim();
            break;
          }
        }
      }

      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        await db.collection('leads').updateOne(
          { phone: phoneNumber },
          {
            $set: {
              phone: phoneNumber,
              name: customerName || undefined,
              address: address || undefined,
              rawText: combinedText,
              updatedAt: new Date()
            },
            $setOnInsert: {
              createdAt: new Date()
            }
          },
          { upsert: true }
        );
        console.log(`[Lead Capture] Saved lead: Phone=${phoneNumber}, Name=${customerName}, Address=${address}`);
      }
    }
  } catch (err) {
    console.error('[Lead Capture Error]', err);
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const { messages, data, documentId: bodyDocumentId, model: chosenModel } = await req.json();

    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      syncDatabaseToSandbox().catch(err => console.error('[Sandbox Sync Error]', err));
    }

    // Run lead extraction asynchronously in background without blocking response stream
    extractAndSaveLead(messages).catch(err => console.error('[API Lead Error]', err));

    const latestMessage = messages[messages.length - 1];
    let searchContent = '';
    
    if (latestMessage) {
      if (latestMessage.parts) {
        searchContent = latestMessage.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      } else if (typeof latestMessage.content === 'string') {
        searchContent = latestMessage.content;
      }
    }

    // 1. Context & Intent Orchestration
    const { intent, contextualizedQuery } = await analyzeAndContextualize(messages, searchContent);

    // 2. Gateway Router Logic
    let context = '';
    let targetFileName = '';
    let responseSource = 'LLM';
    let retrievalHits = 0;

    const documentId = bodyDocumentId || (Array.isArray(data) ? data[0]?.documentId : data?.documentId);

    // If explicit document provided, override routing to use that document
    if (documentId) {
      const doc = getDocument(documentId);
      if (doc) {
        context = doc.content;
        targetFileName = doc.fileName;
        responseSource = 'DocumentStore';
        retrievalHits = 1;
      } else {
        try {
          await connectToDatabase();
          const db = mongoose.connection.db;
          if (db) {
            const mongoDoc = await db.collection('documents').findOne({ id: documentId });
            if (mongoDoc) {
              targetFileName = mongoDoc.file_name;
              const chunks = await db.collection('document_chunks')
                .find({ document_id: documentId })
                .toArray();
              if (chunks && chunks.length > 0) {
                context = chunks.map((c: any) => c.content).join('\n\n');
                responseSource = 'MongoDBStore';
                retrievalHits = chunks.length;
              }
            }
          }
        } catch (dbErr) {
          console.error('Error fetching specific document from MongoDB fallback:', dbErr);
        }
      }
    } else {
      // Execute the 5-branch router logic based on Intent
      if (intent === 'showroom') {
        context = `[DANH SÁCH SHOWROOM EUROWINDOW]\n${JSON.stringify(showroomsData, null, 2)}`;
        responseSource = 'ShowroomDB';
        retrievalHits = showroomsData.length;
      } 
      else if (intent === 'quote') {
        const pricingGuide = `
[TÀI LIỆU HƯỚNG DẪN TÍNH BÁO GIÁ SƠ BỘ]
- Diện tích cửa (m2) = Chiều rộng (m) * Chiều cao (m)
- Diện tích tối thiểu để tính giá là 1.0 m2 (nếu diện tích cửa < 1.0 m2, vẫn tính là 1.0 m2).
- Thành tiền 1 bộ cửa = Diện tích cửa tính giá * (Đơn giá cửa cơ bản/m2 + Đơn giá kính phụ trội/m2 + Đơn giá phụ kiện cửa/m2)
- Tổng chi phí = Thành tiền 1 bộ * Số lượng bộ

[BẢNG TRA CỨU TỪ ĐỒNG NGHĨA & TÊN GỌI KHÁCH HÀNG]
- Các loại cửa Hệ nhôm EA55: ${JSON.stringify(doorTypes, null, 2)}
- Các loại cửa Hệ nhôm EA60i: ${JSON.stringify(doorTypesEA60i, null, 2)}
- Các loại cửa Hệ nhựa Kommerling: ${JSON.stringify(doorTypesKommerling, null, 2)}
- Các loại cửa Hệ nhựa Asia: ${JSON.stringify(doorTypesAsia, null, 2)}

[BẢNG GIÁ VÀ HỆ CỬA EUROWINDOW CHI TIẾT]
- Bảng giá Hệ nhôm EA55 (nhôm không cầu cách nhiệt): ${JSON.stringify(pricing, null, 2)}
- Bảng giá Hệ nhôm EA60i (nhôm có cầu cách nhiệt cao cấp): ${JSON.stringify(pricingEA60i, null, 2)}
- Bảng giá Hệ nhựa Kommerling uPVC: ${JSON.stringify(pricingKommerling, null, 2)}
- Bảng giá Hệ nhựa Asia uPVC: ${JSON.stringify(pricingAsia, null, 2)}
`;
        context = pricingGuide;
        responseSource = 'PricingEngine';
        retrievalHits = 1;
      } 
      else if (intent === 'technical' || intent === 'warranty' || intent === 'company_info') {
        if (process.env.ENABLE_CHAT_RAG !== 'false') {
          try {
            const { retrieveRelevantContextWithDetails } = await import('@/lib/rag');
            const details = await withTimeout(
              retrieveRelevantContextWithDetails(contextualizedQuery, 8),
              3_000,
              'Knowledge retrieval'
            );
            context = details.compressedText;
            responseSource = 'EnterpriseHybridRAG';
            retrievalHits = details.top8Candidates.length;

            // Save last debug info for Admin Debug Instrumentation
            (globalThis as any).lastRagDebugInfo = {
              timestamp: new Date().toISOString(),
              query: searchContent,
              contextualizedQuery,
              intent,
              confidenceScore: details.confidenceScore,
              isLowConfidence: details.isLowConfidence,
              expandedQueries: details.expandedQueries,
              top20Candidates: details.top20Candidates,
              top8Candidates: details.top8Candidates,
            };

            if (details.isLowConfidence && !context) {
              context = '[CẢNH BÁO KHÔNG ĐỦ DỮ LIỆU]: Không tìm thấy đoạn tài liệu nào đạt độ tin cậy >= 0.75.';
            }
          } catch (ragError) {
            console.log('RAG search timeout/failed:', (ragError as Error).message);
          }
        }
      } 
      else {
        // intent === 'general'
        responseSource = 'GeneralLLM';
        retrievalHits = 0;
      }
    }

    if (!context && !documentId && (intent === 'technical' || intent === 'warranty')) {
      const latestDoc = getLatestDocument();
      if (latestDoc) {
        context = latestDoc.content;
      }
    }

    context = optimizeDocumentContext(context, 25000);

    let systemPromptWithContext = context 
      ? `${SYSTEM_PROMPT}\n\n[NGỮ CẢNH TỪ TÀI LIỆU CÔNG TY]\n${context}\n\nHãy sử dụng ngữ cảnh trên để trả lời câu hỏi của khách hàng nếu nó liên quan.`
      : SYSTEM_PROMPT;

    if (targetFileName) {
      const sanitizedName = targetFileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      systemPromptWithContext += `\n\n[YÊU CẦU QUAN TRỌNG]\nNgười dùng đã chỉ định tài liệu cụ thể: "${targetFileName}". Bạn CHỈ được tìm kiếm và truy vấn thông tin trong tệp tin "sandbox/files/${sanitizedName}". TUYỆT ĐỐI KHÔNG được sử dụng các công cụ tìm kiếm trên các tệp tin khác.`;
    }

    const modelMessages = [];
    for (const msg of messages) {
      if (msg.parts) {
        const converted = await convertToModelMessages([msg]);
        modelMessages.push(...converted);
      } else if (typeof msg.content === 'string') {
        modelMessages.push({
          role: msg.role,
          content: [{ type: 'text', text: msg.content }]
        });
      } else {
        modelMessages.push(msg);
      }
    }

    const optimizedMessages = optimizeMessages(modelMessages);
    const task = classifyTask(optimizedMessages);

    let sequence: ProviderName[] = [];
    if (chosenModel && chosenModel !== 'auto') {
      const primaryProvider = chosenModel.split(':')[0] as ProviderName;
      sequence = [primaryProvider, ...getRoutingSequence(task).filter(p => p !== primaryProvider)];
    } else {
      sequence = getRoutingSequence(task);
    }

    // 3. Response Generation with Context Guard & Observability Logging
    const { result, provider, modelName, fallbackTriggered } = await streamTextWithFallback({
      sequence,
      task,
      messages: optimizedMessages,
      system: systemPromptWithContext,
      temperature: 0.7,
      preferredModel: chosenModel,
      tools: {
        bash: bashTool,
        bash_batch: bashBatchTool,
      },
      maxSteps: 5,
      onFinish: async (event) => {
        const latencyMs = Date.now() - startTime;
        
        // Context Guard & Response Validator
        await validateResponse(event.text, intent);
        
        // Observability 
        await logTransaction({
          sessionId: 'session-' + Date.now(), // Real app would pull from req or context
          user_question: searchContent,
          intent,
          selected_route: intent, // Map branch
          retrieval_hits: retrievalHits,
          prompt_sent_to_llm: systemPromptWithContext,
          llm_raw_response: event.text,
          fallback_used: fallbackTriggered,
          fallback_reason: fallbackTriggered ? 'Multi-provider fallback triggered during streamText' : undefined,
          response_source: responseSource,
          latencyMs,
          promptTokens: event.usage?.promptTokens || 0,
          completionTokens: event.usage?.completionTokens || 0,
          totalTokens: event.usage?.totalTokens || 0,
          model: modelName,
          provider: provider
        });
      },
      onError: async (event) => {
        const latencyMs = Date.now() - startTime;
        console.error('[Route] Async stream failed, logging observability...', event.error);
        await logTransaction({
          sessionId: 'session-' + Date.now(),
          user_question: searchContent,
          intent,
          selected_route: intent,
          retrieval_hits: retrievalHits,
          prompt_sent_to_llm: systemPromptWithContext,
          llm_raw_response: `[Stream Error] ${String(event.error)}`,
          fallback_used: fallbackTriggered,
          fallback_reason: 'Stream failed asynchronously',
          response_source: responseSource,
          latencyMs,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          model: modelName,
          provider: provider
        });
      }
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'X-AI-Provider': provider,
        'X-AI-Model': modelName,
        'X-AI-Fallback-Triggered': fallbackTriggered.toString(),
        'X-AI-Intent': intent
      }
    });
  } catch (error: any) {
    console.error('Error in chat API, invoking friendly fallback response:', error);
    
    // TEMPORARY: Write error to file for debugging
    try {
      require('fs').writeFileSync('F:/Nextjs/eurowindowdoor/chat-error.log', error.stack || error.toString());
    } catch (e) {}

    // Log fatal fallback
    await logTransaction({
      sessionId: 'session-' + Date.now(),
      user_question: "Unknown/Crash",
      intent: 'general', // Default fallback intent
      selected_route: 'crash',
      retrieval_hits: 0,
      prompt_sent_to_llm: '',
      llm_raw_response: '',
      fallback_used: true,
      fallback_reason: `API Route Crash: ${error.message}`,
      response_source: 'HardcodedFallback',
      latencyMs: Date.now() - startTime,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      model: 'error',
      provider: 'error'
    });
    
    // Friendly fallback
    const friendlyMessage = "Hiện tại trợ lý đang bận không thể trả lời tin nhắn của quý khách ngay được, quý khách có thể liên hệ lại tôi sau hoặc liên hệ qua Zalo, gọi điện tới Mr. Thắng để được tư vấn thêm.";
    
    // Gửi phản hồi theo đúng giao thức UIMessageStream (SSE format) cho @ai-sdk/react v4
    const textPartId = `fallback-${Date.now()}`;
    const ssePayload = [
      { type: 'start' },
      { type: 'start-step' },
      { type: 'text-start', id: textPartId },
      { type: 'text-delta', id: textPartId, delta: friendlyMessage },
      { type: 'text-end', id: textPartId },
      { type: 'finish-step' },
      { type: 'finish' },
    ].map(part => `data: ${JSON.stringify(part)}\n\n`).join('') + 'data: [DONE]\n\n';
    
    return new Response(ssePayload, {
      status: 200,
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1',
        'x-accel-buffering': 'no',
        'X-AI-Provider': 'fallback-error-handler',
        'X-AI-Model': 'friendly-fallback-msg',
        'X-AI-Fallback-Triggered': 'true'
      }
    });
  }
}

