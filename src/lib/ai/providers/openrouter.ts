import { createOpenAI } from '@ai-sdk/openai';

export function getOpenRouterProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY;
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
