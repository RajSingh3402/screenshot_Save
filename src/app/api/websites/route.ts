import { NextResponse } from 'next/server';
import { createWebsite, deleteAllWebsites, getWebsites } from '@/lib/repos';
import { normalizeUrl } from '@/lib/url';
import { websiteFormSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await getWebsites());
  } catch (err) {
    console.error('GET /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const parsed = websiteFormSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    const created = await createWebsite({
      id: Date.now(),
      name: parsed.data.name,
      url: normalizeUrl(parsed.data.url),
      status: 'active',
      lastStatus: 'success',
      lastCapture: '-',
      error: null,
      lastCaptureImage: null,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteAllWebsites();
    return NextResponse.json({ message: 'All websites deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
