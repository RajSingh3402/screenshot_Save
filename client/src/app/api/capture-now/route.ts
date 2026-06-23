import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getCaptureProgressState, runCaptureSession } from '@/lib/services/screenshotService';

/**
 * POST /api/capture-now
 * Initiates the automated screenshot and metrics check session asynchronously.
 * Requires Editor or Admin role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const progress = await getCaptureProgressState();
    if (progress.active) {
      return NextResponse.json({ error: 'A capture session is already in progress' }, { status: 409 });
    }

    // Launch check pipeline asynchronously
    runCaptureSession('Manual Trigger').catch((err) => {
      console.error('Async manual capture session failed:', err);
    });

    return NextResponse.json({ message: 'Capture session started' }, { status: 202 });
  } catch (err) {
    console.error('Error in POST /api/capture-now:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
