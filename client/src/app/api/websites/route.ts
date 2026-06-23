import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/websites
 * Fetches all websites, ordered by ID descending.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const websites = await prisma.website.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(sanitize(websites));
  } catch (err) {
    console.error('Error in GET /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/websites
 * Creates a new website record. Requires role Editor or Admin.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    let targetUrl = body.url ? String(body.url).trim() : '';
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const newSite = {
      id: BigInt(Date.now()),
      name: body.name || 'Unnamed Site',
      url: targetUrl,
      status: 'active',
      lastStatus: 'success',
      lastCapture: '-',
      error: null,
      lastCaptureImage: null,
    };

    const created = await prisma.website.create({
      data: newSite,
    });

    return NextResponse.json(sanitize(created), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/websites
 * Truncates all website records. Requires role Editor or Admin.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    await prisma.website.deleteMany({});

    return NextResponse.json({ message: 'All websites deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/websites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
