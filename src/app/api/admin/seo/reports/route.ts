import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateReport, reportToCsv } from '@/lib/seo/report';
import { aggregateSeoScore } from '@/lib/seo/score';
import { fetchPageSpeedData } from '@/lib/seo/pagespeed';
import type { ReportType } from '@/lib/seo/types';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type = 'monthly', format = 'json' } = await req.json();

  let latestAudit: { score?: number } | null = null;
  try {
    await connectToDatabase();
    latestAudit = await mongoose.connection.db?.collection('seo_audits')
      .findOne({}, { sort: { auditedAt: -1 }, projection: { score: 1 } }) as { score?: number } | null ?? null;
  } catch { /* handled below */ }
  const pageSpeed = await fetchPageSpeedData('https://eurowindowdoor.com');
  if (typeof latestAudit?.score !== 'number' || !pageSpeed) {
    return NextResponse.json({
      error: 'Chưa đủ dữ liệu thực để xuất báo cáo. Hãy chạy Technical Audit và kiểm tra kết nối Google PageSpeed trước.',
    }, { status: 409 });
  }
  const seoScore = aggregateSeoScore({
    technical: latestAudit.score,
    content: pageSpeed.seo,
    performance: pageSpeed.performance,
    mobile: pageSpeed.performance,
    accessibility: pageSpeed.accessibility,
  });

  const report = await generateReport(type as ReportType, seoScore);

  // Persist
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) await db.collection('seo_reports').insertOne({ ...report });
  } catch { /* non-critical */ }

  if (format === 'csv') {
    const csv = reportToCsv(report);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="seo-report-${type}.csv"`,
      },
    });
  }

  return NextResponse.json(report);
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return NextResponse.json([]);
    const reports = await db.collection('seo_reports')
      .find({}, { projection: { type: 1, title: 1, generatedAt: 1, 'seoScore.overall': 1, _id: 0 } })
      .sort({ generatedAt: -1 })
      .limit(20)
      .toArray();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Report request failed' }, { status: 500 });
  }
}
