import { NextRequest, NextResponse } from 'next/server';
import { verifySmtpConnection } from '@/services/mail.service';
import { verifyAuth } from '@/lib/auth';

/**
 * POST /api/settings/smtp/test
 * Tests the SMTP connection using the provided configuration parameters without saving them.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { host, port, username, password } = body;

    if (!host || !port || !username || !password) {
      return NextResponse.json(
        { error: 'All fields (host, port, username, password) are required to test connection.' },
        { status: 400 }
      );
    }

    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber <= 0) {
      return NextResponse.json(
        { error: 'Port must be a valid positive number.' },
        { status: 400 }
      );
    }

    // Call mail service to verify settings
    await verifySmtpConnection(
      String(host).trim(),
      portNumber,
      String(username).trim(),
      String(password).trim()
    );

    return NextResponse.json({ success: true, message: 'SMTP connection test succeeded!' });
  } catch (error: any) {
    console.error('SMTP Connection test failed:', error);
    return NextResponse.json(
      {
        error: error.message || 'SMTP connection test failed. Please verify your configuration.',
        details: error.code || error.command || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
