import { ProviderName } from './providers';

export interface KeyEntry {
  key: string;
  provider: ProviderName;
  status: 'active' | 'cooldown' | 'exhausted';
  cooldownUntil: number | null;
  errorCount: number;
  lastUsedAt: number;
}

class KeyPoolManager {
  private pool: Record<ProviderName, KeyEntry[]> = {
    gemini: [],
    openrouter: [],
    grok: [],
    deepseek: [],
  };

  private activeIndexes: Record<ProviderName, number> = {
    gemini: 0,
    openrouter: 0,
    grok: 0,
    deepseek: 0,
  };

  constructor() {
    this.refreshPoolFromEnv();
  }

  public refreshPoolFromEnv() {
    const parseKeys = (envVar: string, singleVar: string, provider: ProviderName): KeyEntry[] => {
      const keysStr = process.env[envVar] || process.env[singleVar] || '';
      if (!keysStr) return [];
      const keys = keysStr.split(',').map(k => k.trim()).filter(Boolean);
      return keys.map(key => ({
        key,
        provider,
        status: 'active',
        cooldownUntil: null,
        errorCount: 0,
        lastUsedAt: 0,
      }));
    };

    this.pool.gemini = parseKeys('GEMINI_API_KEYS', 'GEMINI_API_KEY', 'gemini');
    if (this.pool.gemini.length === 0) {
      this.pool.gemini = parseKeys('GOOGLE_GENERATIVE_AI_API_KEYS', 'GOOGLE_GENERATIVE_AI_API_KEY', 'gemini');
    }
    this.pool.openrouter = parseKeys('OPENROUTER_API_KEYS', 'OPENROUTER_API_KEY', 'openrouter');
    this.pool.grok = parseKeys('XAI_API_KEYS', 'XAI_API_KEY', 'grok');
    this.pool.deepseek = parseKeys('DEEPSEEK_API_KEYS', 'DEEPSEEK_API_KEY', 'deepseek');
  }

  public getKey(provider: ProviderName): string | null {
    this.refreshPoolFromEnv();
    const entries = this.pool[provider];
    if (!entries || entries.length === 0) return null;

    const now = Date.now();
    
    // Auto-recover expired cooldowns
    entries.forEach(entry => {
      if (entry.status === 'cooldown' && entry.cooldownUntil && now > entry.cooldownUntil) {
        entry.status = 'active';
        entry.cooldownUntil = null;
      }
    });

    const activeEntries = entries.filter(e => e.status === 'active');
    if (activeEntries.length === 0) {
      // Return least recently used if all in cooldown as fallback
      const sorted = [...entries].sort((a, b) => a.lastUsedAt - b.lastUsedAt);
      const chosen = sorted[0];
      chosen.lastUsedAt = now;
      return chosen.key;
    }

    const currentIndex = this.activeIndexes[provider] % activeEntries.length;
    const chosen = activeEntries[currentIndex];
    chosen.lastUsedAt = now;
    this.activeIndexes[provider] = (currentIndex + 1) % activeEntries.length;
    return chosen.key;
  }

  public reportError(provider: ProviderName, key: string, errorMsg: string, cooldownDurationMs = 10 * 60 * 1000) {
    const entries = this.pool[provider];
    if (!entries) return;

    const entry = entries.find(e => e.key === key);
    if (entry) {
      entry.errorCount += 1;
      entry.status = 'cooldown';
      entry.cooldownUntil = Date.now() + cooldownDurationMs;
      console.warn(`[KeyPool] Marked key for ${provider} in COOLDOWN for ${cooldownDurationMs / 1000}s. Reason: ${errorMsg}`);
    }
  }

  public getPoolStats() {
    this.refreshPoolFromEnv();
    const stats: Record<string, any> = {};
    for (const [provider, entries] of Object.entries(this.pool)) {
      stats[provider] = {
        totalKeys: entries.length,
        activeKeys: entries.filter(e => e.status === 'active').length,
        cooldownKeys: entries.filter(e => e.status === 'cooldown').length,
      };
    }
    return stats;
  }
}

export const keyPool = new KeyPoolManager();
