/**
 * LiteLLM Gateway Client Wrapper.
 * Proxies LLM requests through a unified LiteLLM gateway if configured,
 * providing zero-code failover, load balancing, cost tracking, and rate limit resilience.
 */

export interface LiteLLMConfig {
  baseUrl: string;
  apiKey?: string;
  model: string;
}

export interface LiteLLMRequestPayload {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface LiteLLMResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function getLiteLLMConfig(defaultModel = 'gpt-4o-mini'): LiteLLMConfig | null {
  const isEnabled = process.env.ENABLE_LITELLM_GATEWAY === 'true';
  const baseUrl = process.env.LITELLM_BASE_URL || 'http://localhost:4000';
  const apiKey = process.env.LITELLM_API_KEY;

  if (!isEnabled) return null;

  return {
    baseUrl,
    apiKey,
    model: process.env.LITELLM_DEFAULT_MODEL || defaultModel,
  };
}

export async function invokeLiteLLM(
  payload: LiteLLMRequestPayload
): Promise<LiteLLMResponse | null> {
  const config = getLiteLLMConfig(payload.model);
  if (!config) return null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        model: payload.model || config.model,
      }),
    });

    if (!res.ok) {
      console.warn(`[LiteLLM Gateway] HTTP error ${res.status}: ${await res.text()}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('[LiteLLM Gateway] Request failed:', err);
    return null;
  }
}
