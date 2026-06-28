import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';
import { checkSSL } from './sslService';
import { checkDomainExpiry } from './domainService';
import { checkMalware } from './malwareService';
import { generatePdfReport } from './pdfService';
import { sendEmailNotification, sendSslExpiryAlert, sendDomainExpiryAlert } from './emailService';

const globalForBrowser = global as unknown as { cachedBrowser?: Browser };

export async function getBrowserInstance(): Promise<Browser> {
  console.log('[Puppeteer] Checking cached browser health...');
  if (globalForBrowser.cachedBrowser) {
    if (globalForBrowser.cachedBrowser.connected) {
      console.log('[Puppeteer] Cached browser is connected and healthy.');
      return globalForBrowser.cachedBrowser;
    } else {
      console.log('[Puppeteer] Cached browser is disconnected, restarting...');
      globalForBrowser.cachedBrowser = undefined;
    }
  }

  console.log('[Puppeteer] Launching new optimized browser instance...');
  const startTimeLaunch = Date.now();
  globalForBrowser.cachedBrowser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-zygote',
      '--disable-extensions',
      '--disable-notifications',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-component-extensions-with-background-pages',
      '--disable-features=Translate',
      '--disable-ipc-flooding-protection',
      '--disable-renderer-backgrounding',
      '--force-color-profile=srgb',
      '--metrics-recording-only',
      '--mute-audio',
      '--disable-web-security',
      '--js-flags="--max-old-space-size=512"',
    ],
  });
  console.log(`[Puppeteer] Browser launched in ${Date.now() - startTimeLaunch}ms`);

  globalForBrowser.cachedBrowser.on('disconnected', () => {
    console.log('[Puppeteer] Browser disconnected event received.');
    globalForBrowser.cachedBrowser = undefined;
  });

  return globalForBrowser.cachedBrowser;
}

// Downscales screenshot buffer to max 800px width and compresses as JPEG at 65% quality
async function compressImageBuffer(browser: Browser, buffer: Buffer): Promise<Buffer> {
  let tempPage: Page | null = null;
  try {
    tempPage = await browser.newPage();
    await tempPage.goto('about:blank');

    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const compressedBase64 = await tempPage.evaluate(async (src) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          const maxWidth = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = src;
      });
    }, dataUrl);

    return Buffer.from(compressedBase64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  } finally {
    if (tempPage) {
      try {
        await tempPage.close();
      } catch (_) {}
    }
  }
}

// Helper function to auto-scroll page to load lazy content
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 1000; // Scroll in larger steps
      const maxScrolls = 15; // Limit scrolls to prevent hanging
      let scrolls = 0;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++;

        if (totalHeight >= scrollHeight - window.innerHeight || scrolls >= maxScrolls) {
          clearInterval(timer);
          window.scrollTo(0, 0); // Scroll back to top for screenshot
          resolve();
        }
      }, 25);
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 200)); // Wait 200ms for settle
}

// Helper function to wait for all image tags in the page to complete loading
async function verifyImagesLoaded(page: Page) {
  try {
    await Promise.race([
      page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
              setTimeout(() => resolve(), 2500); // 2.5s individual image load timeout
            });
          })
        );
      }),
      new Promise((resolve) => setTimeout(resolve, 3000)) // 3s max wait for all images
    ]);
  } catch (err: any) {
    console.log('Warning waiting for images to load:', err.message);
  }
}

// Helper function to prepare the page layout for continuous full-page screenshot
async function preparePageForScreenshot(page: Page) {
  try {
    await page.evaluate(() => {
      // Force convert fixed and sticky positioned elements to absolute
      // so that they only appear once in their natural layout flow and do not repeat/overlap
      const all = document.querySelectorAll('*');
      all.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          (el as HTMLElement).style.setProperty('position', 'absolute', 'important');
        }
      });
    });
  } catch (err: any) {
    console.log('Warning preparing page styles for screenshot:', err.message);
  }
}

// Target directories for storing output assets within the client public folder
const baseDir = process.cwd();
export const screenshotsDir = path.join(baseDir, 'public', 'screenshots');
export const reportsDir = path.join(baseDir, 'public', 'reports');

// Ensure screenshots and reports directories exist at startup
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Global Capture Progress State
export interface ProgressState {
  active: boolean;
  status: string;
  current: number;
  total: number;
}

