import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { reportsDir } from '@/lib/services/screenshotService';

/**
 * GET /api/reports
 * Fetches all reports with detailed website metrics.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Sync screenshots and reports from server/public to client/public if they exist
    try {
      const serverScreenshots = 'c:\\screenshot_project\\server\\public\\screenshots';
      const clientScreenshots = 'c:\\screenshot_project\\client\\public\\screenshots';
      const serverReports = 'c:\\screenshot_project\\server\\public\\reports';
      const clientReports = 'c:\\screenshot_project\\client\\public\\reports';

      const copyFiles = (src: string, dest: string) => {
        if (fs.existsSync(src)) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          const files = fs.readdirSync(src);
          for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            if (fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
              try {
                fs.copyFileSync(srcPath, destPath);
              } catch (e) {
                console.error(`Failed to sync file ${file}:`, e);
              }
            }
          }
        }
      };

      copyFiles(serverScreenshots, clientScreenshots);
      copyFiles(serverReports, clientReports);
    } catch (syncErr) {
      console.error('Asset sync error:', syncErr);
    }

    const reports = await prisma.report.findMany({
      orderBy: { id: 'desc' },
      include: {
        details: true,
      },
    });

    const serialized = reports.map((r) => ({
      id: Number(r.id),
      date: r.date,
      time: r.time,
      total: r.total,
      success: r.success,
      failed: r.failed,
      file: r.file,
      details: r.details.map((d) => ({
        id: Number(d.websiteId),
        name: d.name,
        url: d.url,
        status: d.status,
        loadTime: d.loadTime,
        error: d.error,
        screenshot: d.screenshot,
      })),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Error in GET /api/reports:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/reports
 * Purges all report records and deletes corresponding PDF report files. Requires Editor or Admin.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request, ['Editor', 'Admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    // Delete records in MySQL
    await prisma.report.deleteMany({});

    // Clean up local physical PDF files
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir);
      for (const file of files) {
        if (file.endsWith('.pdf')) {
          try {
            fs.unlinkSync(path.join(reportsDir, file));
          } catch (e) {
            console.error(`Failed to delete report PDF ${file}:`, e);
          }
        }
      }
    }

    return NextResponse.json({ message: 'All reports deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/reports:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
