import { LanguageModel } from 'ai';
import { getGeminiProvider } from './gemini';
import { getOpenRouterProvider } from './openrouter';
import { getGroqProvider } from './groq';
import { getCloudflareProvider } from './cloudflare';

export type ProviderName = 'gemini' | 'openrouter' | 'groq' | 'cloudflare';

export interface ProviderModelConfig {
  provider: ProviderName;
  model: string;
}

// Default models mapped for each provider
export const DEFAULT_MODELS: Record<ProviderName, string> = {
  gemini: 'gemini-flash-latest',
  openrouter: 'openrouter/auto',
  groq: 'llama-3.3-70b-versatile',
  cloudflare: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
};

/**
 * Returns the correct LanguageModel instance for a provider and model name.
 */
export function getProviderModel(provider: ProviderName, modelName?: string): LanguageModel {
  const targetModel = modelName || DEFAULT_MODELS[provider];

  switch (provider) {
    case 'gemini': {
      const gemini = getGeminiProvider();
      if (!gemini) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY chưa được cấu hình.');
      }
      return gemini(targetModel);
    }
    case 'openrouter': {
      const openrouter = getOpenRouterProvider();
      if (!openrouter) {
        throw new Error('OPENROUTER_API_KEY chưa được cấu hình.');
      }
      return openrouter.chat(targetModel);
    }
    case 'groq': {
      const groq = getGroqProvider();
      if (!groq) {
        throw new Error('GROQ_API_KEY chưa được cấu hình.');
      }
      return groq.chat(targetModel);
    }
    case 'cloudflare': {
      const cf = getCloudflareProvider();
      if (!cf) {
        throw new Error('CLOUDFLARE_API_TOKEN chưa được cấu hình.');
      }
      return cf.chat(targetModel);
    }
    default:
      throw new Error(`Nhà cung cấp AI không hợp lệ: ${provider}`);
  }
}

/**
 * Check if a provider has its API Key configured.
 */
export function isProviderAvailable(provider: ProviderName): boolean {
  switch (provider) {
    case 'gemini':
      return !!(process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    case 'openrouter':
      return !!(process.env.OPENROUTER_API_KEYS || process.env.OPENROUTER_API_KEY);
    case 'groq':
      return !!(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY);
    case 'cloudflare':
      return !!(process.env.CLOUDFLARE_API_TOKENS || process.env.CLOUDFLARE_API_TOKEN);
    default:
      return false;
  }
}
