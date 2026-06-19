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
