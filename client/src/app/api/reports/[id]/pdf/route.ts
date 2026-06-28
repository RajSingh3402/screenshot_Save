import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { reportsDir } from '@/lib/services/screenshotService';

/**
 * GET /api/reports/[id]/pdf
 * Streams/downloads the physical PDF file associated with a report ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const reportId = BigInt(resolvedParams.id);

    console.log(`[Next.js PDF] [START] Request for Report ID: ${reportId}`);
    const requestStartTime = Date.now();

    console.log(`[Next.js PDF] [DB Query] Fetching report meta...`);
    const dbMetaStartTime = Date.now();
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });
    console.log(`[Next.js PDF] [DB Query] Fetched report meta in ${Date.now() - dbMetaStartTime}ms`);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const filePath = path.join(reportsDir, report.file);
    if (!fs.existsSync(filePath)) {
      const serverFilePath = path.join('c:\\screenshot_project\\server\\public\\reports', report.file);
      if (fs.existsSync(serverFilePath)) {
        try {
          if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
          }
          console.log(`[Next.js PDF] Copying report file on demand from server...`);
          fs.copyFileSync(serverFilePath, filePath);
        } catch (e) {
          console.error(`Failed to copy report file on demand:`, e);
        }
      }
    }

    // On-Demand Fallback: If the file is still missing on disk, generate it locally
    if (!fs.existsSync(filePath)) {
      try {
        console.log(`[Next.js PDF] Generating PDF report locally for ID: ${reportId}`);
        
        // Fetch report details from database
        console.log(`[Next.js PDF] [DB Query] Fetching report details...`);
        const dbDetailsStartTime = Date.now();
        const reportWithDetails = await prisma.report.findUnique({
          where: { id: reportId },
          include: { details: true },
        });
        console.log(`[Next.js PDF] [DB Query] Fetched details in ${Date.now() - dbDetailsStartTime}ms`);

        if (!reportWithDetails) {
          return NextResponse.json({ error: 'Report not found in database' }, { status: 404 });
        }

        // Map database details to the structure expected by generatePdfReport
        const reportDetails = reportWithDetails.details.map((d) => ({
          id: d.websiteId,
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

        const dateObj = new Date(Number(reportWithDetails.id));
        const dateStr = reportWithDetails.date || dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = reportWithDetails.time || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // Ensure reportsDir exists
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }

        const { generatePdfReport } = await import('@/lib/services/pdfService');
        const { screenshotsDir } = await import('@/lib/services/screenshotService');

        await generatePdfReport({
          reportDetails,
          successCount: reportWithDetails.success,
          failedCount: reportWithDetails.failed,
          activeSitesCount: reportWithDetails.total,
          triggerName: 'On-Demand Recovery',
          dateStr,
          timeStr,
          pdfPath: filePath,
          screenshotsDir,
        });

        console.log(`[Next.js PDF] Successfully generated PDF report locally: ${filePath}`);
      } catch (genErr: any) {
        console.error(`[Next.js PDF] Failed to generate PDF locally for ID ${reportId}:`, genErr);
        console.error(genErr.stack);
        return NextResponse.json({
          error: genErr.message || String(genErr),
          stack: genErr.stack || '',
        }, { status: 500 });
      }
    }

    console.log(`[Next.js PDF] Verifying physical file existence: ${filePath}`);
    const fileExists = await fs.promises.access(filePath, fs.constants.F_OK).then(() => true).catch(() => false);
    if (!fileExists) {
      return NextResponse.json({ error: 'Report file not found on disk' }, { status: 404 });
    }

    console.log(`[Next.js PDF] [File Read] Reading report file buffer...`);
    const readStartTime = Date.now();
    const fileBuffer = await fs.promises.readFile(filePath);
    console.log(`[Next.js PDF] [File Read] Read buffer in ${Date.now() - readStartTime}ms`);

    console.log(`[Next.js PDF] [COMPLETE] Request served in ${Date.now() - requestStartTime}ms`);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.file}"`,
      },
    });
  } catch (err) {
    console.error('Error in GET /api/reports/:id/pdf:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
