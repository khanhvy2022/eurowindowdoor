/**
 * AI Content Audit — E-E-A-T, Helpful Content, Semantic SEO
 * Reuses: RAG retrieveRelevantContext, Gemini via @ai-sdk/google
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { retrieveRelevantContext } from '@/lib/rag';
import type { ContentAuditResult, ContentScores, ContentIssue, ContentSuggestion } from './types';

interface AiContentAuditResponse {
  scores: ContentScores;
  issues: ContentIssue[];
  suggestions: ContentSuggestion[];
  optimizedVersion?: string;
}

async function analyzeContentWithAi(
  content: string,
  url: string,
  ragContext: string,
): Promise<AiContentAuditResponse> {
  const contentSnippet = content.slice(0, 3000);

  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `Bạn là chuyên gia SEO Content và E-E-A-T. Phân tích nội dung và trả về JSON hợp lệ.
Chỉ trả về JSON object, không markdown fence, không giải thích ngoài JSON.
Schema:
{
  "scores": {
    "eeat": 0-100,
    "helpfulness": 0-100,
    "readability": 0-100,
    "semanticSeo": 0-100,
    "intentMatch": 0-100,
    "spamRisk": 0-100,
    "topicalAuthority": 0-100,
    "freshness": 0-100
  },
  "issues": [{"type": "...", "severity": "critical|warning|info", "description": "...", "suggestion": "..."}],
  "suggestions": [{"type": "add|remove|rewrite|optimize", "section": "...", "current": "...", "suggested": "...", "reason": "..."}],
  "optimizedVersion": "bản tiêu đề và mô tả đã tối ưu"
}`,
    prompt: `URL: ${url}

Ngữ cảnh thương hiệu từ RAG (tài liệu Eurowindow đã xác thực):
${ragContext || 'Không có ngữ cảnh RAG.'}

Nội dung cần phân tích:
${contentSnippet}

Đánh giá theo tiêu chí:
1. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
2. Google Helpful Content (độ hữu ích thực sự cho người dùng)
3. Readability (khả năng đọc, cấu trúc đoạn văn, heading)
4. Semantic SEO (từ khóa liên quan, entity coverage)
5. Intent Match (có đáp ứng search intent không)
6. Spam Risk (keyword stuffing, over-optimization)
7. Topical Authority (độ sâu chủ đề)
8. Freshness (độ mới của thông tin)`,
  });

  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) {
      return JSON.parse(jsonStr) as AiContentAuditResponse;
    }
  } catch (parseErr) {
    console.warn('[Content Audit] JSON parse failed:', parseErr);
  }

  throw new Error('Content Audit response could not be verified; no fallback score is displayed.');
}

export async function auditContent(content: string, url = ''): Promise<ContentAuditResult> {
  // Pull relevant Eurowindow context for factual grounding
  const ragContext = await retrieveRelevantContext(content.slice(0, 500), 3).catch(() => '');

  const aiResult = await analyzeContentWithAi(content, url, ragContext);

  return {
    url,
    content,
    scores: aiResult.scores,
    issues: aiResult.issues,
    suggestions: aiResult.suggestions,
    optimizedVersion: aiResult.optimizedVersion,
    auditedAt: new Date(),
  };
}
