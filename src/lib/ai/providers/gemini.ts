import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getGeminiProvider() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  return createGoogleGenerativeAI({ apiKey });
}
