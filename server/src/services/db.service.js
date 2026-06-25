import { prisma, sanitize } from '../lib/prisma.ts';

export async function initDb() {
  try {
    await prisma.$connect();
    console.log('Prisma Database connection initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database connection via Prisma:', err.message);
  }
}

/* ─── Websites CRUD Methods ──────────────────────────── */

export async function getWebsites() {
  const rows = await prisma.website.findMany({
    orderBy: { id: 'desc' }
  });
  return sanitize(rows);
}

export async function getWebsiteById(id) {
  const row = await prisma.website.findUnique({
    where: { id: BigInt(id) }
  });
  return sanitize(row);
}

export async function createWebsite(site) {
  const created = await prisma.website.create({
    data: {
      id: BigInt(site.id),
      name: site.name,
      url: site.url,
      status: site.status || 'active',
      lastStatus: site.lastStatus || null,
      lastCapture: site.lastCapture || null,
      error: site.error || null,
      lastCaptureImage: site.lastCaptureImage || null,
      alertEmail: site.alertEmail || null,
      emailStatus: site.emailStatus || 'No Alert',
      lastAlertSentAt: site.lastAlertSentAt ? new Date(site.lastAlertSentAt) : null,
      domainEmailStatus: site.domainEmailStatus || 'No Alert',
      lastDomainAlertSentAt: site.lastDomainAlertSentAt ? new Date(site.lastDomainAlertSentAt) : null
    }
  });
  return sanitize(created);
}

export async function updateWebsite(id, fields) {
  const allowedFields = [
    'name', 'url', 'status', 'lastStatus', 'lastCapture', 'error', 'lastCaptureImage',
    'alertEmail', 'emailStatus', 'lastAlertSentAt', 'domainEmailStatus', 'lastDomainAlertSentAt'
  ];
  const data = {};
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      data[key] = fields[key];
    }
  }
  if (data.lastAlertSentAt !== undefined && data.lastAlertSentAt !== null) {
    data.lastAlertSentAt = new Date(data.lastAlertSentAt);
  }
  if (data.lastDomainAlertSentAt !== undefined && data.lastDomainAlertSentAt !== null) {
    data.lastDomainAlertSentAt = new Date(data.lastDomainAlertSentAt);
  }
  const updated = await prisma.website.update({
    where: { id: BigInt(id) },
    data
  });
  return sanitize(updated);
}

export async function deleteWebsite(id) {
  await prisma.website.delete({
    where: { id: BigInt(id) }
  });
}

export async function deleteAllWebsites() {
  await prisma.website.deleteMany({});
}

export async function bulkInsertWebsites(sites) {
  if (!sites || sites.length === 0) return [];
  const data = sites.map(s => ({
    id: BigInt(s.id),
    name: s.name,
    url: s.url,
    status: s.status || 'active',
    lastStatus: s.lastStatus || null,
    lastCapture: s.lastCapture || null,
    error: s.error || null,
    lastCaptureImage: s.lastCaptureImage || null,
    alertEmail: s.alertEmail || null,
    emailStatus: s.emailStatus || 'No Alert',
    lastAlertSentAt: s.lastAlertSentAt ? new Date(s.lastAlertSentAt) : null,
    domainEmailStatus: s.domainEmailStatus || 'No Alert',
    lastDomainAlertSentAt: s.lastDomainAlertSentAt ? new Date(s.lastDomainAlertSentAt) : null
  }));
  await prisma.website.createMany({
    data
  });
  return sanitize(sites);
}

/* ─── Reports CRUD Methods ───────────────────────────── */

export async function getReports() {
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

export async function getReportById(id) {
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

export async function createReport(report) {
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

export async function deleteAllReports() {
  await prisma.report.deleteMany({});
}


/* ─── Users CRUD Methods ─────────────────────────────── */

export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' }
  });
  return sanitize(users);
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(id) }
  });
  return sanitize(user);
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });
  return sanitize(user);
}

export async function createUser(user) {
  const created = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email.toLowerCase().trim(),
      password: user.password || '',
      role: user.role || 'Viewer',
      status: user.status || 'Active'
    }
  });
  return sanitize(created);
}

export async function updateUser(id, fields) {
  const allowedFields = ['name', 'email', 'role', 'status', 'password'];
  const data = {};
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      if (key === 'email') {
        data[key] = fields[key].toLowerCase().trim();
      } else {
        data[key] = fields[key];
      }
    }
  }
  const updated = await prisma.user.update({
    where: { id: BigInt(id) },
    data
  });
  return sanitize(updated);
}

export async function deleteUser(id) {
  await prisma.user.delete({
    where: { id: BigInt(id) }
  });
}

/* ─── Settings CRUD Methods ──────────────────────────── */

export async function getSettings() {
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

export async function updateSettings(body) {
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

/* ─── Metrics CRUD Methods ───────────────────────────── */

export async function getMetrics() {
  const rows = await prisma.metric.findMany({
    orderBy: { timestamp: 'desc' }
  });
  const websites = await prisma.website.findMany();
  const websiteMap = new Map(websites.map(w => [String(w.id), w]));
  const enriched = rows.map(r => {
    const site = websiteMap.get(String(r.websiteId));
    return {
      ...r,
      alertEmail: site ? site.alertEmail : null,
      emailStatus: site ? site.emailStatus : null,
      domainEmailStatus: site ? site.domainEmailStatus : null
    };
  });
  return sanitize(enriched);
}

export async function createMetric(metric) {
  const created = await prisma.metric.create({
    data: {
      websiteId: BigInt(metric.websiteId),
      url: metric.url,
      name: metric.name,
      timestamp: metric.timestamp || new Date(),
      status: metric.status,
      responseTime: metric.responseTime !== undefined ? metric.responseTime : null,
      sslStatus: metric.sslStatus,
      sslExpiryDate: metric.sslExpiryDate || null,
      sslDaysRemaining: metric.sslDaysRemaining !== undefined ? metric.sslDaysRemaining : null,
      sslWarning: Boolean(metric.sslWarning),
      domainExpiryDate: metric.domainExpiryDate || null,
      domainDaysRemaining: metric.domainDaysRemaining !== undefined ? metric.domainDaysRemaining : null,
      domainWarning: Boolean(metric.domainWarning),
      safeBrowsingStatus: metric.safeBrowsingStatus,
      malwareStatus: metric.malwareStatus,
      phishingStatus: metric.phishingStatus,
      blacklistStatus: metric.blacklistStatus,
      screenshotPath: metric.screenshotPath || null
    }
  });
  return sanitize(created);
}

export async function deleteAllMetrics() {
  await prisma.metric.deleteMany({});
}


