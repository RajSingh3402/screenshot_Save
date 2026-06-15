import { prisma } from './prisma';
import { normalizeUrl } from './url';
import type {
  Report,
  ReportDetail,
  Settings,
  User,
  Website,
} from './types';

/* ─── Websites ───────────────────────────────────────── */

function toWebsite(row: {
  id: bigint;
  name: string;
  url: string;
  status: string;
  lastStatus: string | null;
  lastCapture: string | null;
  error: string | null;
  lastCaptureImage: string | null;
}): Website {
  return {
    id: Number(row.id),
    name: row.name,
    url: row.url,
    status: row.status as Website['status'],
    lastStatus: row.lastStatus as Website['lastStatus'],
    lastCapture: row.lastCapture,
    error: row.error,
    lastCaptureImage: row.lastCaptureImage,
  };
}

export async function getWebsites(): Promise<Website[]> {
  const rows = await prisma.website.findMany({ orderBy: { id: 'desc' } });
  return rows.map(toWebsite);
}

export async function getWebsiteById(id: number | string): Promise<Website | null> {
  const row = await prisma.website.findUnique({ where: { id: BigInt(id) } });
  return row ? toWebsite(row) : null;
}

export interface NewWebsiteInput {
  id: number;
  name: string;
  url: string;
  status?: Website['status'];
  lastStatus?: Website['lastStatus'];
  lastCapture?: string | null;
  error?: string | null;
  lastCaptureImage?: string | null;
}

export async function createWebsite(site: NewWebsiteInput): Promise<Website> {
  const created = await prisma.website.create({
    data: {
      id: BigInt(site.id),
      name: site.name,
      url: site.url,
      status: site.status ?? 'active',
      lastStatus: site.lastStatus ?? null,
      lastCapture: site.lastCapture ?? null,
      error: site.error ?? null,
      lastCaptureImage: site.lastCaptureImage ?? null,
    },
  });
  return toWebsite(created);
}

const WEBSITE_FIELDS = [
  'name',
  'url',
  'status',
  'lastStatus',
  'lastCapture',
  'error',
  'lastCaptureImage',
] as const;

export async function updateWebsite(
  id: number | string,
  fields: Partial<Omit<Website, 'id'>>,
): Promise<Website> {
  const data: Record<string, unknown> = {};
  for (const key of WEBSITE_FIELDS) {
    if (fields[key] !== undefined) data[key] = fields[key];
  }
  const updated = await prisma.website.update({ where: { id: BigInt(id) }, data });
  return toWebsite(updated);
}

export async function deleteWebsite(id: number | string): Promise<void> {
  await prisma.website.delete({ where: { id: BigInt(id) } });
}

export async function deleteAllWebsites(): Promise<void> {
  await prisma.website.deleteMany({});
}

export async function bulkInsertWebsites(sites: NewWebsiteInput[]): Promise<void> {
  if (!sites.length) return;
  await prisma.website.createMany({
    data: sites.map((s) => ({
      id: BigInt(s.id),
      name: s.name,
      url: normalizeUrl(s.url),
      status: s.status ?? 'active',
      lastStatus: s.lastStatus ?? 'success',
      lastCapture: s.lastCapture ?? '-',
      error: s.error ?? null,
      lastCaptureImage: s.lastCaptureImage ?? null,
    })),
  });
}

/* ─── Reports ────────────────────────────────────────── */

type ReportRow = {
  id: bigint;
  date: string;
  time: string;
  total: number;
  success: number;
  failed: number;
  file: string;
  details: {
    websiteId: bigint;
    name: string;
    url: string;
    status: string;
    loadTime: number | null;
    error: string | null;
    screenshot: string | null;
  }[];
};

