import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateSchema } from '@/lib/seo/schema-generator';
import type { SchemaType } from '@/lib/seo/types';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { type, data, url } = await req.json();
  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 });
  const result = generateSchema({ type: type as SchemaType, data: data || {}, url });
  return NextResponse.json(result);
}
