/**
 * AI Technical SEO Audit Engine
 * Crawls a URL → parses HTML signals → generates prioritized fix checklist via AI
 * Reuses: crawl4AIClient, Gemini via @ai-sdk/google
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { crawl4AIClient } from '@/lib/ai/crawl4ai-client';
import type {
  TechnicalAuditResult,
  AuditIssue,
  AuditChecklistItem,
  PageData,
  AuditSeverity,
  AuditCategory,
} from './types';
import { quickScore } from './score';
import crypto from 'crypto';

// ─── HTML Parser helpers ────────────────────────────────────────────────────────

function extractPageData(html: string, url: string): PageData {
  const get = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m ? m[1]?.trim() : undefined;
  };

  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    ?? get(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const h1 = get(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(/<[^>]+>/g, '').trim();
  const canonical = get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const robots = get(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const ogTitle = get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogDescription = get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const ogImage = get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const twitterCard = get(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i);

  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const h2s = h2Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).slice(0, 10);

  const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
  const totalImages = imgMatches.length;
  const imagesWithoutAlt = imgMatches.filter(m => !m[0].includes('alt=') || /alt=["']\s*["']/.test(m[0])).length;

  const internalLinks = (html.match(/href=["'][/#][^"']+["']/g) || []).length;
  const externalLinks = (html.match(/href=["']https?:\/\/[^"']+["']/g) || []).length;

  const schemaMatches = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)];
  const schemaTypes = [...new Set(schemaMatches.map(m => m[1]))];

  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  return {
    title, description, h1, h2s, canonical, robots,
    ogTitle, ogDescription, ogImage, twitterCard,
    schemaTypes, imagesWithoutAlt, totalImages,
    internalLinks, externalLinks, wordCount,
  };
}

// ─── Issue Detectors ────────────────────────────────────────────────────────────

function detectIssues(page: PageData, url: string): AuditIssue[] {
  const issues: AuditIssue[] = [];

  const add = (
    category: AuditCategory,
    severity: AuditSeverity,
    title: string,
    description: string,
    recommendation: string,
    affectedElement?: string,
  ) => {
    issues.push({
      id: crypto.randomUUID(),
      category, severity, title, description, recommendation,
      affectedElement, url,
    });
  };

  // Title
  if (!page.title) {
    add('title', 'critical', 'Missing Title Tag', 'Page has no <title> tag.', 'Add a unique, descriptive title (50–60 chars).');
  } else if (page.title.length < 30 || page.title.length > 65) {
    add('title', 'warning', 'Title Length Issue',
      `Title is ${page.title.length} chars. Optimal: 50–60.`,
      'Rewrite title to 50–60 characters.', page.title);
  }

  // Description
  if (!page.description) {
    add('description', 'critical', 'Missing Meta Description', 'No meta description found.', 'Add a compelling meta description (120–160 chars).');
  } else if (page.description.length < 100 || page.description.length > 165) {
    add('description', 'warning', 'Meta Description Length Issue',
      `Description is ${page.description.length} chars. Optimal: 120–160.`,
      'Rewrite description to 120–160 characters.', page.description);
  }

  // H1
  if (!page.h1) {
    add('headings', 'critical', 'Missing H1 Tag', 'Page has no H1 heading.', 'Add a single, keyword-rich H1 heading.');
  }

  // Images Alt
  if (page.imagesWithoutAlt && page.imagesWithoutAlt > 0) {
    add('images', 'warning', 'Images Missing Alt Text',
      `${page.imagesWithoutAlt} of ${page.totalImages} images lack alt text.`,
      'Add descriptive alt text to all images.');
  }

  // Canonical
  if (!page.canonical) {
    add('canonical', 'warning', 'Missing Canonical Tag', 'No canonical URL defined.', 'Add <link rel="canonical"> to prevent duplicate content.');
  }

  // OpenGraph
  if (!page.ogTitle || !page.ogDescription || !page.ogImage) {
    const missing = [!page.ogTitle && 'og:title', !page.ogDescription && 'og:description', !page.ogImage && 'og:image']
      .filter(Boolean).join(', ');
    add('opengraph', 'warning', 'Incomplete OpenGraph Tags', `Missing: ${missing}`, 'Add complete OG tags for social sharing.');
  }

  // Twitter Card
  if (!page.twitterCard) {
    add('opengraph', 'info', 'Missing Twitter Card', 'No twitter:card meta tag.', 'Add <meta name="twitter:card" content="summary_large_image">.');
  }

  // Schema
  if (!page.schemaTypes || page.schemaTypes.length === 0) {
    add('schema', 'warning', 'No Structured Data', 'No JSON-LD schema found.', 'Add relevant schema markup (Organization, Product, FAQ, Breadcrumb).');
  }

  // Noindex
  if (page.robots?.includes('noindex')) {
    add('indexing', 'critical', 'Page is Noindexed', `robots meta: "${page.robots}"`, 'Remove noindex directive unless intentional.');
  }

  // Content
  if ((page.wordCount || 0) < 300) {
    add('content', 'warning', 'Thin Content', `Only ${page.wordCount} words. Recommended: 600+.`, 'Expand content with relevant, helpful information.');
  }

  // Internal Links
  if ((page.internalLinks || 0) < 3) {
    add('links', 'info', 'Low Internal Links', `Only ${page.internalLinks} internal links found.`, 'Add 3–7 relevant internal links to improve crawlability.');
  }

  return issues;
}

// ─── AI Checklist Generator ────────────────────────────────────────────────────

async function generateAiChecklist(
  issues: AuditIssue[],
  pageData: PageData,
  url: string,
): Promise<AuditChecklistItem[]> {
  if (issues.length === 0) return [];

  const issuesSummary = issues
    .map(i => `[${i.severity.toUpperCase()}] ${i.category}: ${i.title} — ${i.recommendation}`)
    .join('\n');

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: `Bạn là chuyên gia SEO kỹ thuật. Nhiệm vụ: tạo danh sách ưu tiên sửa lỗi SEO.
Chỉ trả về JSON array, không markdown, không giải thích thêm.
Format: [{"priority": 1, "severity": "critical|warning|info", "task": "...", "category": "...", "estimatedImpact": "high|medium|low"}]`,
      prompt: `URL: ${url}\nTiêu đề trang: ${pageData.title || 'N/A'}\nCác vấn đề phát hiện:\n${issuesSummary}\n\nTạo checklist ưu tiên sửa lỗi, sắp xếp từ quan trọng nhất đến ít quan trọng hơn.`,
    });

    const json = text.match(/\[[\s\S]*\]/)?.[0];
    if (json) {
      const parsed = JSON.parse(json) as AuditChecklistItem[];
      return parsed.slice(0, 15);
    }
  } catch (err) {
    console.warn('[SEO Audit] AI checklist generation failed:', err);
  }

  // Fallback: sort by severity
  const severityOrder: Record<AuditSeverity, number> = { critical: 0, warning: 1, info: 2, pass: 3 };
  return issues
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .map((issue, idx) => ({
      priority: idx + 1,
      severity: issue.severity,
      task: issue.recommendation,
      category: issue.category,
      estimatedImpact: issue.severity === 'critical' ? 'high' : issue.severity === 'warning' ? 'medium' : 'low',
    }));
}

// ─── Main Audit Function ────────────────────────────────────────────────────────

export async function auditUrl(url: string): Promise<TechnicalAuditResult> {
  let html = '';
  let pageData: PageData = {};

  // Try Crawl4AI first, fallback to native fetch
  const crawlResult = await crawl4AIClient.crawlUrl(url, { word_count_threshold: 5 });
  if (crawlResult?.html) {
    html = crawlResult.html;
  } else {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
        signal: AbortSignal.timeout(15000),
      });
      html = await res.text();
    } catch (fetchErr) {
      console.warn('[SEO Audit] Fetch failed:', fetchErr);
    }
  }

  pageData = extractPageData(html, url);
  const issues = detectIssues(pageData, url);
  const checklist = await generateAiChecklist(issues, pageData, url);

  const criticals = issues.filter(i => i.severity === 'critical').length;
  const warnings  = issues.filter(i => i.severity === 'warning').length;
  const infos     = issues.filter(i => i.severity === 'info').length;
  const score = quickScore(criticals, warnings, infos);

  return {
    url,
    score,
    issues,
    checklist,
    pageData,
    auditedAt: new Date(),
  };
}
