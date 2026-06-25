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
  const attachmentStr = (mailOptions.attachments && mailOptions.attachments[0])
    ? `Attachment Saved: ${mailOptions.attachments[0].filename}`
    : 'No Attachments';
  const bodyContent = mailOptions.text || mailOptions.html || '';
  const logContent = `
=== MOCK EMAIL NOTIFICATION ===
To: ${mailOptions.to}
From: ${mailOptions.from}
Subject: ${mailOptions.subject}
Body:
${bodyContent}
${attachmentStr}
===============================
`;
  fs.writeFileSync(emailLogFile, logContent, 'utf8');
  console.log(`Mock email log written to ${emailLogFile}`);
}

export interface SslExpiryAlertOptions {
  alertEmail: string;
  websiteName: string;
  websiteUrl: string;
  sslStatus: string;
  expiryDate: string;
  daysRemaining: string | number;
  alertLevel: string;
  websiteStatus: string;
  domainStatus: string;
  malwareStatus: string;
  lastScanTime: string;
}

export async function sendSslExpiryAlert(options: SslExpiryAlertOptions): Promise<void> {
  const {
    alertEmail,
    websiteName,
    websiteUrl,
    sslStatus,
    expiryDate,
    daysRemaining,
    alertLevel,
    websiteStatus,
    domainStatus,
    malwareStatus,
    lastScanTime
  } = options;

  if (!alertEmail) {
    console.log('No alert email specified for SSL Expiry Alert.');
    return;
  }

  let smtp: any = {};
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
    } else {
      const smtpRow = await prisma.smtpSetting.findUnique({ where: { id: 1 } });
      if (smtpRow) {
        smtp = {
          host: smtpRow.host || '',
          port: smtpRow.port || '',
          user: smtpRow.user || '',
          pass: smtpRow.pass || '',
        };
      }
    }
  } catch (err: any) {
    console.log('Could not load SMTP config from database for SSL alert:', err.message);
  }

  const alertBadgeClass = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent') ? 'badge-critical' : 'badge-warning';
  const alertBannerClass = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent') ? '' : 'warning';
  
  const sslStatusBadgeClass = sslStatus === 'Valid' ? 'badge-info' : 'badge-critical';
  const websiteStatusColor = websiteStatus === 'Online' ? '#4ade80' : '#f87171';
  const sslStatusColor = sslStatus === 'Valid' ? '#4ade80' : '#f87171';
  const domainStatusColor = domainStatus === 'Secure' ? '#4ade80' : '#fbbf24';
  const malwareStatusColor = malwareStatus === 'Clean' ? '#4ade80' : '#f87171';
  const daysRemainingColor = (typeof daysRemaining === 'number' && daysRemaining <= 7) ? '#f87171' : (typeof daysRemaining === 'number' && daysRemaining <= 30) ? '#fbbf24' : '#818cf8';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SSL Certificate Expiry Alert</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 30px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); padding: 24px; text-align: center; border-bottom: 1px solid #1f2937; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; color: #c7d2fe; font-size: 13px; }
    .content { padding: 32px 24px; }
    .alert-banner { background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin-bottom: 24px; }
    .alert-banner.warning { background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; }
    .alert-title { font-weight: 700; color: #f1f5f9; font-size: 15px; margin-bottom: 6px; }
    .alert-desc { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #1f2937; font-size: 14px; }
    .details-table td.label { color: #94a3b8; width: 40%; font-weight: 500; }
    .details-table td.value { color: #f1f5f9; font-weight: 600; text-align: right; }
    .action-box { background-color: #1e1b4b; border: 1px dashed #4f46e5; border-radius: 6px; padding: 18px; margin-bottom: 28px; text-align: center; }
    .action-title { font-size: 13px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .action-desc { font-size: 14px; color: #e0e7ff; margin: 0; font-weight: 500; }
    .summary-section { background-color: #0f172a; border-radius: 6px; padding: 20px; border: 1px solid #1e293b; }
    .summary-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #4b5563; background-color: #0b0f19; border-top: 1px solid #1f2937; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-critical { background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-warning { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-info { background-color: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SiteWatch Monitor Portal</h1>
      <p>SSL Certificate Expiry Alert</p>
    </div>
    <div class="content">
      <div class="alert-banner ${alertBannerClass}">
        <div class="alert-title">SSL Certificate Expiration Warning</div>
        <div class="alert-desc">The SSL certificate for <strong>${websiteName}</strong> requires immediate attention. See details below.</div>
      </div>
      
      <table class="details-table">
        <tr>
          <td class="label">Website Name</td>
          <td class="value">${websiteName}</td>
        </tr>
        <tr>
          <td class="label">Website URL</td>
          <td class="value"><a href="${websiteUrl}" style="color: #818cf8; text-decoration: none;">${websiteUrl}</a></td>
        </tr>
        <tr>
          <td class="label">SSL Status</td>
          <td class="value"><span class="badge ${sslStatusBadgeClass}">${sslStatus}</span></td>
        </tr>
        <tr>
          <td class="label">Expiry Date</td>
          <td class="value">${expiryDate}</td>
        </tr>
        <tr>
          <td class="label">Days Remaining</td>
          <td class="value" style="color: ${daysRemainingColor}; font-weight: bold;">${daysRemaining}</td>
        </tr>
        <tr>
          <td class="label">Alert Level</td>
          <td class="value"><span class="badge ${alertBadgeClass}">${alertLevel}</span></td>
        </tr>
      </table>

      <div class="action-box">
        <div class="action-title">Action Required</div>
        <p class="action-desc">Please renew your SSL certificate before expiration.</p>
      </div>

      <div class="summary-section">
        <div class="summary-title">Monitoring Summary</div>
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.8;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
            <span>Website Status</span> <strong style="color: ${websiteStatusColor}">${websiteStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>SSL Status</span> <strong style="color: ${sslStatusColor}">${sslStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>Domain Status</span> <strong style="color: ${domainStatusColor}">${domainStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>Malware Status</span> <strong style="color: ${malwareStatusColor}">${malwareStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding-top: 6px;">
            <span>Last Scan Time</span> <strong style="color: #f1f5f9">${lastScanTime}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      Generated By: SiteWatch Monitor Portal
    </div>
  </div>
</body>
</html>
`;

  const textBody = `
SiteWatch Monitor Portal

SSL Certificate Expiry Alert

Website Name:
${websiteName}

Website URL:
${websiteUrl}

SSL Status:
${sslStatus}

Expiry Date:
${expiryDate}

Days Remaining:
${daysRemaining}

Alert Level:
${alertLevel}

Action Required:

Please renew your SSL certificate before expiration.

Monitoring Summary:

Website Status: ${websiteStatus}
SSL Status: ${sslStatus}
Domain Status: ${domainStatus}
Malware Status: ${malwareStatus}
Last Scan Time: ${lastScanTime}

Generated By:
SiteWatch Monitor Portal
`;

  const mailOptions = {
    from: smtp.user || 'noreply@company.com',
    to: alertEmail,
    subject: `SSL Certificate Expiry Alert - ${alertLevel} - ${websiteName}`,
    html: htmlBody,
    text: textBody.trim()
  };

  if (smtp.host && smtp.user) {
    console.log(`Attempting to send SSL expiry alert via SMTP to ${alertEmail}...`);
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
          rejectUnauthorized: false,
        },
      });
      await transporter.sendMail(mailOptions);
      console.log('Real SSL expiry alert email sent successfully!');
    } catch (err: any) {
      console.error('SMTP sending failed for SSL expiry alert (falling back to Mock Logging):', err.message);
      logMockEmail(mailOptions);
    }
  } else {
    console.log('SMTP configuration incomplete. Emulating SSL expiry alert email sending (Mock Logging)...');
    logMockEmail(mailOptions);
  }
}

export interface DomainExpiryAlertOptions {
  alertEmail: string;
  websiteName: string;
  websiteUrl: string;
  domainName: string;
  domainStatus: string;
  expiryDate: string;
  daysRemaining: string | number;
  alertLevel: string;
  websiteStatus: string;
  sslStatus: string;
  malwareStatus: string;
  lastScanTime: string;
}

export async function sendDomainExpiryAlert(options: DomainExpiryAlertOptions): Promise<void> {
  const {
    alertEmail,
    websiteName,
    websiteUrl,
    domainName,
    domainStatus,
    expiryDate,
    daysRemaining,
    alertLevel,
    websiteStatus,
    sslStatus,
    malwareStatus,
    lastScanTime
  } = options;

  if (!alertEmail) {
    console.log('No alert email specified for Domain Expiry Alert.');
    return;
  }

  let smtp: any = {};
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
    } else {
      const smtpRow = await prisma.smtpSetting.findUnique({ where: { id: 1 } });
      if (smtpRow) {
        smtp = {
          host: smtpRow.host || '',
          port: smtpRow.port || '',
          user: smtpRow.user || '',
          pass: smtpRow.pass || '',
        };
      }
    }
  } catch (err: any) {
    console.log('Could not load SMTP config from database for Domain alert:', err.message);
  }

  const alertBadgeClass = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent') ? 'badge-critical' : 'badge-warning';
  const alertBannerClass = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent') ? '' : 'warning';
  
  const domainStatusBadgeClass = domainStatus === 'Secure' ? 'badge-info' : 'badge-critical';
  const websiteStatusColor = websiteStatus === 'Online' ? '#4ade80' : '#f87171';
  const sslStatusColor = sslStatus === 'Valid' ? '#4ade80' : '#f87171';
  const domainStatusColor = domainStatus === 'Secure' ? '#4ade80' : '#fbbf24';
  const malwareStatusColor = malwareStatus === 'Clean' ? '#4ade80' : '#f87171';
  const daysRemainingColor = (typeof daysRemaining === 'number' && daysRemaining <= 7) ? '#f87171' : (typeof daysRemaining === 'number' && daysRemaining <= 30) ? '#fbbf24' : '#818cf8';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Domain Expiration Warning</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 30px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #78350f 100%); padding: 24px; text-align: center; border-bottom: 1px solid #1f2937; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; color: #fde68a; font-size: 13px; }
    .content { padding: 32px 24px; }
    .alert-banner { background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin-bottom: 24px; }
    .alert-banner.warning { background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; }
    .alert-title { font-weight: 700; color: #f1f5f9; font-size: 15px; margin-bottom: 6px; }
    .alert-desc { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #1f2937; font-size: 14px; }
    .details-table td.label { color: #94a3b8; width: 40%; font-weight: 500; }
    .details-table td.value { color: #f1f5f9; font-weight: 600; text-align: right; }
    .action-box { background-color: #1e1b4b; border: 1px dashed #4f46e5; border-radius: 6px; padding: 18px; margin-bottom: 28px; text-align: center; }
    .action-title { font-size: 13px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .action-desc { font-size: 14px; color: #e0e7ff; margin: 0; font-weight: 500; }
    .summary-section { background-color: #0f172a; border-radius: 6px; padding: 20px; border: 1px solid #1e293b; }
    .summary-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #4b5563; background-color: #0b0f19; border-top: 1px solid #1f2937; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-critical { background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-warning { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-info { background-color: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DOMAIN EXPIRATION WARNING</h1>
      <p>SiteWatch Monitor Portal</p>
    </div>
    <div class="content">
      <div class="alert-banner ${alertBannerClass}">
        <div class="alert-title">Domain Expiry Warning</div>
        <div class="alert-desc">Your domain registration is approaching expiration. Please renew your domain before the expiry date to avoid website downtime, email service interruption, and domain loss.</div>
      </div>
      
      <table class="details-table">
        <tr>
          <td class="label">Website Name</td>
          <td class="value">${websiteName}</td>
        </tr>
        <tr>
          <td class="label">Website URL</td>
          <td class="value"><a href="${websiteUrl}" style="color: #818cf8; text-decoration: none;">${websiteUrl}</a></td>
        </tr>
        <tr>
          <td class="label">Domain Name</td>
          <td class="value">${domainName}</td>
        </tr>
        <tr>
          <td class="label">Domain Status</td>
          <td class="value"><span class="badge ${domainStatusBadgeClass}">${domainStatus}</span></td>
        </tr>
        <tr>
          <td class="label">Expiry Date</td>
          <td class="value">${expiryDate}</td>
        </tr>
        <tr>
          <td class="label">Days Remaining</td>
          <td class="value" style="color: ${daysRemainingColor}; font-weight: bold;">${daysRemaining}</td>
        </tr>
        <tr>
          <td class="label">Alert Level</td>
          <td class="value"><span class="badge ${alertBadgeClass}">${alertLevel}</span></td>
        </tr>
      </table>

      <div class="action-box">
        <div class="action-title">Need Assistance?</div>
        <p class="action-desc">Contact support team.</p>
      </div>

      <div class="summary-section">
        <div class="summary-title">Monitoring Summary</div>
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.8;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
            <span>Website Status</span> <strong style="color: ${websiteStatusColor}">${websiteStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>SSL Status</span> <strong style="color: ${sslStatusColor}">${sslStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>Domain Status</span> <strong style="color: ${domainStatusColor}">${domainStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #1e293b; padding: 6px 0;">
            <span>Malware Status</span> <strong style="color: ${malwareStatusColor}">${malwareStatus}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding-top: 6px;">
            <span>Last Scan Time</span> <strong style="color: #f1f5f9">${lastScanTime}</strong>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; padding: 24px; font-size: 11px; color: #4b5563; background-color: #0b0f19; border-top: 1px solid #1f2937;">
      SiteWatch Monitor Portal
    </div>
  </div>
</body>
</html>
`;

  const textBody = `
DOMAIN EXPIRATION WARNING

Your domain registration is approaching expiration.
Please renew your domain before the expiry date to avoid website downtime, email service interruption, and domain loss.

Domain Details Section:

Website Name: ${websiteName}
Website URL: ${websiteUrl}
Domain Name: ${domainName}
Domain Status: ${domainStatus}
Expiry Date: ${expiryDate}
Days Remaining: ${daysRemaining}
Alert Level: ${alertLevel}

Need Assistance?
Contact support team.

SiteWatch Monitor Portal
`;

  const mailOptions = {
    from: smtp.user || 'noreply@company.com',
    to: alertEmail,
    subject: `Domain Registration Expiry Alert - ${alertLevel} - ${websiteName}`,
    html: htmlBody,
    text: textBody.trim(),
  };

  if (smtp.host && smtp.user) {
    console.log(`Attempting to send Domain expiry alert via SMTP to ${alertEmail}...`);
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
          rejectUnauthorized: false,
        },
      });
      await transporter.sendMail(mailOptions);
      console.log('Real Domain expiry alert email sent successfully!');
    } catch (err: any) {
      console.error('SMTP sending failed for Domain expiry alert (falling back to Mock Logging):', err.message);
      logMockEmail(mailOptions);
    }
  } else {
    console.log('SMTP configuration incomplete. Emulating Domain expiry alert email sending (Mock Logging)...');
    logMockEmail(mailOptions);
  }
}