// Attach state to global scope to prevent reset during Next.js hot-reloads
const globalForProgress = global as unknown as { captureProgress?: ProgressState };

if (!globalForProgress.captureProgress) {
  globalForProgress.captureProgress = {
    active: false,
    status: 'Idle',
    current: 0,
    total: 0,
  };
}

export const getCaptureProgressState = async (): Promise<ProgressState> => {
  return globalForProgress.captureProgress!;
};

export async function runCaptureSession(triggerName = 'Manual Trigger'): Promise<void> {
  console.log(`Starting capture session triggered by: ${triggerName}`);

  if (globalForProgress.captureProgress?.active) {
    console.log('Capture session is already active. Ignoring trigger.');
    return;
  }

  globalForProgress.captureProgress = {
    active: true,
    status: 'Initializing...',
    current: 0,
    total: 0,
  };

  try {
    if (triggerName === 'Manual Trigger') {
      try {
        await prisma.website.updateMany({
          data: {
            emailStatus: 'No Alert',
            domainEmailStatus: 'No Alert'
          }
        });
        console.log('[Alert System] Reset email and domain alert status for all websites for manual capture.');
      } catch (resetErr: any) {
        console.error('Failed to reset alert statuses:', resetErr.message);
      }
    }

    let websites: any[] = [];
    try {
      websites = await prisma.website.findMany({
        orderBy: { id: 'desc' },
      });
    } catch (err) {
      console.error('Database read failed in runCaptureSession:', err);
      globalForProgress.captureProgress = {
        active: false,
        status: 'Failed to read sites from database',
        current: 0,
        total: 0,
      };
      return;
    }

    const activeSites = (websites || []).filter((s) => s.status === 'active');

    if (activeSites.length === 0) {
      console.log('No active websites to monitor.');
      globalForProgress.captureProgress = {
        active: false,
        status: 'Completed (No active sites)',
        current: 0,
        total: 0,
      };
      return;
    }

    globalForProgress.captureProgress = {
      active: true,
      status: 'Launching browser engine...',
      current: 0,
      total: activeSites.length,
    };

    try {
      let browser: Browser | null = null;
      try {
        browser = await getBrowserInstance();
      } catch (err) {
        console.error('Failed to launch browser:', err);
        globalForProgress.captureProgress = {
          active: false,
          status: 'Failed to launch browser',
          current: 0,
          total: 0,
        };
        return;
      }

      const timestamp = Date.now();
      const dateObj = new Date();
      const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const reportDetails = new Array(activeSites.length);
      let completedCount = 0;
      let currentActiveCaptures: string[] = [];

      const updateProgressStatus = () => {
        if (completedCount < activeSites.length) {
          const activeNames = currentActiveCaptures.join(', ');
          globalForProgress.captureProgress!.status = `Checked ${completedCount} of ${activeSites.length}. Active: ${activeNames}...`;
        }
      };

      const captureWorker = async (site: any, index: number) => {
        currentActiveCaptures.push(site.name);
        globalForProgress.captureProgress!.current = completedCount;
        updateProgressStatus();
        console.log(`[Start] Monitoring ${site.name} (${site.url})...`);

        let page: Page | null = null;
        try {
          page = await browser!.newPage();
          
          // Request interception to block tracking, ads, social and font resources
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const resourceType = req.resourceType();
            const url = req.url().toLowerCase();
            
            const blockedPatterns = [
              'google-analytics',
              'googletagmanager',
              'doubleclick',
              'adsystem',
              'adserver',
              'facebook.com/plugins',
              'twitter.com/widgets',
              'analytics.js',
              'amplitude.com',
              'mixpanel.com',
              'hotjar',
              'sentry.io',
              'bugsnag',
              'optimizely',
              'crisp.chat',
              'intercom.io',
              'amazon-adsystem',
              'adnxs',
              'smartadserver',
              'pubmatic',
              'rubiconproject',
              'openx',
              'casalemedia',
              'criteo',
              'yieldlab',
              'bidswitch',
              'teads',
              'outbrain',
              'taboola',
              'revcontent',
              'adroll',
              'hubspot',
              'marketo',
              'pardot',
              'drift',
              'segment',
              'customer.io',
              'facebook.net',
              'googleadservices',
              'googlesyndication',
              'inspectlet',
              'fullstory',
              'luckyorange',
              'crazyegg'
            ];
            const blockedTypes = ['font', 'media', 'websocket', 'other'];

            if (
              blockedTypes.includes(resourceType) ||
              blockedPatterns.some((pattern) => url.includes(pattern))
            ) {
              req.abort();
            } else {
              req.continue();
            }
          });

          await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          );
          await page.setDefaultNavigationTimeout(25000);
        } catch (e: any) {
          console.error(`Failed to create page context for ${site.name}:`, e.message);
          completedCount++;
          currentActiveCaptures = currentActiveCaptures.filter((name) => name !== site.name);
          return;
        }

        let loadTime = 0;
        let siteSuccess = true;
        let siteError: string | null = null;
        let filename = `${site.id}_${timestamp}.jpg`;
        let screenshotPath = path.join(screenshotsDir, filename);
        const startTime = Date.now();

        try {
          const response = await page.goto(site.url, { waitUntil: 'load', timeout: 20000 });

          // Simulate user interaction to bypass optimization plugins that delay JS execution until user interaction
          try {
            await page.mouse.move(100, 100);
            await page.evaluate(() => {
              window.scrollBy(0, 50);
              const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
              events.forEach((evt) => {
                window.dispatchEvent(new Event(evt));
              });
            });
            await page.mouse.move(200, 200);
            await page.evaluate(() => {
              window.scrollBy(0, -50);
            });
          } catch (interactionErr: any) {
            console.log(`Failed to simulate interaction for ${site.name}:`, interactionErr.message);
          }

          // Wait for network idle to settle, but with a very short timeout (max 3000ms)
          try {
            await page.waitForNetworkIdle({ idleTime: 500, timeout: 3000 });
          } catch (idleErr) {
            console.log(`waitForNetworkIdle timed out for ${site.name}, proceeding anyway...`);
          }

          // Dynamically wait up to 5 seconds for any loader/preloader overlay elements to disappear
          try {
            await page.evaluate(async () => {
              const loaderSelectors = [
                '#preloader',
                '.preloader',
                '#loader',
                '.loader',
                '#loading',
                '.loading',
                '.site-preloader',
                '.site-loader',
                '.page-loader',
                '#page-preloader',
                '.gt3_preloader',
                '.loading-screen',
                '.spinner-wrapper',
                '#spinner-wrapper',
                '.preloader-wrapper',
                '#preloader-wrapper',
              ];

              const getVisibleLoaders = () => {
                return loaderSelectors.flatMap((selector) => {
                  const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
                  return elements.filter((el) => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    return (
                      el.offsetParent !== null &&
                      style.display !== 'none' &&
                      style.visibility !== 'hidden' &&
                      parseFloat(style.opacity) > 0.1 &&
                      rect.width > 10 &&
                      rect.height > 10
                    );
                  });
                });
              };

              const start = Date.now();
              while (Date.now() - start < 5000) {
                const visibleLoaders = getVisibleLoaders();
                if (visibleLoaders.length === 0) {
                  break;
                }
                await new Promise((r) => setTimeout(r, 200));
              }
            });
          } catch (err: any) {
            console.log(`Preloader visibility polling failed for ${site.name}:`, err.message);
          }

          // Add a short 0.5-second stabilization buffer to let page animations/layout settle
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Force hide any remaining preloader/spinner elements in case they are stuck
          try {
            await page.evaluate(() => {
              const loaderSelectors = [
                '#preloader',
                '.preloader',
                '#loader',
                '.loader',
                '#loading',
                '.loading',
                '.site-preloader',
                '.site-loader',
                '.page-loader',
                '#page-preloader',
                '.gt3_preloader',
                '.loading-screen',
                '.spinner-wrapper',
                '#spinner-wrapper',
                '.preloader-wrapper',
                '#preloader-wrapper',
              ];
              loaderSelectors.forEach((selector) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el: any) => {
                  el.style.display = 'none';
                  el.style.opacity = '0';
                  el.style.visibility = 'hidden';
                });
              });
            });
          } catch (err: any) {
            console.log(`Failed to hide loader elements for ${site.name}:`, err.message);
          }

          loadTime = Date.now() - startTime;

          const status = response ? response.status() : 200;
          if (status >= 400) {
            siteSuccess = false;
            siteError = `HTTP Error ${status}`;
          } else {
            await autoScroll(page);
            await verifyImagesLoaded(page);
            await preparePageForScreenshot(page);
            // Capture image as raw buffer and compress using browser canvas
            const rawBuffer = await page.screenshot({ type: 'jpeg', quality: 70, fullPage: true });
            const compressedBuffer = await compressImageBuffer(browser!, rawBuffer);
            await fs.promises.writeFile(screenshotPath, compressedBuffer);
          }
        } catch (err: any) {
          const currentUrl = page.url();
          if (err.message.includes('timeout') && currentUrl && currentUrl !== 'about:blank') {
            try {
              console.log(`Navigation timed out for ${site.name}, attempting fallback screenshot...`);
              try {
                await page.mouse.move(100, 100);
                await page.evaluate(() => {
                  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
                  events.forEach((evt) => {
                    window.dispatchEvent(new Event(evt));
                  });
                });
              } catch (e) {}
              await new Promise((resolve) => setTimeout(resolve, 500));
              try {
                await page.evaluate(() => {
                  const loaderSelectors = [
                    '#preloader',
                    '.preloader',
                    '#loader',
                    '.loader',
                    '#loading',
                    '.loading',
                    '.site-preloader',
                    '.site-loader',
                    '.page-loader',
                    '#page-preloader',
                    '.gt3_preloader',
                    '.loading-screen',
                    '.spinner-wrapper',
                    '#spinner-wrapper',
                    '.preloader-wrapper',
                    '#preloader-wrapper',
                  ];
                  loaderSelectors.forEach((selector) => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el: any) => {
                      el.style.display = 'none';
                      el.style.opacity = '0';
                      el.style.visibility = 'hidden';
                    });
                  });
                });
              } catch (e) {}
              await autoScroll(page);
              await verifyImagesLoaded(page);
              await preparePageForScreenshot(page);
              const rawBuffer = await page.screenshot({ type: 'jpeg', quality: 70, fullPage: true });
              const compressedBuffer = await compressImageBuffer(browser!, rawBuffer);
              await fs.promises.writeFile(screenshotPath, compressedBuffer);
              loadTime = Date.now() - startTime;
              siteSuccess = true;
              siteError = null;
            } catch (screenshotErr) {
              siteSuccess = false;
              siteError = err.message || 'Timeout / Connection Failure';
              console.error(`Error loading ${site.name} and fallback screenshot failed:`, siteError);
            }
          } else {
            siteSuccess = false;
            siteError = err.message || 'Timeout / Connection Failure';
            console.error(`Error loading ${site.name}:`, siteError);
          }
        } finally {
          if (page) await page.close();
        }

        // Perform Metrics Checks
        console.log(`[Start] Security metrics checks for ${site.name}...`);
        let sslRes = { status: 'Error', expiryDate: null as Date | null, daysRemaining: null as number | null, warning: true };
        let domainRes = { expiryDate: null as Date | null, daysRemaining: null as number | null, warning: true };
        let malwareRes = { safeBrowsingStatus: 'Error', malwareStatus: 'Error', phishingStatus: 'Error', blacklistStatus: 'Error' };

        try {
          sslRes = await checkSSL(site.url);
        } catch (sslErr: any) {
          console.error(`SSL check failed for ${site.name}:`, sslErr.message);
        }

        try {
          domainRes = await checkDomainExpiry(site.url);
        } catch (domErr: any) {
          console.error(`Domain check failed for ${site.name}:`, domErr.message);
        }

        try {
          malwareRes = checkMalware(site.url);
        } catch (malErr: any) {
          console.error(`Malware check failed for ${site.name}:`, malErr.message);
        }

        // Save metrics results to database
        try {
          await prisma.metric.create({
            data: {
              websiteId: BigInt(site.id),
              url: site.url,
              name: site.name,
              timestamp: new Date(),
              status: siteSuccess ? 'online' : 'offline',
              responseTime: siteSuccess ? loadTime : null,
              sslStatus: sslRes.status,
              sslExpiryDate: sslRes.expiryDate,
              sslDaysRemaining: sslRes.daysRemaining,
              sslWarning: sslRes.warning,
              domainExpiryDate: domainRes.expiryDate,
              domainDaysRemaining: domainRes.daysRemaining,
              domainWarning: domainRes.warning,
              safeBrowsingStatus: malwareRes.safeBrowsingStatus,
              malwareStatus: malwareRes.malwareStatus,
              phishingStatus: malwareRes.phishingStatus,
              blacklistStatus: malwareRes.blacklistStatus,
              screenshotPath: siteSuccess ? filename : null,
            },
          });
        } catch (dbMetricErr: any) {
          console.error(`Failed to write metrics to database for ${site.name}:`, dbMetricErr.message);
        }

        // Update website state in MySQL database
        try {
          await prisma.website.update({
            where: { id: BigInt(site.id) },
            data: {
              lastStatus: siteSuccess ? 'success' : 'failed',
              lastCapture: timeStr,
              error: siteSuccess ? null : siteError,
              lastCaptureImage: siteSuccess ? filename : null,
            },
          });
        } catch (dbErr: any) {
          console.error(`Failed to update website state in database for ${site.name}:`, dbErr);
        }

        // SSL Expiry Email Alert Logic
        if (site.alertEmail) {
          console.log(`[Alert System] Checking SSL expiry alert for ${site.name} (Alert Email: ${site.alertEmail})...`);
          
          const daysRemaining = sslRes.daysRemaining;
          const sslStatus = sslRes.status;
          
          let expectedStatus = 'No Alert';
          let alertLevel = '';
          let shouldSend = false;
          
          if (sslStatus === 'Expired' || (daysRemaining !== null && daysRemaining <= 0)) {
            expectedStatus = '🚨 Expired Alert Sent';
            alertLevel = 'SSL Expired';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 7) {
            expectedStatus = '🚨 Critical Sent';
            alertLevel = 'SSL Critical Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 15) {
            expectedStatus = '🚨 Urgent Sent';
            alertLevel = 'SSL Urgent Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 30) {
            expectedStatus = '⚠ Warning Sent';
            alertLevel = 'SSL Priority Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 60) {
            expectedStatus = '📧 Sent';
            alertLevel = 'SSL Warning';
            shouldSend = true;
          }
          
          const currentEmailStatus = site.emailStatus || 'No Alert';
          
          if (currentEmailStatus !== expectedStatus) {
            console.log(`[Alert System] Alert status changed from "${currentEmailStatus}" to "${expectedStatus}" for ${site.name}.`);
            
            if (shouldSend) {
              try {
                const websiteStatus = siteSuccess ? 'Online' : 'Offline';
                const domainStatus = domainRes.warning ? 'Warning' : 'Secure';
                
                let malwareStatus = 'Clean';
                if (
                  malwareRes.safeBrowsingStatus !== 'Safe' || 
                  malwareRes.malwareStatus !== 'Clean' || 
                  malwareRes.phishingStatus !== 'Clean' || 
                  malwareRes.blacklistStatus !== 'Clean'
                ) {
                  malwareStatus = 'Threat Detected';
                }
                
                const lastScanTime = new Date().toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
                
                const expiryDateStr = sslRes.expiryDate ? new Date(sslRes.expiryDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A';
                
                await sendSslExpiryAlert({
                  alertEmail: site.alertEmail,
                  websiteName: site.name,
                  websiteUrl: site.url,
                  sslStatus: sslStatus,
                  expiryDate: expiryDateStr,
                  daysRemaining: daysRemaining !== null ? daysRemaining : 'Unknown',
                  alertLevel: alertLevel,
                  websiteStatus,
                  domainStatus,
                  malwareStatus,
                  lastScanTime
                });
                
                console.log(`[Alert System] SSL expiry alert email sent successfully to ${site.alertEmail}.`);
              } catch (mailErr: any) {
                console.error(`[Alert System] Failed to send SSL expiry email alert for ${site.name}:`, mailErr.message);
              }
            }
            
            try {
              await prisma.website.update({
                where: { id: BigInt(site.id) },
                data: {
                  emailStatus: expectedStatus,
                  lastAlertSentAt: shouldSend ? new Date() : null
                }
              });
              console.log(`[Alert System] Website ${site.name} email status updated to "${expectedStatus}"`);
            } catch (dbErr: any) {
              console.error(`[Alert System] Failed to update website alert status in database:`, dbErr.message);
            }
          } else {
            console.log(`[Alert System] Alert status unchanged ("${currentEmailStatus}"). No email sent.`);
          }
        }

        // Domain Expiry Email Alert Logic
        if (site.alertEmail) {
          console.log(`[Alert System] Checking Domain expiry alert for ${site.name} (Alert Email: ${site.alertEmail})...`);
          
          const daysRemaining = domainRes.daysRemaining;
          const domainWarning = domainRes.warning;
          
          let expectedStatus = 'No Alert';
          let alertLevel = '';
          let shouldSend = false;
          
          if (daysRemaining !== null && daysRemaining <= 0) {
            expectedStatus = '🚨 Expired Alert Sent';
            alertLevel = 'Domain Expired';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 7) {
            expectedStatus = '🚨 Critical Sent';
            alertLevel = 'Domain Critical Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 15) {
            expectedStatus = '🚨 Urgent Sent';
            alertLevel = 'Domain Urgent Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 30) {
            expectedStatus = '⚠ Warning Sent';
            alertLevel = 'Domain Priority Warning';
            shouldSend = true;
          } else if (daysRemaining !== null && daysRemaining <= 160) {
            expectedStatus = '📧 Sent';
            alertLevel = 'Domain Warning';
            shouldSend = true;
          }
          
          const currentDomainEmailStatus = site.domainEmailStatus || 'No Alert';
          
          if (currentDomainEmailStatus !== expectedStatus) {
            console.log(`[Alert System] Domain alert status changed from "${currentDomainEmailStatus}" to "${expectedStatus}" for ${site.name}.`);
            
            if (shouldSend) {
              try {
                const websiteStatus = siteSuccess ? 'Online' : 'Offline';
                const domainStatus = domainWarning ? 'Warning' : 'Secure';
                let domainName = site.name;
                try {
                  domainName = site.url ? new URL(site.url).hostname.replace('www.', '') : site.name;
                } catch (urlErr) {
                  console.log(`Failed to parse URL for domain name, using fallback: ${site.url}`);
                }
                
                let malwareStatus = 'Clean';
                if (
                  malwareRes.safeBrowsingStatus !== 'Safe' || 
                  malwareRes.malwareStatus !== 'Clean' || 
                  malwareRes.phishingStatus !== 'Clean' || 
                  malwareRes.blacklistStatus !== 'Clean'
                ) {
                  malwareStatus = 'Threat Detected';
                }
                
                const lastScanTime = new Date().toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
                
                const expiryDateStr = domainRes.expiryDate ? new Date(domainRes.expiryDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A';
                
                await sendDomainExpiryAlert({
                  alertEmail: site.alertEmail,
                  websiteName: site.name,
                  websiteUrl: site.url,
                  domainName: domainName,
                  domainStatus: domainStatus,
                  expiryDate: expiryDateStr,
                  daysRemaining: daysRemaining !== null ? daysRemaining : 'Unknown',
                  alertLevel: alertLevel,
                  websiteStatus,
                  sslStatus: sslRes.status,
                  malwareStatus,
                  lastScanTime
                });
                
                console.log(`[Alert System] Domain expiry alert email sent successfully to ${site.alertEmail}.`);
              } catch (mailErr: any) {
                console.error(`[Alert System] Failed to send Domain expiry email alert for ${site.name}:`, mailErr.message);
              }
            }
            
            try {
              await prisma.website.update({
                where: { id: BigInt(site.id) },
                data: {
                  domainEmailStatus: expectedStatus,
                  lastDomainAlertSentAt: shouldSend ? new Date() : null
                }
              });
              console.log(`[Alert System] Website ${site.name} domain email status updated to "${expectedStatus}"`);
            } catch (dbErr: any) {
              console.error(`[Alert System] Failed to update website domain alert status in database:`, dbErr.message);
            }
          } else {
            console.log(`[Alert System] Domain alert status unchanged ("${currentDomainEmailStatus}"). No email sent.`);
          }
        }

        reportDetails[index] = {
          id: site.id,
          name: site.name,
          url: site.url,
          status: siteSuccess ? 'success' : 'failed',
          loadTime: siteSuccess ? loadTime : null,
          error: siteSuccess ? null : siteError,
          screenshot: siteSuccess ? filename : null,
          ssl: sslRes,
          domain: domainRes,
          malware: malwareRes,
        };

        completedCount++;
        currentActiveCaptures = currentActiveCaptures.filter((name) => name !== site.name);
        globalForProgress.captureProgress!.current = completedCount;
        updateProgressStatus();
        console.log(`[Finish] Monitored ${site.name}. Success: ${siteSuccess}`);
      };

      // Run up to 4 captures concurrently to speed up the process significantly
      const concurrencyLimit = 4;
      const queue = [...activeSites];
      const workers = Array(Math.min(concurrencyLimit, queue.length))
        .fill(null)
        .map(async () => {
          while (queue.length > 0) {
            const site = queue.shift();
            if (!site) continue;
            const index = activeSites.indexOf(site);
            await captureWorker(site, index);
          }
        });

      await Promise.all(workers);

      // Reuse browser, so do not close it here

      // Calculate success / failed counts
      let successCount = 0;
      let failedCount = 0;
      for (const item of reportDetails) {
        if (item && item.status === 'success') {
          successCount++;
        } else {
          failedCount++;
        }
      }

      globalForProgress.captureProgress!.status = 'Generating PDF report...';
      console.log('Generating A4 PDF Report...');

      const pdfFilename = `WebsiteReport_${dateObj.getFullYear()}${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}_${dateObj.getHours()
        .toString()
        .padStart(2, '0')}${dateObj.getMinutes().toString().padStart(2, '0')}.pdf`;
      const pdfPath = path.join(reportsDir, pdfFilename);

      try {
        await generatePdfReport({
          reportDetails,
          successCount,
          failedCount,
          activeSitesCount: activeSites.length,
          triggerName,
          dateStr,
          timeStr,
          pdfPath,
          screenshotsDir,
        });
      } catch (err) {
        console.error('PDF generation failed:', err);
      }

      // Create new report database entry
      const newReport = {
        id: timestamp,
        date: dateStr,
        time: timeStr,
        total: activeSites.length,
        success: successCount,
        failed: failedCount,
        file: pdfFilename,
        details: reportDetails,
      };

      try {
        await prisma.report.create({
          data: {
            id: BigInt(newReport.id),
            date: newReport.date,
            time: newReport.time,
            total: newReport.total,
            success: newReport.success,
            failed: newReport.failed,
            file: newReport.file,
            details: {
              create: (newReport.details || []).map((d: any) => ({
                websiteId: BigInt(d.id),
                name: d.name,
                url: d.url,
                status: d.status,
                loadTime: d.loadTime || null,
                error: d.error || null,
                screenshot: d.screenshot || null,
              })),
            },
          },
        });
      } catch (dbErr) {
        console.error('Failed to create report entry in database:', dbErr);
      }

      globalForProgress.captureProgress!.status = 'Sending email alerts...';
      console.log('Sending emails...');

      // Fetch settings from database for email notification dispatch
      let settings: any = {};
      try {
        const [schedules, recipients, smtpRow] = await Promise.all([
          prisma.schedule.findMany(),
          prisma.emailRecipient.findMany(),
          prisma.smtpConfig.findFirst({ orderBy: { id: 'desc' } }),
        ]);
        const smtp = smtpRow
          ? {
              host: smtpRow.host || '',
              port: smtpRow.port !== undefined && smtpRow.port !== null ? String(smtpRow.port) : '',
              user: smtpRow.username || '',
              pass: smtpRow.password || '',
            }
          : { host: '', port: '', user: '', pass: '' };
        settings = {
          schedules: schedules.map((s) => ({
            id: Number(s.id),
            time: s.time,
            enabled: Boolean(s.enabled),
          })),
          recipients: recipients.map((r) => ({
            id: Number(r.id),
            email: r.email,
          })),
          smtp: {
            host: smtp.host || '',
            port: smtp.port || '',
            user: smtp.user || '',
            pass: smtp.pass || '',
          },
        };
      } catch (err) {
        console.error('Failed to fetch settings for email notifications:', err);
      }

      // Ensure the PDF file is fully generated before sending the email.
      // Verify the PDF file exists before attaching it.
      const pdfExists = await fs.promises.access(pdfPath, fs.constants.F_OK).then(() => true).catch(() => false);
      if (pdfExists) {
        try {
          await sendEmailNotification(settings, newReport, pdfPath);
        } catch (emailErr) {
          console.error('Failed to send email notification:', emailErr);
        }
      } else {
        console.error(`[Alert System] PDF file does not exist at ${pdfPath}. Skipping email notification.`);
      }

      globalForProgress.captureProgress = {
        active: false,
        status: 'Completed successfully!',
        current: 0,
        total: 0,
      };
      console.log('Capture session completed successfully.');
    } finally {
      globalForProgress.captureProgress!.active = false;
    }
  } finally {
    globalForProgress.captureProgress!.active = false;
  }
}
