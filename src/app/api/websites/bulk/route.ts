import { NextResponse } from 'next/server';
import { bulkInsertWebsites, type NewWebsiteInput } from '@/lib/repos';
import { normalizeUrl } from '@/lib/url';
import { bulkWebsitesSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const parsed = bulkWebsitesSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid bulk payload' }, { status: 400 });
    }
    const newSites: NewWebsiteInput[] = parsed.data.map((site, index) => ({
      id: Date.now() + index,
      name: site.name || 'Unnamed Site',
      url: normalizeUrl(site.url),
      status: 'active',
      lastStatus: 'success',
      lastCapture: '-',
      error: null,
      lastCaptureImage: null,
    }));
    await bulkInsertWebsites(newSites);
    return NextResponse.json(newSites, { status: 201 });
  } catch (err) {
    console.error('POST /api/websites/bulk:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
