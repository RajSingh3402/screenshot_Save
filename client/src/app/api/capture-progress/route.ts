import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getCaptureProgressState } from '@/lib/services/screenshotService';

/**
 * GET /api/capture-progress
 * Returns the current screenshot capture and validation pipeline status.
 * Requires authenticated session.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const progress = await getCaptureProgressState();
    return NextResponse.json(progress);
  } catch (err) {
    console.error('Error in GET /api/capture-progress:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
