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
import { 
  pricing, 
  pricingEA60i, 
  pricingKommerling, 
  pricingAsia,
  doorTypes,
  doorTypesEA60i,
  doorTypesKommerling,
  doorTypesAsia,
  glassTypes,
  glassTypesEA60i,
  glassTypesKommerling,
  glassTypesAsia,
  hardwareTypes
} from '@/app/bao-gia/pricing';

export const maxDuration = 60; // max duration for edge/serverless function (up to 60s for Hobby)

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn cửa Eurowindow cao cấp. 
Nhiệm vụ của bạn là tư vấn cho khách hàng về các dòng sản phẩm cửa của Eurowindow như cửa nhôm, cửa nhựa uPVC, cửa gỗ, vách kính lớn, và các phụ kiện đi kèm.

Bạn có quyền truy cập vào các công cụ tìm kiếm tệp tin trong thư mục bảo mật sandbox/ (các file tài liệu nằm trong sandbox/files/ và tệp tin dữ liệu như blogs, projects nằm trong sandbox/data/).
Hãy sử dụng các câu lệnh Unix (ví dụ: 'grep -rn "kính Low-E" sandbox/', 'find sandbox/ -type f', 'cat sandbox/files/file_name') bằng công cụ \`bash\` hoặc \`bash_batch\` để chủ động tìm kiếm và đọc các tài liệu chính thống của Eurowindow khi cần trả lời về thông số kỹ thuật, hệ nhôm, giá cả hay dòng sản phẩm.

Các quy tắc cần tuân thủ nghiêm ngặt:
1. LUÔN LUÔN giao tiếp một cách chuyên nghiệp, lịch sự, tôn trọng khách hàng như một nhân viên tư vấn giải pháp cao cấp của Eurowindow.
2. Trả lời ngắn gọn, đúng trọng tâm câu hỏi của khách hàng, tuyệt đối KHÔNG viết lan man hay giả định thông tin.
3. ĐỐI CHIẾU VÀ SỬ DỤNG CHÍNH XÁC thông tin được trích xuất từ tài liệu của công ty qua công cụ để trả lời các thông số kỹ thuật (độ dày profile, chỉ số cách âm dB, hệ phụ kiện, kính hộp, kính Low-E, v.v.).
4. NẾU THÔNG TIN KHÔNG CÓ TRONG TÀI LIỆU HOẶC KHÔNG BẢO ĐẢM ĐỘ CHÍNH XÁC, hãy lịch sự xin lỗi khách hàng và đề xuất họ để lại số điện thoại/email để chuyên viên kỹ thuật trực tiếp liên hệ hỗ trợ. TUYỆT ĐỐI KHÔNG tự bịa đặt hay suy đoán thông số kỹ thuật hoặc chính sách bán hàng.
5. Thường xuyên đề xuất các giải pháp hệ cửa phù hợp theo đúng tài liệu dựa trên nhu cầu của khách (ví dụ: khu vực cần cách âm/cách nhiệt cao -> tư vấn cửa nhôm cầu cách nhiệt kết hợp kính hộp).
6. Định dạng câu trả lời rõ ràng bằng Markdown (dùng bullet points, in đậm các thuật ngữ quan trọng) để khách hàng dễ theo dõi.
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
        return m.content.map((p: any) => {
          if (typeof p === 'string') return p;
          return p.text || '';
        }).join(' ');
      }
      if (m.parts && Array.isArray(m.parts)) {
        return m.parts.map((p: any) => {
          if (typeof p === 'string') return p;
          return p.text || '';
        }).join(' ');
      }
      return '';
    }).join('\n');

    // Regex phát hiện số điện thoại tại Việt Nam (chấp nhận khoảng trắng, dấu chấm, dấu gạch ngang)
    // Bắt đầu bằng 0 hoặc +84, sau đó là 3, 5, 7, 8, 9 và các chữ số tiếp theo
    const phoneRegex = /(?:\+84|0)\s*[35789]\d(?:\s*[\s\.\-]?\s*\d){7}\b/g;
    const phoneMatches = combinedText.match(phoneRegex);

    if (phoneMatches && phoneMatches.length > 0) {
      // Làm sạch số điện thoại bằng cách loại bỏ các khoảng trắng và dấu ngăn cách
      const rawPhone = phoneMatches[0];
      const phoneNumber = rawPhone.replace(/[^\d\+]/g, '');

      // Tìm tên có thể có của khách hàng dựa trên các cấu trúc thông thường
      const nameRegex = /(?:tên\s+(?:tôi|em|mình)\s+là|tên\s+là|tôi\s+là|gọi\s+tôi\s+là|xưng\s+hô\s+là|anh|chị)\s+([A-ZÀ-ỹ][a-zà-ỹ]*(\s+[A-ZÀ-ỹ][a-zà-ỹ]*){0,3})/i;
      const nameMatch = combinedText.match(nameRegex);
      let customerName = '';
      if (nameMatch && nameMatch[1]) {
        customerName = nameMatch[1].trim();
      }

      // Tìm địa chỉ
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

      // Lưu/Cập nhật thông tin khách hàng vào MongoDB
      await connectToDatabase();
      const db = mongoose.connection.db;
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
  } catch (err) {
    console.error('[Lead Capture Error]', err);
  }
}

export async function POST(req: Request) {
  try {
    const { messages, data, documentId: bodyDocumentId, model: chosenModel } = await req.json();

    // Đồng bộ tài liệu sang sandbox (chỉ chạy ở môi trường phát triển/local để tránh lỗi hệ thống file trên Vercel)
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      syncDatabaseToSandbox().catch(err => console.error('[Sandbox Sync Error]', err));
    }

    // Thu thập lead nếu khách hàng để lại thông tin (dùng await để đảm bảo lưu thành công trên Serverless)
    await extractAndSaveLead(messages).catch(err => console.error('[API Lead Error]', err));

    // Lấy tin nhắn cuối cùng của người dùng để search context
    const latestMessage = messages[messages.length - 1];
    let context = '';
    let targetFileName = '';

    // Try to get document context from request
    const documentId = bodyDocumentId || (Array.isArray(data) ? data[0]?.documentId : data?.documentId);

    // 1. If a specific document is requested, load it
    if (documentId) {
      // Get specific document by ID
      const doc = getDocument(documentId);
      if (doc) {
        context = doc.content;
        targetFileName = doc.fileName;
      } else {
        // Fallback to MongoDB for specific document content
        try {
          await connectToDatabase();
      const db = mongoose.connection.db;
          const mongoDoc = await db.collection('documents').findOne({ id: documentId });
          if (mongoDoc) {
            targetFileName = mongoDoc.file_name;
            const chunks = await db.collection('document_chunks')
              .find({ document_id: documentId })
              .toArray();
            if (chunks && chunks.length > 0) {
              context = chunks.map((c: any) => c.content).join('\n\n');
            }
          }
        } catch (dbErr) {
          console.error('Error fetching specific document from MongoDB fallback:', dbErr);
        }
      }
    } else if (latestMessage) {
      // 2. General Chat Mode: Always use semantic/keyword RAG search across ALL documents
      let searchContent = '';
      if (latestMessage.parts) {
        searchContent = latestMessage.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      } else if (typeof latestMessage.content === 'string') {
        searchContent = latestMessage.content;
      }

      if (searchContent) {
        try {
          const { retrieveRelevantContext } = await import('@/lib/rag');
          context = await retrieveRelevantContext(searchContent, 25);
        } catch (ragError) {
          console.log('RAG search failed:', (ragError as Error).message);
        }
      }
    }
    
    // Tự động phát hiện yêu cầu báo giá để nạp ngữ cảnh bảng giá từ mã nguồn dự án
    let isPricingRequest = false;
    if (latestMessage) {
      let contentStr = '';
      if (typeof latestMessage.content === 'string') {
        contentStr = latestMessage.content;
      } else if (Array.isArray(latestMessage.content)) {
        contentStr = latestMessage.content.map((p: any) => p.text || '').join(' ');
      } else if (latestMessage.parts) {
        contentStr = latestMessage.parts.map((p: any) => p.text || '').join(' ');
      }
      
      const cleanContent = contentStr.toLowerCase();
      // Nhận diện rộng các từ khóa liên quan đến giá, báo giá, tiền, chi phí, hoặc các phép tính
      const pricingKeywords = [
        'giá', 'gia', 'báo', 'bao', 'phí', 'phi', 'tiền', 'tien', 
        'đơn', 'don', 'tính', 'tinh', 'nhiêu', 'nhieu', 'tổng', 'tong',
        'bao nhiêu', 'bao nhieu', 'hết bao', 'het bao', 'bao nhiêu tiền', 'bao nhieu tien'
      ];
      if (
        pricingKeywords.some(kw => cleanContent.includes(kw)) ||
        cleanContent.includes('đơn giá') ||
        cleanContent.includes('tính giá') ||
        cleanContent.includes('giá cả')
      ) {
        isPricingRequest = true;
      }
    }

    if (isPricingRequest) {
      try {
        const pricingGuide = `
