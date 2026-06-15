/**
 * Next.js startup hook. Runs once when the server process boots.
 * Initializes the DB connection and starts the background capture scheduler.
 * Guarded to the Node.js runtime so it never runs on the edge runtime.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { initDb } = await import('./lib/prisma');
  const { startScheduler } = await import('./lib/scheduler');

  await initDb();
  startScheduler();
}
