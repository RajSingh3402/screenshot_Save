import fs from 'fs';
import path from 'path';
import * as dbService from '../services/db.service.js';
import { reportsDir, generatePdfReport, screenshotsDir } from '../services/capture.service.js';

export async function getReports(req, res) {
  try {
    const reports = await dbService.getReports();
    res.json(reports);
  } catch (err) {
    console.error('Error in GET /api/reports:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getReportPdf(req, res) {
  try {
    const report = await dbService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const filePath = path.join(reportsDir, report.file);
    if (!fs.existsSync(filePath)) {
      console.log(`[On-Demand PDF] Generating PDF report for ID: ${report.id} since it is missing on disk.`);
      
      // Map database details to the structure expected by generatePdfReport
      const reportDetails = report.details.map((d) => ({
        id: d.id,
        name: d.name,
        url: d.url,
        status: d.status,
        loadTime: d.loadTime,
        error: d.error,
        screenshot: d.screenshot,
        // Fallback default values
        ssl: { status: 'Secure', expiryDate: null, daysRemaining: null, warning: false },
        domain: { expiryDate: null, daysRemaining: null, warning: false },
        malware: { safeBrowsingStatus: 'Safe', malwareStatus: 'Clean', phishingStatus: 'Clean', blacklistStatus: 'Clean' }
      }));

      const dateObj = new Date(Number(report.id));
      const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      await generatePdfReport({
        reportDetails,
        successCount: report.success,
        failedCount: report.failed,
        activeSitesCount: report.total,
        triggerName: 'On-Demand Recovery',
        dateStr: report.date || dateStr,
        timeStr: report.time || timeStr,
        pdfPath: filePath,
        screenshotsDir
      });
      
      console.log(`[On-Demand PDF] Successfully generated PDF file on disk: ${filePath}`);
    }
    res.download(filePath, report.file);
  } catch (err) {
    console.error('Error in GET /api/reports/:id/pdf:', err);
    res.status(500).json({ error: `Failed to retrieve or generate PDF report: ${err.message || err}` });
  }
}

export async function deleteAllReports(req, res) {
  try {
    // Delete database records
    await dbService.deleteAllReports();

    // Clean up physical PDF files
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir);
      for (const file of files) {
        if (file.endsWith('.pdf')) {
          try {
            fs.unlinkSync(path.join(reportsDir, file));
          } catch (e) {
            console.error(`Failed to delete report file ${file}:`, e);
          }
        }
      }
    }

    res.json({ message: 'All reports deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/reports:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