[TÀI LIỆU HƯỚNG DẪN TÍNH BÁO GIÁ SƠ BỘ]
- Diện tích cửa (m2) = Chiều rộng (m) * Chiều cao (m)
- Diện tích tối thiểu để tính giá là 1.0 m2 (nếu diện tích cửa < 1.0 m2, vẫn tính là 1.0 m2).
- Thành tiền 1 bộ cửa = Diện tích cửa tính giá * (Đơn giá cửa cơ bản/m2 + Đơn giá kính phụ trội/m2 + Đơn giá phụ kiện cửa/m2)
- Tổng chi phí = Thành tiền 1 bộ * Số lượng bộ

[BẢNG TRA CỨU TỪ ĐỒNG NGHĨA & TÊN GỌI KHÁCH HÀNG (Sử dụng bảng này để khớp từ khóa viết sai chính tả, viết tắt hoặc ngôn từ tự nhiên của khách hàng sang Mã Khóa gốc)]
- Các loại cửa Hệ nhôm EA55:
${JSON.stringify(doorTypes, null, 2)}

- Các loại cửa Hệ nhôm EA60i:
${JSON.stringify(doorTypesEA60i, null, 2)}

- Các loại cửa Hệ nhựa Kommerling:
${JSON.stringify(doorTypesKommerling, null, 2)}

