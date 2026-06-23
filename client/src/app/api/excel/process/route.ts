import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { verifyAuth } from '@/lib/auth';
import { parseExcelBuffer } from '@/lib/utils/excelParser';
import { checkUrlStatus } from '@/lib/utils/urlFetcher';

/**
 * POST /api/excel/process
 * Parses Excel list of sites and streams ping validation progress via NDJSON.
 * Requires Editor or Admin role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json();
    const { file, fileName, demo } = body;
    let buffer: Buffer;

    if (demo) {
      const mockPaths = [
        path.join(process.cwd(), '..', 'mock_websites.xlsx'),
        path.join(process.cwd(), 'mock_websites.xlsx'),
      ];

      const mockPath = mockPaths.find((p) => fs.existsSync(p));
      if (mockPath) {
        buffer = fs.readFileSync(mockPath);
      } else {
        // Fallback workbook generation
        const data = [
          ['Name', 'URL'],
          ['Google India', 'https://www.google.co.in/'],
          ['Squarespace Main', 'https://www.squarespace.com/'],
          ['AI Studio', 'https://aistudio.google.com/'],
          ['Broken Site Test', 'https://this-url-is-definitely-broken-and-will-fail-12345.org/'],
          ['HTTP Status 404', 'https://httpstat.us/404'],
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');
        buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      }
    } else {
      if (!file) {
        return NextResponse.json({ error: 'No Excel file provided' }, { status: 400 });
      }

      try {
        buffer = Buffer.from(file, 'base64');
      } catch (e) {
        return NextResponse.json({ error: 'Invalid base64 file coding' }, { status: 400 });
      }

      if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Excel file exceeds 5MB size limit' }, { status: 400 });
      }
    }

    let parsedRows = [];
    try {
      parsedRows = parseExcelBuffer(buffer);
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to parse Excel: ${e.message}` }, { status: 400 });
    }

    if (parsedRows.length === 0) {
      return NextResponse.json({ error: 'No valid rows found in Excel file' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initialize stream
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: 'init', total: parsedRows.length }) + '\n')
          );

          const batchSize = 15;
          const results: any[] = [];
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
                statusCode: null as number | null,
                responseTime: 0,
                pageTitle: null as string | null,
                error: 'No URL specified',
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
                error: checkResult.error,
              };

              return resultItem;
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            batchResults.forEach((r) => {
              if (r.status === 'success') successCount++;
              else failedCount++;
            });

            // Enqueue batch results
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: 'progress',
                  current: results.length,
                  total: parsedRows.length,
                  batch: batchResults,
                  successCount,
                  failedCount,
                }) + '\n'
              )
            );

            // Small breathing room between batches to prevent event loop starvation
            await new Promise((r) => setTimeout(r, 100));
          }

          // Complete stream
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: 'complete',
                total: parsedRows.length,
                successCount,
                failedCount,
                data: results,
              }) + '\n'
            )
          );
        } catch (streamErr: any) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: 'error', error: streamErr.message || 'Stream processing error' }) + '\n'
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('Error processing Excel:', err);
    return NextResponse.json({ error: err.message || 'Failed to process Excel file' }, { status: 500 });
  }
}
