import { NextResponse } from 'next/server';
import { createUser, getUsers } from '@/lib/repos';
import { userFormSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await getUsers());
  } catch (err) {
    console.error('GET /api/users:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const parsed = userFormSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    const created = await createUser({
      id: Date.now(),
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      status: 'active',
      created: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/users:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
