import { NextResponse } from 'next/server';
import { getReports } from '@/lib/repos';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await getReports());
  } catch (err) {
    console.error('GET /api/reports:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
