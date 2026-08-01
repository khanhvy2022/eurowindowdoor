import { ProviderName } from './providers';

/**
 * Classifies the conversation task based on message content.
 */
export function classifyTask(messages: any[]): 'coding' | 'reasoning' | 'general' {
  if (messages.length === 0) return 'general';
  
  // Look at the latest message
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

  // Keyword check lists
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
 * Returns the preferred provider sequence based on the task classification.
 */
export function getRoutingSequence(task: 'coding' | 'reasoning' | 'general'): ProviderName[] {
  return ['openrouter', 'gemini', 'deepseek', 'grok'];
}

/**
 * Token Optimization: Sanitizes, consolidates, and truncates message history.
 */
export function optimizeMessages(messages: any[]): any[] {
  if (messages.length <= 1) return messages;

  const optimized: any[] = [];
  
  // 1. Remove duplicate adjacent prompts
  let lastText = '';
  for (const msg of messages) {
    let currentText = '';
    if (typeof msg.content === 'string') {
      currentText = msg.content;
    } else if (Array.isArray(msg.content)) {
      currentText = msg.content.map((p: any) => p.text || '').join('');
    }
    
    if (currentText.trim() === '') {
      continue; // Skip empty messages
    }

    if (currentText.trim() === lastText.trim()) {
      continue; // Skip consecutive duplicates
    }

    optimized.push(msg);
    lastText = currentText;
  }

  // If we have 10 or fewer messages, return them as is
  if (optimized.length <= 10) return optimized;

  // Keep the last 10 messages intact to preserve multi-turn context and entity references
  const keepCount = 10;
  const systemMessages = optimized.filter(msg => msg.role === 'system');
  const nonSystemMessages = optimized.filter(msg => msg.role !== 'system');

  if (nonSystemMessages.length <= keepCount) {
    return [...systemMessages, ...nonSystemMessages];
  }

  const oldMessages = nonSystemMessages.slice(0, nonSystemMessages.length - keepCount);
  const recentMessages = nonSystemMessages.slice(nonSystemMessages.length - keepCount);

  // Preserve key context points from older turns
  let summaryText = '[Bối cảnh hội thoại trước đó:\n';
  oldMessages.forEach(msg => {
    let msgText = '';
    if (typeof msg.content === 'string') {
      msgText = msg.content;
    } else if (Array.isArray(msg.content)) {
      msgText = msg.content.map((p: any) => p.text || '').join('');
    }
    
    // Retain up to 250 characters per older turn to preserve technical specs & product names
    const truncatedMsg = msgText.length > 250 ? `${msgText.slice(0, 250)}...` : msgText;
    summaryText += `- ${msg.role === 'user' ? 'Khách' : 'Trợ lý'}: ${truncatedMsg}\n`;
  });
  summaryText += ']';

  const summaryMessage = {
    role: 'system',
    content: summaryText,
  };

  return [
    ...systemMessages,
    summaryMessage,
    ...recentMessages
  ];
}

/**
 * Token Optimization: Restricts corporate document context length to prevent quota spikes.
 */
export function optimizeDocumentContext(context: string, maxChars = 4500): string {
  if (!context) return '';
  if (context.length <= maxChars) return context;
  
  // Cut to maxChars and append a warning to let the model know context was trimmed.
  return context.substring(0, maxChars) + '\n\n[Lưu ý: Tài liệu tham khảo đã được cắt bớt để tối ưu tốc độ xử lý]';
}
