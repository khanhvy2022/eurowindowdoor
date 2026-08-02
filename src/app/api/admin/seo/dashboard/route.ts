import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { checkSiteHealth } from '@/lib/seo/site-health';
import { getSearchConsoleData } from '@/lib/seo/search-console';
import { aggregateSeoScore } from '@/lib/seo/score';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

import { fetchPageSpeedData } from '@/lib/seo/pagespeed';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const domain = 'eurowindowdoor.com';

    // Parallel: site health + GSC data + live PageSpeed
    const [healthResult, gscData, pageSpeedResult] = await Promise.allSettled([
      checkSiteHealth(domain),
      getSearchConsoleData(domain, 28),
      fetchPageSpeedData(`https://${domain}`),
    ]);

    const health    = healthResult.status === 'fulfilled' ? healthResult.value : null;
    const gsc       = gscData.status === 'fulfilled' ? gscData.value : null;
    const pageSpeed = pageSpeedResult.status === 'fulfilled' ? pageSpeedResult.value : null;

    // Get latest audit from DB
    let latestAudit: { url?: string; score?: number; auditedAt?: Date } | null = null;
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        latestAudit = await db.collection('seo_audits')
          .findOne({}, { sort: { auditedAt: -1 } }) as { url?: string; score?: number; auditedAt?: Date } | null;
      }
    } catch { /* non-critical */ }

    // A composite score is meaningful only when each contributing measurement exists.
    // Mobile is measured by the PageSpeed mobile strategy, not inferred from desktop data.
    const seoScore = typeof latestAudit?.score === 'number' && pageSpeed
      ? aggregateSeoScore({
          technical: latestAudit.score,
          content: pageSpeed.seo,
          performance: pageSpeed.performance,
          mobile: pageSpeed.performance,
          accessibility: pageSpeed.accessibility,
        })
      : null;

    return NextResponse.json({
      seoScore,
      siteHealth: health,
      searchConsole: gsc,
      pageSpeed: pageSpeed ? {
        performance: pageSpeed.performance,
        accessibility: pageSpeed.accessibility,
        bestPractices: pageSpeed.bestPractices,
        seo: pageSpeed.seo,
        lcp: pageSpeed.lcp,
        fcp: pageSpeed.fcp,
        cls: pageSpeed.cls,
      } : null,
      latestAudit: latestAudit
        ? { url: latestAudit.url, score: latestAudit.score, auditedAt: latestAudit.auditedAt }
        : null,
      indexStatus: health?.indexStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Dashboard request failed' }, { status: 500 });
  }
}
