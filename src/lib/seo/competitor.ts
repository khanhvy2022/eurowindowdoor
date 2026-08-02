/**
 * AI Competitor Analysis
 * Crawls competitor domain → AI comparison report
 * Reuses: crawl-engine, Gemini
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { crawlPage } from './crawl-engine';
import type { CompetitorAnalysis, SchemaType } from './types';

export async function analyzeCompetitor(domain: string): Promise<CompetitorAnalysis> {
  const base = domain.startsWith('http') ? domain : `https://${domain}`;

  // Crawl key pages
  const pagesToCrawl = [base, `${base}/sitemap.xml`];
  const crawlResults = await Promise.allSettled(pagesToCrawl.map(u => crawlPage(u)));

  const pageContent = crawlResults
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value.markdown || '')
    .join('\n\n')
    .slice(0, 4000);

  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `Bạn là chuyên gia SEO phân tích đối thủ cạnh tranh. Trả về JSON hợp lệ.
Chỉ JSON, không markdown fence.
Schema:
{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "opportunities": ["..."],
  "schemaUsed": ["Organization", "Product"],
  "technicalScore": 0-100,
  "contentScore": 0-100,
  "topPages": [{"url": "...", "estimatedTraffic": 0, "keywords": ["..."]}],
  "keywordGaps": [{"keyword": "...", "intent": "informational", "cluster": "..."}],
  "contentGaps": ["..."]
}`,
    prompt: `So sánh đối thủ "${domain}" với Eurowindow (cửa nhôm, cửa nhựa uPVC, cửa gỗ, kính Low-E tại Việt Nam).

Nội dung trang đối thủ (đã crawl):
${pageContent || 'Không crawl được nội dung. Phân tích dựa trên domain name.'}

Phân tích:
1. Điểm mạnh của đối thủ (so với Eurowindow)
2. Điểm yếu của đối thủ
3. Cơ hội Eurowindow có thể vượt lên
4. Schema types họ sử dụng
5. Top pages ước tính
6. Keyword gaps (từ khóa đối thủ có nhưng Eurowindow chưa target)`,
  });

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (json) {
      const data = JSON.parse(json);
      return {
        domain,
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        opportunities: data.opportunities || [],
        keywordGaps: data.keywordGaps || [],
        contentGaps: data.contentGaps || [],
        schemaUsed: (data.schemaUsed || []) as SchemaType[],
        topPages: data.topPages || [],
        technicalScore: data.technicalScore || 50,
        contentScore: data.contentScore || 50,
        analyzedAt: new Date(),
      };
    }
  } catch (e) {
    console.warn('[Competitor] Parse failed:', e);
  }

  return {
    domain,
    strengths: ['Có website'],
    weaknesses: ['Không phân tích được'],
    opportunities: ['Chưa xác định'],
    keywordGaps: [],
    contentGaps: [],
    schemaUsed: [],
    topPages: [],
    technicalScore: 50,
    contentScore: 50,
    analyzedAt: new Date(),
  };
}
