import fs from 'fs';
import path from 'path';
import * as dbService from '../services/db.service.js';
import { reportsDir } from '../services/capture.service.js';

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
      return res.status(404).json({ error: 'Report file not found on disk' });
    }
    res.download(filePath, report.file);
  } catch (err) {
    console.error('Error in GET /api/reports/:id/pdf:', err);
    res.status(500).json({ error: 'Internal server error' });
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

