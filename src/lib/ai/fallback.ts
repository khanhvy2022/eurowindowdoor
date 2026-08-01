import { streamText, stepCountIs } from 'ai';
import { getProviderModel, ProviderName } from './providers';
import { recordSuccess, triggerCooldown, recordFallback, isProviderHealthy } from './health';

export interface FallbackOptions {
  sequence: ProviderName[];
  task: 'general' | 'coding' | 'reasoning';
  messages: any[];
  system: string;
  temperature?: number;
  preferredModel?: string; // e.g. "gemini:gemini-2.0-flash"
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
 * Executes a streaming chat request using the fallback sequence.
 * AI SDK v7: streamText() is synchronous but quota/rate errors manifest inside the stream.
 */
export async function streamTextWithFallback(options: FallbackOptions) {
  const { sequence, task, messages, system, temperature = 0.7, preferredModel, tools, maxSteps } = options;

  let lastError: any = null;
  const attemptedProviders: ProviderName[] = [];

  // Filter sequence to find healthy providers first
  const healthySequence = sequence.filter(isProviderHealthy);
  
  // If all preferred providers are in cooldown, try all of them anyway as a last resort
  const finalSequence = healthySequence.length > 0 ? healthySequence : sequence;

  // Expand the provider list into specific models to try sequentially
  const targets: TargetConfig[] = [];
  
  for (const provider of finalSequence) {
    // If the user forced a specific model, prioritize it
    if (preferredModel && preferredModel.startsWith(`${provider}:`)) {
      targets.push({ provider, model: preferredModel.split(':')[1] });
      continue;
    }

    if (provider === 'gemini') {
      targets.push({ provider: 'gemini', model: 'gemini-flash-latest' });
    } else if (provider === 'openrouter') {
      targets.push({ provider: 'openrouter', model: 'openrouter/auto' });
    } else if (provider === 'deepseek') {
      targets.push({ provider: 'deepseek', model: 'deepseek-chat' });
    } else if (provider === 'grok') {
      targets.push({ provider: 'grok', model: 'grok-2-1212' });
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
      console.log(`[AI Fallback System] Đang thử kết nối: ${provider} (Mô hình: ${modelId}) cho tác vụ ${task}`);
      
      const modelInstance = getProviderModel(provider, modelId);
      
      const result = streamText({
        model: modelInstance,
        messages,
        system,
        temperature,
        maxRetries: 0, // No retries — we handle fallback ourselves
        maxTokens: 1500,
        tools,
        stopWhen: stepCountIs(maxSteps || 5),
        onFinish: options.onFinish,
        onError: (event: any) => {
          const { error } = event;
          console.error(`[AI Fallback System] Async Stream Error từ model ${modelId}:`, error);
          triggerCooldown(provider, `Stream error (${modelId}): ${error?.message || error}`, 3 * 60 * 1000);
          const fs = require('fs');
          const path = require('path');
          const logDir = path.join(process.cwd(), 'sandbox', 'logs');
          if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
          fs.appendFileSync(path.join(logDir, 'stream_error.log'), `[${new Date().toISOString()}] ${modelId} - ${error instanceof Error ? error.stack : String(error)}\n`);
          if (options.onError) {
            options.onError(event);
          }
        },
      } as any);

      // Record success optimistically — stream has been initiated without sync error
      recordSuccess(provider, 0);
      console.log(`[AI Fallback System] Stream khởi tạo thành công: ${provider} (${modelId})`);

      return {
        result,
        provider,
        modelName: modelId,
        fallbackTriggered: i > 0,
        attemptedProviders,
      };
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      console.error(`[AI Fallback System] Lỗi từ model ${modelId} (${provider}): ${errorMsg}`);
      
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
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`, 5 * 60 * 1000); // 5 min
      } else {
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`, 30 * 1000); // 30s
      }
      
      lastError = err;
    }
  }

  // All models in expanded targets list failed — throw to let route handler deal with it
  throw new Error(
    `Tất cả các mô hình AI trong chuỗi fallback đều gặp lỗi. Lỗi cuối cùng: ${lastError?.message || lastError}`
  );
}
