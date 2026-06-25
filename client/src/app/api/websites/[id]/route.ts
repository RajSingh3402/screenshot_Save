import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * PUT /api/websites/[id]
 * Updates website details. Requires Editor or Admin role.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const siteId = BigInt(resolvedParams.id);
    const body = await request.json();

    const existingSite = await prisma.website.findUnique({
      where: { id: siteId },
    });

    if (!existingSite) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    let targetUrl = body.url ? String(body.url).trim() : '';
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const allowedFields = [
      'name',
      'url',
      'status',
      'lastStatus',
      'lastCapture',
      'error',
      'lastCaptureImage',
      'alertEmail',
      'emailStatus',
      'lastAlertSentAt',
      'domainEmailStatus',
      'lastDomainAlertSentAt',
    ];
    const dataToUpdate: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        dataToUpdate[key] = body[key];
      }
    }

    if (dataToUpdate.lastAlertSentAt !== undefined && dataToUpdate.lastAlertSentAt !== null) {
      dataToUpdate.lastAlertSentAt = new Date(dataToUpdate.lastAlertSentAt);
    }

    if (dataToUpdate.lastDomainAlertSentAt !== undefined && dataToUpdate.lastDomainAlertSentAt !== null) {
      dataToUpdate.lastDomainAlertSentAt = new Date(dataToUpdate.lastDomainAlertSentAt);
    }

    if (targetUrl) {
      dataToUpdate.url = targetUrl;
    }

    const updated = await prisma.website.update({
      where: { id: siteId },
      data: dataToUpdate,
    });

    return NextResponse.json(sanitize(updated));
  } catch (err) {
    console.error('Error in PUT /api/websites/:id:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/websites/[id]
 * Deletes a website record. Requires Editor or Admin role.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const siteId = BigInt(resolvedParams.id);

    const existingSite = await prisma.website.findUnique({
      where: { id: siteId },
    });

    if (!existingSite) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    await prisma.website.delete({
      where: { id: siteId },
    });

    return NextResponse.json({ message: 'Website deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/websites/:id:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
