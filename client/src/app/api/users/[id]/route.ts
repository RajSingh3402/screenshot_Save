import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * PUT /api/users/[id]
 * Updates user settings (name, email, role, status). Requires Admin role.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = BigInt(resolvedParams.id);
    const body = await request.json();
    const { name, email, role, status } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (role !== undefined) updates.role = String(role).trim();
    if (status !== undefined) updates.status = String(status).trim();

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }

      const duplicate = await prisma.user.findUnique({
        where: { email: trimmedEmail },
      });

      if (duplicate && duplicate.id !== userId) {
        return NextResponse.json({ error: 'Email address is already in use.' }, { status: 409 });
      }
      updates.email = trimmedEmail;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(sanitize(userWithoutPassword));
  } catch (err) {
    console.error('Error in PUT /api/users/:id:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/users/[id]
 * Removes a user record. Requires Admin role. Prevents self-deletion.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const adminUser = await verifyAuth(request, ['Admin']);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = BigInt(resolvedParams.id);

    // Prevent deleting oneself
    if (adminUser.id.toString() === userId.toString()) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User removed successfully.' });
  } catch (err) {
    console.error('Error in DELETE /api/users/:id:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
