import { isProviderAvailable, ProviderName } from './providers';

export interface ProviderHealth {
  status: 'online' | 'offline' | 'cooldown';
  cooldownUntil: number | null;
  latency: number[];
  requestCount: number;
  errorCount: number;
  fallbackCount: number;
  lastErrorMsg?: string;
}

const DEFAULT_HEALTH = (): ProviderHealth => ({
  status: 'online',
  cooldownUntil: null,
  latency: [],
  requestCount: 0,
  errorCount: 0,
  fallbackCount: 0,
});

const globalRef = globalThis as unknown as {
  providerHealthRegistry: Record<ProviderName, ProviderHealth>;
};

if (!globalRef.providerHealthRegistry) {
  globalRef.providerHealthRegistry = {
    gemini: DEFAULT_HEALTH(),
    openrouter: DEFAULT_HEALTH(),
    groq: DEFAULT_HEALTH(),
    cloudflare: DEFAULT_HEALTH(),
  };
}

export const registry = globalRef.providerHealthRegistry;

export function isProviderHealthy(provider: ProviderName): boolean {
  if (!registry[provider]) {
    registry[provider] = DEFAULT_HEALTH();
  }

  if (!isProviderAvailable(provider)) {
    if (registry[provider].status !== 'offline') {
      registry[provider].status = 'offline';
      registry[provider].lastErrorMsg = 'Thiếu cấu hình API Key';
    }
    return false;
  }

  const p = registry[provider];
  const now = Date.now();

  if (p.status === 'cooldown') {
    if (p.cooldownUntil && now >= p.cooldownUntil) {
      p.status = 'online';
      p.cooldownUntil = null;
      p.lastErrorMsg = undefined;
      console.log(`[HealthRegistry] ${provider} đã hết thời gian Cooldown. Tự động phục hồi trạng thái Online.`);
      return true;
    }
    return false;
  }

  return p.status === 'online';
}

export function recordSuccess(provider: ProviderName, latencyMs: number) {
  const p = registry[provider];
  p.requestCount += 1;
  p.latency.push(latencyMs);
  if (p.latency.length > 20) p.latency.shift();
  p.status = 'online';
}

export function triggerCooldown(provider: ProviderName, errorMsg: string, durationMs = 5 * 60 * 1000) {
  const p = registry[provider];
  p.errorCount += 1;
  p.status = 'cooldown';
  p.cooldownUntil = Date.now() + durationMs;
  p.lastErrorMsg = errorMsg;
  console.warn(`[HealthRegistry] Kích hoạt Cooldown cho ${provider} trong ${durationMs / 1000}s. Nguyên nhân: ${errorMsg}`);
}

export function recordFallback(provider: ProviderName) {
  if (registry[provider]) {
    registry[provider].fallbackCount += 1;
  }
}

export function getAllProvidersHealth() {
  const providers: ProviderName[] = ['gemini', 'groq', 'cloudflare', 'openrouter'];
  const res: Record<string, any> = {};

  providers.forEach(p => {
    const isAvailable = isProviderAvailable(p);
    const h = registry[p] || DEFAULT_HEALTH();
    res[p] = {
      ...h,
      available: isAvailable,
      avgLatencyMs: h.latency.length > 0 ? Math.round(h.latency.reduce((a, b) => a + b, 0) / h.latency.length) : 0,
    };
  });

  return res;
}
