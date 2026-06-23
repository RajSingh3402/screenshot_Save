import { PrismaClient } from '../generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured.');
}

// Parse the MySQL connection string into individual connection options
let host = '127.0.0.1';
let port = 3306;
let user = 'root';
let password = '';
let database = 'sitewatch';

try {
  const url = new URL(databaseUrl);
  host = url.hostname;
  port = parseInt(url.port || '3306', 10);
  user = url.username;
  password = decodeURIComponent(url.password);
  database = url.pathname.substring(1); // Remove leading '/'
} catch (err) {
  console.error('Failed to parse DATABASE_URL, falling back to defaults:', err);
}

const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 10
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper to sanitize Prisma outputs by recursively converting BigInt values to JS Numbers
// to prevent JSON serialization errors (TypeError: Do not know how to serialize a BigInt)
export function sanitize(val: any): any {
  if (val === null || val === undefined) return val;
  if (val instanceof Date) {
    return val;
  }
  if (typeof val === 'bigint') {
    return Number(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitize);
  }
  if (typeof val === 'object') {
    const res: any = {};
    for (const key of Object.keys(val)) {
      res[key] = sanitize(val[key]);
    }
    return res;
  }
  return val;
}

