import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import { parseExcelBuffer } from '../utils/excelParser.js';
import { checkUrlStatus } from '../utils/urlFetcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function processExcel(req, res) {
  try {
    const { file, fileName, demo } = req.body;
    let buffer;

    if (demo) {
      // Look for mock workbook at project root first, then server root
      const mockPaths = [
        path.join(process.cwd(), 'mock_websites.xlsx'),
        path.join(process.cwd(), 'server', 'mock_websites.xlsx'),
        path.resolve(__dirname, '..', '..', 'mock_websites.xlsx')
      ];
      
      let mockPath = mockPaths.find(p => fs.existsSync(p));
      if (mockPath) {
        buffer = fs.readFileSync(mockPath);
      } else {
        // Fallback: generate the workbook in-memory if file is deleted
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
}
