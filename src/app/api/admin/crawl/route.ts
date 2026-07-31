import { NextResponse } from 'next/server';
import { runCrawlPipeline } from '@/lib/ai/crawler';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const customTargets = body.targets || undefined;

    console.log('[API Admin Crawl] Starting Crawl4AI pipeline...');
    const results = await runCrawlPipeline(customTargets);

    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      message: `Đã hoàn thành đồng bộ website: ${successCount} thành công, ${failedCount} thất bại.`,
      data: results,
    });
  } catch (error: any) {
    console.error('[API Admin Crawl Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi đồng bộ website' },
      { status: 500 }
    );
  }
}
