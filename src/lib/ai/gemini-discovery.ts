/**
 * Dynamic Gemini Model Discovery Engine.
 * Dynamically queries Google Generative AI ListModels API (v1beta)
 * to discover valid generation models for the active API key without hardcoding.
 */

interface GeminiModelInfo {
  name: string;
  version?: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
}

interface CacheEntry {
  models: string[];
  lastFetched: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache
let modelCache: CacheEntry | null = null;
const badModels = new Map<string, number>(); // modelName -> cooldownUntil

export async function fetchAvailableGeminiModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (modelCache && now - modelCache.lastFetched < CACHE_TTL_MS) {
    return modelCache.models;
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      console.warn(`[GeminiDiscovery] ListModels API returned status ${res.status}`);
      return modelCache?.models || [];
    }

    const data = await res.json();
    const rawModels: GeminiModelInfo[] = data.models || [];

    const supportedModels = rawModels
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace(/^models\//, ''));

    console.log(`[GeminiDiscovery] Dynamically discovered ${supportedModels.length} generation models for key:`, supportedModels);

    modelCache = {
      models: supportedModels,
      lastFetched: now,
    };

    return supportedModels;
  } catch (err: any) {
    console.error(`[GeminiDiscovery] Failed to fetch models.list:`, err.message);
    return modelCache?.models || [];
  }
}

export async function resolveDynamicGeminiModel(apiKey: string, preferredModel?: string): Promise<string> {
  const discoveredModels = await fetchAvailableGeminiModels(apiKey);
  const now = Date.now();

  // Filter out models in bad list
  const validModels = discoveredModels.filter(m => {
    const cooldown = badModels.get(m);
    return !cooldown || now > cooldown;
  });

  if (preferredModel && validModels.includes(preferredModel)) {
    console.log(`[GeminiDiscovery] Using requested valid model: "${preferredModel}"`);
    return preferredModel;
  }

  // Priority ordering: Flash lite/latest models ➔ 2.0/Flash models ➔ Pro models ➔ First valid
  const flashLite = validModels.find(m => m.includes('flash-lite-latest') || m.includes('flash-lite'));
  if (flashLite) {
    console.log(`[GeminiDiscovery] Dynamic selection -> "${flashLite}" (High reliability flash-lite priority)`);
    return flashLite;
  }

  const flashAny = validModels.find(m => m.includes('flash'));
  if (flashAny) {
    console.log(`[GeminiDiscovery] Dynamic selection -> "${flashAny}" (Flash priority)`);
    return flashAny;
  }

  if (validModels.length > 0) {
    const fallbackModel = validModels[0];
    console.log(`[GeminiDiscovery] Dynamic selection fallback -> "${fallbackModel}"`);
    return fallbackModel;
  }

  // Fallback default if list discovery empty
  console.log(`[GeminiDiscovery] Default fallback -> "gemini-flash-lite-latest"`);
  return 'gemini-flash-lite-latest';
}

export function reportBadGeminiModel(modelName: string, reason: string, cooldownDurationMs = 10 * 60 * 1000) {
  console.warn(`[GeminiDiscovery] Excluding model "${modelName}" for ${cooldownDurationMs / 1000}s. Reason: ${reason}`);
  badModels.set(modelName, Date.now() + cooldownDurationMs);
}
