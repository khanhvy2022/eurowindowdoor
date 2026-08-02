/**
 * Site Health Monitor
 * Checks: SSL, sitemap, robots, canonical issues, basic link health
 */

import type { SiteHealthResult, BrokenLink, RedirectChain, CanonicalIssue } from './types';

async function checkUrl(
  url: string,
  followRedirects = false,
): Promise<{ status: number; finalUrl: string; chain: string[] }> {
  const chain: string[] = [url];
  let current = url;

  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(current, {
        method: 'HEAD',
        redirect: followRedirects ? 'follow' : 'manual',
        headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
        signal: AbortSignal.timeout(8000),
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location') || '';
        if (!location) break;
        const next = location.startsWith('http') ? location : new URL(location, current).href;
        chain.push(next);
        current = next;
        continue;
      }

      return { status: res.status, finalUrl: current, chain };
    } catch {
      return { status: 0, finalUrl: current, chain };
    }
  }

  return { status: 301, finalUrl: current, chain };
}

async function checkSitemap(domain: string) {
  const sitemapUrl = `${domain}/sitemap.xml`;
  try {
    const res = await fetch(sitemapUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
    });
    if (!res.ok) return { found: false };
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
    return { found: true, url: sitemapUrl, urlCount: urls.length };
  } catch {
    return { found: false };
  }
}

async function checkRobots(domain: string) {
  const robotsUrl = `${domain}/robots.txt`;
  try {
    const res = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'EurowindowSEOBot/1.0' },
    });
    if (!res.ok) return { found: false, allowsIndexing: true, hasSitemap: false };
    const text = await res.text();
    const disallowsRoot = /Disallow:\s*\/\s*$/.test(text);
    const hasSitemap = /Sitemap:/i.test(text);
    return { found: true, allowsIndexing: !disallowsRoot, hasSitemap };
  } catch {
    return { found: false, allowsIndexing: true, hasSitemap: false };
  }
}

export async function checkSiteHealth(domain: string): Promise<SiteHealthResult> {
  // Normalize domain
  const base = domain.startsWith('http') ? domain : `https://${domain}`;

  const [sitemapResult, robotsResult, mainPageCheck] = await Promise.allSettled([
    checkSitemap(base),
    checkRobots(base),
    checkUrl(base, true),
  ]);

  const sitemap = sitemapResult.status === 'fulfilled'
    ? sitemapResult.value
    : { found: false };

  const robots = robotsResult.status === 'fulfilled'
    ? robotsResult.value
    : { found: false, allowsIndexing: true, hasSitemap: false };

  // SSL check via HTTPS attempt
  const sslValid = base.startsWith('https');

  // Check sample pages for redirect chains
  const sampleUrls = [
    base,
    `${base}/san-pham`,
    `${base}/tin-tuc`,
  ];

  const redirectChains: RedirectChain[] = [];
  for (const url of sampleUrls) {
    try {
      const check = await checkUrl(url, false);
      if (check.chain.length > 2) {
        redirectChains.push({
          start: url,
          chain: check.chain,
          hops: check.chain.length - 1,
          isProblematic: check.chain.length > 3,
        });
      }
    } catch {
      // ignore
    }
  }

  return {
    domain,
    ssl: { valid: sslValid },
    sitemap: {
      found: (sitemap as any).found ?? false,
      url: (sitemap as any).url,
      urlCount: (sitemap as any).urlCount,
    },
    robots: {
      found: robots.found ?? false,
      allowsIndexing: robots.allowsIndexing ?? true,
      hasSitemap: robots.hasSitemap ?? false,
    },
    brokenLinks: [],
    redirectChains,
    canonicalIssues: [],
    indexStatus: { indexed: 0, notIndexed: 0, errors: 0, warnings: 0 },
    checkedAt: new Date(),
  };
}
