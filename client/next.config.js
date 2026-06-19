/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/websites/:path*',
        destination: `${backendUrl}/api/websites/:path*`,
      },
      {
        source: '/api/reports/:path*',
        destination: `${backendUrl}/api/reports/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${backendUrl}/api/users/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: '/api/excel/:path*',
        destination: `${backendUrl}/api/excel/:path*`,
      },
      {
        source: '/api/metrics/:path*',
        destination: `${backendUrl}/api/metrics/:path*`,
      },
      {
        source: '/api/capture-progress',
        destination: `${backendUrl}/api/capture-progress`,
      },
      {
        source: '/api/capture-now',
        destination: `${backendUrl}/api/capture-now`,
      },
      {
        source: '/screenshots/:path*',
        destination: `${backendUrl}/screenshots/:path*`,
      },
      {
        source: '/reports/:path*',
        destination: `${backendUrl}/reports/:path*`,
      },
    ];
  },
};

export default nextConfig;
