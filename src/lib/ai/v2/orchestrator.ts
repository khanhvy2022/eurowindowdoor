import { generateObject } from 'ai';
import { z } from 'zod';
import { getProviderModel } from '../providers';

export type UserIntent = 'showroom' | 'technical' | 'quote' | 'warranty' | 'general' | 'company_info';

export interface AnalyzedQuery {
  intent: UserIntent;
  contextualizedQuery: string;
}

export async function analyzeAndContextualize(
  messages: Array<{ role: string; content?: any; parts?: any }>,
  latestQuery: string
): Promise<AnalyzedQuery> {
  if (!latestQuery || latestQuery.trim() === '') {
    return { intent: 'general', contextualizedQuery: '' };
  }

  const cleanText = latestQuery.toLowerCase().trim();

  // Fast Path: Common greetings / short simple queries (0ms latency)
  const isGreeting = /^(chào|chào bạn|hello|hi|xin chào|dạ chào|cảm ơn|thank|tạm biệt|bye)/i.test(cleanText);
  if (isGreeting) {
    return { intent: 'general', contextualizedQuery: latestQuery };
  }

  let fastIntent: UserIntent | null = null;
  if (cleanText.includes('thành lập') || cleanText.includes('công ty') || cleanText.includes('lịch sử') || cleanText.includes('tổng giám đốc') || cleanText.includes('ai sáng lập')) {
    fastIntent = 'company_info';
  } else if (cleanText.includes('showroom') || cleanText.includes('địa chỉ') || cleanText.includes('chi nhánh') || cleanText.includes('ở đâu') || cleanText.includes('nhà máy')) {
    fastIntent = 'showroom';
  } else if (cleanText.includes('giá') || cleanText.includes('chi phí') || cleanText.includes('báo giá') || cleanText.includes('bao nhiêu tiền') || cleanText.includes('tính giá')) {
    fastIntent = 'quote';
  } else if (cleanText.includes('bảo hành') || cleanText.includes('hậu mãi') || cleanText.includes('đổi trả')) {
    fastIntent = 'warranty';
  } else if (cleanText.includes('nhôm') || cleanText.includes('nhựa') || cleanText.includes('upvc') || cleanText.includes('kính') || cleanText.includes('ea55') || cleanText.includes('ea60i') || cleanText.includes('low-e')) {
    fastIntent = 'technical';
  }

  // Check if query needs pronoun rewriting ("nó", "loại này", "đó")
  const needsRewriting = /(nó|loại này|cái này|đó|kia|thế nào)/i.test(cleanText) && messages.length > 2;

  // If we have a fast matched intent or query is short/direct, return INSTANTLY (0ms latency)
  if (fastIntent || !needsRewriting) {
    return { intent: fastIntent || 'general', contextualizedQuery: latestQuery };
  }

  // Extract recent conversation history (last 4 turns)
  const recentTurns: Array<{ role: string; text: string }> = [];
  const nonSystem = messages.filter(m => m.role !== 'system');
  const slice = nonSystem.slice(-5, -1);

  slice.forEach(msg => {
    let text = '';
    if (typeof msg.content === 'string') {
      text = msg.content;
    } else if (Array.isArray(msg.content)) {
      text = msg.content.map((p: any) => p.text || '').join(' ');
    } else if (msg.parts && Array.isArray(msg.parts)) {
      text = msg.parts.map((p: any) => p.text || '').join(' ');
    }
    if (text.trim()) {
      recentTurns.push({ role: msg.role === 'user' ? 'Khách' : 'Trợ lý', text: text.trim().slice(0, 300) });
    }
  });

  const historyStr = recentTurns.map(t => `${t.role}: ${t.text}`).join('\n');

  try {
    const prompt = `Bạn là lõi phân tích ngữ cảnh (CCM) và phân loại ý định (Intent Classifier) của chatbot Eurowindow.
Dựa vào lịch sử hội thoại và câu hỏi cuối cùng của khách hàng, hãy thực hiện 2 việc:
1. Phân loại ý định (intent) vào MỘT trong 6 loại sau:
   - "showroom": Khách hỏi địa chỉ, số điện thoại, thông tin về showroom, chi nhánh, nhà máy.
   - "technical": Khách hỏi về kỹ thuật, tính năng sản phẩm (cửa nhôm, uPVC, vách kính, low-e), bản vẽ, bảo dưỡng kỹ thuật.
   - "quote": Khách hỏi giá tiền, báo giá, chi phí, dự toán.
   - "warranty": Khách hỏi về chính sách bảo hành, điều khoản dịch vụ hậu mãi.
   - "company_info": Khách hỏi về lịch sử công ty, năm thành lập, thông tin doanh nghiệp, người sáng lập.
   - "general": Khách chào hỏi xã giao (chào bạn, cảm ơn, tạm biệt) hoặc các câu không thuộc 5 loại trên.
2. Viết lại câu hỏi (contextualizedQuery): Giải mã các từ thay thế ("nó", "loại này", "cái đó") dựa vào lịch sử để thành một câu hỏi độc lập hoàn chỉnh. Nếu câu đã đầy đủ hoặc là câu xã giao, giữ nguyên.

LỊCH SỬ HỘI THOẠI:
${historyStr}

CÂU HỎI CUỐI:
"${latestQuery}"
`;

    // Timeout intent classification at 1200ms to guarantee zero delay for streaming
    const classifyPromise = generateObject({
      model: getProviderModel('gemini', 'gemini-2.0-flash'),
      schema: z.object({
        intent: z.enum(['showroom', 'technical', 'quote', 'warranty', 'company_info', 'general']),
        contextualizedQuery: z.string().describe('Câu hỏi đã được bổ sung ngữ cảnh'),
      }),
      prompt,
      temperature: 0.1,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Orchestrator timeout')), 1200)
    );

    const { object } = await Promise.race([classifyPromise, timeoutPromise]);
    console.log(`[Orchestrator] Intent: ${object.intent} | Rewritten: "${object.contextualizedQuery}"`);
    return object;
  } catch (error) {
    console.error('[Orchestrator] Failed to analyze query:', error);
    
    // Fallback heuristic classification
    const cleanText = latestQuery.toLowerCase();
    let fallbackIntent: UserIntent = 'general';
    
    if (cleanText.includes('thành lập') || cleanText.includes('công ty') || cleanText.includes('lịch sử') || cleanText.includes('tổng giám đốc')) {
      fallbackIntent = 'company_info';
    } else if (cleanText.includes('showroom') || cleanText.includes('địa chỉ') || cleanText.includes('chi nhánh') || cleanText.includes('ở đâu')) {
      fallbackIntent = 'showroom';
    } else if (cleanText.includes('giá') || cleanText.includes('chi phí') || cleanText.includes('báo giá') || cleanText.includes('bao nhiêu tiền')) {
      fallbackIntent = 'quote';
    } else if (cleanText.includes('bảo hành') || cleanText.includes('hậu mãi')) {
      fallbackIntent = 'warranty';
    } else if (cleanText.includes('nhôm') || cleanText.includes('nhựa') || cleanText.includes('upvc') || cleanText.includes('kính') || cleanText.includes('ea55')) {
      fallbackIntent = 'technical';
    }

    return {
      intent: fallbackIntent,
      contextualizedQuery: latestQuery
    };
  }
}
