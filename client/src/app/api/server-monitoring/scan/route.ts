import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { runServerScan } from '@/app/server-monitoring/scanner';

/**
 * POST /api/server-monitoring/scan
 * Manually triggers a scan of all registered servers and returns when finished.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    await runServerScan();

    return NextResponse.json({ success: true, message: 'Server scan completed successfully.' });
  } catch (err: any) {
    console.error('Error in POST /api/server-monitoring/scan:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
