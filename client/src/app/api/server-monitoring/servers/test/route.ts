import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { testSshConnection } from '@/app/server-monitoring/scanner';

/**
 * POST /api/server-monitoring/servers/test
 * Tests SSH connection credentials on demand without saving database changes.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { host, username, privateKeyPath, passphrase } = body;
    const port = parseInt(body.port, 10) || 22;

    if (!host || !username || !privateKeyPath) {
      return NextResponse.json({ error: 'Missing connection settings (Host, Username, Private Key Path).' }, { status: 400 });
    }

    const result = await testSshConnection({ host, port, username, privateKeyPath, passphrase });
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Connection Successful' });
    } else {
      return NextResponse.json({ success: false, error: result.error, message: result.error });
    }
  } catch (err: any) {
    console.error('Error in POST /api/server-monitoring/servers/test:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
