/**
 * SEO Crawl Engine — wrapper around Crawl4AI with dedup + MongoDB cache
 * Supports: URL, sitemap, batch crawling
 * Reuses: Crawl4AIClient, MongoDB
 */

import { crawl4AIClient } from '@/lib/ai/crawl4ai-client';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';

const CACHE_COLLECTION = 'seo_crawl_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CrawlPageResult {
  url: string;
  title?: string;
  description?: string;
  markdown?: string;
  links: string[];
  images: Array<{ src: string; alt?: string }>;
  statusCode?: number;
  wordCount?: number;
  crawledAt: Date;
  fromCache: boolean;
}

async function getCached(url: string): Promise<CrawlPageResult | null> {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return null;
    const cached = await db.collection(CACHE_COLLECTION).findOne({ url });
    if (!cached) return null;
    const age = Date.now() - new Date(cached.crawledAt).getTime();
    if (age > CACHE_TTL_MS) return null;
    return { ...cached, fromCache: true } as unknown as CrawlPageResult;
  } catch {
    return null;
  }
}

async function saveCache(result: CrawlPageResult): Promise<void> {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return;
    await db.collection(CACHE_COLLECTION).replaceOne(
      { url: result.url },
      { ...result, _id: crypto.randomUUID() },
      { upsert: true },
    );
  } catch (e) {
    console.warn('[CrawlEngine] Cache save failed:', e);
  }
}

export async function crawlPage(url: string): Promise<CrawlPageResult> {
  // Check cache first
  const cached = await getCached(url);
  if (cached) return cached;

  // Try Crawl4AI
  const crawlResult = await crawl4AIClient.crawlUrl(url, { word_count_threshold: 10 });

  if (crawlResult?.success) {
    const result: CrawlPageResult = {
      url,
      markdown: crawlResult.markdown || '',
      links: (crawlResult.links || []).map(l => l.href).filter(Boolean) as string[],
      images: crawlResult.media || [],
      wordCount: (crawlResult.markdown || '').split(/\s+/).filter(Boolean).length,
      crawledAt: new Date(),
      fromCache: false,
    };
    await saveCache(result);
    return result;
  }

  // Fallback: native fetch
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const linkMatches = [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)];

    const result: CrawlPageResult = {
      url,
      title: titleMatch?.[1]?.trim(),
      description: descMatch?.[1]?.trim(),
      links: linkMatches.map(m => m[1]).slice(0, 100),
      images: [],
      statusCode: res.status,
      wordCount: html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
      crawledAt: new Date(),
      fromCache: false,
    };

    await saveCache(result);
    return result;
  } catch (err) {
    return {
      url,
      links: [],
      images: [],
      crawledAt: new Date(),
      fromCache: false,
    };
  }
}

export async function crawlSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const res = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
    return urls;
  } catch {
    return [];
  }
}

export async function batchCrawl(
  urls: string[],
  concurrency = 3,
): Promise<CrawlPageResult[]> {
  const results: CrawlPageResult[] = [];
  const unique = [...new Set(urls)];

  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(url => crawlPage(url)));
    batchResults.forEach(r => {
      if (r.status === 'fulfilled') results.push(r.value);
    });
    // Small delay to avoid hammering
    if (i + concurrency < unique.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return results;
}
