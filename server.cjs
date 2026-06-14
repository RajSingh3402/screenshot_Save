const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const next = require('next');
const cron = require('node-cron');

// Redirect console logs to a log file for remote debugging
const logFile = path.join(__dirname, 'server_logs.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
console.log = function(...args) {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  logStream.write(`[LOG ${new Date().toLocaleTimeString()}] ${msg}\n`);
  process.stdout.write(msg + '\n');
};
console.error = function(...args) {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  logStream.write(`[ERR ${new Date().toLocaleTimeString()}] ${msg}\n`);
  process.stderr.write(msg + '\n');
};

// Excel & URL check utilities
const { parseExcelBuffer } = require('./src/utils/excelParser.cjs');
const { checkUrlStatus } = require('./src/utils/urlFetcher.cjs');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = 8080;

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Ensure public directories exist for screenshots and reports
  const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
  const reportsDir = path.join(__dirname, 'public', 'reports');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Serve screenshots and reports
  app.use('/screenshots', express.static(screenshotsDir));
  app.use('/reports', express.static(reportsDir));

// Database Helpers
const dbPath = path.join(__dirname, 'db.json');
function readDb() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error('Error reading database:', err);
    return { websites: [], reports: [], users: [], settings: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Global Capture Progress State
let captureProgress = {
  active: false,
  status: 'Idle',
  current: 0,
  total: 0
};

/* ─── API Endpoints ──────────────────────────────────── */

// Excel upload & batch verification API
app.post('/api/excel/process', async (req, res) => {
  try {
    const { file, fileName, demo } = req.body;
    let buffer;

    if (demo) {
      const mockPath = path.join(__dirname, 'mock_websites.xlsx');
      if (fs.existsSync(mockPath)) {
        buffer = fs.readFileSync(mockPath);
      } else {
        // Fallback: generate the workbook in-memory if file is deleted
        const XLSX = require('xlsx');
        const data = [
          ['Name', 'URL'],
          ['Google India', 'https://www.google.co.in/'],
          ['Squarespace Main', 'https://www.squarespace.com/'],
          ['AI Studio', 'https://aistudio.google.com/'],
          ['Broken Site Test', 'https://this-url-is-definitely-broken-and-will-fail-12345.org/'],
          ['HTTP Status 404', 'https://httpstat.us/404']
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');
        buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      }
    } else {
      if (!file) {
        return res.status(400).json({ error: 'No Excel file provided' });
      }

      // Decode base64 buffer
      try {
        buffer = Buffer.from(file, 'base64');
      } catch (e) {
        return res.status(400).json({ error: 'Invalid base64 file coding' });
      }

      // File validation: check size (5MB limit)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Excel file exceeds 5MB size limit' });
      }
    }

    // Parse Excel file
    let parsedRows = [];
    try {
      parsedRows = parseExcelBuffer(buffer);
    } catch (e) {
      return res.status(400).json({ error: `Failed to parse Excel: ${e.message}` });
    }

    if (parsedRows.length === 0) {
      return res.status(400).json({ error: 'No valid rows found in Excel file' });
    }

    // Prepare for streaming response using Ndjson
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // First send total row count
    res.write(JSON.stringify({ type: 'init', total: parsedRows.length }) + '\n');

    // Batch size of 15 for async concurrent requests
    const batchSize = 15;
    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < parsedRows.length; i += batchSize) {
      const batch = parsedRows.slice(i, i + batchSize);
      const batchPromises = batch.map(async (row, index) => {
        const rowIdx = i + index;
        let urlToCheck = row.url ? row.url.trim() : '';
        if (urlToCheck && !/^https?:\/\//i.test(urlToCheck)) {
          urlToCheck = 'https://' + urlToCheck;
        }
        
        let checkResult = {
          status: 'failed',
          statusCode: null,
          responseTime: 0,
          pageTitle: null,
          error: 'No URL specified'
        };

        if (urlToCheck) {
          checkResult = await checkUrlStatus(urlToCheck);
        }

        const resultItem = {
          id: Date.now() + '-' + rowIdx,
          name: row.name,
          url: urlToCheck,
          status: checkResult.status,
          statusCode: checkResult.statusCode,
          responseTime: checkResult.responseTime,
          pageTitle: checkResult.pageTitle,
          error: checkResult.error
        };

        return resultItem;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      batchResults.forEach(r => {
        if (r.status === 'success') successCount++;
        else failedCount++;
      });

      // Stream progress of this batch back to the client
      res.write(JSON.stringify({
        type: 'progress',
        current: results.length,
        total: parsedRows.length,
        batch: batchResults,
        successCount,
        failedCount
      }) + '\n');
    }

    // Final finish event
    res.write(JSON.stringify({
      type: 'complete',
      total: parsedRows.length,
      successCount,
      failedCount,
      data: results
    }) + '\n');
    res.end();

  } catch (error) {
    console.error('Error processing Excel:', error);
    // If headers already sent, close stream, otherwise send error response
    if (res.headersSent) {
      res.write(JSON.stringify({ type: 'error', error: error.message || 'Internal server error' }) + '\n');
      res.end();
    } else {
      res.status(500).json({ error: error.message || 'Failed to process Excel file' });
    }
  }
});

// Websites CRUD
app.get('/api/websites', (req, res) => {
  const db = readDb();
  const websites = db.websites || [];
  // Sort by id descending so that newer websites always appear at the top
  const sortedWebsites = [...websites].sort((a, b) => b.id - a.id);
  res.json(sortedWebsites);
});

app.post('/api/websites', (req, res) => {
  const db = readDb();
  let targetUrl = req.body.url ? req.body.url.trim() : '';
  if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }
  const newSite = {
    id: Date.now(),
    name: req.body.name,
    url: targetUrl,
    status: 'active',
    lastStatus: 'success',
    lastCapture: '-',
    error: null
  };
  db.websites = db.websites || [];
  db.websites.unshift(newSite); // Prepend so new website goes to the top
  writeDb(db);
  res.status(201).json(newSite);
});

app.put('/api/websites/:id', (req, res) => {
  const db = readDb();
  const siteId = req.params.id;
  const siteIndex = db.websites.findIndex(s => String(s.id) === String(siteId));
  if (siteIndex === -1) {
    return res.status(404).json({ error: 'Website not found' });
  }
  
  let targetUrl = req.body.url ? req.body.url.trim() : '';
  if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  db.websites[siteIndex] = {
    ...db.websites[siteIndex],
    ...req.body,
    ...(targetUrl ? { url: targetUrl } : {})
  };
  writeDb(db);
  res.json(db.websites[siteIndex]);
});

app.delete('/api/websites', (req, res) => {
  const db = readDb();
  db.websites = [];
  writeDb(db);
  res.json({ message: 'All websites deleted successfully' });
});

app.delete('/api/websites/:id', (req, res) => {
  const db = readDb();
  const siteId = req.params.id;
  db.websites = db.websites.filter(s => String(s.id) !== String(siteId));
  writeDb(db);
  res.json({ message: 'Website deleted successfully' });
});

app.post('/api/websites/bulk', (req, res) => {
  const db = readDb();
  db.websites = db.websites || [];
  const incoming = Array.isArray(req.body) ? req.body : [];
  const newSites = incoming.map((site, index) => {
    let targetUrl = site.url ? site.url.trim() : '';
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    return {
      id: Date.now() + index,
      name: site.name || 'Unnamed Site',
      url: targetUrl,
      status: 'active',
      lastStatus: 'success',
      lastCapture: '-',
      error: null
    };
  });
  db.websites.unshift(...newSites); // Prepend bulk websites
  writeDb(db);
  res.status(201).json(newSites);
});

// Reports API
app.get('/api/reports', (req, res) => {
  const db = readDb();
  res.json(db.reports || []);
});

app.get('/api/reports/:id/pdf', (req, res) => {
  const db = readDb();
  const report = db.reports.find(r => String(r.id) === String(req.params.id));
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  const filePath = path.join(reportsDir, report.file);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Report file not found on disk' });
  }
  res.download(filePath, report.file);
});

// Users CRUD
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json(db.users || []);
});

