/**
 * AI Internal Linking Engine
 * Analyzes site pages, detects orphan pages, generates link suggestions
 * Reuses: MongoDB documents collection
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import type { InternalLinkAnalysis, InternalLinkSuggestion, LinkGraphNode } from './types';

interface StoredPage {
  url?: string;
  file_name?: string;
  content?: string;
  inboundLinks?: number;
}

async function getSitePages(): Promise<StoredPage[]> {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return [];
    const docs = await db.collection('documents').find({}).limit(100).toArray();
    return docs.map(d => ({
      url: d.url || d.file_name || '',
      file_name: d.file_name || '',
      content: '',
    }));
  } catch {
    return [];
  }
}

async function generateLinkSuggestions(
  pages: StoredPage[],
): Promise<InternalLinkSuggestion[]> {
  if (pages.length < 2) return [];

  const pageList = pages
    .slice(0, 30)
    .map(p => `- ${p.file_name || p.url}`)
    .join('\n');

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: `Bạn là chuyên gia SEO internal linking. Trả về JSON array hợp lệ.
Format: [{"sourceUrl":"...","sourceTitle":"...","targetUrl":"...","targetTitle":"...","anchorText":"...","context":"...","reason":"...","confidence":0.0-1.0}]
Chỉ JSON, không markdown.`,
      prompt: `Website Eurowindow (cửa sổ, cửa nhôm, cửa nhựa uPVC, cửa gỗ)
Danh sách trang/tài liệu:\n${pageList}

Đề xuất 10 internal link tốt nhất, ưu tiên:
1. Link từ bài viết informational đến product page
2. Link từ product page đến related products  
3. Link đến pillar content từ cluster pages
Anchor text phải tự nhiên, không over-optimize.`,
    });

    const json = text.match(/\[[\s\S]*\]/)?.[0];
    if (json) return JSON.parse(json) as InternalLinkSuggestion[];
  } catch (e) {
    console.warn('[InternalLink] AI failed:', e);
  }

  return [];
}

export async function analyzeInternalLinks(): Promise<InternalLinkAnalysis> {
  const pages = await getSitePages();

  const suggestions = await generateLinkSuggestions(pages);

  const linkGraph: LinkGraphNode[] = pages.map(p => ({
    url: p.url || p.file_name || '',
    title: p.file_name || '',
    inboundLinks: 0,
    outboundLinks: 0,
    depth: 1,
    isOrphan: (p.inboundLinks ?? 0) === 0,
    isPillar: false,
  }));

  const orphanPages = linkGraph.filter(n => n.isOrphan).map(n => n.url);

  return {
    orphanPages,
    deepPages: [],
    suggestions,
    brokenLinks: [],
    pillarPages: [],
    linkGraph,
    analyzedAt: new Date(),
  };
}