- Các loại cửa Hệ nhựa Asia:
${JSON.stringify(doorTypesAsia, null, 2)}

- Phân loại kính Hệ nhôm EA55:
${JSON.stringify(glassTypes, null, 2)}

- Phân loại kính Hệ nhôm EA60i:
${JSON.stringify(glassTypesEA60i, null, 2)}

- Phân loại kính Hệ nhựa Kommerling:
${JSON.stringify(glassTypesKommerling, null, 2)}

- Phân loại kính Hệ nhựa Asia:
${JSON.stringify(glassTypesAsia, null, 2)}

- Các hãng phụ kiện đi kèm:
${JSON.stringify(hardwareTypes, null, 2)}

[BẢNG GIÁ VÀ HỆ CỬA EUROWINDOW CHI TIẾT (Đơn giá cơ bản và phụ trội để tính toán)]
- Bảng giá Hệ nhôm EA55 (nhôm không cầu cách nhiệt):
${JSON.stringify(pricing, null, 2)}

- Bảng giá Hệ nhôm EA60i (nhôm có cầu cách nhiệt cao cấp):
${JSON.stringify(pricingEA60i, null, 2)}

- Bảng giá Hệ nhựa Kommerling uPVC (nhựa châu Âu cao cấp):
${JSON.stringify(pricingKommerling, null, 2)}

