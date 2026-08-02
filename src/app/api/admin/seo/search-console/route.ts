import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSearchConsoleData } from '@/lib/seo/search-console';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const days = parseInt(req.nextUrl.searchParams.get('days') || '28');
  const result = await getSearchConsoleData('eurowindow.com.vn', days);
  return NextResponse.json(result);
}
