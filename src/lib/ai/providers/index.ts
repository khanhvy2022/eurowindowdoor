import { LanguageModel } from 'ai';
import { getGrokProvider } from './grok';
import { getGeminiProvider } from './gemini';
import { getOpenRouterProvider } from './openrouter';
import { getDeepSeekProvider } from './deepseek';

export type ProviderName = 'grok' | 'gemini' | 'openrouter' | 'deepseek';

export interface ProviderModelConfig {
  provider: ProviderName;
  model: string;
}

// Default models mapped for each provider
export const DEFAULT_MODELS: Record<ProviderName, string> = {
  grok: 'grok-2-1212',
  gemini: 'gemini-2.5-flash',
  openrouter: 'deepseek/deepseek-chat-v3-0324:free',
  deepseek: 'deepseek-chat',
};

/**
 * Returns the correct LanguageModel instance for a provider and model name.
 */
export function getProviderModel(provider: ProviderName, modelName?: string): LanguageModel {
  const targetModel = modelName || DEFAULT_MODELS[provider];

  switch (provider) {
    case 'grok': {
      const grok = getGrokProvider();
      if (!grok) {
        throw new Error('XAI_API_KEY chưa được cấu hình.');
      }
      return grok(targetModel);
    }
    case 'gemini': {
      const gemini = getGeminiProvider();
      if (!gemini) {
        throw new Error('GEMINI_API_KEY chưa được cấu hình.');
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
    case 'deepseek': {
      const deepseek = getDeepSeekProvider();
      if (!deepseek) {
        throw new Error('DEEPSEEK_API_KEY chưa được cấu hình.');
      }
      // Use .chat() for DeepSeek to ensure compatibility with /chat/completions
      return deepseek.chat(targetModel);
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
    case 'grok':
      return !!process.env.XAI_API_KEY;
    case 'gemini':
      return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    case 'openrouter':
      return !!process.env.OPENROUTER_API_KEY;
    case 'deepseek':
      return !!process.env.DEEPSEEK_API_KEY;
    default:
      return false;
  }
}
