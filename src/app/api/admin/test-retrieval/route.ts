import { NextResponse } from 'next/server';
import { retrieveRelevantContext } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập từ khóa hoặc câu hỏi cần tra cứu.' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const contextResult = await retrieveRelevantContext(query.trim(), 5);
    const durationMs = Date.now() - startTime;

    const chunks = contextResult
      ? contextResult.split('\n\n').filter(c => c.trim().length > 0)
      : [];

    return NextResponse.json({
      success: true,
      query: query.trim(),
      retrievedChunksCount: chunks.length,
      chunks,
      durationMs,
    });
  } catch (error: any) {
    console.error('[API Admin Test Retrieval Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi tra cứu tri thức' },
      { status: 500 }
    );
  }
}
