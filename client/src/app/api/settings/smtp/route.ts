import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/settings/smtp
 * Fetches the latest SMTP configuration.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const config = await prisma.smtpConfig.findFirst({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(config || null);
  } catch (error: any) {
    console.error('Error fetching SMTP config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch SMTP configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/smtp
 * Creates a new SMTP configuration.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { host, port, username, password, globalCcEmail } = body;

    if (!host || !port || !username || !password) {
      return NextResponse.json(
        { error: 'All fields (host, port, username, password) are required.' },
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

    const config = await prisma.smtpConfig.create({
      data: {
        host: String(host).trim(),
        port: portNumber,
        username: String(username).trim(),
        password: String(password).trim(),
        globalCcEmail: globalCcEmail ? String(globalCcEmail).trim() : null,
      },
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    console.error('Error creating SMTP config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save SMTP configuration' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/smtp
 * Updates the existing SMTP configuration, or creates one if it doesn't exist.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { host, port, username, password, globalCcEmail } = body;

    if (!host || !port || !username || !password) {
      return NextResponse.json(
        { error: 'All fields (host, port, username, password) are required.' },
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

    const existing = await prisma.smtpConfig.findFirst({
      orderBy: { id: 'desc' },
    });

    let config;
    if (existing) {
      config = await prisma.smtpConfig.update({
        where: { id: existing.id },
        data: {
          host: String(host).trim(),
          port: portNumber,
          username: String(username).trim(),
          password: String(password).trim(),
          globalCcEmail: globalCcEmail ? String(globalCcEmail).trim() : null,
        },
      });
    } else {
      config = await prisma.smtpConfig.create({
        data: {
          host: String(host).trim(),
          port: portNumber,
          username: String(username).trim(),
          password: String(password).trim(),
          globalCcEmail: globalCcEmail ? String(globalCcEmail).trim() : null,
        },
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error updating SMTP config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update SMTP configuration' },
      { status: 500 }
    );
  }
}
