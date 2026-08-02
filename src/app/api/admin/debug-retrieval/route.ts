import { NextResponse } from 'next/server';
import { retrieveRelevantContextWithDetails } from '@/lib/rag';
import { keyPool } from '@/lib/ai/key-pool';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  const lastDebug = (globalThis as any).lastRagDebugInfo || null;
  const poolStats = keyPool.getPoolStats();

  if (query) {
    const startTime = Date.now();
    const details = await retrieveRelevantContextWithDetails(query, 8);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      query,
      latencyMs,
      keyPoolStats: poolStats,
      details,
    });
  }

  return NextResponse.json({
    success: true,
    lastDebug,
    keyPoolStats: poolStats,
  });
}
