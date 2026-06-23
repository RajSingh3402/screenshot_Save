import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Helper function to read PNG dimensions from physical file metadata
function getPngDimensions(filePath: string) {
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

export async function generatePdfReport({
  reportDetails,
  successCount,
  failedCount,
  activeSitesCount,
  triggerName,
  dateStr,
  timeStr,
  pdfPath,
  screenshotsDir,
}: {
  reportDetails: any[];
  successCount: number;
  failedCount: number;
  activeSitesCount: number;
  triggerName: string;
  dateStr: string;
  timeStr: string;
  pdfPath: string;
  screenshotsDir: string;
}): Promise<void> {
  let pdfBrowser;
  try {
    pdfBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const pdfPage = await pdfBrowser.newPage();

    const sslAlerts = reportDetails.filter((d) => d.ssl && d.ssl.warning).length;
    const domainAlerts = reportDetails.filter((d) => d.domain && d.domain.warning).length;
    const malwareAlerts = reportDetails.filter(
      (d) =>
        d.malware &&
        (d.malware.safeBrowsingStatus !== 'Safe' ||
          d.malware.malwareStatus !== 'Clean' ||
          d.malware.phishingStatus !== 'Clean' ||
          d.malware.blacklistStatus !== 'Clean')
    ).length;

    // Collect individual alerts to display in the Alerts Section
    const activeAlertList: string[] = [];
    reportDetails.forEach((d) => {
      if (d.status !== 'success') {
        activeAlertList.push(
          `🔴 Website Offline: <strong>${d.name}</strong> (${d.url}) - Error: ${
            d.error || 'Connection Failed'
          }`
        );
      }
      if (d.ssl && d.ssl.warning) {
        if (d.ssl.status === 'No SSL (HTTP)') {
          activeAlertList.push(`⚠️ No SSL (HTTP) for <strong>${d.name}</strong> (${d.url})`);
        } else {
          activeAlertList.push(
            `⚠️ SSL Expiry Warning: <strong>${d.name}</strong> (${d.url}) - Status: ${
              d.ssl.status
            }, Expiry in ${d.ssl.daysRemaining !== null ? d.ssl.daysRemaining : 'unknown'} days (${
              d.ssl.expiryDate ? new Date(d.ssl.expiryDate).toLocaleDateString('en-GB') : 'N/A'
            })`
          );
        }
      }
      if (d.domain && d.domain.warning) {
        activeAlertList.push(
          `⚠️ Domain Expiry Warning: <strong>${d.name}</strong> - Expiry in ${
            d.domain.daysRemaining !== null ? d.domain.daysRemaining : 'unknown'
          } days (${d.domain.expiryDate ? new Date(d.domain.expiryDate).toLocaleDateString('en-GB') : 'N/A'})`
        );
      }
      if (
        d.malware &&
        (d.malware.safeBrowsingStatus !== 'Safe' ||
          d.malware.malwareStatus !== 'Clean' ||
          d.malware.phishingStatus !== 'Clean' ||
          d.malware.blacklistStatus !== 'Clean')
      ) {
        activeAlertList.push(
          `🚨 Security Threat: <strong>${d.name}</strong> (${d.url}) - Safe Browsing: <span style="color:red;font-weight:bold">${
            d.malware.safeBrowsingStatus
          }</span>, Malware: <span style="color:red;font-weight:bold">${
            d.malware.malwareStatus
          }</span>, Phishing: <span style="color:red;font-weight:bold">${
            d.malware.phishingStatus
          }</span>, Blacklist: <span style="color:red;font-weight:bold">${d.malware.blacklistStatus}</span>`
        );
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
        ${
          activeAlertList.length === 0
            ? `<p style="margin:0; font-size:11px; color:#166534">No active threat, SSL certificate, or domain expiry alerts detected for all monitored websites.</p>`
            : `<ul>${activeAlertList.map((a) => `<li>${a}</li>`).join('')}</ul>`
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
          ${reportDetails
            .map(
              (d) => `
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
          `
            )
            .join('')}
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
          ${reportDetails
            .map((d) => {
              const ssl = d.ssl || { status: 'Unknown', expiryDate: null, daysRemaining: null, warning: false };
              const expiryFmt = ssl.expiryDate
                ? new Date(ssl.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A';
              const daysLeft = ssl.daysRemaining !== null ? `${ssl.daysRemaining} days` : 'N/A';
              return `
              <tr>
                <td style="color: #4b5563;">${d.url}</td>
                <td>
                  <span class="badge ${
                    ssl.status === 'Valid'
                      ? 'badge-success'
                      : ssl.status === 'No SSL (HTTP)'
                      ? 'badge-neutral'
                      : 'badge-danger'
                  }">
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
            })
            .join('')}
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
          ${reportDetails
            .map((d) => {
              const dom = d.domain || { expiryDate: null, daysRemaining: null, warning: false };
              const expiryFmt = dom.expiryDate
                ? new Date(dom.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A';
              const daysLeft = dom.daysRemaining !== null ? `${dom.daysRemaining} days` : 'N/A';
              let domainName = d.name;
              try {
                domainName = d.url ? new URL(d.url).hostname.replace('www.', '') : d.name;
              } catch (_) {}
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
            })
            .join('')}
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
          ${reportDetails
            .map((d) => {
              const mal = d.malware || {
                safeBrowsingStatus: 'Unknown',
                malwareStatus: 'Unknown',
                phishingStatus: 'Unknown',
                blacklistStatus: 'Unknown',
              };
              const sbBadge = mal.safeBrowsingStatus === 'Safe' ? 'badge-success' : 'badge-danger';
              const mwBadge = mal.malwareStatus === 'Clean' ? 'badge-success' : 'badge-danger';
              const phBadge = mal.phishingStatus === 'Clean' ? 'badge-success' : 'badge-danger';
              const blBadge = mal.blacklistStatus === 'Clean' ? 'badge-success' : 'badge-danger';
              let domainName = d.name;
              try {
                domainName = d.url ? new URL(d.url).hostname.replace('www.', '') : d.name;
              } catch (_) {}
              return `
              <tr>
                <td><strong>${domainName}</strong></td>
                <td><span class="badge ${sbBadge}">${mal.safeBrowsingStatus}</span></td>
                <td><span class="badge ${mwBadge}">${mal.malwareStatus}</span></td>
                <td><span class="badge ${phBadge}">${mal.phishingStatus}</span></td>
                <td><span class="badge ${blBadge}">${mal.blacklistStatus}</span></td>
              </tr>
            `;
            })
            .join('')}
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
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });
  } finally {
    if (pdfBrowser) {
      await pdfBrowser.close();
    }
  }
}
