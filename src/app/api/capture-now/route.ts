import { NextResponse } from 'next/server';
import { isCapturing, startCaptureSession } from '@/lib/capture/engine';

export const runtime = 'nodejs';

export async function POST() {
  if (isCapturing()) {
    return NextResponse.json({ error: 'A capture session is already in progress' }, { status: 409 });
  }
  startCaptureSession('Manual Trigger');
  return NextResponse.json({ message: 'Capture session started' }, { status: 202 });
}
