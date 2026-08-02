import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { retrieveRelevantContext } from '@/lib/rag';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await req.json();
  const lastMessage = messages?.[messages.length - 1]?.content || '';

  // Pull SEO-relevant RAG context
  const ragContext = await retrieveRelevantContext(lastMessage, 4).catch(() => '');

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    system: `Bạn là SEO Expert AI Assistant của Eurowindow.
Nhiệm vụ: trả lời câu hỏi về SEO, phân tích nội dung, đề xuất tối ưu hóa.

Bối cảnh thương hiệu từ knowledge base:
${ragContext || 'Không có ngữ cảnh.'}

Quy tắc:
- Chỉ tư vấn dựa trên dữ liệu đã xác thực
- Đề xuất cụ thể, có thể thực hiện được
- Trả lời tiếng Việt trừ khi được yêu cầu khác
- Dẫn chiếu Google Guidelines khi liên quan đến E-E-A-T, Helpful Content, Core Web Vitals
- Khi không chắc, nói rõ để tránh misinformation`,
    messages,
  });

  return result.toTextStreamResponse();
}
