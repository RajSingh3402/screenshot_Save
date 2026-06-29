import cron from 'node-cron';
import { runServerScan } from './scanner';

let isScanning = false;

/**
 * Starts the 5-minute interval background cron job for server disk checks.
 */
export function initServerMonitoringCron() {
  console.log('[Scheduler] Initializing Server Monitoring background scheduler (running every 5 minutes)...');
  
  cron.schedule('*/5 * * * *', async () => {
    if (isScanning) {
      console.log('[Scheduler] Server monitoring scan is already in progress. Skipping tick.');
      return;
    }
    
    try {
      isScanning = true;
      await runServerScan();
    } catch (err) {
      console.error('[Scheduler] Error running server monitoring scan:', err);
    } finally {
      isScanning = false;
    }
  });
}
