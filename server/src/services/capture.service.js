import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWebsites, updateWebsite, createReport, getSettings, createMetric } from './db.service.js';
import { checkSSL, checkDomainExpiry, checkMalware } from './security.service.js';
import { sendEmailNotification, sendSslExpiryAlert, sendDomainExpiryAlert } from './email.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read PNG dimensions from physical file metadata
function getPngDimensions(filePath) {
  const buffer = Buffer.alloc(8);
  const fd = fs.openSync(filePath, 'r');
  try {
    fs.readSync(fd, buffer, 0, 8, 16);
    const width = buffer.readInt32BE(0);
    const height = buffer.readInt32BE(4);
    return { width, height };
  } finally {
    fs.closeSync(fd);
  }
}

// Helper function to read JPEG dimensions from physical file metadata
function getJpgDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(65536);
    const bytesRead = fs.readSync(fd, buffer, 0, 65536, 0);
    if (bytesRead < 4 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
      throw new Error('Not a valid JPEG file');
    }
    let i = 2;
    while (i < bytesRead - 8) {
      if (buffer[i] !== 0xFF) {
        i++;
        continue;
      }
      const marker = buffer[i + 1];
      if (marker === 0xFF) {
        i++;
        continue;
      }
      if (marker === 0xD9 || marker === 0xDA) {
        break;
      }
      if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) {
        i += 2;
        continue;
      }
      const length = buffer.readUInt16BE(i + 2);
      if ((marker >= 0xC0 && marker <= 0xCF) && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
        const height = buffer.readUInt16BE(i + 5);
        const width = buffer.readUInt16BE(i + 7);
        return { width, height };
      }
      i += 2 + length;
    }
    throw new Error('SOF marker not found');
  } finally {
    fs.closeSync(fd);
  }
}

const globalForBrowser = global;

async function getBrowserInstance() {
  console.log('[Puppeteer] Checking cached server browser health...');
  if (globalForBrowser.cachedBrowser) {
    if (globalForBrowser.cachedBrowser.connected) {
      console.log('[Puppeteer] Cached server browser is connected and healthy.');
      return globalForBrowser.cachedBrowser;
    } else {
      console.log('[Puppeteer] Cached server browser is disconnected or dead, restarting...');
      globalForBrowser.cachedBrowser = undefined;
    }
  }

  console.log('[Puppeteer] Launching new optimized server browser instance...');
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
    ]
  });
  console.log(`[Puppeteer] Server browser launched in ${Date.now() - startTimeLaunch}ms`);

  globalForBrowser.cachedBrowser.on('disconnected', () => {
    console.log('[Puppeteer] Server browser disconnected event received.');
    globalForBrowser.cachedBrowser = undefined;
  });

  return globalForBrowser.cachedBrowser;
}

// Helper function to wait for all image tags in the page to complete loading
async function verifyImagesLoaded(page) {
  try {
    await Promise.race([
      page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
              setTimeout(() => resolve(), 2500); // 2.5s individual image load timeout
            });
          })
        );
      }),
      new Promise((resolve) => setTimeout(resolve, 3000)) // 3s max wait for all images
    ]);
  } catch (err) {
    console.log('Warning waiting for images to load:', err.message);
  }
}

// Helper function to prepare the page layout for continuous full-page screenshot
async function preparePageForScreenshot(page) {
  try {
    await page.evaluate(() => {
      // Force convert fixed and sticky positioned elements to absolute
      // so that they only appear once in their natural layout flow and do not repeat/overlap
      const all = document.querySelectorAll('*');
      all.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          el.style.setProperty('position', 'absolute', 'important');
        }
      });
    });
  } catch (err) {
    console.log('Warning preparing page styles for screenshot:', err.message);
  }
}

// Downscales screenshot buffer to max 800px width and compresses as JPEG at 65% quality
async function compressImageBuffer(browser, buffer) {
  let tempPage = null;
  try {
    tempPage = await browser.newPage();
    await tempPage.goto('about:blank');

    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const compressedBase64 = await tempPage.evaluate(async (src) => {
      return new Promise((resolve, reject) => {
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
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
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
          window.scrollTo(0, 0); // Scroll back to top
          resolve();
        }
      }, 25);
    });
  });
  await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms for settle
}

