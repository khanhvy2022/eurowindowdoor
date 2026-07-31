import { NextResponse } from 'next/server';
import { getAllProvidersHealth } from '@/lib/ai/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = getAllProvidersHealth();
    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
