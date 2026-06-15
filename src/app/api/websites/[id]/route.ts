import { NextResponse } from 'next/server';
import { deleteWebsite, getWebsiteById, updateWebsite } from '@/lib/repos';
import { normalizeUrl } from '@/lib/url';
import { websiteUpdateSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await getWebsiteById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const parsed = websiteUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    const normalized = normalizeUrl(parsed.data.url);
    const fields = { ...parsed.data, ...(normalized ? { url: normalized } : {}) };

    return NextResponse.json(await updateWebsite(id, fields));
  } catch (err) {
    console.error('PUT /api/websites/[id]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await deleteWebsite(id);
    return NextResponse.json({ message: 'Website deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/websites/[id]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
