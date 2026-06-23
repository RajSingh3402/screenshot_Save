/**
 * Next.js Instrumentation Hook
 * This file runs once when the Next.js server starts up.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const globalForScheduler = global as unknown as { schedulerInitialized?: boolean };
      if (!globalForScheduler.schedulerInitialized) {
        globalForScheduler.schedulerInitialized = true;
        const { initScheduler } = await import('./services/scheduler.service');
        initScheduler();
        console.log('Next.js Background Scan Scheduler successfully initialized.');
      } else {
        console.log('Next.js Background Scan Scheduler already initialized.');
      }
    } catch (err) {
      console.error('Failed to check instrumentation hook:', err);
    }
  }
}

