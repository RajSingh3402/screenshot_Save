import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';

/**
 * Creates and returns a Nodemailer transporter using the latest SMTP configuration from the database.
 */
export async function getSmtpTransporter() {
  const config = await prisma.smtpConfig.findFirst({
    orderBy: { id: 'desc' }
  });

  if (!config) {
    throw new Error('SMTP Configuration not found in database.');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // Use SSL for port 465
    auth: {
      user: config.username,
      pass: config.password,
    },
    // Optional: add timeout to prevent hangs
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  });
}

/**
 * Verifies if the provided SMTP credentials can establish a successful connection.
 */
export async function verifySmtpConnection(host: string, port: number, username: string, password: string) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: username,
      pass: password,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  });

  await transporter.verify();
  return true;
}

/**
 * Reusable email sending method using database-configured SMTP settings.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = await getSmtpTransporter();
  const config = await prisma.smtpConfig.findFirst({
    orderBy: { id: 'desc' }
  });

  if (!config) {
    throw new Error('SMTP Configuration not found.');
  }

  // Double check connection availability
  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"SiteWatch Monitor" <${config.username}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
}
