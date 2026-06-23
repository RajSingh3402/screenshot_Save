import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required. Please log in.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Auth Me API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
