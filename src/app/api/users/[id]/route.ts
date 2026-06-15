import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/repos';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await deleteUser(id);
    return NextResponse.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('DELETE /api/users/[id]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
