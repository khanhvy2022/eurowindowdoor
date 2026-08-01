/**
 * Crawl4AI Engine: Automated Web Crawler & Periodic Document Synchronization.
 * Scrapes official website pages, extracts clean Markdown/Text, and syncs into Vector Store.
 */

import { processAndStoreDocument } from '@/lib/rag';

export interface CrawlTarget {
  url: string;
  category: 'product' | 'article' | 'showroom' | 'general';
}

export interface CrawlResult {
  url: string;
  title: string;
  status: 'success' | 'failed' | 'skipped';
  chunksCount?: number;
  error?: string;
}

const OFFICIAL_TARGETS: CrawlTarget[] = [
  { url: 'https://eurowindow.biz/san-pham', category: 'product' },
  { url: 'https://eurowindow.biz/cua-nhom-cao-cap', category: 'product' },
  { url: 'https://eurowindow.biz/cua-nhua-upvc', category: 'product' },
  { url: 'https://eurowindow.biz/tin-tuc', category: 'article' },
  { url: 'https://eurowindow.biz/showroom', category: 'showroom' },
];

/**
 * Strips HTML tags and transforms web page content into clean Markdown prose.
 */
export function htmlToCleanProse(html: string): { title: string; text: string } {
  // Extract Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Eurowindow Official Page';

  // Strip script, style, nav, footer tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');

  // Convert headers & paragraphs
  cleaned = cleaned
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n### $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n- $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { title, text: cleaned };
}

/**
 * Crawls official targets or custom URLs and syncs processed content into RAG Store.
 */
export async function runCrawlPipeline(customTargets?: CrawlTarget[]): Promise<CrawlResult[]> {
  const targets = customTargets && customTargets.length > 0 ? customTargets : OFFICIAL_TARGETS;
  const results: CrawlResult[] = [];
  const { crawl4AIClient } = await import('@/lib/ai/crawl4ai-client');

  for (const target of targets) {
    try {
      console.log(`[Crawl4AI Engine] Processing: ${target.url}...`);
      let title = '';
      let text = '';

      if (crawl4AIClient.isConfigured()) {
        const c4aResult = await crawl4AIClient.crawlUrl(target.url);
        if (c4aResult && c4aResult.success && c4aResult.markdown) {
          title = c4aResult.metadata?.title || target.url;
          text = c4aResult.markdown;
        }
      }

      // Native fallback if Crawl4AI disabled or returned empty
      if (!text) {
        const response = await fetch(target.url, {
          headers: {
            'User-Agent': 'EurowindowAI-Crawler/2.0 (+https://eurowindow.com.vn)',
            'Accept': 'text/html,application/xhtml+xml',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP Status ${response.status}`);
        }

        const html = await response.text();
        const parsed = htmlToCleanProse(html);
        title = parsed.title;
        text = parsed.text;
      }

      if (!text || text.length < 100) {
        results.push({
          url: target.url,
          title: title || target.url,
          status: 'skipped',
          error: 'Nội dung trang web quá ngắn hoặc rỗng',
        });
        continue;
      }

      const fileName = `[Website] ${title} (${target.url})`;
      const docId = await processAndStoreDocument(fileName, text);

      // Auto-trigger Knowledge Compiler in background (Non-blocking)
      try {
        const { compileKnowledgePack, ENABLE_KNOWLEDGE_COMPILER } = await import('@/lib/ai/knowledge-compiler/compiler');
        if (ENABLE_KNOWLEDGE_COMPILER) {
          compileKnowledgePack(text, title, `Crawl4AI: ${target.url}`).catch(err => {
            console.warn('[Crawl4AI Compiler Background Error]:', err);
          });
        }
      } catch (e) {}

      results.push({
        url: target.url,
        title,
        status: 'success',
        chunksCount: Math.ceil(text.length / 700),
      });
    } catch (err: any) {
      console.error(`[Crawl4AI Engine] Fail ${target.url}:`, err.message || err);
      results.push({
        url: target.url,
        title: target.url,
        status: 'failed',
        error: err.message || String(err),
      });
    }
  }

  return results;
}
