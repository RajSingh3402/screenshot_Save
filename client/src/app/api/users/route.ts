import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitize } from '@/lib/prisma';
import { verifyAuth, hashPassword } from '@/lib/auth';

/**
 * GET /api/users
 * Fetches all registered users, omitting password hashes. Requires Admin role.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
    });

    const sanitizedUsers = users.map((u) => {
      const { password, ...userWithoutPassword } = u;
      return sanitize(userWithoutPassword);
    });

    return NextResponse.json(sanitizedUsers);
  } catch (err) {
    console.error('Error in GET /api/users:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/users
 * Creates a new user with optional manual or generated password. Requires Admin role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role, password, status } = body;

    // Validate inputs
    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, Email, and Role are required.' }, { status: 400 });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Check for duplicates
    const duplicate = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'Email address is already registered.' }, { status: 409 });
    }

    // Generate or encrypt password
    const plainPassword = password || Math.random().toString(36).slice(-10);
    const hashedPassword = await hashPassword(plainPassword);

    const newUser = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: trimmedEmail,
        password: hashedPassword,
        role: String(role).trim(),
        status: status || 'Active',
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        user: sanitize(userWithoutPassword),
        plainPassword, // Returned once so admin can share it with the user
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in POST /api/users:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
