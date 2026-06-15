import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getReportById } from '@/lib/repos';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const report = await getReportById(id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', 'reports', report.file);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Report file not found on disk' }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.file}"`,
      },
    });
  } catch (err) {
    console.error('GET /api/reports/[id]/pdf:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
