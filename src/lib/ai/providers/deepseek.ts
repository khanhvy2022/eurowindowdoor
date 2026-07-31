import { createOpenAI } from '@ai-sdk/openai';

export function getDeepSeekProvider() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
}
