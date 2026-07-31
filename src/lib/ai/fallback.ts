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
 * Executes a streaming chat request using the fallback sequence with multiple free Gemini options.
 * Filters out unhealthy providers (in cooldown) and handles timeouts of 10s per model attempt.
 */
export async function streamTextWithFallback(options: FallbackOptions) {
  const { sequence, task, messages, system, temperature = 0.7, preferredModel, tools, maxSteps } = options;

  let lastError: any = null;
  const attemptedProviders: ProviderName[] = [];

  // Filter sequence to find healthy providers first
  const healthySequence = sequence.filter(isProviderHealthy);
  
  // If all preferred providers are in cooldown, try all of them anyway as a last resort
  const finalSequence = healthySequence.length > 0 ? healthySequence : sequence;

  // Expand the provider list into specific models to try sequentially (prioritizing free Gemini models)
  const targets: TargetConfig[] = [];
  
  for (const provider of finalSequence) {
    // If the user forced a specific model, prioritize it
    if (preferredModel && preferredModel.startsWith(`${provider}:`)) {
      targets.push({ provider, model: preferredModel.split(':')[1] });
      continue;
    }

    if (provider === 'gemini') {
      // Gemini Free-tier — confirmed working models (tested 2026-07-30)
      // 3.x series works on free tier; 2.x series hits quota limits
      targets.push({ provider: 'gemini', model: 'gemini-3.5-flash-lite' });   // 819ms, tiếng Việt tốt
      targets.push({ provider: 'gemini', model: 'gemini-3.1-flash-lite' });   // 782ms, nhanh nhất
      targets.push({ provider: 'gemini', model: 'gemini-3.6-flash' });        // 1359ms, mới nhất
      targets.push({ provider: 'gemini', model: 'gemini-flash-lite-latest' }); // 988ms, auto-update
    } else if (provider === 'openrouter') {
      // OpenRouter Free-tier — confirmed working models (tested 2026-07-30)
      // gemma-4-31b: 1.3s, nemotron-3-nano: 1.3s, nemotron-3-super: fast, gpt-oss-20b: slow backup
      if (task === 'coding') {
        targets.push({ provider: 'openrouter', model: 'google/gemma-4-31b-it:free' });
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free' });
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-nano-30b-a3b:free' });
      } else if (task === 'reasoning') {
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-ultra-550b-a55b:free' });
        targets.push({ provider: 'openrouter', model: 'google/gemma-4-31b-it:free' });
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-nano-30b-a3b:free' });
      } else {
        targets.push({ provider: 'openrouter', model: 'google/gemma-4-31b-it:free' });
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-nano-30b-a3b:free' });
        targets.push({ provider: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free' });
        targets.push({ provider: 'openrouter', model: 'openrouter/free' });
      }
    } else if (provider === 'deepseek') {
      // DeepSeek (currently insufficient balance but kept for when topped up)
      targets.push({ provider: 'deepseek', model: 'deepseek-chat' });
    } else if (provider === 'grok') {
      // Grok (currently forbidden but kept for when key is refreshed)
      targets.push({ provider: 'grok', model: 'grok-2-1212' });
    }
  }

  for (let i = 0; i < targets.length; i++) {
    const { provider, model: modelId } = targets[i];
    
    if (!attemptedProviders.includes(provider)) {
      attemptedProviders.push(provider);
    }
    
    // Record fallback triggers when switching providers
    if (i > 0 && targets[i - 1].provider !== provider) {
      recordFallback(targets[i - 1].provider);
    }

    const startTime = Date.now();
    try {
      console.log(`[AI Fallback System] Đang thử kết nối: ${provider} (Mô hình: ${modelId}) cho tác vụ ${task}`);
      
      const modelInstance = getProviderModel(provider, modelId);
      
      // Initialize stream request. Set maxRetries: 1 for fast failover.
      const result = streamText({
        model: modelInstance,
        messages,
        system,
        temperature,
        maxRetries: 1,
        maxTokens: 4000,
        tools,
        maxSteps,
      } as any);

      // Create a 10-second timeout promise for API connection response
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Model ${modelId} trên ${provider} quá thời gian phản hồi (timeout 5s)`)),
          5000
        )
      );

      // Wait until connection headers are resolved, or timeout occurs
      await Promise.race([result.response, timeoutPromise]);

      // Record success
      const latency = Date.now() - startTime;
      recordSuccess(provider, latency);

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
        errLower.includes('fetch failed');

      // Only trigger cooldown for provider if all attempts on it fail or if we hit global limit
      // For general errors, trigger a short cooldown
      if (isQuotaOrLimit) {
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`);
      } else {
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`, 1 * 60 * 1000);
      }
      
      lastError = err;
    }
  }

  // If all models in the expanded targets list failed
  throw new Error(
    `Tất cả các mô hình AI trong chuỗi fallback đều gặp lỗi hoặc đang cooldown. Lỗi cuối cùng: ${lastError?.message || lastError}`
  );
}

