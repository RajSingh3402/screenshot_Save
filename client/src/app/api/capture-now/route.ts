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

    let force = false;
    try {
      const body = await request.json();
      force = !!body.force;
    } catch (_) {}

    const progress = await getCaptureProgressState();
    if (progress.active && !force) {
      return NextResponse.json({ error: 'A capture session is already in progress' }, { status: 409 });
    }

    if (force) {
      progress.active = false;
      progress.status = 'Force reset by user...';
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

/**
 * DELETE /api/capture-now
 * Force resets the progress state to idle.
 * Requires Editor or Admin role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const progress = await getCaptureProgressState();
    progress.active = false;
    progress.status = 'Idle';
    progress.current = 0;
    progress.total = 0;

    console.log('[Capture Route] Progress active flag forced to FALSE by Admin.');
    return NextResponse.json({ message: 'Capture progress reset successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/capture-now:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
