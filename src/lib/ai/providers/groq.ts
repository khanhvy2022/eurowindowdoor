import { createOpenAI } from '@ai-sdk/openai';
import { keyPool } from '../key-pool';

export function getGroqProvider() {
  const apiKey = keyPool.getKey('groq');
  if (!apiKey) return null;
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}
