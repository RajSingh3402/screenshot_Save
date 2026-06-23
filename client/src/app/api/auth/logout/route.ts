import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete('token');
    return response;
  } catch (err) {
    console.error('Logout API error:', err);
    return NextResponse.json({ error: 'Internal server error during logout.' }, { status: 500 });
  }
}
