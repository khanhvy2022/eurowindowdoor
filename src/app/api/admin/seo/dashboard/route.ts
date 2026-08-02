import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { auditUrl } from '@/lib/seo/audit';
import { checkSiteHealth } from '@/lib/seo/site-health';
import { getSearchConsoleData } from '@/lib/seo/search-console';
import { aggregateSeoScore } from '@/lib/seo/score';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const domain = 'eurowindow.com.vn';

    // Parallel: site health + GSC data
    const [healthResult, gscData] = await Promise.allSettled([
      checkSiteHealth(domain),
      getSearchConsoleData(domain, 28),
    ]);

    const health = healthResult.status === 'fulfilled' ? healthResult.value : null;
    const gsc    = gscData.status === 'fulfilled' ? gscData.value : null;

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

    const technicalScore = latestAudit?.score ?? 65;
    const seoScore = aggregateSeoScore({
      technical:    technicalScore,
      content:      68,
      performance:  72,
      mobile:       70,
      accessibility: 75,
    });

    return NextResponse.json({
      seoScore,
      siteHealth: health,
      searchConsole: gsc,
      latestAudit: latestAudit
        ? { url: latestAudit.url, score: latestAudit.score, auditedAt: latestAudit.auditedAt }
        : null,
      indexStatus: health?.indexStatus ?? gsc?.indexCoverage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
