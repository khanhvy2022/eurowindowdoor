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
 * Executes a streaming chat request using the fallback sequence with valid Gemini and OpenRouter models.
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
      // Valid Google Gemini API model IDs
      targets.push({ provider: 'gemini', model: 'gemini-2.0-flash' });
      targets.push({ provider: 'gemini', model: 'gemini-2.0-flash-lite' });
      targets.push({ provider: 'gemini', model: 'gemini-1.5-flash' });
      targets.push({ provider: 'gemini', model: 'gemini-1.5-flash-8b' });
    } else if (provider === 'openrouter') {
      // Valid OpenRouter Free-tier model IDs
      if (task === 'coding') {
        targets.push({ provider: 'openrouter', model: 'google/gemma-2-9b-it:free' });
        targets.push({ provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' });
        targets.push({ provider: 'openrouter', model: 'qwen/qwen-2.5-72b-instruct:free' });
      } else if (task === 'reasoning') {
        targets.push({ provider: 'openrouter', model: 'deepseek/deepseek-r1:free' });
        targets.push({ provider: 'openrouter', model: 'google/gemma-2-9b-it:free' });
        targets.push({ provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' });
      } else {
        targets.push({ provider: 'openrouter', model: 'google/gemma-2-9b-it:free' });
        targets.push({ provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' });
        targets.push({ provider: 'openrouter', model: 'qwen/qwen-2.5-72b-instruct:free' });
        targets.push({ provider: 'openrouter', model: 'openrouter/free' });
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

    const startTime = Date.now();
    try {
      console.log(`[AI Fallback System] Đang thử kết nối: ${provider} (Mô hình: ${modelId}) cho tác vụ ${task}`);
      
      const modelInstance = getProviderModel(provider, modelId);
      
      // Initialize stream request
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

      // Create a 15-second timeout promise for API connection response
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Model ${modelId} trên ${provider} quá thời gian phản hồi (timeout 15s)`)),
          15000
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

      if (isQuotaOrLimit) {
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`, 1 * 60 * 1000); // 1 minute short cooldown
      } else {
        triggerCooldown(provider, `Model ${modelId} lỗi: ${errorMsg}`, 30 * 1000); // 30s short cooldown
      }
      
      lastError = err;
    }
  }

  // If all models in the expanded targets list failed, try gemini-2.0-flash directly as absolute emergency fallback
  try {
    console.log('[AI Fallback System] Thử lại bằng Gemini 2.0 Flash trực tiếp (Emergency Fallback)...');
    const emergencyModel = getProviderModel('gemini', 'gemini-2.0-flash');
    const result = streamText({
      model: emergencyModel,
      messages,
      system,
      temperature,
      maxRetries: 2,
      maxTokens: 4000,
    } as any);

    return {
      result,
      provider: 'gemini',
      modelName: 'gemini-2.0-flash',
      fallbackTriggered: true,
      attemptedProviders,
    };
  } catch (emergencyErr: any) {
    throw new Error(
      `Tất cả các mô hình AI trong chuỗi fallback đều gặp lỗi. Lỗi cuối cùng: ${emergencyErr?.message || lastError?.message || lastError}`
    );
  }
}
