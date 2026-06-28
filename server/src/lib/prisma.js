import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { loadEnv } from '../config/env.js';

// Ensure env variables are loaded before configuring the adapter
loadEnv();

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306');
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = process.env.MYSQL_DATABASE || 'sitewatch';

console.log(`Instantiating MariaDB adapter: ${user}@${host}:${port}/${database}`);

const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 10
});

export const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

// Helper to sanitize Prisma outputs by recursively converting BigInt values to JS Numbers
// to prevent JSON serialization errors (TypeError: Do not know how to serialize a BigInt)
export function sanitize(val) {
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
    const res = {};
    for (const key of Object.keys(val)) {
      res[key] = sanitize(val[key]);
    }
    return res;
  }
  return val;
}
