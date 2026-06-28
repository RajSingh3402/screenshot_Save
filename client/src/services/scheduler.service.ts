import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { runCaptureSession, getCaptureProgressState } from '../lib/services/screenshotService';

let isExecuting = false; // Prevents overlapping scheduler ticks

/**
 * Initializes the automated cron background scheduler.
 * Runs every minute to check and execute matched scan schedules.
 */
export function initScheduler() {
  console.log('[Scheduler] Initializing Next.js background scan scheduler (polling every minute)...');

  cron.schedule('* * * * *', async () => {
    if (isExecuting) {
      console.log('[Scheduler] Previous tick is still executing. Skipping.');
      return;
    }

    try {
      isExecuting = true;
      await checkAndRunSchedules();
    } catch (err: any) {
      console.error('[Scheduler] Critical error in scheduler tick:', err);
    } finally {
      isExecuting = false;
    }
  });
}

/**
 * Checks all active schedules and runs matched checks.
 */
async function checkAndRunSchedules() {
  const date = new Date();
  const currentHour = date.getHours().toString().padStart(2, '0');
  const currentMinute = date.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHour}:${currentMinute}`;

  // 1. Fetch enabled schedules
  const enabledSchedules = await prisma.schedule.findMany({
    where: { enabled: true },
  });

  const matchingSchedule = enabledSchedules.find((s) => s.time === currentTimeStr);
  if (!matchingSchedule) {
    return; // No schedule matches the current minute
  }

  // Attempt to get the database lock
  const lockResult = await prisma.$queryRawUnsafe<any[]>(
    `SELECT GET_LOCK('sitewatch_scheduler_lock', 0) as locked`
  );
  const isLocked = lockResult && 
                   lockResult[0] && 
                   (lockResult[0].locked === 1 || 
                    lockResult[0].locked === '1' || 
                    lockResult[0].locked === true || 
                    String(lockResult[0].locked) === '1');

  if (!isLocked) {
    console.log('[Scheduler] Another scheduler instance is already running or has the lock. Skipping scheduled run.');
    return;
  }

  try {
    const progress = await getCaptureProgressState();
    if (progress.active) {
      console.log('[Scheduler] A capture session is already active. Skipping scheduled scan.');
      return;
    }

    const scheduleTime = matchingSchedule.time;
    console.log(`[Scheduler] Matched scan schedule for ${scheduleTime}. Executing checks...`);

    // 2. Prevent duplicate execution within the same minute
    const startOfMinute = new Date();
    startOfMinute.setSeconds(0, 0);

    const duplicateLog = await prisma.scanExecutionLog.findFirst({
      where: {
        scheduleTime,
        executedAt: {
          gte: startOfMinute,
        },
      },
    });

    if (duplicateLog) {
      console.log(`[Scheduler] Schedule for ${scheduleTime} already executed in this minute. Skipping.`);
      return;
    }

    // 3. Create ScanExecutionLog in progress
    const logEntry = await prisma.scanExecutionLog.create({
      data: {
        scheduleTime,
        status: 'in_progress',
        message: 'Automatic background scan initiated by cron scheduler.',
        executedAt: new Date(),
      },
    });

    try {
      // 4. Trigger website scan locally
      await runCaptureSession(`Scheduled Check (${currentTimeStr})`);

      // 5. Fetch latest report info to log stats
      const latestReport = await prisma.report.findFirst({
        orderBy: { id: 'desc' },
      });

      let reportMsg = '';
      if (latestReport) {
        // Verify that the report is recent (within last 5 minutes)
        const reportTimeId = Number(latestReport.id);
        if (Date.now() - reportTimeId < 300000) {
          reportMsg = ` Checked: ${latestReport.total}, Success: ${latestReport.success}, Failed: ${latestReport.failed}.`;
        }
      }

      // 6. Update ScanExecutionLog as success
      await prisma.scanExecutionLog.update({
        where: { id: logEntry.id },
        data: {
          status: 'success',
          message: `Scan finished successfully.${reportMsg}`,
        },
      });
    } catch (err: any) {
      console.error(`[Scheduler] Execution error for schedule ${scheduleTime}:`, err);

      // Update ScanExecutionLog as failed with error details
      await prisma.scanExecutionLog.update({
        where: { id: logEntry.id },
        data: {
          status: 'failed',
          message: `Execution failed: ${err.message || err}`,
        },
      });
    }
  } finally {
    // Release database lock
    await prisma.$queryRawUnsafe(`SELECT RELEASE_LOCK('sitewatch_scheduler_lock')`);
  }
}
