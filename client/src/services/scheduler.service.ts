import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';

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
    where: { enabled: true }
  });

  const matchingSchedule = enabledSchedules.find(s => s.time === currentTimeStr);
  if (!matchingSchedule) {
    return; // No schedule matches the current minute
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
        gte: startOfMinute
      }
    }
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
      executedAt: new Date()
    }
  });

  try {
    // 4. Trigger website scan on the Express backend server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const JWT_SECRET = process.env.JWT_SECRET || 'sitewatch_secret_key_123456_default';
    console.log(`[Scheduler] Contacting Express backend to launch scan: ${backendUrl}/api/capture-now`);
    
    const triggerRes = await fetch(`${backendUrl}/api/capture-now`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    if (!triggerRes.ok) {
      throw new Error(`Express capture API returned error status: ${triggerRes.status}`);
    }

    // 5. Poll the Express backend until the scan session is completed
    console.log('[Scheduler] Website scan started. Polling progress...');
    let isScanning = true;
    const pollStart = Date.now();
    
    while (isScanning) {
      // Wait 3 seconds between polls
      await new Promise(r => setTimeout(r, 3000));

      // Limit polling to 6 minutes to avoid infinite loops
      if (Date.now() - pollStart > 360000) {
        throw new Error('Website scan execution timed out on the backend after 6 minutes.');
      }

      const progRes = await fetch(`${backendUrl}/api/capture-progress`, {
        headers: {
          'Authorization': `Bearer ${JWT_SECRET}`
        }
      });
      if (progRes.ok) {
        const progData = await progRes.json();
        isScanning = progData.active;
      } else {
        console.warn('[Scheduler] Progress poll failed, retrying...');
      }
    }

    console.log('[Scheduler] Website scan completed. Loading generated report...');

    // 6. Fetch the newly created report from database
    const latestReport = await prisma.report.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!latestReport) {
      throw new Error('No reports found in the database after scan completion.');
    }

    // Double check that the report is recent
    const reportTimeId = Number(latestReport.id);
    if (Date.now() - reportTimeId > 300000) { // Should be generated within last 5 minutes
      throw new Error('The latest report found in database is stale. PDF generation failed on backend.');
    }

    const pdfFilename = latestReport.file;
    const pdfUrl = `${backendUrl}/reports/${pdfFilename}`;

    console.log(`[Scheduler] Fetching generated PDF report from: ${pdfUrl}`);

    // 7. Download generated PDF report
    const pdfFetchRes = await fetch(pdfUrl);
    if (!pdfFetchRes.ok) {
      throw new Error(`Failed to download report PDF from URL: ${pdfUrl}`);
    }
    const pdfBuffer = Buffer.from(await pdfFetchRes.arrayBuffer());

    // 8. Load SMTP Config
    const smtp = await prisma.smtpConfig.findFirst({
      orderBy: { id: 'desc' }
    });
    if (!smtp) {
      throw new Error('Missing SMTP credentials in database. Please configure SMTP Settings.');
    }

    // 9. Load Email Recipients
    const recipients = await prisma.emailRecipient.findMany();
    if (recipients.length === 0) {
      throw new Error('No email recipients configured in database.');
    }

    const recipientEmails = recipients.map(r => r.email).join(', ');
    console.log(`[Scheduler] Sending report email to recipients: ${recipientEmails}`);

    // 10. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    // Verify SMTP connection
    await transporter.verify();

    // 11. Send Email Notification
    const mailOptions = {
      from: `"SiteWatch Portal" <${smtp.username}>`,
      to: recipientEmails,
      subject: 'SiteWatch Metrics Report',
      text: `Hello,\n\nPlease find attached the automated SiteWatch Metrics Report.\n\nSummary:\n- Total Websites Checked: ${latestReport.total}\n- Online / Success: ${latestReport.success}\n- Offline / Failed: ${latestReport.failed}\n\nRegards,\nSiteWatch Portal`,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('[Scheduler] Email sent successfully!');

    // 12. Update ScanExecutionLog as success
    await prisma.scanExecutionLog.update({
      where: { id: logEntry.id },
      data: {
        status: 'success',
        message: `Scan finished. PDF report successfully emailed to ${recipients.length} recipients. Checked: ${latestReport.total}, Success: ${latestReport.success}, Failed: ${latestReport.failed}.`
      }
    });

  } catch (err: any) {
    console.error(`[Scheduler] Execution error for schedule ${scheduleTime}:`, err);
    
    // Update ScanExecutionLog as failed with error details
    await prisma.scanExecutionLog.update({
      where: { id: logEntry.id },
      data: {
        status: 'failed',
        message: `Execution failed: ${err.message || err}`
      }
    });
  }
}
