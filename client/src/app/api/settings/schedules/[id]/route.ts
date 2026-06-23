import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * PUT /api/settings/schedules/[id]
 * Updates the enabled state of a background scan schedule.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const scheduleId = BigInt(resolvedParams.id);
    const body = await request.json();
    const { enabled } = body;

    if (enabled === undefined) {
      return NextResponse.json(
        { error: 'The enabled property is required.' },
        { status: 400 }
      );
    }

    // Check if exists
    const existing = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Schedule not found.' },
        { status: 404 }
      );
    }

    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        enabled: Boolean(enabled),
      },
    });

    return NextResponse.json({
      id: Number(updated.id),
      time: updated.time,
      enabled: updated.enabled,
    });
  } catch (error: any) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings/schedules/[id]
 * Deletes a scan schedule by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const scheduleId = BigInt(resolvedParams.id);

    // Check if exists
    const existing = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Schedule not found.' },
        { status: 404 }
      );
    }

    await prisma.schedule.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
