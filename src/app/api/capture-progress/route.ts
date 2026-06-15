import { NextResponse } from 'next/server';
import { getCaptureProgress } from '@/lib/capture/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getCaptureProgress());
}
