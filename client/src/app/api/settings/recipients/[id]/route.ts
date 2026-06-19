import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/settings/recipients/[id]
 * Deletes an email recipient by ID.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const recipientId = parseInt(resolvedParams.id, 10);

    if (isNaN(recipientId)) {
      return NextResponse.json(
        { error: 'Invalid recipient ID.' },
        { status: 400 }
      );
    }

    // Check if recipient exists
    const existing = await prisma.emailRecipient.findUnique({
      where: { id: recipientId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Recipient not found.' },
        { status: 404 }
      );
    }

    // Delete recipient from database
    await prisma.emailRecipient.delete({
      where: { id: recipientId },
    });

    return NextResponse.json({ success: true, message: 'Recipient deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting recipient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete recipient' },
      { status: 500 }
    );
  }
}
