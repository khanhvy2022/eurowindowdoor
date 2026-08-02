import { createOpenAI } from '@ai-sdk/openai';
import { keyPool } from '../key-pool';

export function getCloudflareProvider() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '19bfd4847b3a648317a8a60282f0cf5a';
  const apiKey = keyPool.getKey('cloudflare') || process.env.CLOUDFLARE_API_TOKEN;
  if (!apiKey) return null;

  return createOpenAI({
    apiKey,
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
  });
}
