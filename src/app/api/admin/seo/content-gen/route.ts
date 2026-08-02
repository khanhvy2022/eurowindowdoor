import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateContent } from '@/lib/seo/content-generator';
import type { ContentGeneratorInput } from '@/lib/seo/types';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const input = await req.json() as ContentGeneratorInput;
  if (!input.topic || !input.type) {
    return NextResponse.json({ error: 'topic and type required' }, { status: 400 });
  }
  const result = await generateContent(input);
  return NextResponse.json(result);
}
