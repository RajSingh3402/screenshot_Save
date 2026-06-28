import { PrismaClient } from './src/generated/client/index.js';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  try {
    const websites = await prisma.website.findMany();
    // Convert BigInt to string for JSON serialization
    const serializedWebsites = websites.map(w => ({
      ...w,
      id: w.id.toString(),
    }));

    const metrics = await prisma.metric.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    const serializedMetrics = metrics.map(m => ({
      ...m,
      id: m.id,
      websiteId: m.websiteId.toString(),
    }));

    const dump = {
      websites: serializedWebsites,
      recentMetrics: serializedMetrics,
    };

    fs.writeFileSync('db_inspect.json', JSON.stringify(dump, null, 2), 'utf8');
    console.log('Database inspection successful. Dumped to db_inspect.json');
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
