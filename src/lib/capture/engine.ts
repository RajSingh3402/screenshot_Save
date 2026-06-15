import fs from 'node:fs';
import path from 'node:path';
import puppeteer, { type Browser } from 'puppeteer';
import { getSettings, getWebsites, createReport, updateWebsite } from '../repos';
import { sendEmailNotification } from '../email';
import type { CaptureProgress, ReportDetail, Website } from '../types';
import { hideLoaders, simulateInteraction, waitForLoadersGone } from './loaders';
import { renderReportPdf } from './pdf';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');
const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports');
const CONCURRENCY = 4;

/**
 * Capture progress is a process-wide singleton shared between the
 * `/api/capture-*` route handlers and the cron scheduler. Cached on globalThis
 * so it is not reset by dev hot-reloads.
 */
const globalForCapture = globalThis as unknown as { captureProgress?: CaptureProgress };

const progress: CaptureProgress =
  globalForCapture.captureProgress ??
  (globalForCapture.captureProgress = { active: false, status: 'Idle', current: 0, total: 0 });

export function getCaptureProgress(): CaptureProgress {
  return progress;
}

export function isCapturing(): boolean {
  return progress.active;
}

function setProgress(patch: Partial<CaptureProgress>): void {
  Object.assign(progress, patch);
}

function ensureDirs(): void {
  for (const dir of [SCREENSHOTS_DIR, REPORTS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Capture a single site: navigate, settle loaders, screenshot, persist state.
 * Returns the report detail row for this site.
 */
async function captureSite(
  browser: Browser,
  site: Website,
  timestamp: number,
  timeStr: string,
): Promise<ReportDetail> {
  const filename = `${site.id}_${timestamp}.png`;
  const screenshotPath = path.join(SCREENSHOTS_DIR, filename);
  const startTime = Date.now();

  let loadTime = 0;
  let success = true;
  let error: string | null = null;

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );
  page.setDefaultNavigationTimeout(30000);

  try {
    const response = await page.goto(site.url, { waitUntil: 'load' });
    await simulateInteraction(page);
    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 });
    } catch {
      /* proceed anyway */
    }
    await waitForLoadersGone(page);
    await new Promise((r) => setTimeout(r, 1500)); // settle animations
    await hideLoaders(page);

    loadTime = Date.now() - startTime;
    const status = response ? response.status() : 200;
    if (status >= 400) {
      success = false;
      error = `HTTP Error ${status}`;
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: false });
    }
  } catch (err) {
    const message = (err as Error).message || 'Timeout / Connection Failure';
    const currentUrl = page.url();
    // On a navigation timeout where the page partially loaded, try a fallback capture.
    if (message.includes('timeout') && currentUrl && currentUrl !== 'about:blank') {
      try {
        await simulateInteraction(page);
        await new Promise((r) => setTimeout(r, 3000));
        await hideLoaders(page);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        loadTime = Date.now() - startTime;
        success = true;
        error = null;
      } catch {
        success = false;
        error = message;
      }
    } else {
      success = false;
      error = message;
    }
  } finally {
    await page.close();
  }

  try {
    await updateWebsite(site.id, {
      lastStatus: success ? 'success' : 'failed',
      lastCapture: timeStr,
      error: success ? null : error,
      lastCaptureImage: success ? filename : null,
    });
  } catch (dbErr) {
    console.error(`[capture] Failed to update DB for ${site.name}:`, dbErr);
  }

  return {
    id: site.id,
    name: site.name,
    url: site.url,
    status: success ? 'success' : 'failed',
    loadTime: success ? loadTime : null,
    error: success ? null : error,
    screenshot: success ? filename : null,
  };
}

/** Run a full capture session over all active sites: screenshots → PDF → email. */
export async function runCaptureSession(triggerName = 'Manual Trigger'): Promise<void> {
  console.log(`[capture] Session started by: ${triggerName}`);
  ensureDirs();

  let websites: Website[] = [];
  try {
    websites = await getWebsites();
  } catch (err) {
    console.error('[capture] Failed to read sites:', err);
    setProgress({ active: false, status: 'Failed to read sites from database', current: 0, total: 0 });
    return;
  }

  const activeSites = websites.filter((s) => s.status === 'active');
  if (activeSites.length === 0) {
    setProgress({ active: false, status: 'Completed (No active sites)', current: 0, total: 0 });
    return;
  }

  setProgress({ active: true, status: 'Launching browser engine...', current: 0, total: activeSites.length });

  let browser: Browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
    console.error('[capture] Failed to launch browser:', err);
    setProgress({ active: false, status: 'Failed to launch browser', current: 0, total: 0 });
    return;
  }

  const timestamp = Date.now();
  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const details: ReportDetail[] = new Array(activeSites.length);
  let completed = 0;
  const inFlight: string[] = [];

  const refreshStatus = () => {
    if (completed < activeSites.length) {
      setProgress({
        current: completed,
        status: `Checked ${completed} of ${activeSites.length}. Active: ${inFlight.join(', ')}...`,
      });
    }
  };

  // Worker-pool over the active sites with bounded concurrency.
  const queue = activeSites.map((site, index) => ({ site, index }));
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    let job = queue.shift();
    while (job) {
      const { site, index } = job;
      inFlight.push(site.name);
      refreshStatus();
      details[index] = await captureSite(browser, site, timestamp, timeStr);
      completed++;
      inFlight.splice(inFlight.indexOf(site.name), 1);
      refreshStatus();
      job = queue.shift();
    }
  });

  await Promise.all(workers);
  await browser.close();

  const successCount = details.filter((d) => d?.status === 'success').length;
  const failedCount = activeSites.length - successCount;

  setProgress({ status: 'Generating PDF report...' });
  const pad = (n: number) => n.toString().padStart(2, '0');
  const pdfFilename = `WebsiteReport_${dateObj.getFullYear()}${pad(dateObj.getMonth() + 1)}${pad(
    dateObj.getDate(),
  )}_${pad(dateObj.getHours())}${pad(dateObj.getMinutes())}.pdf`;
  const pdfPath = path.join(REPORTS_DIR, pdfFilename);

  await renderReportPdf(
    { dateStr, timeStr, triggerName, total: activeSites.length, successCount, failedCount, details },
    SCREENSHOTS_DIR,
    pdfPath,
  );

  const report = {
    id: timestamp,
    date: dateStr,
    time: timeStr,
    total: activeSites.length,
    success: successCount,
    failed: failedCount,
    file: pdfFilename,
    details,
  };

  try {
    await createReport(report);
  } catch (dbErr) {
    console.error('[capture] Failed to create report entry:', dbErr);
  }

  setProgress({ status: 'Sending email alerts...' });
  try {
    const settings = await getSettings();
    await sendEmailNotification(settings, report, pdfPath);
  } catch (err) {
    console.error('[capture] Email step failed:', err);
  }

  setProgress({ active: false, status: 'Completed successfully!', current: 0, total: 0 });
  console.log('[capture] Session completed.');
}

/** Kick off a capture session in the background (non-blocking). */
export function startCaptureSession(triggerName?: string): void {
  runCaptureSession(triggerName).catch((err) => {
    console.error('[capture] Session crashed:', err);
    setProgress({ active: false, status: `Error: ${(err as Error).message}` });
  });
}