function mapReport(r: ReportRow): Report {
  return {
    id: Number(r.id),
    date: r.date,
    time: r.time,
    total: r.total,
    success: r.success,
    failed: r.failed,
    file: r.file,
    details: r.details.map(
      (d): ReportDetail => ({
        id: Number(d.websiteId),
        name: d.name,
        url: d.url,
        status: d.status as ReportDetail['status'],
        loadTime: d.loadTime,
        error: d.error,
        screenshot: d.screenshot,
      }),
    ),
  };
}

export async function getReports(): Promise<Report[]> {
  const reports = await prisma.report.findMany({
    orderBy: { id: 'desc' },
    include: { details: true },
  });
  return reports.map(mapReport);
}

export async function getReportById(id: number | string): Promise<Report | null> {
  const report = await prisma.report.findUnique({
    where: { id: BigInt(id) },
    include: { details: true },
  });
  return report ? mapReport(report) : null;
}

export async function createReport(report: Report): Promise<void> {
  await prisma.report.create({
    data: {
      id: BigInt(report.id),
      date: report.date,
      time: report.time,
      total: report.total,
      success: report.success,
      failed: report.failed,
      file: report.file,
      details: {
        create: report.details.map((d) => ({
          websiteId: BigInt(d.id),
          name: d.name,
          url: d.url,
          status: d.status,
          loadTime: d.loadTime ?? null,
          error: d.error ?? null,
          screenshot: d.screenshot ?? null,
        })),
      },
    },
  });
}

/* ─── Users ──────────────────────────────────────────── */

export async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users.map((u) => ({ ...u, id: Number(u.id) }));
}

export interface NewUserInput {
  id: number;
  name: string;
  email: string;
  role?: string;
  status?: string;
  created: string;
}

export async function createUser(user: NewUserInput): Promise<User> {
  const created = await prisma.user.create({
    data: {
      id: BigInt(user.id),
      name: user.name,
      email: user.email,
      role: user.role || 'Viewer',
      status: user.status || 'active',
      created: user.created,
    },
  });
  return { ...created, id: Number(created.id) };
}

export async function deleteUser(id: number | string): Promise<void> {
  await prisma.user.delete({ where: { id: BigInt(id) } });
}

/* ─── Settings ───────────────────────────────────────── */

export async function getSettings(): Promise<Settings> {
  const [schedules, recipients, smtpRow] = await Promise.all([
    prisma.schedule.findMany(),
    prisma.emailRecipient.findMany(),
    prisma.smtpSetting.findUnique({ where: { id: 1 } }),
  ]);

  return {
    schedules: schedules.map((s) => ({
      id: Number(s.id),
      time: s.time,
      enabled: Boolean(s.enabled),
    })),
    recipients: recipients.map((r) => ({ id: Number(r.id), email: r.email })),
    smtp: {
      host: smtpRow?.host || '',
      port: smtpRow?.port || '',
      user: smtpRow?.user || '',
      pass: smtpRow?.pass || '',
    },
  };
}

export async function updateSettings(body: Partial<Settings>): Promise<Settings> {
  await prisma.$transaction(async (tx) => {
    if (body.schedules !== undefined) {
      await tx.schedule.deleteMany({});
      if (body.schedules.length) {
        await tx.schedule.createMany({
          data: body.schedules.map((s) => ({
            id: BigInt(s.id),
            time: s.time,
            enabled: Boolean(s.enabled),
          })),
        });
      }
    }

    if (body.recipients !== undefined) {
      await tx.emailRecipient.deleteMany({});
      if (body.recipients.length) {
        await tx.emailRecipient.createMany({
          data: body.recipients.map((r) => ({ id: BigInt(r.id), email: r.email })),
        });
      }
    }

    if (body.smtp !== undefined) {
      const smtp = body.smtp;
      await tx.smtpSetting.upsert({
        where: { id: 1 },
        update: { host: smtp.host || '', port: smtp.port || '', user: smtp.user || '', pass: smtp.pass || '' },
        create: { id: 1, host: smtp.host || '', port: smtp.port || '', user: smtp.user || '', pass: smtp.pass || '' },
      });
    }
  });

  return getSettings();
}
