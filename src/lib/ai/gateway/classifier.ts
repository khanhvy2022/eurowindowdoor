import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export type UserIntent =
  | 'product_consulting'
  | 'pdf_analysis'
  | 'cad_analysis'
  | 'bim_analysis'
  | 'house_design'
  | 'rendering'
  | 'pricing'
  | 'seo'
  | 'technical_support'
  | 'general';

const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  pricing: ['giá', 'chi phí', 'bao nhiêu tiền', 'báo giá', 'hết bao nhiêu', 'dự toán', 'đơn giá', 'bom', 'boq'],
  house_design: ['thiết kế', 'phòng ngủ', 'phòng khách', 'biệt thự', 'nhà phố', 'tầng', 'chia phòng', 'mái nhà', 'cầu thang', 'vẽ', 'mặt bằng', 'phòng'],
  pdf_analysis: ['đọc tài liệu', 'phân tích pdf', 'tóm tắt file', 'tập tin', 'tải lên', 'file pdf'],
  cad_analysis: ['bản vẽ', 'tọa độ', 'cad', 'dxf', 'dwg', 'nét vẽ', 'snap', 'trực giao', 'layer'],
  bim_analysis: ['ifc', 'bim', 'xeokit', 'web-ifc', 'mô hình 3d', 'object tree'],
  rendering: ['sơn tường', 'vật liệu', 'màu nhôm', 'pbr', 'kính màu trà', 'vân gỗ', 'bóng', 'phối cảnh'],
  product_consulting: ['nhôm', 'upvc', 'cửa gỗ', 'kính hộp', 'low-e', 'vách kính', 'hệ cửa', 'phụ kiện', 'cầu cách nhiệt'],
  seo: ['seo', 'sitemap', 'keywords', 'tối ưu tìm kiếm', 'robots', 'googlebot'],
  technical_support: ['hỗ trợ', 'kỹ thuật', 'hotline', 'liên hệ', 'báo hỏng', 'bảo hành', 'bảo dưỡng'],
  general: ['xin chào', 'hello', 'cảm ơn', 'tạm biệt', 'chào']
};

/**
 * Classifies user intent based on conversation history.
 * Uses Gemini API with structural instructions, and falls back to keyword matching.
 */
export async function classifyIntent(messages: any[]): Promise<UserIntent> {
  if (messages.length === 0) return 'general';

  // Get the last user message
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length === 0) return 'general';
  
  const lastMsg = userMessages[userMessages.length - 1];
  let content = '';
  if (typeof lastMsg.content === 'string') {
    content = lastMsg.content;
  } else if (Array.isArray(lastMsg.content)) {
    content = lastMsg.content.map((p: any) => p.text || '').join(' ');
  }

  const cleanText = content.toLowerCase().trim();

  // Primary attempt: LLM-based classification
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `Bạn là hệ thống phân loại ý định (Intent Classifier) của Eurowindow AI.
Hãy phân loại tin nhắn sau của người dùng vào MỘT TRONG CÁC Ý ĐỊNH sau:
1. 'product_consulting': Hỏi về các sản phẩm, thông số cửa nhôm/nhựa/gỗ, vách kính của Eurowindow.
2. 'pdf_analysis': Yêu cầu đọc, trích xuất hoặc phân tích tài liệu PDF được tải lên.
3. 'cad_analysis': Hỏi hoặc yêu cầu xử lý liên quan đến bản vẽ kỹ thuật CAD (file DXF, DWG, snapping, tọa độ).
4. 'bim_analysis': Hỏi hoặc yêu cầu liên quan đến mô hình thông tin công trình BIM (file IFC).
5. 'house_design': Yêu cầu thiết kế mặt bằng nhà, chia phòng, bố trí cửa, thêm mái dốc, cầu thang.
6. 'rendering': Yêu cầu đổi màu sắc nhôm, loại kính, sơn tường, đổi vật liệu PBR hoặc xem phối cảnh 3D.
7. 'pricing': Hỏi về giá cả, chi phí, yêu cầu báo giá sơ bộ hoặc xuất bảng vật tư (BOM/BOQ).
8. 'seo': Hỏi về cấu trúc SEO, sitemap, meta tags, sitemap.
9. 'technical_support': Yêu cầu liên hệ, kỹ thuật viên hỗ trợ, bảo hành, báo cáo lỗi hệ thống.
10. 'general': Tin nhắn chào hỏi xã giao, cảm ơn hoặc không thuộc các nhóm trên.

Tin nhắn người dùng: "${content}"

Chỉ xuất ra ĐÚNG 1 từ khóa ý định (ví dụ: 'product_consulting' hoặc 'house_design'), không viết thêm bất kỳ từ nào khác.`;

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: prompt,
        temperature: 0.1,
      });

      const parsedIntent = text.trim().toLowerCase().replace(/['"`]/g, '') as UserIntent;
      const validIntents = new Set<UserIntent>([
        'product_consulting',
        'pdf_analysis',
        'cad_analysis',
        'bim_analysis',
        'house_design',
        'rendering',
        'pricing',
        'seo',
        'technical_support',
        'general'
      ]);

      if (validIntents.has(parsedIntent)) {
        console.log(`[IntentClassifier] Classified intent by LLM: "${parsedIntent}"`);
        return parsedIntent;
      }
    } catch (err) {
      console.warn('[IntentClassifier] LLM classification failed, running keyword heuristics:', err);
    }
  }

  // Fallback: Keyword-based heuristics
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [UserIntent, string[]][]) {
    if (keywords.some(kw => cleanText.includes(kw))) {
      console.log(`[IntentClassifier] Classified intent by heuristics: "${intent}"`);
      return intent;
    }
  }

  console.log('[IntentClassifier] Fallback to general intent.');
  return 'general';
}
