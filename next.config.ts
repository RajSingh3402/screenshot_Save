import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep heavy native/server-only packages out of the bundler so they run
  // directly from node_modules at runtime (puppeteer ships a Chromium binary,
  // prisma/mariadb use native bindings).
  serverExternalPackages: [
    'puppeteer',
    '@prisma/client',
    '@prisma/adapter-mariadb',
    'mariadb',
    'nodemailer',
    'node-cron',
    'xlsx',
  ],
};

export default nextConfig;
