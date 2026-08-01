/**
 * Crawl4AI REST Client.
 * Connects to a Crawl4AI microservice engine for dynamic JavaScript rendering,
 * deep crawling, anti-bot evasion, and structured Markdown transformation.
 */

export interface Crawl4AIResult {
  url: string;
  success: boolean;
  markdown?: string;
  html?: string;
  cleaned_html?: string;
  extracted_content?: string;
  metadata?: Record<string, any>;
  media?: Array<{ src: string; alt?: string }>;
  links?: Array<{ href: string; text?: string }>;
  error_message?: string;
}

export interface Crawl4AIOptions {
  js_code?: string;
  wait_for?: string;
  screenshot?: boolean;
  pdf?: boolean;
  word_count_threshold?: number;
  extraction_strategy?: string;
}

export class Crawl4AIClient {
  private baseUrl: string;
  private apiToken?: string;

  constructor() {
    this.baseUrl = process.env.CRAWL4AI_API_URL || 'http://localhost:11235';
    this.apiToken = process.env.CRAWL4AI_API_TOKEN;
  }

  public isConfigured(): boolean {
    return process.env.ENABLE_CRAWL4AI === 'true';
  }

  /**
   * Crawls a single URL using Crawl4AI dynamic engine.
   */
  public async crawlUrl(url: string, options: Crawl4AIOptions = {}): Promise<Crawl4AIResult | null> {
    if (!this.isConfigured()) return null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}/crawl`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          urls: url,
          word_count_threshold: options.word_count_threshold || 10,
          extraction_strategy: options.extraction_strategy || 'NoExtractionStrategy',
          js_code: options.js_code,
          wait_for: options.wait_for,
          screenshot: options.screenshot || false,
        }),
      });

      if (!res.ok) {
        console.warn(`[Crawl4AI] Failed to crawl ${url}. Status ${res.status}`);
        return null;
      }

      const data = await res.json();
      const result = Array.isArray(data.results) ? data.results[0] : data;

      if (!result || !result.success) {
        console.warn(`[Crawl4AI] Unsuccessful crawl for ${url}: ${result?.error_message}`);
        return null;
      }

      return {
        url: result.url || url,
        success: true,
        markdown: result.markdown || result.extracted_content || '',
        html: result.html || '',
        cleaned_html: result.cleaned_html || '',
        extracted_content: result.extracted_content || '',
        metadata: result.metadata || {},
        media: result.media || [],
        links: result.links || [],
      };
    } catch (err) {
      console.error(`[Crawl4AI] Exception during crawl of ${url}:`, err);
      return null;
    }
  }
}

export const crawl4AIClient = new Crawl4AIClient();
