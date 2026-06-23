import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { reportsDir } from '@/lib/services/screenshotService';

/**
 * GET /api/reports/[id]/pdf
 * Streams/downloads the physical PDF file associated with a report ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const reportId = BigInt(resolvedParams.id);

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const filePath = path.join(reportsDir, report.file);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Report file not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.file}"`,
      },
    });
  } catch (err) {
    console.error('Error in GET /api/reports/:id/pdf:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
