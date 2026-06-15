import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

/**
 * Prisma client singleton.
 *
 * Cached on `globalThis` so the client (and its connection pool) is reused
 * across dev hot-reloads and shared by every route handler + the scheduler in
 * the single `next start` Node process. `.env` is loaded automatically by Next.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrisma(): PrismaClient {
  const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'sitewatch',
    connectionLimit: 10,
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/** Verify the database connection on startup. */
export async function initDb(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[db] Prisma connection initialized.');
  } catch (err) {
    console.error('[db] Failed to initialize Prisma connection:', err);
  }
}
