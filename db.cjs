const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const fs = require('fs');
const path = require('path');

// Basic .env parser helper to load environment variables locally if dotenv isn't used
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}
loadEnv();

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT) || 3306;
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = process.env.MYSQL_DATABASE || 'sitewatch';

console.log(`Instantiating MariaDB adapter: ${user}@${host}:${port}/${database}`);

// Pass the adapter directly with config options to the PrismaClient constructor
const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 10
});
const prisma = new PrismaClient({ adapter });

// Helper to sanitize Prisma outputs by recursively converting BigInt values to JS Numbers
// to prevent JSON serialization errors (TypeError: Do not know how to serialize a BigInt)
function sanitize(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'bigint') {
    return Number(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitize);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const key of Object.keys(val)) {
      res[key] = sanitize(val[key]);
    }
    return res;
  }
  return val;
}

// Backward-compatible query helper using raw queries for safety
async function query(sql, params) {
  return sanitize(await prisma.$queryRawUnsafe(sql, ...(params || [])));
}

// Backward-compatible pool mock
const pool = {
  getConnection: async () => {
    return {
      query: async (sql, params) => query(sql, params),
      release: () => {}
    };
  },
  query: async (sql, params) => query(sql, params)
};

// Database initialization
async function initDb() {
  try {
    await prisma.$connect();
    console.log('Prisma Database connection initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database connection via Prisma:', err.message);
  }
}

/* ─── Websites CRUD Methods ──────────────────────────── */

async function getWebsites() {
  const rows = await prisma.website.findMany({
    orderBy: { id: 'desc' }
  });
  return sanitize(rows);
}

async function getWebsiteById(id) {
  const row = await prisma.website.findUnique({
    where: { id: BigInt(id) }
  });
  return sanitize(row);
}

async function createWebsite(site) {
  const created = await prisma.website.create({
    data: {
      id: BigInt(site.id),
      name: site.name,
      url: site.url,
      status: site.status || 'active',
      lastStatus: site.lastStatus || null,
      lastCapture: site.lastCapture || null,
      error: site.error || null,
      lastCaptureImage: site.lastCaptureImage || null
    }
  });
  return sanitize(created);
}

async function updateWebsite(id, fields) {
  const allowedFields = ['name', 'url', 'status', 'lastStatus', 'lastCapture', 'error', 'lastCaptureImage'];
  const data = {};
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      data[key] = fields[key];
    }
  }
  const updated = await prisma.website.update({
    where: { id: BigInt(id) },
    data
  });
  return sanitize(updated);
}

async function deleteWebsite(id) {
  await prisma.website.delete({
    where: { id: BigInt(id) }
  });
}

async function deleteAllWebsites() {
  await prisma.website.deleteMany({});
}

async function bulkInsertWebsites(sites) {
  if (!sites || sites.length === 0) return [];
  const data = sites.map(s => ({
    id: BigInt(s.id),
    name: s.name,
    url: s.url,
    status: s.status || 'active',
    lastStatus: s.lastStatus || null,
    lastCapture: s.lastCapture || null,
    error: s.error || null,
    lastCaptureImage: s.lastCaptureImage || null
  }));
  await prisma.website.createMany({
    data
  });
  return sanitize(sites);
}

/* ─── Reports CRUD Methods ───────────────────────────── */

async function getReports() {
  const reports = await prisma.report.findMany({
    orderBy: { id: 'desc' },
    include: {
      details: true
    }
  });
  
  return reports.map(r => ({
    id: Number(r.id),
    date: r.date,
    time: r.time,
    total: r.total,
    success: r.success,
    failed: r.failed,
    file: r.file,
    details: r.details.map(d => ({
      id: Number(d.websiteId),
      name: d.name,
      url: d.url,
      status: d.status,
      loadTime: d.loadTime,
      error: d.error,
      screenshot: d.screenshot
    }))
  }));
}

async function getReportById(id) {
  const report = await prisma.report.findUnique({
    where: { id: BigInt(id) },
    include: {
      details: true
    }
  });
  if (!report) return null;
  return {
    id: Number(report.id),
    date: report.date,
    time: report.time,
    total: report.total,
    success: report.success,
    failed: report.failed,
    file: report.file,
    details: report.details.map(d => ({
      id: Number(d.websiteId),
      name: d.name,
      url: d.url,
      status: d.status,
      loadTime: d.loadTime,
      error: d.error,
      screenshot: d.screenshot
    }))
  };
}

async function createReport(report) {
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
        create: (report.details || []).map(d => ({
          websiteId: BigInt(d.id),
          name: d.name,
          url: d.url,
          status: d.status,
          loadTime: d.loadTime || null,
          error: d.error || null,
          screenshot: d.screenshot || null
        }))
      }
    }
  });
}

/* ─── Users CRUD Methods ─────────────────────────────── */

async function getUsers() {
  const users = await prisma.user.findMany();
  return sanitize(users);
}

async function createUser(user) {
  const created = await prisma.user.create({
    data: {
      id: BigInt(user.id),
      name: user.name,
      email: user.email,
      role: user.role || 'Viewer',
      status: user.status || 'active',
      created: user.created
    }
  });
  return sanitize(created);
}

async function deleteUser(id) {
  await prisma.user.delete({
    where: { id: BigInt(id) }
  });
}

/* ─── Settings CRUD Methods ──────────────────────────── */

async function getSettings() {
  const [schedules, recipients, smtpRow] = await Promise.all([
    prisma.schedule.findMany(),
    prisma.emailRecipient.findMany(),
    prisma.smtpSetting.findUnique({ where: { id: 1 } })
  ]);
  
  const smtp = smtpRow || { host: '', port: '', user: '', pass: '' };
  
  return {
    schedules: schedules.map(s => ({
      id: Number(s.id),
      time: s.time,
      enabled: Boolean(s.enabled)
    })),
    recipients: recipients.map(r => ({
      id: Number(r.id),
      email: r.email
    })),
    smtp: {
      host: smtp.host || '',
      port: smtp.port || '',
      user: smtp.user || '',
      pass: smtp.pass || ''
    }
  };
}

async function updateSettings(body) {
  await prisma.$transaction(async (tx) => {
    if (body.schedules !== undefined) {
      await tx.schedule.deleteMany({});
      if (body.schedules && body.schedules.length > 0) {
        await tx.schedule.createMany({
          data: body.schedules.map(s => ({
            id: BigInt(s.id),
            time: s.time,
            enabled: Boolean(s.enabled)
          }))
        });
      }
    }
    
    if (body.recipients !== undefined) {
      await tx.emailRecipient.deleteMany({});
      if (body.recipients && body.recipients.length > 0) {
        await tx.emailRecipient.createMany({
          data: body.recipients.map(r => ({
            id: BigInt(r.id),
            email: r.email
          }))
        });
      }
    }
    
    if (body.smtp !== undefined) {
      const smtp = body.smtp || {};
      await tx.smtpSetting.upsert({
        where: { id: 1 },
        update: {
          host: smtp.host || '',
          port: smtp.port || '',
          user: smtp.user || '',
          pass: smtp.pass || ''
        },
        create: {
          id: 1,
          host: smtp.host || '',
          port: smtp.port || '',
          user: smtp.user || '',
          pass: smtp.pass || ''
        }
      });
    }
  });
  
  return await getSettings();
}

module.exports = {
  pool,
  query,
  initDb,
  getWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  deleteAllWebsites,
  bulkInsertWebsites,
  getReports,
  getReportById,
  createReport,
  getUsers,
  createUser,
  deleteUser,
  getSettings,
  updateSettings
};
