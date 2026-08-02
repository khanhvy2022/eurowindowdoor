/**
 * GEO — Generative Engine Optimization
 * Tests AI visibility of Eurowindow brand using available API providers:
 * Gemini (Google), Groq (LLama/Mixtral), OpenRouter
 * Reuses: existing API keys from .env.local
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { GeoAnalysisResult, GeoScore, AiEngine } from './types';

const GEO_QUERIES = [
  'Eurowindow là thương hiệu gì?',
  'Cửa nhôm Eurowindow có tốt không?',
  'Eurowindow vs các thương hiệu cửa khác ở Việt Nam',
  'Giá cửa nhựa uPVC Eurowindow bao nhiêu?',
  'Eurowindow địa chỉ showroom ở đâu?',
];

const SCORING_PROMPT = (brand: string, query: string, response: string) => `
Đánh giá khả năng hiển thị của thương hiệu "${brand}" trong câu trả lời AI bên dưới.
Query gốc: "${query}"
Câu trả lời AI:
"""
${response.slice(0, 1000)}
"""

Chấm điểm từng tiêu chí (0-100) và trả về JSON:
{
  "entityCompleteness": 0-100,
  "knowledgeCoverage": 0-100,
  "citationQuality": 0-100,
  "semanticRichness": 0-100,
  "answerQuality": 0-100
}
Chỉ JSON, không markdown.
`;

async function scoreGeoResponse(
  brand: string,
  query: string,
  response: string,
): Promise<Omit<GeoScore, 'engine' | 'analyzedAt' | 'aiVisibilityScore' | 'sampleResponse'>> {
  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: SCORING_PROMPT(brand, query, response),
    });
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (json) return JSON.parse(json);
  } catch {
    // fallback
  }
  return {
    entityCompleteness: 50,
    knowledgeCoverage: 50,
    citationQuality: 50,
    semanticRichness: 50,
    answerQuality: 50,
  };
}

async function testWithGemini(brand: string, query: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: query,
    });
    return text;
  } catch {
    return '';
  }
}

async function testWithGroq(brand: string, query: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return '';
  try {
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
    });
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      prompt: query,
    });
    return text;
  } catch {
    return '';
  }
}

async function testWithOpenRouter(brand: string, query: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return '';
  try {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
    const { text } = await generateText({
      model: openrouter('mistralai/mistral-7b-instruct'),
      prompt: query,
    });
    return text;
  } catch {
    return '';
  }
}

export async function analyzeGeoVisibility(
  brand = 'Eurowindow',
  domain = 'eurowindowdoor.com',
): Promise<GeoAnalysisResult> {
  const query = GEO_QUERIES[Math.floor(Math.random() * GEO_QUERIES.length)];

  const engines: Array<{ engine: AiEngine; tester: (b: string, q: string) => Promise<string> }> = [
    { engine: 'gemini',      tester: testWithGemini },
    { engine: 'groq',        tester: testWithGroq },
    { engine: 'openrouter',  tester: testWithOpenRouter },
  ];

  const scores: GeoScore[] = [];

  for (const { engine, tester } of engines) {
    const response = await tester(brand, query);
    if (!response) continue;

    const rawScores = await scoreGeoResponse(brand, query, response);
    const aiVisibilityScore = Math.round(
      (rawScores.entityCompleteness * 0.25 +
        rawScores.knowledgeCoverage * 0.25 +
        rawScores.citationQuality * 0.15 +
        rawScores.semanticRichness * 0.20 +
        rawScores.answerQuality * 0.15),
    );

    scores.push({
      engine,
      ...rawScores,
      aiVisibilityScore,
      sampleResponse: response.slice(0, 300),
      analyzedAt: new Date(),
    });
  }

  const overallScore = scores.length > 0
    ? Math.round(scores.reduce((s, g) => s + g.aiVisibilityScore, 0) / scores.length)
    : 0;

  const recommendations: string[] = [];
  if (overallScore < 50) {
    recommendations.push('Tăng cường Entity Coverage — thêm thông tin chi tiết về sản phẩm, địa chỉ, giải thưởng.');
    recommendations.push('Thêm FAQ schema để AI có dữ liệu có cấu trúc để trích dẫn.');
    recommendations.push('Tối ưu Organization schema với sameAs links đến Wikipedia, Wikidata.');
  }
  if (overallScore < 70) {
    recommendations.push('Cập nhật About page với thông tin E-E-A-T đầy đủ.');
    recommendations.push('Thêm citation từ các nguồn uy tín (báo chí, hiệp hội ngành).');
  }
  recommendations.push('Đảm bảo tên thương hiệu, địa chỉ, số điện thoại nhất quán trên tất cả các trang.');

  return {
    domain,
    brand,
    scores,
    overallScore,
    recommendations,
    analyzedAt: new Date(),
  };
}
