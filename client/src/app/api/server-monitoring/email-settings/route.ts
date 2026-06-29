import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/server-monitoring/email-settings
 * Lists all email recipients registered for warning notifications.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Viewer', 'Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const recipients = await prisma.emailRecipient.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sanitize(recipients));
  } catch (err) {
    console.error('Error in GET /api/server-monitoring/email-settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/server-monitoring/email-settings
 * Adds a new email recipient.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email field is required.' }, { status: 400 });
    }

    // Verify it is not a duplicate
    const existing = await prisma.emailRecipient.findUnique({
      where: { email }
    });
    if (existing) {
      return NextResponse.json({ error: 'Email recipient already exists.' }, { status: 400 });
    }

    const recipient = await prisma.emailRecipient.create({
      data: { email }
    });

    return NextResponse.json(sanitize(recipient), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/server-monitoring/email-settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/server-monitoring/email-settings?id=<id>
 * Deletes an email recipient.
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
      return NextResponse.json({ error: 'Recipient ID is required.' }, { status: 400 });
    }

    await prisma.emailRecipient.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ message: 'Recipient successfully deleted.' });
  } catch (err) {
    console.error('Error in DELETE /api/server-monitoring/email-settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
