import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateReport, reportToCsv } from '@/lib/seo/report';
import { aggregateSeoScore } from '@/lib/seo/score';
import type { ReportType } from '@/lib/seo/types';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type = 'monthly', format = 'json' } = await req.json();

  const seoScore = aggregateSeoScore({
    technical: 65, content: 68, performance: 72, mobile: 70, accessibility: 75,
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
