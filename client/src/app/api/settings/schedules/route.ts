import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/settings/schedules
 * Fetches all automated background scan schedules.
 */
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { time: 'asc' },
    });

    // Safely map and serialize BigInt IDs to numbers
    const serialized = schedules.map(s => ({
      id: Number(s.id),
      time: s.time,
      enabled: s.enabled,
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/schedules
 * Adds a new automated scan schedule time.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time } = body;

    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { error: 'Valid time (HH:MM) is required.' },
        { status: 400 }
      );
    }

    // Check if duplicate exists
    const duplicate = await prisma.schedule.findFirst({
      where: { time },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: 'This schedule time already exists.' },
        { status: 409 }
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        id: BigInt(Date.now()),
        time,
        enabled: true,
      },
    });

    return NextResponse.json({
      id: Number(schedule.id),
      time: schedule.time,
      enabled: schedule.enabled,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
