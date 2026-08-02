import { createOpenAI } from '@ai-sdk/openai';
import { keyPool } from '../key-pool';

export function getGrokProvider() {
  const apiKey = keyPool.getKey('grok');
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  });
}
