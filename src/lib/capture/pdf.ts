import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import type { ReportDetail } from '../types';

export interface PdfReportData {
  dateStr: string;
  timeStr: string;
  triggerName: string;
  total: number;
  successCount: number;
  failedCount: number;
  details: ReportDetail[];
}

/** Build the printable HTML for the monitoring report, embedding screenshots as base64. */
function buildReportHtml(data: PdfReportData, screenshotsDir: string): string {
  const { dateStr, timeStr, triggerName, total, successCount, failedCount, details } = data;
  const successPct = Math.round((successCount / Math.max(total, 1)) * 100);

  const rows = details
    .map(
      (d) => `
        <tr>
          <td><strong>${d.name}</strong></td>
          <td style="color:#2563eb;font-size:11px;">${d.url}</td>
          <td>${d.status === 'success' ? `${d.loadTime} ms` : '-'}</td>
          <td>
            <span class="status-badge ${d.status === 'success' ? 'badge-success' : 'badge-failed'}">
              ${d.status === 'success' ? '✓ Online' : `✗ ${d.error || 'Offline'}`}
            </span>
          </td>
        </tr>`,
    )
    .join('');

  let screenshotSections = '';
  let embeddedCount = 0;
  details.forEach((d, i) => {
    if (d.status === 'success' && d.screenshot) {
      const fullImagePath = path.join(screenshotsDir, d.screenshot);
      if (fs.existsSync(fullImagePath)) {
        const base64Image = fs.readFileSync(fullImagePath).toString('base64');
        const pageBreakClass = embeddedCount % 3 === 0 ? 'page-break-before' : '';
        screenshotSections += `
          <div class="screenshot-section ${pageBreakClass}">
            <div class="screenshot-header">${i + 1}. Capture Screenshot: ${d.name} (${d.url})</div>
            <div class="screenshot-img-container">
              <img class="screenshot-img" src="data:image/png;base64,${base64Image}" />
            </div>
          </div>`;
        embeddedCount++;
      }
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Monitoring Report</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #2b2b22; background: #ffffff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e1d6; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { font-size: 24px; color: #8a7650; margin: 0; }
    .header .meta { font-size: 13px; color: #6b6452; text-align: right; }
    .summary-grid { display: flex; gap: 15px; margin-bottom: 30px; }
    .card { flex: 1; border: 1px solid #e5e1d6; border-radius: 8px; padding: 15px; text-align: center; background: #faf8f2; }
    .card .value { font-size: 26px; font-weight: bold; margin-bottom: 5px; color: #2b2b22; }
    .card.success .value { color: #5f7152; }
    .card.failed .value { color: #b4493f; }
    .card .label { font-size: 11px; color: #8a8270; text-transform: uppercase; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e1d6; font-size: 12px; }
    th { background: #f1ede2; color: #5b5443; font-weight: 600; }
    .status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
    .badge-success { background: #dde6d3; color: #41512f; }
    .badge-failed { background: #f5dcd8; color: #7e2b23; }
    .screenshot-section { page-break-inside: avoid; margin-top: 15px; }
    .page-break-before { page-break-before: always; }
    .screenshot-header { border-bottom: 1px solid #e5e1d6; padding-bottom: 5px; margin-bottom: 8px; font-size: 13px; font-weight: bold; color: #5b5443; }
    .screenshot-img-container { text-align: center; border: 1px solid #e5e1d6; border-radius: 6px; padding: 6px; background: #faf8f2; }
    .screenshot-img { max-width: 100%; max-height: 250px; object-fit: contain; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>SiteWatch Portal Report</h1>
      <p style="margin:4px 0 0 0;font-size:12px;color:#8a8270;">Automated Website Health Check</p>
    </div>
    <div class="meta">
      <div><strong>Date:</strong> ${dateStr}</div>
      <div><strong>Time:</strong> ${timeStr}</div>
      <div><strong>Trigger:</strong> ${triggerName}</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="card"><div class="value">${total}</div><div class="label">Total Monitored</div></div>
    <div class="card success"><div class="value">${successCount}</div><div class="label">Success (Online)</div></div>
    <div class="card failed"><div class="value">${failedCount}</div><div class="label">Failed (Offline)</div></div>
    <div class="card" style="border-top:3px solid #8a7650;"><div class="value" style="color:#8a7650;">${successPct}%</div><div class="label">Availability</div></div>
  </div>

  <h2>Websites Status Overview</h2>
  <table>
    <thead>
      <tr><th>Website Name</th><th>Target URL</th><th>Response Time</th><th>Status Check</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  ${screenshotSections}
</body>
</html>`;
}

/** Render the report HTML to a PDF file on disk. */
export async function renderReportPdf(
  data: PdfReportData,
  screenshotsDir: string,
  pdfPath: string,
): Promise<void> {
  let pdfBrowser;
  try {
    pdfBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const pdfPage = await pdfBrowser.newPage();
    await pdfPage.setContent(buildReportHtml(data, screenshotsDir), { waitUntil: 'load' });
    await pdfPage.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });
  } catch (err) {
    console.error('[pdf] Error rendering report PDF:', err);
  } finally {
    await pdfBrowser?.close();
  }
}
