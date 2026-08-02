import { createOpenAI } from '@ai-sdk/openai';
import { keyPool } from '../key-pool';

export function getOpenRouterProvider() {
  const apiKey = keyPool.getKey('openrouter');
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': 'https://eurowindow.com.vn',
      'X-Title': 'Eurowindow AI Chatbot',
    },
  });
}