// Base directory is the server project root (e.g. c:/screenshot_project/server)
const baseDir = path.resolve(__dirname, '..', '..');
export const screenshotsDir = path.join(baseDir, '..', 'client', 'public', 'screenshots');
export const reportsDir = path.join(baseDir, '..', 'client', 'public', 'reports');

// Ensure screenshots and reports directories exist at startup
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Global Capture Progress State
export let captureProgress = {
  active: false,
  status: 'Idle',
  current: 0,
  total: 0
};

export async function getCaptureProgressState() {
  return captureProgress;
}

export async function runCaptureSession(triggerName = 'Manual Trigger') {
  console.log(`Starting capture session triggered by: ${triggerName}`);
  
  if (captureProgress?.active) {
    console.log('Capture session is already active. Ignoring trigger.');
    return;
  }

  if (triggerName === 'Manual Trigger') {
    try {
      await prisma.website.updateMany({
        data: {
          emailStatus: 'No Alert',
          domainEmailStatus: 'No Alert'
        }
      });
      console.log('[Alert System] Reset email and domain alert status for all websites for manual capture.');
    } catch (resetErr) {
      console.error('Failed to reset alert statuses:', resetErr.message);
    }
  }
  
  let websites = [];
  try {
    websites = await getWebsites();
  } catch (err) {
    console.error('Database read failed in runCaptureSession:', err);
    captureProgress = { active: false, status: 'Failed to read sites from database', current: 0, total: 0 };
    return;
  }

  const activeSites = (websites || []).filter(s => s.status === 'active');
  
  if (activeSites.length === 0) {
    console.log('No active websites to monitor.');
    captureProgress = { active: false, status: 'Completed (No active sites)', current: 0, total: 0 };
    return;
  }
  
  captureProgress = {
    active: true,
    status: 'Launching browser engine...',
    current: 0,
    total: activeSites.length
  };
  
  try {
    let browser;
  try {
    browser = await getBrowserInstance();
  } catch (err) {
    console.error('Failed to launch browser:', err);
    captureProgress = { active: false, status: 'Failed to launch browser', current: 0, total: 0 };
    return;
  }

  const timestamp = Date.now();
  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const reportDetails = new Array(activeSites.length);
  let completedCount = 0;
  let currentActiveCaptures = [];

  const updateProgressStatus = () => {
    if (completedCount < activeSites.length) {
      const activeNames = currentActiveCaptures.join(', ');
      captureProgress.status = `Checked ${completedCount} of ${activeSites.length}. Active: ${activeNames}...`;
    }
  };

  const captureWorker = async (site, index) => {
    currentActiveCaptures.push(site.name);
    captureProgress.current = completedCount;
    updateProgressStatus();
    console.log(`[Start] Monitoring ${site.name} (${site.url})...`);

    let page;
    try {
      page = await browser.newPage();
      
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
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setDefaultNavigationTimeout(25000);
    } catch (e) {
      console.error(`Failed to create page context for ${site.name}:`, e.message);
      completedCount++;
      currentActiveCaptures = currentActiveCaptures.filter(name => name !== site.name);
      return;
    }

    let loadTime = 0;
    let siteSuccess = true;
    let siteError = null;
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
          events.forEach(evt => {
            window.dispatchEvent(new Event(evt));
          });
        });
        await page.mouse.move(200, 200);
        await page.evaluate(() => {
          window.scrollBy(0, -50);
        });
      } catch (interactionErr) {
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
            '#preloader', '.preloader', '#loader', '.loader', 
            '#loading', '.loading', '.site-preloader', '.site-loader', 
            '.page-loader', '#page-preloader', '.gt3_preloader',
            '.loading-screen', '.spinner-wrapper', '#spinner-wrapper',
            '.preloader-wrapper', '#preloader-wrapper'
          ];
          
          const getVisibleLoaders = () => {
            return loaderSelectors.flatMap(selector => {
              const elements = Array.from(document.querySelectorAll(selector));
              return elements.filter(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return (
                  el.offsetParent !== null &&
                  style.display !== 'none' &&
                  style.visibility !== 'hidden' &&
                  parseFloat(style.opacity) > 0.1 &&
                  rect.width > 10 && rect.height > 10
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
            await new Promise(r => setTimeout(r, 200));
          }
        });
      } catch (err) {
        console.log(`Preloader visibility polling failed for ${site.name}:`, err.message);
      }

      // Add a short 0.5-second stabilization buffer to let page animations/layout settle
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force hide any remaining preloader/spinner elements in case they are stuck
      try {
        await page.evaluate(() => {
          const loaderSelectors = [
            '#preloader', '.preloader', '#loader', '.loader', 
            '#loading', '.loading', '.site-preloader', '.site-loader', 
            '.page-loader', '#page-preloader', '.gt3_preloader',
            '.loading-screen', '.spinner-wrapper', '#spinner-wrapper',
            '.preloader-wrapper', '#preloader-wrapper'
          ];
          loaderSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              el.style.display = 'none';
              el.style.opacity = '0';
              el.style.visibility = 'hidden';
            });
          });
        });
      } catch (err) {
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
        const compressedBuffer = await compressImageBuffer(browser, rawBuffer);
        await fs.promises.writeFile(screenshotPath, compressedBuffer);
      }
    } catch (err) {
      const currentUrl = page.url();
      if (err.message.includes('timeout') && currentUrl && currentUrl !== 'about:blank') {
        try {
          console.log(`Navigation timed out for ${site.name}, attempting fallback screenshot...`);
          try {
            await page.mouse.move(100, 100);
            await page.evaluate(() => {
              const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
              events.forEach(evt => {
                window.dispatchEvent(new Event(evt));
              });
            });
          } catch (e) {}
          await new Promise(resolve => setTimeout(resolve, 500));
          try {
            await page.evaluate(() => {
              const loaderSelectors = [
                '#preloader', '.preloader', '#loader', '.loader', 
                '#loading', '.loading', '.site-preloader', '.site-loader', 
                '.page-loader', '#page-preloader', '.gt3_preloader',
                '.loading-screen', '.spinner-wrapper', '#spinner-wrapper',
                '.preloader-wrapper', '#preloader-wrapper'
              ];
              loaderSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
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
          const compressedBuffer = await compressImageBuffer(browser, rawBuffer);
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
    let sslRes = { status: 'Error', expiryDate: null, daysRemaining: null, warning: true };
    let domainRes = { expiryDate: null, daysRemaining: null, warning: true };
    let malwareRes = { safeBrowsingStatus: 'Error', malwareStatus: 'Error', phishingStatus: 'Error', blacklistStatus: 'Error' };
    
    try {
      sslRes = await checkSSL(site.url);
    } catch (sslErr) {
      console.error(`SSL check failed for ${site.name}:`, sslErr.message);
    }
    
    try {
      domainRes = await checkDomainExpiry(site.url);
    } catch (domErr) {
      console.error(`Domain check failed for ${site.name}:`, domErr.message);
    }
    
    try {
      malwareRes = checkMalware(site.url);
    } catch (malErr) {
      console.error(`Malware check failed for ${site.name}:`, malErr.message);
    }

    // Save metrics results to database
    try {
      await createMetric({
        websiteId: site.id,
        url: site.url,
        name: site.name,
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
        screenshotPath: siteSuccess ? filename : null
      });
    } catch (dbMetricErr) {
      console.error(`Failed to write metrics to database for ${site.name}:`, dbMetricErr.message);
    }

    // Update website state in MySQL database
    try {
      await updateWebsite(site.id, {
        lastStatus: siteSuccess ? 'success' : 'failed',
        lastCapture: timeStr,
        error: siteSuccess ? null : siteError,
        lastCaptureImage: siteSuccess ? filename : null
      });
    } catch (dbErr) {
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
          } catch (mailErr) {
            console.error(`[Alert System] Failed to send SSL expiry email alert for ${site.name}:`, mailErr);
          }
        }
        
        try {
          await updateWebsite(site.id, {
            emailStatus: expectedStatus,
            lastAlertSentAt: shouldSend ? new Date() : null
          });
          console.log(`[Alert System] Website ${site.name} email status updated to "${expectedStatus}"`);
        } catch (dbErr) {
          console.error(`[Alert System] Failed to update website alert status in database:`, dbErr);
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
            const domainName = site.url ? new URL(site.url).hostname.replace('www.', '') : site.name;
            
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
          } catch (mailErr) {
            console.error(`[Alert System] Failed to send Domain expiry email alert for ${site.name}:`, mailErr);
          }
        }
        
        try {
          await updateWebsite(site.id, {
            domainEmailStatus: expectedStatus,
            lastDomainAlertSentAt: shouldSend ? new Date() : null
          });
          console.log(`[Alert System] Website ${site.name} domain email status updated to "${expectedStatus}"`);
        } catch (dbErr) {
          console.error(`[Alert System] Failed to update website domain alert status in database:`, dbErr);
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
      malware: malwareRes
    };

    completedCount++;
    currentActiveCaptures = currentActiveCaptures.filter(name => name !== site.name);
    captureProgress.current = completedCount;
    updateProgressStatus();
    console.log(`[Finish] Monitored ${site.name}. Success: ${siteSuccess}`);
  };

  // Run up to 4 captures concurrently to speed up the process significantly
  const concurrencyLimit = 4;
  const queue = [...activeSites];
  const workers = Array(Math.min(concurrencyLimit, queue.length)).fill(null).map(async () => {
    while (queue.length > 0) {
      const site = queue.shift();
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

  const pdfFilename = `WebsiteReport_${dateObj.getFullYear()}${(dateObj.getMonth()+1).toString().padStart(2,'0')}${dateObj.getDate().toString().padStart(2,'0')}_${dateObj.getHours().toString().padStart(2,'0')}${dateObj.getMinutes().toString().padStart(2,'0')}.pdf`;
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
      screenshotsDir
    });
  } catch (err) {
    console.error('Error rendering report PDF:', err);
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
    details: reportDetails
  };
  
  try {
    await createReport(newReport);
  } catch (dbErr) {
    console.error('Failed to create report entry in database:', dbErr);
  }
  captureProgress.status = 'Sending email alerts...';
  console.log('Sending emails...');

  let settings = {};
  try {
    settings = await getSettings();
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

  captureProgress = {
    active: false,
    status: 'Completed successfully!',
    current: 0,
    total: 0
  };
  console.log('Capture session completed successfully.');
  } finally {
    captureProgress.active = false;
  }
}

export async function generatePdfReport({
  reportDetails,
  successCount,
  failedCount,
  activeSitesCount,
  triggerName,
  dateStr,
  timeStr,
  pdfPath,
  screenshotsDir
}) {
  let pdfBrowser = null;
  let pdfPage = null;
  try {
    console.log('[Puppeteer PDF] Launching dedicated browser on server...');
    const startTimeLaunch = Date.now();
    try {
      pdfBrowser = await puppeteer.launch({
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
        ]
      });
      console.log(`[Puppeteer PDF] Dedicated server browser launched in ${Date.now() - startTimeLaunch}ms`);
      
      console.log('[Puppeteer PDF] Creating new server page context...');
      const startTimePage = Date.now();
      pdfPage = await pdfBrowser.newPage();
      console.log(`[Puppeteer PDF] Server page context created in ${Date.now() - startTimePage}ms`);
    } catch (browserErr) {
      console.error("[PDF Generator] Failed to initialize dedicated server Puppeteer browser or page:");
      console.error(browserErr);
      console.error(browserErr.stack);
      throw browserErr;
    }

    const sslAlerts = reportDetails.filter(d => d.ssl && d.ssl.warning).length;
    const domainAlerts = reportDetails.filter(d => d.domain && d.domain.warning).length;
    const malwareAlerts = reportDetails.filter(d => d.malware && (
      d.malware.safeBrowsingStatus !== 'Safe' || 
      d.malware.malwareStatus !== 'Clean' || 
      d.malware.phishingStatus !== 'Clean' || 
      d.malware.blacklistStatus !== 'Clean'
    )).length;

    // Collect individual alerts to display in the Alerts Section
    const activeAlertList = [];
    reportDetails.forEach(d => {
      if (d.status !== 'success') {
        activeAlertList.push(`🔴 Website Offline: <strong>${d.name}</strong> (${d.url}) - Error: ${d.error || 'Connection Failed'}`);
      }
      if (d.ssl && d.ssl.warning) {
        if (d.ssl.status === 'No SSL (HTTP)') {
          activeAlertList.push(`⚠️ No SSL (HTTP) for <strong>${d.name}</strong> (${d.url})`);
        } else {
          activeAlertList.push(`⚠️ SSL Expiry Warning: <strong>${d.name}</strong> (${d.url}) - Status: ${d.ssl.status}, Expiry in ${d.ssl.daysRemaining !== null ? d.ssl.daysRemaining : 'unknown'} days (${d.ssl.expiryDate ? new Date(d.ssl.expiryDate).toLocaleDateString('en-GB') : 'N/A'})`);
        }
      }
      if (d.domain && d.domain.warning) {
        activeAlertList.push(`⚠️ Domain Expiry Warning: <strong>${d.name}</strong> - Expiry in ${d.domain.daysRemaining !== null ? d.domain.daysRemaining : 'unknown'} days (${d.domain.expiryDate ? new Date(d.domain.expiryDate).toLocaleDateString('en-GB') : 'N/A'})`);
      }
      if (d.malware && (
        d.malware.safeBrowsingStatus !== 'Safe' || 
        d.malware.malwareStatus !== 'Clean' || 
        d.malware.phishingStatus !== 'Clean' || 
        d.malware.blacklistStatus !== 'Clean'
      )) {
        activeAlertList.push(`🚨 Security Threat: <strong>${d.name}</strong> (${d.url}) - Safe Browsing: <span style="color:red;font-weight:bold">${d.malware.safeBrowsingStatus}</span>, Malware: <span style="color:red;font-weight:bold">${d.malware.malwareStatus}</span>, Phishing: <span style="color:red;font-weight:bold">${d.malware.phishingStatus}</span>, Blacklist: <span style="color:red;font-weight:bold">${d.malware.blacklistStatus}</span>`);
      }
    });

    // Build beautiful HTML report structure
    let reportHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SiteWatch Metrics Report</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 25px; color: #1f2937; background: #ffffff; line-height: 1.4; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 22px; color: #4f46e5; margin: 0; font-weight: 700; }
        .header .meta { font-size: 11px; color: #4b5563; text-align: right; }
        .section-title { font-size: 14px; font-weight: 700; color: #1e1b4b; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 25px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
        .summary-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 20px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; text-align: center; background: #f9fafb; border-top: 3px solid #64748b; }
        .card .value { font-size: 20px; font-weight: bold; color: #111827; }
        .card.online { border-top-color: #10b981; }
        .card.online .value { color: #10b981; }
        .card.offline { border-top-color: #ef4444; }
        .card.offline .value { color: #ef4444; }
        .card.alert { border-top-color: #f59e0b; }
        .card.alert .value { color: #f59e0b; }
        .card.critical { border-top-color: #ef4444; }
        .card.critical .value { color: #ef4444; }
        .card .label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: avoid; }
        th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        th { background: #f3f4f6; color: #374151; font-weight: 600; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; }
        
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-neutral { background: #f3f4f6; color: #374151; }
        
        .alerts-box { border: 1px solid #fee2e2; background: #fff5f5; border-radius: 6px; padding: 12px; margin-bottom: 20px; page-break-inside: avoid; }
        .alerts-box.nominal { border: 1px solid #d1fae5; background: #f0fdf4; }
        .alerts-box h3 { font-size: 12px; font-weight: 700; margin: 0 0 8px 0; }
        .alerts-box.nominal h3 { color: #15803d; }
        .alerts-box.triggered h3 { color: #b91c1c; }
        .alerts-box ul { margin: 0; padding-left: 20px; font-size: 11px; }
        .alerts-box li { margin-bottom: 6px; }
        
        .screenshot-section {
          page-break-before: always;
          page-break-inside: avoid;
          margin-bottom: 20px;
          text-align: center;
        }
        .screenshot-header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px;
          margin-bottom: 15px;
          font-size: 12px;
          font-weight: bold;
          color: #374151;
          text-align: left;
        }
        .screenshot-img-container-full {
          width: 100%;
          text-align: center;
        }
        .screenshot-img-full {
          display: inline-block;
          max-width: 100%;
          height: auto;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>SiteWatch Monitor Portal</h1>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #6b7280;">Automated System Metrics Check</p>
        </div>
        <div class="meta">
          <div><strong>Report:</strong> Metrics Report</div>
          <div><strong>Generated:</strong> ${dateStr} at ${timeStr}</div>
          <div><strong>Trigger:</strong> ${triggerName}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="card">
          <div class="value">${activeSitesCount}</div>
          <div class="label">Total Websites</div>
        </div>
        <div class="card online">
          <div class="value">${successCount}</div>
          <div class="label">Online</div>
        </div>
        <div class="card offline">
          <div class="value">${failedCount}</div>
          <div class="label">Offline</div>
        </div>
        <div class="card alert">
          <div class="value">${sslAlerts}</div>
          <div class="label">SSL Alerts</div>
        </div>
        <div class="card alert">
          <div class="value">${domainAlerts}</div>
          <div class="label">Domain Alerts</div>
        </div>
        <div class="card critical">
          <div class="value">${malwareAlerts}</div>
          <div class="label">Malware Alerts</div>
        </div>
      </div>

      <!-- Alerts Section -->
      <div class="alerts-box ${activeAlertList.length === 0 ? 'nominal' : 'triggered'}">
        <h3>${activeAlertList.length === 0 ? '✅ All Systems Nominal' : '⚠️ System Alerts Triggered'}</h3>
        ${activeAlertList.length === 0 
          ? `<p style="margin:0; font-size:11px; color:#166534">No active threat, SSL certificate, or domain expiry alerts detected for all monitored websites.</p>`
          : `<ul>${activeAlertList.map(a => `<li>${a}</li>`).join('')}</ul>`
        }
      </div>

      <!-- Section 1: Availability and Response Time -->
      <div class="section-title">Website Availability & Response Time</div>
      <table>
        <thead>
          <tr>
            <th>Website Name</th>
            <th>Target URL</th>
            <th>Check Status</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          ${reportDetails.map(d => `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td style="color: #4f46e5;">${d.url}</td>
              <td>
                <span class="badge ${d.status === 'success' ? 'badge-success' : 'badge-danger'}">
                  ${d.status === 'success' ? '✓ Online' : '✗ Offline'}
                </span>
              </td>
              <td>${d.status === 'success' ? `<strong>${d.loadTime} ms</strong>` : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Section 2: SSL Monitoring Results -->
      <div class="section-title">SSL Certificate Monitoring</div>
      <table>
        <thead>
          <tr>
            <th>Website URL</th>
            <th>SSL Status</th>
            <th>SSL Expiry Date</th>
            <th>Days Remaining</th>
            <th>SSL Warning</th>
          </tr>
        </thead>
        <tbody>
          ${reportDetails.map(d => {
            const ssl = d.ssl || { status: 'Unknown', expiryDate: null, daysRemaining: null, warning: false };
            const expiryFmt = ssl.expiryDate ? new Date(ssl.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            const daysLeft = ssl.daysRemaining !== null ? `${ssl.daysRemaining} days` : 'N/A';
            return `
              <tr>
                <td style="color: #4b5563;">${d.url}</td>
                <td>
                  <span class="badge ${ssl.status === 'Valid' ? 'badge-success' : ssl.status === 'No SSL (HTTP)' ? 'badge-neutral' : 'badge-danger'}">
                    ${ssl.status}
                  </span>
                </td>
                <td>${expiryFmt}</td>
                <td><strong>${daysLeft}</strong></td>
                <td>
                  <span class="badge ${ssl.warning ? 'badge-danger' : 'badge-success'}">
                    ${ssl.warning ? '⚠️ WARNING' : '✓ SECURE'}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- Section 3: Domain Expiry Results -->
      <div class="section-title">Domain Expiry Monitoring</div>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Domain Expiry Date</th>
            <th>Days Remaining</th>
            <th>Domain Warning</th>
          </tr>
        </thead>
        <tbody>
          ${reportDetails.map(d => {
            const dom = d.domain || { expiryDate: null, daysRemaining: null, warning: false };
            const expiryFmt = dom.expiryDate ? new Date(dom.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            const daysLeft = dom.daysRemaining !== null ? `${dom.daysRemaining} days` : 'N/A';
            const domainName = d.url ? new URL(d.url).hostname.replace('www.', '') : d.name;
            return `
              <tr>
                <td><strong>${domainName}</strong></td>
                <td>${expiryFmt}</td>
                <td><strong>${daysLeft}</strong></td>
                <td>
                  <span class="badge ${dom.warning ? 'badge-danger' : 'badge-success'}">
                    ${dom.warning ? '⚠️ WARNING' : '✓ SECURE'}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- Section 4: Malware & Reputation Checks -->
      <div class="section-title">Malware & Threat Reputation Checks</div>
      <table>
        <thead>
          <tr>
            <th>Website Domain</th>
            <th>Safe Browsing</th>
            <th>Malware Status</th>
            <th>Phishing Status</th>
            <th>Blacklist Status</th>
          </tr>
        </thead>
        <tbody>
          ${reportDetails.map(d => {
            const mal = d.malware || { safeBrowsingStatus: 'Unknown', malwareStatus: 'Unknown', phishingStatus: 'Unknown', blacklistStatus: 'Unknown' };
            const sbBadge = mal.safeBrowsingStatus === 'Safe' ? 'badge-success' : 'badge-danger';
            const mwBadge = mal.malwareStatus === 'Clean' ? 'badge-success' : 'badge-danger';
            const phBadge = mal.phishingStatus === 'Clean' ? 'badge-success' : 'badge-danger';
            const blBadge = mal.blacklistStatus === 'Clean' ? 'badge-success' : 'badge-danger';
            const domainName = d.url ? new URL(d.url).hostname.replace('www.', '') : d.name;
            return `
              <tr>
                <td><strong>${domainName}</strong></td>
                <td><span class="badge ${sbBadge}">${mal.safeBrowsingStatus}</span></td>
                <td><span class="badge ${mwBadge}">${mal.malwareStatus}</span></td>
                <td><span class="badge ${phBadge}">${mal.phishingStatus}</span></td>
                <td><span class="badge ${blBadge}">${mal.blacklistStatus}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='800' viewBox='0 0 1280 800'><rect width='1280' height='800' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='30' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle'>Screenshot Not Available</text></svg>";

    // Embed screenshots for A4 printing PDF using local file:/// URLs and SVG placeholders
    let embeddedCount = 0;
    for (let i = 0; i < reportDetails.length; i++) {
      const d = reportDetails[i];
      if (d) {
        let dataUrl = PLACEHOLDER_IMAGE;
        let isPlaceholder = true;

        if (d.status === 'success' && d.screenshot) {
          const fullImagePath = path.join(screenshotsDir, d.screenshot);
          try {
            const fileExists = await fs.promises.access(fullImagePath, fs.constants.F_OK).then(() => true).catch(() => false);
            if (fileExists) {
              dataUrl = 'file:///' + fullImagePath.replace(/\\/g, '/');
              isPlaceholder = false;
            } else {
              console.warn(`[PDF Generator] Missing screenshot file at path: ${fullImagePath}`);
            }
          } catch (fileErr) {
            console.error(`[PDF Generator] Failed to verify screenshot existence ${d.screenshot}:`, fileErr.message);
          }
        }

        let targetWidth = 718;
        let targetHeight = 449; // Default to aspect ratio of 1280x800 viewport

        if (!isPlaceholder && d.screenshot) {
          const fullImagePath = path.join(screenshotsDir, d.screenshot);
          const extension = path.extname(d.screenshot).toLowerCase();
          
          let dimensions = null;
          try {
            if (extension === '.png') {
              dimensions = getPngDimensions(fullImagePath);
            } else if (extension === '.jpg' || extension === '.jpeg') {
              dimensions = getJpgDimensions(fullImagePath);
            }
          } catch (dimErr) {
            console.warn(`[PDF Generator] Failed to get dimensions for screenshot ${d.screenshot} (corrupted or missing header), using fallback defaults:`, dimErr.message);
          }

          if (dimensions) {
            const originalWidth = dimensions.width;
            const originalHeight = dimensions.height;

            // Bounding box at 96 DPI: width ~ 718px, height ~ 907px
            const maxWidth = 718;
            const maxHeight = 907;

            const scaleX = maxWidth / originalWidth;
            const scaleY = maxHeight / originalHeight;
            let scale = Math.min(scaleX, scaleY, 1.0);

            // If the image is very tall, the width becomes extremely narrow.
            // Ensure a minimum target width (e.g. 380px) so the screenshot is readable.
            const minReadableWidth = Math.min(380, originalWidth, maxWidth);
            if (originalWidth * scale < minReadableWidth) {
              scale = minReadableWidth / originalWidth;
            }

            targetWidth = Math.round(originalWidth * scale);
            targetHeight = Math.round(originalHeight * scale);
          }
        }

        reportHtml += `
          <div class="screenshot-section">
            <div class="screenshot-header">${embeddedCount + 1}. Capture Screenshot: ${d.name} (${d.url})</div>
            <div class="screenshot-img-container-full">
              <img class="screenshot-img-full" src="${dataUrl}" style="width: ${targetWidth}px; height: ${targetHeight}px;" />
            </div>
          </div>
        `;
        embeddedCount++;
      }
    }

    reportHtml += `
    </body>
    </html>
    `;

    const tempHtmlPath = pdfPath.replace(/\.pdf$/i, '.html');
    await fs.promises.writeFile(tempHtmlPath, reportHtml, 'utf8');
    try {
      const pageUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
      
      console.log('[Puppeteer PDF] Navigating to pageUrl...');
      const startTimeGoto = Date.now();
      await pdfPage.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      console.log(`[Puppeteer PDF] Navigated to pageUrl in ${Date.now() - startTimeGoto}ms`);

      // Wait for all local images to load asynchronously (max 4-second timeout limit)
      console.log('[Puppeteer PDF] Waiting for local images to load...');
      const startTimeImages = Date.now();
      await Promise.race([
        pdfPage.evaluate(async () => {
          const imgs = Array.from(document.querySelectorAll('img'));
          await Promise.all(
            imgs.map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
                setTimeout(() => resolve(), 3000); // 3s fallback per image
              });
            })
          );
        }),
        new Promise((resolve) => setTimeout(resolve, 4000)) // 4s absolute max wait for all images
      ]);
      console.log(`[Puppeteer PDF] Images loaded/settled in ${Date.now() - startTimeImages}ms`);

      console.log('[Puppeteer PDF] Generating and writing PDF file...');
      const startTimePdf = Date.now();
      await pdfPage.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
      });
      console.log(`[Puppeteer PDF] PDF rendered and written to disk in ${Date.now() - startTimePdf}ms`);
    } finally {
      const tempExists = await fs.promises.access(tempHtmlPath, fs.constants.F_OK).then(() => true).catch(() => false);
      if (tempExists) {
        try {
          const startTimeUnlink = Date.now();
          await fs.promises.unlink(tempHtmlPath);
          console.log(`[PDF Generator] Unlinked temporary HTML file in ${Date.now() - startTimeUnlink}ms`);
        } catch (_) {}
      }
    }

  } catch (err) {
    console.error('Error rendering report PDF:', err);
  } finally {
    if (pdfPage) {
      try {
        const startTimeClose = Date.now();
        await pdfPage.close();
        console.log(`[PDF Generator] Closed pdfPage context in ${Date.now() - startTimeClose}ms`);
      } catch (_) {}
    }
    if (pdfBrowser) {
      try {
        const startTimeCloseBrowser = Date.now();
        await pdfBrowser.close();
        console.log(`[PDF Generator] Closed dedicated server browser in ${Date.now() - startTimeCloseBrowser}ms`);
      } catch (_) {}
    }
  }
}

