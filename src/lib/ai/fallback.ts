import { streamText } from 'ai';
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
}

interface TargetConfig {
  provider: ProviderName;
  model: string;
}

/**
 * Executes a streaming chat request using the fallback sequence.
 * AI SDK v7: streamText() is synchronous but quota/rate errors manifest inside the stream.
 * We use result.finishReason (a Promise) to eagerly detect errors before returning.
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
      // Valid Google Gemini API model IDs (latest)
      targets.push({ provider: 'gemini', model: 'gemini-2.5-flash' });
      targets.push({ provider: 'gemini', model: 'gemini-2.5-flash-lite' });
      targets.push({ provider: 'gemini', model: 'gemini-2.0-flash' });
      targets.push({ provider: 'gemini', model: 'gemini-2.0-flash-lite' });
    } else if (provider === 'openrouter') {
      // Use openrouter/free router which auto-selects available free models
      targets.push({ provider: 'openrouter', model: 'openrouter/auto' });
      // Also try some specific models known to be free
      if (task === 'coding') {
        targets.push({ provider: 'openrouter', model: 'deepseek/deepseek-chat-v3-0324:free' });
        targets.push({ provider: 'openrouter', model: 'google/gemma-3-27b-it:free' });
      } else if (task === 'reasoning') {
        targets.push({ provider: 'openrouter', model: 'deepseek/deepseek-r1-0528:free' });
        targets.push({ provider: 'openrouter', model: 'deepseek/deepseek-chat-v3-0324:free' });
      } else {
        targets.push({ provider: 'openrouter', model: 'deepseek/deepseek-chat-v3-0324:free' });
        targets.push({ provider: 'openrouter', model: 'google/gemma-3-27b-it:free' });
        targets.push({ provider: 'openrouter', model: 'meta-llama/llama-4-scout:free' });
      }
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
      
      // Initialize stream request (synchronous in AI SDK v7)
      const result = streamText({
        model: modelInstance,
        messages,
        system,
        temperature,
        maxRetries: 0, // No retries — we handle fallback ourselves
        maxTokens: 4000,
        tools,
        maxSteps,
      } as any);

      // AI SDK v7: errors from quota/rate limits manifest in the stream, not synchronously.
      // We use a short race: try to get finishReason within 20s timeout.
      // If the stream errors, finishReason will reject with the error.
      const STREAM_TEST_TIMEOUT = 20000; // 20 second timeout
      
      try {
        await Promise.race([
          result.finishReason, // Will reject if API returns error (quota, auth, etc.)
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error('stream_timeout')), STREAM_TEST_TIMEOUT)
          ),
        ]);
      } catch (streamErr: any) {
        const errMsg = streamErr?.message || String(streamErr);
        
        if (errMsg === 'stream_timeout') {
          // Timeout doesn't necessarily mean failure — stream might still be going
          // This is acceptable; proceed with this provider
          console.log(`[AI Fallback System] Stream timeout check passed for ${provider} (${modelId}) — proceeding.`);
        } else {
          // Real error from provider (quota, auth, etc.) — try next provider
          console.error(`[AI Fallback System] Stream error from ${provider} (${modelId}): ${errMsg}`);
          
          const errLower = errMsg.toLowerCase();
          const isQuotaOrLimit =
            errLower.includes('quota') ||
            errLower.includes('429') ||
            errLower.includes('limit') ||
            errLower.includes('credit') ||
            errLower.includes('rate') ||
            errLower.includes('exceeded');

          if (isQuotaOrLimit) {
            triggerCooldown(provider, `Model ${modelId} lỗi: ${errMsg}`, 5 * 60 * 1000); // 5 min cooldown
          } else {
            triggerCooldown(provider, `Model ${modelId} lỗi: ${errMsg}`, 30 * 1000); // 30s cooldown
          }
          
          lastError = streamErr;
          continue; // Try next target
        }
      }

      // If we get here, provider appears to be working
      recordSuccess(provider, 0);
      console.log(`[AI Fallback System] Kết nối thành công! ${provider} (${modelId}) đang phản hồi.`);

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