app.post('/api/users', (req, res) => {
  const db = readDb();
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'Viewer',
    status: 'active',
    created: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  };
  db.users = db.users || [];
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json(newUser);
});

app.delete('/api/users/:id', (req, res) => {
  const db = readDb();
  const userId = req.params.id;
  db.users = db.users.filter(u => String(u.id) !== String(userId));
  writeDb(db);
  res.json({ message: 'User removed successfully' });
});

// Settings API
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings || {});
});

app.put('/api/settings', (req, res) => {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  writeDb(db);
  res.json(db.settings);
});

// Capture Status & Trigger Endpoint
app.get('/api/capture-progress', (req, res) => {
  res.json(captureProgress);
});

app.post('/api/capture-now', async (req, res) => {
  if (captureProgress.active) {
    return res.status(409).json({ error: 'A capture session is already in progress' });
  }
  
  // Start the capture pipeline asynchronously
  runCaptureSession().catch(err => {
    console.error('Async capture session failed:', err);
    captureProgress.active = false;
    captureProgress.status = 'Error: ' + err.message;
  });
  
  res.status(202).json({ message: 'Capture session started' });
});

/* ─── Core Capture & PDF Logic ───────────────────────── */

async function runCaptureSession(triggerName = 'Manual Trigger') {
  console.log(`Starting capture session triggered by: ${triggerName}`);
  const db = readDb();
  const activeSites = (db.websites || []).filter(s => s.status === 'active');
  
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

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setDefaultNavigationTimeout(30000);

    let loadTime = 0;
    let siteSuccess = true;
    let siteError = null;
    let filename = `${site.id}_${timestamp}.png`;
    let screenshotPath = path.join(screenshotsDir, filename);
    const startTime = Date.now();

    try {
      const response = await page.goto(site.url, { waitUntil: 'load' });
      
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
        await page.screenshot({ path: screenshotPath, fullPage: false });
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
          await page.screenshot({ path: screenshotPath, fullPage: false });
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
      await page.close();
    }

    // Update website state in memory database
    const siteIndex = db.websites.findIndex(s => s.id === site.id);
    if (siteIndex !== -1) {
      db.websites[siteIndex].lastStatus = siteSuccess ? 'success' : 'failed';
      db.websites[siteIndex].lastCapture = timeStr;
      db.websites[siteIndex].error = siteSuccess ? null : siteError;
      db.websites[siteIndex].lastCaptureImage = siteSuccess ? filename : null;
    }

    reportDetails[index] = {
      id: site.id,
      name: site.name,
      url: site.url,
      status: siteSuccess ? 'success' : 'failed',
      loadTime: siteSuccess ? loadTime : null,
      error: siteSuccess ? null : siteError,
      screenshot: siteSuccess ? filename : null
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

    // Build beautiful HTML report structure
    let reportHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Monitoring Report</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1f2937; background: #ffffff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 25px; }
        .header h1 { font-size: 24px; color: #4f46e5; margin: 0; }
        .header .meta { font-size: 13px; color: #4b5563; text-align: right; }
        .summary-grid { display: flex; gap: 15px; margin-bottom: 30px; }
        .card { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; background: #f9fafb; }
        .card .value { font-size: 26px; font-weight: bold; margin-bottom: 5px; color: #111827; }
        .card.success .value { color: #10b981; }
        .card.failed .value { color: #ef4444; }
        .card .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        th { background: #f3f4f6; color: #374151; font-weight: 600; }
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-failed { background: #fee2e2; color: #991b1b; }
        .screenshot-section { page-break-inside: avoid; margin-top: 15px; }
        .page-break-before { page-break-before: always; }
        .screenshot-header { border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 8px; font-size: 13px; font-weight: bold; color: #374151; }
        .screenshot-img-container { text-align: center; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; background: #f9fafb; }
        .screenshot-img { max-width: 100%; max-height: 250px; object-fit: contain; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>SiteWatch Portal Report</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Automated Website Health Check</p>
        </div>
        <div class="meta">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Time:</strong> ${timeStr}</div>
          <div><strong>Trigger:</strong> ${triggerName}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="card">
          <div class="value">${activeSites.length}</div>
          <div class="label">Total Monitored</div>
        </div>
        <div class="card success">
          <div class="value">${successCount}</div>
          <div class="label">Success (Online)</div>
        </div>
        <div class="card failed">
          <div class="value">${failedCount}</div>
          <div class="label">Failed (Offline)</div>
        </div>
        <div class="card" style="border-top: 3px solid #4f46e5;">
          <div class="value" style="color: #4f46e5;">${successPct}%</div>
          <div class="label">Availability</div>
        </div>
      </div>

      <h2>Websites Status Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Website Name</th>
            <th>Target URL</th>
            <th>Response Time</th>
            <th>Status Check</th>
          </tr>
        </thead>
        <tbody>
          ${reportDetails.map(d => `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td style="color: #2563eb; font-size: 11px;">${d.url}</td>
              <td>${d.status === 'success' ? `${d.loadTime} ms` : '-'}</td>
              <td>
                <span class="status-badge ${d.status === 'success' ? 'badge-success' : 'badge-failed'}">
                  ${d.status === 'success' ? '✓ Online' : `✗ ${d.error || 'Offline'}`}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Embed base64-encoded screenshots for A4 printing PDF safely without relative URL issues
    let embeddedCount = 0;
    for (let i = 0; i < reportDetails.length; i++) {
      const d = reportDetails[i];
      if (d.status === 'success' && d.screenshot) {
        const fullImagePath = path.join(screenshotsDir, d.screenshot);
        if (fs.existsSync(fullImagePath)) {
          const base64Image = fs.readFileSync(fullImagePath).toString('base64');
          const pageBreakClass = (embeddedCount % 3 === 0) ? 'page-break-before' : '';
          reportHtml += `
            <div class="screenshot-section ${pageBreakClass}">
              <div class="screenshot-header">${i + 1}. Capture Screenshot: ${d.name} (${d.url})</div>
              <div class="screenshot-img-container">
                <img class="screenshot-img" src="data:image/png;base64,${base64Image}" />
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
  
  db.reports = db.reports || [];
  db.reports.unshift(newReport); // Prepend to reports
  writeDb(db);

  captureProgress.status = 'Sending email alerts...';
  console.log('Sending emails...');
  await sendEmailNotification(db.settings, newReport, pdfPath);

  captureProgress = {
    active: false,
    status: 'Completed successfully!',
    current: 0,
    total: 0
  };
  console.log('Capture session completed successfully.');
}

async function sendEmailNotification(settings, report, pdfPath) {
  const recipients = (settings.recipients || []).map(r => r.email).join(', ');
  if (!recipients) {
    console.log('No email recipients configured. Skipping notification.');
    return;
  }

  const smtp = settings.smtp || {};
  const mailOptions = {
    from: smtp.user || 'noreply@company.com',
    to: recipients,
    subject: `SiteWatch Website Monitoring Report - ${report.date} - ${report.time}`,
    text: `Hello,\n\nPlease find attached the SiteWatch Website Monitoring Report generated on ${report.date} at ${report.time}.\n\nSummary:\n- Total Websites checked: ${report.total}\n- Online: ${report.success}\n- Offline/Failed: ${report.failed}\n\nRegards,\nSiteWatch Portal`,
    attachments: [
      {
        filename: report.file,
        path: pdfPath
      }
    ]
  };

  // If host and user are set, try sending real email
  if (smtp.host && smtp.user) {
    console.log(`Attempting to send email via SMTP to ${recipients}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: parseInt(smtp.port) || 587,
        secure: parseInt(smtp.port) === 465,
        auth: {
          user: smtp.user,
          pass: smtp.pass || ''
        },
        tls: {
          rejectUnauthorized: false // avoid SSL issues with self-signed test SMTPs
        }
      });
      await transporter.sendMail(mailOptions);
      console.log('Real email notification sent successfully!');
    } catch (err) {
      console.error('SMTP sending failed (falling back to Mock Logging):', err.message);
      logMockEmail(mailOptions);
    }
  } else {
    // Graceful fallback to mock logging
    console.log('SMTP configuration incomplete. Emulating email sending (Mock Logging)...');
    logMockEmail(mailOptions);
  }
}

function logMockEmail(mailOptions) {
  const mockLogDir = path.join(__dirname, 'mock_emails');
  if (!fs.existsSync(mockLogDir)) {
    fs.mkdirSync(mockLogDir);
  }
  const emailLogFile = path.join(mockLogDir, `Email_${Date.now()}.txt`);
  const logContent = `
=== MOCK EMAIL NOTIFICATION ===
To: ${mailOptions.to}
From: ${mailOptions.from}
Subject: ${mailOptions.subject}
Body:
${mailOptions.text}
Attachment Saved: ${mailOptions.attachments[0].filename}
===============================
`;
  fs.writeFileSync(emailLogFile, logContent, 'utf8');
  console.log(`Mock email log written to ${emailLogFile}`);
}

/* ─── Background Scheduler ───────────────────────────── */

cron.schedule('* * * * *', () => {
  const db = readDb();
  if (!db.settings || !db.settings.schedules) return;

  const date = new Date();
  const currentHour = date.getHours().toString().padStart(2, '0');
  const currentMinute = date.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHour}:${currentMinute}`;

  const matchingSchedule = db.settings.schedules.find(
    s => s.enabled && s.time === currentTimeStr
  );

  // Avoid launching double captures inside the same minute by checking if already capturing
  if (matchingSchedule && !captureProgress.active) {
    console.log(`Scheduled capture time matches: ${currentTimeStr}. Launching check...`);
    runCaptureSession(`Scheduled Check (${currentTimeStr})`).catch(err => {
      console.error('Scheduled capture check failed:', err);
    });
  }
});

  // Next.js fallback request handler
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`SiteWatch backend API & server listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Error starting Next.js custom server:', err);
  process.exit(1);
});
