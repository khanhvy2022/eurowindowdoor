/**
 * Google PageSpeed Insights API Integrator (Free Public Endpoint)
 * Fetches REAL Performance, Accessibility, Best Practices, SEO & Core Web Vitals for any URL
 */

export interface PageSpeedResult {
  performance: number;     // 0-100
  accessibility: number;   // 0-100
  bestPractices: number;   // 0-100
  seo: number;             // 0-100
  lcp: string;             // Largest Contentful Paint
  fcp: string;             // First Contentful Paint
  cls: string;             // Cumulative Layout Shift
  inp?: string;            // Interaction to Next Paint
  fetchedAt: Date;
  isLiveData: boolean;
}

export async function fetchPageSpeedData(url: string): Promise<PageSpeedResult | null> {
  const target = url.startsWith('http') ? url : `https://${url}`;
  const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || '';
  const keyParam = apiKey ? `&key=${apiKey}` : '';

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=mobile${keyParam}`;

  try {
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const categories = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};

    const performance = Math.round((categories.performance?.score ?? 0) * 100);
    const accessibility = Math.round((categories.accessibility?.score ?? 0) * 100);
    const bestPractices = Math.round((categories['best-practices']?.score ?? 0) * 100);
    const seo = Math.round((categories.seo?.score ?? 0) * 100);

    const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
    const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
    const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const inp = audits['interaction-to-next-paint']?.displayValue;

    return {
      performance,
      accessibility,
      bestPractices,
      seo,
      lcp,
      fcp,
      cls,
      inp,
      fetchedAt: new Date(),
      isLiveData: true,
    };
  } catch (err) {
    console.warn('[PageSpeed] Failed to fetch live data:', err);
    return null;
  }
}
