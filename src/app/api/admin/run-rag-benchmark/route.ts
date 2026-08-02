import { NextResponse } from 'next/server';
import { runRAGBenchmark } from '@/lib/ai/rag-benchmark-suite';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await runRAGBenchmark();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
