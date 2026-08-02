import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { auditUrl } from '@/lib/seo/audit';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url required' }, { status: 400 });
    }

    const result = await auditUrl(url);

    // Persist to MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        await db.collection('seo_audits').replaceOne(
          { url: result.url },
          { ...result, _id: undefined },
          { upsert: true },
        );
      }
    } catch { /* non-critical */ }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
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

    const audits = await db.collection('seo_audits')
      .find({}, { projection: { url: 1, score: 1, auditedAt: 1, _id: 0 } })
      .sort({ auditedAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(audits);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
