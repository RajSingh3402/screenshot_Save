import { prisma, sanitize } from '../prisma';

export async function getMetrics() {
  const rows = await prisma.metric.findMany({
    orderBy: { timestamp: 'desc' },
  });
  const websites = await prisma.website.findMany();
  const websiteMap = new Map(websites.map(w => [String(w.id), w]));
  const enriched = rows.map((r: any) => {
    const site = websiteMap.get(String(r.websiteId));
    return {
      ...r,
      alertEmail: site ? site.alertEmail : null,
      emailStatus: site ? site.emailStatus : null,
      domainEmailStatus: site ? site.domainEmailStatus : null,
    };
  });
  return sanitize(enriched);
}

export async function createMetric(metric: any) {
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
      screenshotPath: metric.screenshotPath || null,
    },
  });
  return sanitize(created);
}

export async function deleteAllMetrics() {
  await prisma.metric.deleteMany({});
}
