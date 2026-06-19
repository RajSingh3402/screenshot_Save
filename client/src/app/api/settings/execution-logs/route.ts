import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/settings/execution-logs
 * Fetches all automated scan execution logs ordered by time descending.
 */
export async function GET() {
  try {
    const logs = await prisma.scanExecutionLog.findMany({
      orderBy: { executedAt: 'desc' },
      take: 50, // Keep it fast, only return the latest 50 logs
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Error fetching execution logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch execution logs' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings/execution-logs
 * Clears all scan execution logs from the database.
 */
export async function DELETE() {
  try {
    await prisma.scanExecutionLog.deleteMany({});
    return NextResponse.json({ success: true, message: 'Execution logs cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing execution logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear execution logs' },
      { status: 500 }
    );
  }
}
