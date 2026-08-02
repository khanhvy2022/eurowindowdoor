import { streamText, stepCountIs } from 'ai';
import { getProviderModel, ProviderName } from './providers';
import { recordSuccess, triggerCooldown, recordFallback, isProviderHealthy } from './health';

export interface FallbackOptions {
  sequence: ProviderName[];
  task: 'general' | 'coding' | 'reasoning';
  messages: any[];
  system: string;
  temperature?: number;
  preferredModel?: string; // e.g. "gemini:gemini-flash-latest"
  tools?: Record<string, any>;
  maxSteps?: number;
  onFinish?: (event: any) => Promise<void> | void;
  onError?: (event: any) => Promise<void> | void;
}

interface TargetConfig {
  provider: ProviderName;
  model: string;
}

/**
 * Executes a streaming chat request using the multi-provider & multi-model fallback sequence.
 */
export async function streamTextWithFallback(options: FallbackOptions) {
  const { sequence, task, messages, system, temperature = 0.7, preferredModel, tools, maxSteps } = options;

  let lastError: any = null;
  const attemptedProviders: ProviderName[] = [];

  const healthySequence = sequence.filter(isProviderHealthy);
  const finalSequence = healthySequence.length > 0 ? healthySequence : sequence;

  const targets: TargetConfig[] = [];
  
  for (const provider of finalSequence) {
    if (preferredModel && preferredModel.startsWith(`${provider}:`)) {
      targets.push({ provider, model: preferredModel.split(':')[1] });
      continue;
    }

    if (provider === 'gemini') {
      targets.push({ provider: 'gemini', model: 'gemini-flash-lite-latest' });
      targets.push({ provider: 'gemini', model: 'gemini-flash-latest' });
    } else if (provider === 'groq') {
      targets.push({ provider: 'groq', model: 'llama-3.3-70b-versatile' });
      targets.push({ provider: 'groq', model: 'mixtral-8x7b-32768' });
    } else if (provider === 'cloudflare') {
      targets.push({ provider: 'cloudflare', model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast' });
    } else if (provider === 'openrouter') {
      targets.push({ provider: 'openrouter', model: 'openrouter/auto' });
    }
  }

  for (let i = 0; i < targets.length; i++) {
    const { provider, model: modelId } = targets[i];
    
    if (!attemptedProviders.includes(provider)) {
      attemptedProviders.push(provider);
    }
    
    if (i > 0 && targets[i - 1].provider !== provider) {
      recordFallback(targets[i - 1].provider);
    }

    try {
      console.log(`[AI Fallback System] Đang kết nối: ${provider} (${modelId}) cho tác vụ ${task}`);
      
      const modelInstance = getProviderModel(provider, modelId);
      
      const result = streamText({
        model: modelInstance,
        messages,
        system,
        temperature,
        maxRetries: 0,
        maxTokens: 1500,
        tools,
        stopWhen: stepCountIs(maxSteps || 5),
        onFinish: options.onFinish,
        onError: (event: any) => {
          const { error } = event;
          console.error(`[AI Fallback System] Stream Error từ ${provider} (${modelId}):`, error);
          triggerCooldown(provider, `Stream error (${modelId}): ${error?.message || error}`, 3 * 60 * 1000);
          if (options.onError) {
            options.onError(event);
          }
        },
      } as any);

      recordSuccess(provider, 0);
      console.log(`[AI Fallback System] Kết nối thành công: ${provider} (${modelId})`);

      return {
        result,
        provider,
        modelName: modelId,
        fallbackTriggered: i > 0,
        attemptedProviders,
      };
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      console.error(`[AI Fallback System] Lỗi từ ${provider} (${modelId}): ${errorMsg}`);
      
      const errLower = errorMsg.toLowerCase();
      const isQuotaOrLimit =
        errLower.includes('quota') ||
        errLower.includes('429') ||
        errLower.includes('limit') ||
        errLower.includes('credit') ||
        errLower.includes('timeout') ||
        errLower.includes('fetch failed') ||
        errLower.includes('rate') ||
        errLower.includes('exceeded');

      if (isQuotaOrLimit) {
        triggerCooldown(provider, `Model ${modelId} quota error: ${errorMsg}`, 5 * 60 * 1000);
      } else {
        triggerCooldown(provider, `Model ${modelId} error: ${errorMsg}`, 30 * 1000);
      }
      
      lastError = err;
    }
  }

  throw new Error(
    `Tất cả các mô hình AI trong chuỗi fallback đều gặp lỗi. Lỗi cuối cùng: ${lastError?.message || lastError}`
  );
}
