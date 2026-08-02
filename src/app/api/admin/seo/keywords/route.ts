import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { researchKeywords } from '@/lib/seo/keyword';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { seed, domain } = await req.json();
  if (!seed) return NextResponse.json({ error: 'seed required' }, { status: 400 });
  const result = await researchKeywords(seed, domain);
  return NextResponse.json(result);
}
