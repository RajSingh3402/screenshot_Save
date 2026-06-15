import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/repos';
import { settingsUpdateSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (err) {
    console.error('GET /api/settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const parsed = settingsUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid settings' }, { status: 400 });
    }
    return NextResponse.json(await updateSettings(parsed.data));
  } catch (err) {
    console.error('PUT /api/settings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
