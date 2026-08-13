import { NextResponse } from 'next/server';
import { calculateSEOScore } from '@/lib/seo/analyzer/scoring';
import { ArticleSEOData } from '@/lib/seo/analyzer/types';

export async function POST(request: Request) {
  try {
    const data: ArticleSEOData = await request.json();
    const result = calculateSEOScore(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi khi phân tích SEO' },
      { status: 500 }
    );
  }
}
