/**
 * Next.js Instrumentation Hook
 * This file runs once when the Next.js server starts up.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Disabled here to avoid duplicate cron jobs in dev/production.
      // The scheduler runs on the backend Express server instead.
      // const { initScheduler } = await import('./services/scheduler.service');
      // initScheduler();
      console.log('Next.js Background Scan Scheduler bypassed (running on Express backend).');
    } catch (err) {
      console.error('Failed to check instrumentation hook:', err);
    }
  }
}
