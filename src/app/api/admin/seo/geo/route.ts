import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { analyzeGeoVisibility } from '@/lib/seo/geo';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { brand, domain } = await req.json();
  const result = await analyzeGeoVisibility(brand, domain);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await analyzeGeoVisibility();
  return NextResponse.json(result);
}
