import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, hashPassword } from '@/lib/auth';

/**
 * PUT /api/users/[id]/password
 * Resets a user's password. Requires Admin role.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = BigInt(resolvedParams.id);
    const body = await request.json();
    const { password } = body;

    if (!password || String(password).trim().length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const hashedPassword = await hashPassword(String(password));
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'User password updated successfully.' });
  } catch (err) {
    console.error('Error in PUT /api/users/:id/password:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
