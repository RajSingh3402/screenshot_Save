import cron from 'node-cron';
import { getSettings } from './db.service.js';
import { runCaptureSession, captureProgress } from './capture.service.js';
import { prisma } from '../lib/prisma.js';

let isExecuting = false; // Prevents overlapping scheduler ticks

export function initScheduler() {
  console.log('[Scheduler] Initializing Express background scan scheduler (polling every minute)...');
  
  cron.schedule('* * * * *', async () => {
    if (isExecuting) {
      console.log('[Scheduler] Previous tick is still executing. Skipping.');
      return;
    }

    try {
      isExecuting = true;
      const settings = await getSettings();
      if (!settings || !settings.schedules) return;

      const date = new Date();
      const currentHour = date.getHours().toString().padStart(2, '0');
      const currentMinute = date.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      const matchingSchedule = settings.schedules.find(
        s => s.enabled && s.time === currentTimeStr
      );

      if (matchingSchedule) {
        // Attempt to get the database lock
        const lockResult = await prisma.$queryRawUnsafe(`SELECT GET_LOCK('sitewatch_scheduler_lock', 0) as locked`);
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
          // Avoid launching double captures inside the same minute by checking if already capturing
          if (!captureProgress.active) {
            console.log(`[Scheduler] Scheduled capture time matches: ${currentTimeStr}. Launching check...`);
            
            // Prevent duplicate execution within the same minute
            const startOfMinute = new Date();
            startOfMinute.setSeconds(0, 0);

            const duplicateLog = await prisma.scanExecutionLog.findFirst({
              where: {
                scheduleTime: currentTimeStr,
                executedAt: {
                  gte: startOfMinute
                }
              }
            });

            if (duplicateLog) {
              console.log(`[Scheduler] Schedule for ${currentTimeStr} already executed in this minute. Skipping.`);
              return;
            }

            // Create ScanExecutionLog in progress
            const logEntry = await prisma.scanExecutionLog.create({
              data: {
                scheduleTime: currentTimeStr,
                status: 'in_progress',
                message: 'Automatic background scan initiated by Express cron scheduler.',
                executedAt: new Date()
              }
            });

            try {
              await runCaptureSession(`Scheduled Check (${currentTimeStr})`);
              
              // Fetch latest report info to log stats
              const latestReport = await prisma.report.findFirst({
                orderBy: { id: 'desc' }
              });
              
              let reportMsg = '';
              if (latestReport) {
                // Verify that the report is recent (within last 5 minutes)
                const reportTimeId = Number(latestReport.id);
                if (Date.now() - reportTimeId < 300000) {
                  reportMsg = ` Checked: ${latestReport.total}, Success: ${latestReport.success}, Failed: ${latestReport.failed}.`;
                }
              }

              await prisma.scanExecutionLog.update({
                where: { id: logEntry.id },
                data: {
                  status: 'success',
                  message: `Scan finished successfully.${reportMsg}`
                }
              });
            } catch (captureErr) {
              console.error('[Scheduler] Capture session failed:', captureErr);
              await prisma.scanExecutionLog.update({
                where: { id: logEntry.id },
                data: {
                  status: 'failed',
                  message: `Execution failed: ${captureErr.message || captureErr}`
                }
              });
            }
          }
        } finally {
          // Release database lock
          await prisma.$queryRawUnsafe(`SELECT RELEASE_LOCK('sitewatch_scheduler_lock')`);
        }
      }
    } catch (err) {
      console.error('[Scheduler] Error in cron background scheduler:', err);
    } finally {
      isExecuting = false;
    }
  });
}

