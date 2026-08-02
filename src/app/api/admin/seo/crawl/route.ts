import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { crawlPage } from '@/lib/seo/crawl-engine';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });
  const result = await crawlPage(url);
  return NextResponse.json(result);
}
