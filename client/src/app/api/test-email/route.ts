import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testServer = await (prisma.server as any).create({
      data: {
        name: 'Test Server',
        host: 'localhost',
        port: 22,
        username: 'test',
        privateKeyPath: 'C:/keys/test.pem',
        passphrase: 'test_passphrase',
        status: 'Healthy',
      }
    });
    // Delete the test server afterwards to keep it clean
    await (prisma.server as any).delete({
      where: { id: testServer.id }
    });
    return NextResponse.json({ success: true, message: 'Test insert and delete succeeded!', testServer: JSON.stringify(testServer, (k, v) => typeof v === 'bigint' ? v.toString() : v) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err), stack: err.stack });
  }
}


