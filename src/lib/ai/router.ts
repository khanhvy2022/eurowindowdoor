import { ProviderName } from './providers';

export function classifyTask(messages: any[]): 'coding' | 'reasoning' | 'general' {
  if (messages.length === 0) return 'general';
  
  const lastMessage = messages[messages.length - 1];
  let content = '';

  if (typeof lastMessage.content === 'string') {
    content = lastMessage.content;
  } else if (Array.isArray(lastMessage.content)) {
    content = lastMessage.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');
  } else if (lastMessage.parts) {
    content = lastMessage.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');
  }

  const cleanContent = content.toLowerCase();

  const codingKeywords = [
    'code', 'coding', 'lập trình', 'function', 'html', 'css', 'javascript', 'js',
    'typescript', 'ts', 'python', 'database', 'sql', 'api', 'hàm', 'biến', 'class',
    'mảng', 'array', 'object', 'json', 'lỗi cú pháp', 'syntax error', 'git', 'docker'
  ];

  const reasoningKeywords = [
    'giải thích chi tiết', 'phân tích sâu', 'chứng minh', 'suy luận', 'suy nghĩ',
    'tại sao', 'how come', 'bước từng bước', 'step-by-step', 'step by step',
    'toán', 'math', 'logic', 'giải bài', 'reasoning', 'so sánh chi tiết'
  ];

  const isCoding = codingKeywords.some(kw => cleanContent.includes(kw));
  if (isCoding) return 'coding';

  const isReasoning = reasoningKeywords.some(kw => cleanContent.includes(kw));
  if (isReasoning) return 'reasoning';

  return 'general';
}

/**
 * Failover Sequence: Gemini (Main) ➔ Groq ➔ Cloudflare Workers AI ➔ OpenRouter
 */
export function getRoutingSequence(task: 'coding' | 'reasoning' | 'general'): ProviderName[] {
  return ['gemini', 'groq', 'cloudflare', 'openrouter'];
}

export function optimizeMessages(messages: any[], maxTokens = 12000): any[] {
  if (!messages || messages.length === 0) return [];
  if (messages.length <= 6) return messages;

  const systemOrFirst = messages[0];
  const recentMessages = messages.slice(-5);
  return [systemOrFirst, ...recentMessages];
}

export function optimizeDocumentContext(context: string, maxChars = 25000): string {
  if (!context) return '';
  if (context.length <= maxChars) return context;
  return context.slice(0, maxChars) + '\n\n[Dữ liệu đã được tối ưu cắt bớt]';
}
