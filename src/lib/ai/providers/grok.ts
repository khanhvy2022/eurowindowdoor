import { createOpenAI } from '@ai-sdk/openai';

export function getGrokProvider() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  });
}
