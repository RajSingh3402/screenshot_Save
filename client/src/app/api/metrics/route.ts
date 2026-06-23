import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getMetrics, deleteAllMetrics } from '@/lib/services/metricsService';

/**
 * GET /api/metrics
 * Fetches all metrics.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const metrics = await getMetrics();
    return NextResponse.json(metrics);
  } catch (err) {
    console.error('Error in GET /api/metrics:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/metrics
 * Clears all historical metrics logs. Requires Editor or Admin role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    await deleteAllMetrics();

    return NextResponse.json({ message: 'All metrics deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/metrics:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
