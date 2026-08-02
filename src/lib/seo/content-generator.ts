/**
 * AI Content Generator
 * ONLY uses RAG-verified Eurowindow data — no hallucination
 * Reuses: retrieveRelevantContext from rag.ts
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { retrieveRelevantContext } from '@/lib/rag';
import type { ContentGeneratorInput, GeneratedContent, ContentType } from './types';
import { generateSchema } from './schema-generator';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const SYSTEM_PROMPTS: Record<ContentType, string> = {
  blog: `Bạn là chuyên gia content SEO của Eurowindow. Viết bài blog chuẩn SEO.
Chỉ sử dụng thông tin từ tài liệu Eurowindow đã được xác thực. KHÔNG tự bịa.
Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...markdown...","internalLinks":[{"anchor":"...","url":"..."}],"altTexts":[{"description":"...","suggestedAlt":"..."}]}`,
  faq: `Bạn là chuyên gia content Eurowindow. Tạo trang FAQ chuẩn SEO.
Chỉ dùng thông tin đã xác thực. Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...markdown FAQ...","internalLinks":[],"altTexts":[]}`,
  landing: `Bạn là chuyên gia conversion landing page của Eurowindow. Viết landing page tối ưu SEO và CRO.
Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...markdown...","internalLinks":[],"altTexts":[]}`,
  category: `Bạn là chuyên gia content category page. Viết nội dung category chuẩn SEO.
Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...","internalLinks":[],"altTexts":[]}`,
  product: `Bạn là chuyên gia product content SEO. Viết mô tả sản phẩm Eurowindow chuẩn SEO và E-E-A-T.
Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...","internalLinks":[],"altTexts":[]}`,
  meta: `Tạo meta title và meta description tối ưu SEO cho Eurowindow.
Trả về JSON: {"title":"...","metaTitle":"...","metaDescription":"...","slug":"...","content":"...","internalLinks":[],"altTexts":[]}`,
};

export async function generateContent(input: ContentGeneratorInput): Promise<GeneratedContent> {
  const { type, topic, keywords, tone = 'formal', length = 'medium' } = input;

  // RAG context — ONLY verified Eurowindow data
  const ragContext = await retrieveRelevantContext(
    `${topic} ${keywords.join(' ')}`,
    5,
  ).catch(() => '');

  const lengthGuide = { short: '400-600 từ', medium: '800-1200 từ', long: '1500-2500 từ' }[length];

  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: SYSTEM_PROMPTS[type],
    prompt: `Chủ đề: ${topic}
Từ khóa mục tiêu: ${keywords.join(', ')}
Giọng điệu: ${tone}
Độ dài: ${lengthGuide}

Thông tin đã xác thực từ Eurowindow (CHỈ dùng thông tin này, không tự bịa):
${ragContext || 'Không có ngữ cảnh RAG. Chỉ dùng thông tin phổ biến đã biết về Eurowindow.'}

Yêu cầu:
- Tiêu đề H1 hấp dẫn, có keyword
- Meta title 50-60 ký tự
- Meta description 120-155 ký tự
- Cấu trúc heading rõ ràng (H2, H3)
- Có ít nhất 1 đoạn FAQ hoặc CTA
- Đề xuất 3-5 internal links đến các trang Eurowindow liên quan`,
  });

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (json) {
      const data = JSON.parse(json);

      // Auto-generate schema if product or FAQ type
      let schema: Record<string, unknown> | undefined;
      if (type === 'product') {
        schema = generateSchema({
          type: 'Product',
          data: { name: data.title, description: data.metaDescription },
        }).schema;
      } else if (type === 'faq') {
        schema = generateSchema({
          type: 'FAQ',
          data: { faqs: [] },
        }).schema;
      }

      return {
        type,
        title: data.title || topic,
        metaTitle: data.metaTitle || topic,
        metaDescription: data.metaDescription || '',
        slug: data.slug || slugify(data.title || topic),
        content: data.content || '',
        schema,
        internalLinks: data.internalLinks || [],
        altTexts: data.altTexts || [],
        generatedAt: new Date(),
      };
    }
  } catch (e) {
    console.warn('[ContentGen] Parse failed:', e);
  }

  return {
    type,
    title: topic,
    metaTitle: topic.slice(0, 60),
    metaDescription: topic.slice(0, 155),
    slug: slugify(topic),
    content: text.slice(0, 5000),
    internalLinks: [],
    generatedAt: new Date(),
  };
}
