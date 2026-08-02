/**
 * Gemini model discovery.
 *
 * Model IDs are obtained from Google's ListModels API instead of relying on
 * mutable aliases. The cache is scoped to each API key because keys can have
 * different model entitlements.
 */

interface GeminiModelInfo {
  name: string;
  supportedGenerationMethods?: string[];
}

interface GeminiModelsResponse {
  models?: GeminiModelInfo[];
  nextPageToken?: string;
}

interface CacheEntry {
  models: string[];
  lastFetched: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const modelCache = new Map<string, CacheEntry>();
const badModels = new Map<string, number>();

// These are stable model IDs, not Google aliases. A deployment can override
// their priority through GEMINI_MODEL_PRIORITY without changing application code.
const DEFAULT_PRIORITY = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

function cacheKeyFor(apiKey: string) {
  return apiKey.slice(-12);
}

function configuredPriority() {
  const configured = process.env.GEMINI_MODEL_PRIORITY
    ?.split(',')
    .map(model => model.trim())
    .filter(Boolean);

  return configured && configured.length > 0 ? configured : DEFAULT_PRIORITY;
}

function rankModel(model: string, priority: string[]) {
  const explicitRank = priority.indexOf(model);
  if (explicitRank >= 0) return explicitRank;

  // Prefer non-alias Flash variants returned by the API, then any other
  // generation model available to this key.
  if (/^gemini-\d+(?:\.\d+)?-flash(?:-lite)?(?:-\d+)?$/.test(model)) {
    return priority.length + 1;
  }
  if (model.includes('flash') && !model.includes('preview')) return priority.length + 2;
  if (!model.includes('preview') && !model.includes('image') && !model.includes('tts')) {
    return priority.length + 3;
  }
  return priority.length + 4;
}

export async function fetchAvailableGeminiModels(apiKey: string, forceRefresh = false): Promise<string[]> {
  if (!apiKey) throw new Error('Gemini API key is missing; cannot discover models.');

  const key = cacheKeyFor(apiKey);
  const cached = modelCache.get(key);
  const now = Date.now();
  if (!forceRefresh && cached && now - cached.lastFetched < CACHE_TTL_MS) {
    return cached.models;
  }

  try {
    const models: string[] = [];
    let pageToken: string | undefined;

    do {
      const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
      url.searchParams.set('key', apiKey);
      if (pageToken) url.searchParams.set('pageToken', pageToken);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`models.list returned HTTP ${response.status}`);
      }

      const payload = await response.json() as GeminiModelsResponse;
      models.push(...(payload.models || [])
        .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
        .map(model => model.name.replace(/^models\//, '')));
      pageToken = payload.nextPageToken;
    } while (pageToken);

    const uniqueModels = [...new Set(models)];
    modelCache.set(key, { models: uniqueModels, lastFetched: now });
    console.log(`[GeminiDiscovery] models.list found ${uniqueModels.length} generation models for this API key.`);
    return uniqueModels;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[GeminiDiscovery] models.list failed: ${message}`);
    if (cached?.models.length) return cached.models;
    throw new Error(`Gemini model discovery failed: ${message}`);
  }
}

export function warmGeminiModelDiscovery(apiKey: string) {
  return fetchAvailableGeminiModels(apiKey).catch(error => {
    console.warn(`[GeminiDiscovery] Startup warm-up skipped: ${error instanceof Error ? error.message : String(error)}`);
  });
}

export async function getDynamicGeminiModelCandidates(apiKey: string, preferredModel?: string): Promise<string[]> {
  const now = Date.now();
  const priority = configuredPriority();
  const discoveredModels = await fetchAvailableGeminiModels(apiKey);
  const eligibleModels = discoveredModels.filter(model => {
    const cooldownUntil = badModels.get(model);
    return !cooldownUntil || cooldownUntil <= now;
  });

  const orderedModels = [...eligibleModels].sort((left, right) => {
    if (left === preferredModel) return -1;
    if (right === preferredModel) return 1;
    return rankModel(left, priority) - rankModel(right, priority) || left.localeCompare(right);
  });

  if (orderedModels.length === 0) {
    throw new Error('No eligible Gemini generation model is available for this API key.');
  }

  console.log(`[GeminiDiscovery] Candidate order: ${orderedModels.join(' -> ')}`);
  return orderedModels;
}

export async function resolveDynamicGeminiModel(apiKey: string, preferredModel?: string): Promise<string> {
  const [selectedModel] = await getDynamicGeminiModelCandidates(apiKey, preferredModel);
  console.log(`[GeminiDiscovery] Selected "${selectedModel}" from models.list.`);
  return selectedModel;
}

export function reportBadGeminiModel(modelName: string, reason: string, cooldownDurationMs = 10 * 60 * 1000) {
  const isUnavailable = /\b404\b|not found|does not exist|unsupported model/i.test(reason);
  if (isUnavailable) {
    modelCache.clear();
    console.warn(`[GeminiDiscovery] Invalidated cached model list after unavailable model "${modelName}".`);
  }

  badModels.set(modelName, Date.now() + cooldownDurationMs);
  console.warn(`[GeminiDiscovery] Skipping "${modelName}" for ${cooldownDurationMs / 1000}s. Reason: ${reason}`);
}
