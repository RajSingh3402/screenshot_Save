import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import type { Report, Settings } from './types';

const MOCK_DIR = path.join(process.cwd(), 'mock_emails');

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments: { filename: string; path: string }[];
}

/**
 * Send the monitoring report by email. Falls back to writing a mock email file
 * to `mock_emails/` when SMTP is not configured or sending fails.
 */
export async function sendEmailNotification(
  settings: Partial<Settings>,
  report: Report,
  pdfPath: string,
): Promise<void> {
  const recipients = (settings.recipients ?? []).map((r) => r.email).join(', ');
  if (!recipients) {
    console.log('[email] No recipients configured. Skipping notification.');
    return;
  }

  const smtp = settings.smtp ?? { host: '', port: '', user: '', pass: '' };
  const mailOptions: MailOptions = {
    from: smtp.user || 'noreply@company.com',
    to: recipients,
    subject: `SiteWatch Website Monitoring Report - ${report.date} - ${report.time}`,
    text:
      `Hello,\n\nPlease find attached the SiteWatch Website Monitoring Report generated on ` +
      `${report.date} at ${report.time}.\n\nSummary:\n- Total Websites checked: ${report.total}\n` +
      `- Online: ${report.success}\n- Offline/Failed: ${report.failed}\n\nRegards,\nSiteWatch Portal`,
    attachments: [{ filename: report.file, path: pdfPath }],
  };

  if (smtp.host && smtp.user) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: Number(smtp.port) || 587,
        secure: Number(smtp.port) === 465,
        auth: { user: smtp.user, pass: smtp.pass || '' },
        tls: { rejectUnauthorized: false },
      });
      await transporter.sendMail(mailOptions);
      console.log('[email] Notification sent successfully.');
      return;
    } catch (err) {
      console.error('[email] SMTP send failed, falling back to mock log:', (err as Error).message);
    }
  } else {
    console.log('[email] SMTP not configured. Writing mock email log.');
  }

  logMockEmail(mailOptions);
}

function logMockEmail(mail: MailOptions): void {
  if (!fs.existsSync(MOCK_DIR)) fs.mkdirSync(MOCK_DIR, { recursive: true });
  const file = path.join(MOCK_DIR, `Email_${Date.now()}.txt`);
  const content = `
=== MOCK EMAIL NOTIFICATION ===
To: ${mail.to}
From: ${mail.from}
Subject: ${mail.subject}
Body:
${mail.text}
Attachment Saved: ${mail.attachments[0].filename}
===============================
`;
  fs.writeFileSync(file, content, 'utf8');
  console.log(`[email] Mock email written to ${file}`);
}
