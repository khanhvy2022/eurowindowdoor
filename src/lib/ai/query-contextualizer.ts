/**
 * Query Contextualizer & Rewriter Engine for RAG Pipeline.
 * Resolves implicit pronouns ("nó", "loại này", "cửa kia", "báo giá bao nhiêu") and anaphora
 * into fully-qualified standalone search queries using conversation history.
 */

import { generateText } from 'ai';
import { getProviderModel } from './providers';
import { keyPool } from './key-pool';
import { resolveDynamicGeminiModel } from './gemini-discovery';

export async function contextualizeQuery(
  messages: Array<{ role: string; content?: any; parts?: any }>,
  latestQuery: string
): Promise<string> {
  if (!latestQuery || latestQuery.trim().length === 0) return '';
  if (!messages || messages.length <= 1) return latestQuery.trim();

  // Extract recent non-system conversation history (last 4 turns)
  const recentTurns: Array<{ role: string; text: string }> = [];
  const nonSystem = messages.filter(m => m.role !== 'system');
  const slice = nonSystem.slice(-5, -1); // excludes the current latest query

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

  if (recentTurns.length === 0) return latestQuery.trim();

  // Fast check: if query is already long and specific, return directly
  const lower = latestQuery.toLowerCase();
  const hasImplicitPronouns = [
    'nó', 'này', 'kia', 'loại này', 'loại kia', 'hệ này', 'hệ kia', 'dòng này',
    'cửa này', 'giá bao nhiêu', 'chống ồn không', 'bảo hành bao lâu', 'kính gì'
  ].some(p => lower.includes(p));

  if (!hasImplicitPronouns && latestQuery.length > 25 && (lower.includes('ea55') || lower.includes('ea60i') || lower.includes('kommerling') || lower.includes('asia'))) {
    return latestQuery.trim();
  }

  const prompt = `Bạn là bộ chuyển đổi câu hỏi RAG cho chatbot Eurowindow.
Dựa vào lịch sử hội thoại bên dưới, hãy viết lại câu hỏi cuối cùng của khách hàng thành một CÂU TÌM KIẾM ĐỘC LẬP đầy đủ chủ ngữ, tên sản phẩm và thông số cần tra cứu.

LỊCH SỬ HỘI THOẠI:
${recentTurns.map(t => `${t.role}: ${t.text}`).join('\n')}

CÂU HỎI MỚI CỦA KHÁCH:
"${latestQuery}"

QUY TẮC:
1. Giải mã các từ thay thế ("nó", "loại này", "hệ này", "giá bao nhiêu") thành tên sản phẩm cụ thể đề cập trước đó.
2. CHỈ TRẢ VỀ DUY NHẤT câu tìm kiếm đã được viết lại, KHÔNG giải thích, KHÔNG thêm lời chào.

CÂU TÌM KIẾM ĐỘC LẬP:`;

  try {
    const apiKey = keyPool.getKey('gemini') || '';
    const model = getProviderModel('gemini', await resolveDynamicGeminiModel(apiKey));
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.1,
    });

    const rewritten = text.trim().replace(/^["']|["']$/g, '');
    if (rewritten && rewritten.length > 5) {
      console.log(`[Query Contextualizer] Rewrote "${latestQuery}" -> "${rewritten}"`);
      return rewritten;
    }
  } catch (err) {
    console.warn('[Query Contextualizer] LLM rewrite failed, falling back to heuristic fusion:', err);
  }

  // Heuristic Fallback: Combine last user product entity with current query
  const lastUserTurn = recentTurns.filter(t => t.role === 'Khách').pop();
  if (lastUserTurn) {
    return `${lastUserTurn.text} ${latestQuery}`.trim();
  }

  return latestQuery.trim();
}