- Bảng giá Hệ nhựa Asia uPVC (nhựa kinh tế):
${JSON.stringify(pricingAsia, null, 2)}
`;
        context = pricingGuide + "\n\n" + context;
      } catch (err) {
        console.error('Error injecting pricing data to context:', err);
      }
    }

    // 3. Absolute Fallback: If still no context found, load the latest uploaded document
    if (!context) {
      const latestDoc = getLatestDocument();
      if (latestDoc) {
        context = latestDoc.content;
      } else {
        // Fallback to MongoDB latest document
        try {
          await connectToDatabase();
      const db = mongoose.connection.db;
          const latestMongoDocs = await db.collection('documents')
            .find({})
            .sort({ created_at: -1 })
            .limit(1)
            .toArray();
          if (latestMongoDocs && latestMongoDocs.length > 0) {
            const docId = latestMongoDocs[0].id || latestMongoDocs[0]._id.toString();
            const chunks = await db.collection('document_chunks')
              .find({ document_id: docId })
              .toArray();
            if (chunks && chunks.length > 0) {
              context = chunks.map((c: any) => c.content).join('\n\n');
            }
          }
        } catch (dbErr) {
          console.error('Error fetching latest document from MongoDB fallback:', dbErr);
        }
      }
    }

    // Tối ưu hóa độ dài của context
    context = optimizeDocumentContext(context, 25000);

    let systemPromptWithContext = context 
      ? `${SYSTEM_PROMPT}\n\n[NGỮ CẢNH TỪ TÀI LIỆU CÔNG TY]\n${context}\n\nHãy sử dụng ngữ cảnh trên để trả lời câu hỏi của khách hàng nếu nó liên quan.`
      : SYSTEM_PROMPT;

    if (targetFileName) {
      const sanitizedName = targetFileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      systemPromptWithContext += `\n\n[YÊU CẦU QUAN TRỌNG]\nNgười dùng đã chỉ định tài liệu cụ thể: "${targetFileName}". Bạn CHỈ được tìm kiếm và truy vấn thông tin trong tệp tin "sandbox/files/${sanitizedName}". TUYỆT ĐỐI KHÔNG được sử dụng các công cụ tìm kiếm trên các tệp tin khác.`;
    }

    // Convert UI messages (with parts) to model messages for streamText
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

    // Tối ưu hóa chuỗi hội thoại (history truncation & local summary)
    const optimizedMessages = optimizeMessages(modelMessages);

    // Xác định loại tác vụ tự động
    const task = classifyTask(optimizedMessages);

    // Xây dựng chuỗi ưu tiên nhà cung cấp
    let sequence: ProviderName[] = [];
    if (chosenModel && chosenModel !== 'auto') {
      const primaryProvider = chosenModel.split(':')[0] as ProviderName;
      sequence = [primaryProvider, ...getRoutingSequence(task).filter(p => p !== primaryProvider)];
    } else {
      sequence = getRoutingSequence(task);
    }

    // Thực thi streaming với cơ chế tự động chuyển đổi fallback
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
    });

    return result.toDataStreamResponse({
      headers: {
        'X-AI-Provider': provider,
        'X-AI-Model': modelName,
        'X-AI-Fallback-Triggered': fallbackTriggered ? 'true' : 'false',
      },
    });
  } catch (error: any) {
    console.error('Error in chat API, invoking friendly fallback response:', error);
    
    // Khi toàn bộ AI providers đều quá tải hoặc hết quota, trả về tin nhắn thân thiện theo định dạng Vercel AI SDK stream protocol
    const friendlyMessage = "Hiện tại trợ lý đang bận không thể trả lời tin nhắn của quý khách ngay được, quý khách có thể liên hệ lại tôi sau hoặc liên hệ qua Zalo, gọi điện tới Mr. Thắng để được tư vấn thêm.";
    const textEncoder = new TextEncoder();
    // Gửi phản hồi theo đúng giao thức AI SDK (tiền tố 0: biểu diễn text chunk)
    const formattedProtocolMsg = `0:${JSON.stringify(friendlyMessage)}\n`;
    
    return new Response(textEncoder.encode(formattedProtocolMsg), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-AI-Provider': 'fallback-error-handler',
        'X-AI-Model': 'friendly-fallback-msg',
        'X-AI-Fallback-Triggered': 'true'
      }
    });
  }
}

