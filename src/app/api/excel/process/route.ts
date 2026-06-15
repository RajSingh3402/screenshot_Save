import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { NextResponse } from 'next/server';
import { parseExcelBuffer } from '@/lib/excel';
import { checkUrlStatus, normalizeUrl } from '@/lib/url';
import { excelProcessSchema } from '@/lib/schemas';
import type { ExcelResultItem } from '@/lib/types';

export const runtime = 'nodejs';

const BATCH_SIZE = 15;
const MAX_BYTES = 5 * 1024 * 1024;

const DEMO_ROWS = [
  ['Name', 'URL'],
  ['Google India', 'https://www.google.co.in/'],
  ['Squarespace Main', 'https://www.squarespace.com/'],
  ['AI Studio', 'https://aistudio.google.com/'],
  ['Broken Site Test', 'https://this-url-is-definitely-broken-and-will-fail-12345.org/'],
  ['HTTP Status 404', 'https://httpstat.us/404'],
];

function demoBuffer(): Buffer {
  const mockPath = path.join(process.cwd(), 'mock_websites.xlsx');
  if (fs.existsSync(mockPath)) return fs.readFileSync(mockPath);
  const worksheet = XLSX.utils.aoa_to_sheet(DEMO_ROWS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export async function POST(req: Request) {
  let buffer: Buffer;
  try {
    const parsed = excelProcessSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { file, demo } = parsed.data;

    if (demo) {
      buffer = demoBuffer();
    } else {
      if (!file) return NextResponse.json({ error: 'No Excel file provided' }, { status: 400 });
      buffer = Buffer.from(file, 'base64');
      if (buffer.length > MAX_BYTES) {
        return NextResponse.json({ error: 'Excel file exceeds 5MB size limit' }, { status: 400 });
      }
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  let parsedRows;
  try {
    parsedRows = parseExcelBuffer(buffer);
  } catch (e) {
    return NextResponse.json({ error: `Failed to parse Excel: ${(e as Error).message}` }, { status: 400 });
  }
  if (parsedRows.length === 0) {
    return NextResponse.json({ error: 'No valid rows found in Excel file' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const total = parsedRows.length;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
      try {
        send({ type: 'init', total });

        const results: ExcelResultItem[] = [];
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < parsedRows.length; i += BATCH_SIZE) {
          const slice = parsedRows.slice(i, i + BATCH_SIZE);
          const batch = await Promise.all(
            slice.map(async (row, index): Promise<ExcelResultItem> => {
              const url = normalizeUrl(row.url);
              const check = url
                ? await checkUrlStatus(url)
                : {
                    status: 'failed' as const,
                    statusCode: null,
                    responseTime: 0,
                    pageTitle: null,
                    error: 'No URL specified',
                  };
              return { id: `${Date.now()}-${i + index}`, name: row.name, url, ...check };
            }),
          );

          results.push(...batch);
          for (const r of batch) r.status === 'success' ? successCount++ : failedCount++;

          send({ type: 'progress', current: results.length, total, batch, successCount, failedCount });
        }

        send({ type: 'complete', total, successCount, failedCount, data: results });
      } catch (err) {
        send({ type: 'error', error: (err as Error).message || 'Internal server error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
