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

// Helper function to auto-scroll page to load lazy content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const maxScrolls = 80; // Limit to prevent infinite scroll hangs
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
      }, 100);
    });
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Base directory is the server project root (e.g. c:/screenshot_project/server)
const baseDir = path.resolve(__dirname, '..', '..');
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
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
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
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setDefaultNavigationTimeout(60000);
    } catch (e) {
      console.error(`Failed to create page context for ${site.name}:`, e.message);
      completedCount++;
      currentActiveCaptures = currentActiveCaptures.filter(name => name !== site.name);
      return;
    }

    let loadTime = 0;
    let siteSuccess = true;
    let siteError = null;
    let filename = `${site.id}_${timestamp}.png`;
    let screenshotPath = path.join(screenshotsDir, filename);
    const startTime = Date.now();

    try {
      const response = await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });
      
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

      // Wait for network idle to ensure resources/APIs are loaded (especially after dynamic scripts trigger)
      try {
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 });
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

      // Add a short 1.5-second stabilization buffer to let page animations/layout settle
      await new Promise(resolve => setTimeout(resolve, 1500));

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
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }
    } catch (err) {
      const currentUrl = page.url();
      if (err.message.includes('timeout') && currentUrl && currentUrl !== 'about:blank') {
        try {
          console.log(`Navigation timed out for ${site.name}, attempting fallback screenshot...`);
          // Try simulating interaction on timeout fallback as well
          try {
            await page.mouse.move(100, 100);
            await page.evaluate(() => {
              const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
              events.forEach(evt => {
                window.dispatchEvent(new Event(evt));
              });
            });
          } catch (e) {}
          // Wait a 3-second buffer before capture fallback screenshot
          await new Promise(resolve => setTimeout(resolve, 3000));
          // Attempt to hide common preloader/spinner elements on fallback
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
          await page.screenshot({ path: screenshotPath, fullPage: true });
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
        expectedStatus = 'Expired Alert Sent';
        alertLevel = 'Domain Expired';
        shouldSend = true;
      } else if (daysRemaining !== null && daysRemaining <= 7) {
        expectedStatus = 'Critical Sent';
        alertLevel = 'Domain Critical Warning';
        shouldSend = true;
      } else if (daysRemaining !== null && daysRemaining <= 15) {
        expectedStatus = 'Urgent Sent';
        alertLevel = 'Domain Urgent Warning';
        shouldSend = true;
      } else if (daysRemaining !== null && daysRemaining <= 30) {
        expectedStatus = 'Warning Sent';
        alertLevel = 'Domain Priority Warning';
        shouldSend = true;
      } else if (daysRemaining !== null && daysRemaining <= 60) {
        expectedStatus = 'Sent';
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

  // Close monitoring browser instance
  await browser.close();

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

  captureProgress.status = 'Generating PDF report...';
  console.log('Generating A4 PDF Report...');

  // Relaunch browser to render PDF cleanly
  let pdfBrowser;
  const pdfFilename = `WebsiteReport_${dateObj.getFullYear()}${(dateObj.getMonth()+1).toString().padStart(2,'0')}${dateObj.getDate().toString().padStart(2,'0')}_${dateObj.getHours().toString().padStart(2,'0')}${dateObj.getMinutes().toString().padStart(2,'0')}.pdf`;
  const pdfPath = path.join(reportsDir, pdfFilename);

  try {
    pdfBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const pdfPage = await pdfBrowser.newPage();

    const successPct = Math.round((successCount / activeSites.length) * 100);

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
          height: 260mm;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .screenshot-header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px;
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: bold;
          color: #374151;
          width: 100%;
          text-align: left;
        }
        .screenshot-img-container-full {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow: hidden;
        }
        .screenshot-img-full {
          display: block;
          object-fit: contain;
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
          <div class="value">${activeSites.length}</div>
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
        {/* Alerts list */}
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

    // Embed base64-encoded screenshots for A4 printing PDF safely without relative URL issues
    let embeddedCount = 0;
    for (let i = 0; i < reportDetails.length; i++) {
      const d = reportDetails[i];
      if (d && d.status === 'success' && d.screenshot) {
        const fullImagePath = path.join(screenshotsDir, d.screenshot);
        if (fs.existsSync(fullImagePath)) {
          const base64Image = fs.readFileSync(fullImagePath).toString('base64');
          
          let targetWidth = 718;
          let targetHeight = 907;
          try {
            const dimensions = getPngDimensions(fullImagePath);
            const originalWidth = dimensions.width;
            const originalHeight = dimensions.height;
            
            // Bounding box at 96 DPI: width ~ 718px, height ~ 907px
            const maxWidth = 718;
            const maxHeight = 907;
            
            const scaleX = maxWidth / originalWidth;
            const scaleY = maxHeight / originalHeight;
            const scale = Math.min(scaleX, scaleY, 1.0);
            
            targetWidth = Math.round(originalWidth * scale);
            targetHeight = Math.round(originalHeight * scale);
          } catch (dimErr) {
            console.error(`Failed to read dimensions for screenshot ${d.screenshot}:`, dimErr);
          }

          reportHtml += `
            <div class="screenshot-section">
              <div class="screenshot-header">${embeddedCount + 1}. Capture Screenshot: ${d.name} (${d.url})</div>
              <div class="screenshot-img-container-full">
                <img class="screenshot-img-full" src="data:image/png;base64,${base64Image}" style="width: ${targetWidth}px; height: ${targetHeight}px;" />
              </div>
            </div>
          `;
          embeddedCount++;
        }
      }
    }

    reportHtml += `
    </body>
    </html>
    `;

    await pdfPage.setContent(reportHtml, { waitUntil: 'load' });
    await pdfPage.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

  } catch (err) {
    console.error('Error rendering report PDF:', err);
  } finally {
    if (pdfBrowser) await pdfBrowser.close();
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

  await sendEmailNotification(settings, newReport, pdfPath);

  captureProgress = {
    active: false,
    status: 'Completed successfully!',
    current: 0,
    total: 0
  };
  console.log('Capture session completed successfully.');
}
