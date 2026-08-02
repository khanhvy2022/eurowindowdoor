/**
 * AI Keyword Research Engine
 * Reuses expandQuery() from rag.ts as seed, Gemini for clustering & intent
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { expandQuery } from '@/lib/rag';
import type { KeywordResearchResult, KeywordCluster, Keyword } from './types';

interface AiKeywordResponse {
  clusters: KeywordCluster[];
  questions: Keyword[];
  gaps: Keyword[];
  cannibalization: Array<{ keyword: string; pages: string[]; recommendation: string }>;
}

async function generateKeywordsWithAi(
  seed: string,
  domain: string,
  expandedSeeds: string[],
): Promise<AiKeywordResponse> {
  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `Bạn là chuyên gia SEO keyword research. Trả về JSON hợp lệ.
Chỉ trả về JSON object, không markdown.
Schema:
{
  "clusters": [{
    "name": "...",
    "pillarKeyword": "...",
    "topicType": "pillar|cluster|long-tail",
    "contentOpportunity": "high|medium|low",
    "keywords": [{
      "keyword": "...",
      "intent": "informational|commercial|transactional|navigational",
      "cluster": "..."
    }]
  }],
  "questions": [{"keyword": "...", "intent": "informational", "cluster": "..."}],
  "gaps": [{"keyword": "...", "intent": "...", "cluster": "..."}],
  "cannibalization": []
}`,
    prompt: `Công ty: Eurowindow (cửa nhựa uPVC, cửa nhôm, cửa gỗ, kính Low-E tại Việt Nam)
Domain: ${domain}
Seed keyword: ${seed}
Mở rộng tự động: ${expandedSeeds.join(', ')}

Tạo:
1. 3–5 keyword clusters với 5–10 keywords mỗi cluster
2. 10 question keywords (dạng hỏi: "cửa ... là gì?", "tại sao...", "cách...")
3. 5 keyword gaps (cơ hội chưa có content)
4. Phát hiện keyword cannibalization nếu có

Ưu tiên: thị trường Việt Nam, từ khóa tiếng Việt, liên quan đến cửa sổ, cửa ra vào, nội thất.`,
  });

  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) return JSON.parse(jsonStr) as AiKeywordResponse;
  } catch (e) {
    console.warn('[Keyword] AI parse failed:', e);
  }

  return { clusters: [], questions: [], gaps: [], cannibalization: [] };
}

export async function researchKeywords(
  seed: string,
  domain = 'eurowindowdoor.com',
): Promise<KeywordResearchResult> {
  const expandedSeeds = expandQuery(seed);
  const aiResult = await generateKeywordsWithAi(seed, domain, expandedSeeds);

  return {
    seed,
    clusters: aiResult.clusters,
    questions: aiResult.questions,
    competitors: [],
    gaps: aiResult.gaps,
    cannibalization: aiResult.cannibalization,
    researchedAt: new Date(),
  };
}
