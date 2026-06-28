import { prisma } from './src/lib/prisma.js';

async function run() {
  try {
    const smtpConfigs = await prisma.smtpConfig.findMany();
    console.log('=== SMTP CONFIGS ===');
    console.log(smtpConfigs);

    const smtpSettings = await prisma.smtpSetting.findMany();
    console.log('=== SMTP SETTINGS ===');
    console.log(smtpSettings);
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
