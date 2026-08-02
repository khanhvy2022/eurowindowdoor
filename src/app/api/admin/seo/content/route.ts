import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { auditContent } from '@/lib/seo/content-audit';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content, url } = await req.json();
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });
  const result = await auditContent(content, url);
  return NextResponse.json(result);
}
