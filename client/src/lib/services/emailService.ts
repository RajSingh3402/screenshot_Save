import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';

export interface EmailSettings {
  smtp?: {
    host?: string;
    port?: string | number;
    user?: string;
    pass?: string;
  };
  recipients?: Array<{ email: string }>;
}

export interface ScanReport {
  id: number | bigint;
  date: string;
  time: string;
  total: number;
  success: number;
  failed: number;
  file: string;
  details?: any[];
}

export async function sendEmailNotification(
  settings: EmailSettings,
  report: ScanReport,
  pdfPath: string
): Promise<void> {
  const recipients = (settings.recipients || []).map((r) => r.email).join(', ');
  if (!recipients) {
    console.log('No email recipients configured. Skipping notification.');
    return;
  }

  let smtp = settings.smtp || {};
  try {
    const dbConfig = await prisma.smtpConfig.findFirst({
      orderBy: { id: 'desc' },
    });
    if (dbConfig && dbConfig.host && dbConfig.username) {
      smtp = {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        pass: dbConfig.password,
      };
    }
  } catch (err: any) {
    console.log('Could not load SMTP config from smtp_configs, using settings fallback:', err.message);
  }

  const mailOptions = {
    from: smtp.user || 'noreply@company.com',
    to: recipients,
    subject: 'SiteWatch Metrics Report',
    text: `Hello,\n\nPlease find attached the SiteWatch Metrics Report generated on ${report.date} at ${report.time}.\n\nSummary:\n- Total Websites checked: ${report.total}\n- Online: ${report.success}\n- Offline/Failed: ${report.failed}\n\nRegards,\nSiteWatch Portal`,
    attachments: [
      {
        filename: report.file,
        path: pdfPath,
      },
    ],
  };

  // If host and user are set, try sending real email
  if (smtp.host && smtp.user) {
    console.log(`Attempting to send email via SMTP to ${recipients}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: typeof smtp.port === 'string' ? parseInt(smtp.port, 10) : smtp.port || 587,
        secure: (typeof smtp.port === 'string' ? parseInt(smtp.port, 10) : smtp.port) === 465,
        auth: {
          user: smtp.user,
          pass: smtp.pass || '',
        },
        tls: {
          rejectUnauthorized: false, // avoid SSL issues with self-signed test SMTPs
        },
      });
      await transporter.sendMail(mailOptions);
      console.log('Real email notification sent successfully!');
    } catch (err: any) {
      console.error('SMTP sending failed (falling back to Mock Logging):', err.message);
      logMockEmail(mailOptions);
    }
  } else {
    // Graceful fallback to mock logging
    console.log('SMTP configuration incomplete. Emulating email sending (Mock Logging)...');
    logMockEmail(mailOptions);
  }
}

export function logMockEmail(mailOptions: any): void {
  // Save mock emails in a folder under the client project root
  const mockLogDir = path.join(process.cwd(), 'mock_emails');
  if (!fs.existsSync(mockLogDir)) {
    fs.mkdirSync(mockLogDir, { recursive: true });
  }
  const emailLogFile = path.join(mockLogDir, `Email_${Date.now()}.txt`);
  const logContent = `
=== MOCK EMAIL NOTIFICATION ===
To: ${mailOptions.to}
From: ${mailOptions.from}
Subject: ${mailOptions.subject}
Body:
${mailOptions.text}
Attachment Saved: ${mailOptions.attachments[0].filename}
===============================
`;
  fs.writeFileSync(emailLogFile, logContent, 'utf8');
  console.log(`Mock email log written to ${emailLogFile}`);
}
