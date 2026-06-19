import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendEmailNotification(settings, report, pdfPath) {
  const recipients = (settings.recipients || []).map(r => r.email).join(', ');
  if (!recipients) {
    console.log('No email recipients configured. Skipping notification.');
    return;
  }

  let smtp = settings.smtp || {};
  try {
    const dbConfig = await prisma.smtpConfig.findFirst({
      orderBy: { id: 'desc' }
    });
    if (dbConfig && dbConfig.host && dbConfig.username) {
      smtp = {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        pass: dbConfig.password
      };
    }
  } catch (err) {
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
        path: pdfPath
      }
    ]
  };

  // If host and user are set, try sending real email
  if (smtp.host && smtp.user) {
    console.log(`Attempting to send email via SMTP to ${recipients}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: parseInt(smtp.port) || 587,
        secure: parseInt(smtp.port) === 465,
        auth: {
          user: smtp.user,
          pass: smtp.pass || ''
        },
        tls: {
          rejectUnauthorized: false // avoid SSL issues with self-signed test SMTPs
        }
      });
      await transporter.sendMail(mailOptions);
      console.log('Real email notification sent successfully!');
    } catch (err) {
      console.error('SMTP sending failed (falling back to Mock Logging):', err.message);
      logMockEmail(mailOptions);
    }
  } else {
    // Graceful fallback to mock logging
    console.log('SMTP configuration incomplete. Emulating email sending (Mock Logging)...');
    logMockEmail(mailOptions);
  }
}

export function logMockEmail(mailOptions) {
  // Save mock emails in a folder under the project root
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
