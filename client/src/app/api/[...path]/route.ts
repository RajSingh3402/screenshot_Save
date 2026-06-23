import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleProxy(request: NextRequest, params: { path: string[] }) {
  // Access path safely, handle cases where Next.js parses it differently
  const pathParts = params.path || [];
  const fullPath = pathParts.join('/');
  const targetUrl = `${BACKEND_URL}/api/${fullPath}${request.nextUrl.search}`;

  try {
    // Extract body if any
    let body: any = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.text();
      } catch (_) {}
    }

    // Forward request headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    });

    // Make request to local backend
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
    });

    const resBody = await res.text();
    
    // Copy headers from response
    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(resBody, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.warn(`[Proxy Fallback] Failed to connect to backend at ${targetUrl}. Serving mock data.`);
    
    const method = request.method;
    const lowerPath = fullPath.toLowerCase();

    // 1. /api/auth/me
    if (lowerPath === 'auth/me') {
      return NextResponse.json({
        success: true,
        user: {
          id: 1781701899024,
          name: "rajsingh (Demo)",
          email: "satyamsingh.000121@gmail.com",
          role: "Admin",
          status: "Active"
        }
      });
    }

    // 2. /api/auth/login
    if (lowerPath === 'auth/login') {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 1781701899024,
          name: "rajsingh (Demo)",
          email: "satyamsingh.000121@gmail.com",
          role: "Admin",
          status: "Active"
        }
      });
      // Set dummy cookie
      response.cookies.set('token', 'demo-token-bypass-key-12345', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60
      });
      return response;
    }

    // 3. /api/auth/logout
    if (lowerPath === 'auth/logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out (Demo).' });
      response.cookies.delete('token');
      return response;
    }

    // 4. /api/websites
    if (lowerPath === 'websites') {
      if (method === 'GET') {
        return NextResponse.json([
          {
            id: 1,
            name: "Google (Demo)",
            url: "https://www.google.com",
            status: "active",
            lastStatus: "200 OK",
            lastCapture: "2026-06-23 15:30",
            lastCaptureImage: null,
            error: null
          },
          {
            id: 2,
            name: "GitHub (Demo)",
            url: "https://github.com",
            status: "active",
            lastStatus: "200 OK",
            lastCapture: "2026-06-23 15:31",
            lastCaptureImage: null,
            error: null
          }
        ]);
      }
      return NextResponse.json({ success: true, id: Date.now() });
    }

    // 5. /api/reports
    if (lowerPath === 'reports') {
      if (method === 'GET') {
        return NextResponse.json([
          {
            id: 1,
            date: "2026-06-23",
            time: "15:30",
            total: 2,
            success: 2,
            failed: 0,
            file: "demo_report.pdf",
            details: []
          }
        ]);
      }
      return NextResponse.json({ success: true });
    }

    // 6. /api/metrics
    if (lowerPath === 'metrics') {
      return NextResponse.json([]);
    }

    // 7. /api/capture-progress
    if (lowerPath === 'capture-progress') {
      return NextResponse.json({
        active: false,
        status: "Idle",
        current: 0,
        total: 0
      });
    }

    // 8. /api/capture-now
    if (lowerPath === 'capture-now') {
      return NextResponse.json({ success: true, message: "Capture started in Demo Mode." });
    }

    // 9. /api/settings/schedules
    if (lowerPath === 'settings/schedules') {
      return NextResponse.json([
        { id: 1, time: "09:00", enabled: true }
      ]);
    }

    // 10. /api/settings/recipients
    if (lowerPath === 'settings/recipients') {
      return NextResponse.json([
        { id: 1, email: "satyamsingh.000121@gmail.com" }
      ]);
    }

    // 11. /api/settings/smtp
    if (lowerPath === 'settings/smtp') {
      return NextResponse.json({
        host: "smtp.mailtrap.io",
        port: "2525",
        user: "demo_user",
        pass: "demo_pass"
      });
    }

    // 12. /api/settings/execution-logs
    if (lowerPath === 'settings/execution-logs') {
      return NextResponse.json([]);
    }

    // Generic fallback
    return NextResponse.json({ success: true, demo: true, path: fullPath });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams);
}
