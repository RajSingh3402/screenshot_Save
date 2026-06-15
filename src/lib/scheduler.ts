import cron from 'node-cron';
import { getSettings } from './repos';
import { isCapturing, startCaptureSession } from './capture/engine';

const globalForScheduler = globalThis as unknown as { schedulerStarted?: boolean };

/**
 * Start the background scheduler. Every minute it checks whether any enabled
 * schedule matches the current HH:MM and, if so, triggers a capture (unless one
 * is already running). Guarded so it only attaches once per process.
 */
export function startScheduler(): void {
  if (globalForScheduler.schedulerStarted) return;
  globalForScheduler.schedulerStarted = true;

  cron.schedule('* * * * *', async () => {
    try {
      const settings = await getSettings();
      if (!settings?.schedules?.length) return;

      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const match = settings.schedules.find((s) => s.enabled && s.time === currentTimeStr);
      if (match && !isCapturing()) {
        console.log(`[scheduler] Schedule ${currentTimeStr} matched. Launching capture.`);
        startCaptureSession(`Scheduled Check (${currentTimeStr})`);
      }
    } catch (err) {
      console.error('[scheduler] Error:', err);
    }
  });

  console.log('[scheduler] Background scheduler started.');
}
