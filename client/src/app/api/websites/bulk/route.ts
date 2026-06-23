import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * POST /api/websites/bulk
 * Batch creates multiple website records. Requires Editor or Admin role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const incoming = Array.isArray(body) ? body : [];

    if (incoming.length === 0) {
      return NextResponse.json({ error: 'No website entries provided' }, { status: 400 });
    }

    const newSites = incoming.map((site: any, index: number) => {
      let targetUrl = site.url ? String(site.url).trim() : '';
      if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      return {
        id: BigInt(Date.now() + index),
        name: site.name || 'Unnamed Site',
        url: targetUrl,
        status: 'active',
        lastStatus: 'success',
        lastCapture: '-',
        error: null,
        lastCaptureImage: null,
      };
    });

    await prisma.website.createMany({
      data: newSites,
    });

    return NextResponse.json(sanitize(newSites), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/websites/bulk:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
