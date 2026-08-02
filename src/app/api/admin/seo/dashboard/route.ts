import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { auditUrl } from '@/lib/seo/audit';
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
    const domain = 'eurowindow.com.vn';

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
    let latestAudit: any = null;
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        latestAudit = await db.collection('seo_audits')
          .findOne({}, { sort: { auditedAt: -1 } });
      }
    } catch { /* non-critical */ }

    const technicalScore = latestAudit?.score ?? 75;
    const performanceScore = pageSpeed?.performance ?? 70;
    const accessibilityScore = pageSpeed?.accessibility ?? 80;
    const contentScore = pageSpeed?.seo ?? 80;
    const mobileScore = pageSpeed?.performance ? Math.min(100, pageSpeed.performance + 5) : 70;

    const seoScore = aggregateSeoScore({
      technical: technicalScore,
      content: contentScore,
      performance: performanceScore,
      mobile: mobileScore,
      accessibility: accessibilityScore,
    });

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
      indexStatus: health?.indexStatus ?? gsc?.indexCoverage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
