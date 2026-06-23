import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/settings/recipients
 * Fetches all email recipients.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const recipients = await prisma.emailRecipient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(recipients);
  } catch (error: any) {
    console.error('Error fetching recipients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch email recipients' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/recipients
 * Adds a new email recipient.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Check if duplicate exists
    const duplicate = await prisma.emailRecipient.findUnique({
      where: { email: trimmedEmail },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: 'This email address is already added as a recipient.' },
        { status: 409 }
      );
    }

    // Store in MySQL database
    const recipient = await prisma.emailRecipient.create({
      data: {
        email: trimmedEmail,
      },
    });

    return NextResponse.json(recipient, { status: 201 });
  } catch (error: any) {
    console.error('Error creating recipient:', error);
    // Handle Prisma unique constraint error just in case
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email address is already added as a recipient.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to add recipient' },
      { status: 500 }
    );
  }
}
