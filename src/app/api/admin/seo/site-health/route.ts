import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { checkSiteHealth } from '@/lib/seo/site-health';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const domain = req.nextUrl.searchParams.get('domain') || 'eurowindow.com.vn';
  const result = await checkSiteHealth(domain);
  return NextResponse.json(result);
}
