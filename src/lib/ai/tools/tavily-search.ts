/**
 * Tavily Web Search Tool Integration.
 * Conducts real-time domain-restricted web research for market prices,
 * building codes, and official news updates.
 */

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export async function searchTavily(
  query: string,
  options: { maxResults?: number; includeDomains?: string[] } = {}
): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const maxResults = options.maxResults || 5;
  const includeDomains = options.includeDomains || ['eurowindow.biz', 'eurowindow.com.vn'];

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        include_domains: includeDomains,
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      console.warn(`[TavilySearch] HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (data && Array.isArray(data.results)) {
      return data.results.map((r: any) => ({
        title: r.title || 'Web Result',
        url: r.url || '',
        content: r.content || '',
        score: r.score || 0.8,
      }));
    }
  } catch (err) {
    console.error('[TavilySearch] Search failed:', err);
  }

  return [];
}
