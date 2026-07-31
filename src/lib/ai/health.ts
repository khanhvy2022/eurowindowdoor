import { isProviderAvailable, ProviderName } from './providers';

export interface ProviderHealth {
  status: 'online' | 'offline' | 'cooldown';
  cooldownUntil: number | null;
  latency: number[]; // recent response latencies in ms
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
    grok: DEFAULT_HEALTH(),
    gemini: DEFAULT_HEALTH(),
    openrouter: DEFAULT_HEALTH(),
    deepseek: DEFAULT_HEALTH(),
  };
}

export const registry = globalRef.providerHealthRegistry;

/**
 * Checks if a provider is fully operational (has API key and is NOT in cooldown).
 */
export function isProviderHealthy(provider: ProviderName): boolean {
  // 1. Check API Key availability
  if (!isProviderAvailable(provider)) {
    if (registry[provider].status !== 'offline') {
      registry[provider].status = 'offline';
      registry[provider].lastErrorMsg = 'Thiếu cấu hình API Key';
    }
    return false;
  }

  // 2. Check cooldown status
  const stats = registry[provider];
  if (stats.status === 'cooldown') {
    if (stats.cooldownUntil && Date.now() > stats.cooldownUntil) {
      // Cooldown expired! Reset to online
      stats.status = 'online';
      stats.cooldownUntil = null;
      return true;
    }
    return false;
  }

  // Otherwise, if it was marked offline (due to missing key) but now key is found
  if (stats.status === 'offline') {
    stats.status = 'online';
  }

  return true;
}

/**
 * Retrieves the health profile of a single provider.
 */
export function getProviderHealth(provider: ProviderName): ProviderHealth {
  // Trigger auto cooldown expiry check
  isProviderHealthy(provider);
  return registry[provider];
}

/**
 * Retrieves health profiles of all providers.
 */
export function getAllProvidersHealth(): Record<ProviderName, ProviderHealth> {
  const keys: ProviderName[] = ['grok', 'gemini', 'openrouter', 'deepseek'];
  keys.forEach(isProviderHealthy);
  return registry;
}

/**
 * Records a successful response.
 */
export function recordSuccess(provider: ProviderName, latencyMs: number) {
  const stats = registry[provider];
  stats.status = 'online';
  stats.cooldownUntil = null;
  stats.requestCount += 1;
  
  // Track last 10 latency entries
  stats.latency.push(latencyMs);
  if (stats.latency.length > 10) {
    stats.latency.shift();
  }
}

/**
 * Triggers cooldown for a provider when it fails.
 * Cooldown defaults to 5 minutes (300,000ms).
 */
export function triggerCooldown(provider: ProviderName, errorMsg: string, durationMs = 5 * 60 * 1000) {
  const stats = registry[provider];
  stats.status = 'cooldown';
  stats.cooldownUntil = Date.now() + durationMs;
  stats.errorCount += 1;
  stats.lastErrorMsg = errorMsg;
  console.warn(`[AI Health System] Provider ${provider} enters COOLDOWN for ${durationMs / 1000}s. Reason: ${errorMsg}`);
}

/**
 * Increments the fallback count for a provider (i.e. when we fail to use it and must try a fallback).
 */
export function recordFallback(provider: ProviderName) {
  const stats = registry[provider];
  stats.fallbackCount += 1;
}

/**
 * Forces reset of stats. Useful for testing or manual recovery.
 */
export function resetProviderStats(provider: ProviderName) {
  registry[provider] = DEFAULT_HEALTH();
}
