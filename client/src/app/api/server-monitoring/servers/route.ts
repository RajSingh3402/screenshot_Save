import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { testSshConnection } from '@/app/server-monitoring/scanner';

/**
 * GET /api/server-monitoring/servers
 * Lists all external monitored servers.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Viewer', 'Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sanitize(servers));
  } catch (err) {
    console.error('Error in GET /api/server-monitoring/servers:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/server-monitoring/servers
 * Adds a new server. Tests SSH connection before saving.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, host, username, privateKeyPath, passphrase } = body;
    const port = parseInt(body.port, 10) || 22;

    if (!name || !host || !username || !privateKeyPath) {
      return NextResponse.json({ error: 'Missing required fields (Name, Host, Username, Key Path).' }, { status: 400 });
    }

    // Test SSH connection before saving
    const testResult = await testSshConnection({ host, port, username, privateKeyPath, passphrase });
    if (!testResult.success) {
      return NextResponse.json({ error: `SSH Connection failed: ${testResult.error}` }, { status: 400 });
    }

    const server = await prisma.server.create({
      data: {
        name,
        host,
        port,
        username,
        privateKeyPath,
        passphrase: passphrase || null,
        status: 'Healthy', // Started healthy since connection test succeeded!
        lastChecked: new Date(),
      } as any
    });

    return NextResponse.json(sanitize(server), { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/server-monitoring/servers:', err);
    return NextResponse.json({ error: err.message || String(err), stack: err.stack }, { status: 500 });
  }
}

/**
 * PUT /api/server-monitoring/servers
 * Edits an existing server. Tests SSH connection before updating.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, host, username, privateKeyPath, passphrase } = body;
    const port = parseInt(body.port, 10) || 22;

    if (!id || !name || !host || !username || !privateKeyPath) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Test SSH connection before saving changes
    const testResult = await testSshConnection({ host, port, username, privateKeyPath, passphrase });
    if (!testResult.success) {
      return NextResponse.json({ error: `SSH Connection failed: ${testResult.error}` }, { status: 400 });
    }

    const updated = await prisma.server.update({
      where: { id: BigInt(id) },
      data: {
        name,
        host,
        port,
        username,
        privateKeyPath,
        passphrase: passphrase || null,
        status: 'Healthy', // Reset to healthy on successful config save
        lastChecked: new Date(),
      } as any
    });

    return NextResponse.json(sanitize(updated));
  } catch (err: any) {
    console.error('Error in PUT /api/server-monitoring/servers:', err);
    return NextResponse.json({ error: err.message || String(err), stack: err.stack }, { status: 500 });
  }
}

/**
 * DELETE /api/server-monitoring/servers?id=<id>
 * Removes a server by ID.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Server ID is required.' }, { status: 400 });
    }

    await prisma.server.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({ message: 'Server deleted successfully.' });
  } catch (err) {
    console.error('Error in DELETE /api/server-monitoring/servers:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
