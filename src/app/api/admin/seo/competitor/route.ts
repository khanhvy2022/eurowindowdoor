import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { analyzeCompetitor } from '@/lib/seo/competitor';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { domain } = await req.json();
  if (!domain) return NextResponse.json({ error: 'domain required' }, { status: 400 });
  const result = await analyzeCompetitor(domain);
  return NextResponse.json(result);
}
