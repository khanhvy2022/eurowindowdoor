import { createOpenAI } from '@ai-sdk/openai';
import { keyPool } from '../key-pool';

export function getDeepSeekProvider() {
  const apiKey = keyPool.getKey('deepseek');
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
}
