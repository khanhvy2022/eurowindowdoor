import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { keyPool } from '../key-pool';

export function getGeminiProvider() {
  const apiKey = keyPool.getKey('gemini');
  if (!apiKey) return null;
  return createGoogleGenerativeAI({ apiKey });
}
