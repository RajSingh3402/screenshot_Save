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
  const ccStr = mailOptions.cc ? `\nCC: ${mailOptions.cc}` : '';
  const logContent = `
=== MOCK EMAIL NOTIFICATION ===
To: ${mailOptions.to}${ccStr}
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
        globalCcEmail: dbConfig.globalCcEmail,
      };
    } else {
      smtp = {
        host: '',
        port: '',
        user: '',
        pass: '',
        globalCcEmail: '',
      };
    }
  } catch (err: any) {
    console.log('Could not load SMTP config from database for SSL alert:', err.message);
  }

  const isUrgent = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent');
  const themeColor = isUrgent ? '#ef4444' : '#f59e0b';
  const gradientBar = 'linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6, #3b82f6, #10b981)';
  const bannerBg = isUrgent ? '#fef2f2' : '#fffbeb';
  const bannerBorder = isUrgent ? '4px solid #ef4444' : '4px solid #f59e0b';
  
  const alertIcon = isUrgent
    ? '<span style="font-size: 32px; vertical-align: middle;">🚨</span>'
    : '<span style="font-size: 32px; vertical-align: middle;">⚠️</span>';

  const alertBadgeClass = isUrgent ? 'badge-danger' : 'badge-warning';
  const sslStatusBadgeClass = sslStatus === 'Valid' ? 'badge-success' : 'badge-danger';
  const daysRemainingColor = (typeof daysRemaining === 'number' && daysRemaining <= 7) ? '#ef4444' : (typeof daysRemaining === 'number' && daysRemaining <= 30) ? '#f59e0b' : '#3b82f6';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SSL Certificate Expiry Alert</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; padding: 20px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background-color: #0b1d33; padding: 20px; text-align: left; }
    .header-table { width: 100%; border-collapse: collapse; }
    .logo-container { vertical-align: middle; }
    .logo-text { display: inline-block; vertical-align: middle; }
    .logo-title { color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 0.5px; line-height: 1.2; }
    .logo-subtitle { color: #94a3b8; font-size: 8px; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
    .header-right { text-align: right; color: #ffffff; font-size: 11px; vertical-align: middle; }
    .header-right-text { display: inline-block; vertical-align: middle; text-align: left; margin-left: 8px; }
    .header-right-title { font-weight: 700; color: #ffffff; margin: 0; }
    .header-right-subtitle { color: #94a3b8; margin: 0; }
    .gradient-bar { height: 4px; background: ${gradientBar}; }
    .content { padding: 30px 24px; }
    .alert-banner { background-color: ${bannerBg}; border-left: ${bannerBorder}; padding: 18px; border-radius: 6px; margin-bottom: 24px; display: table; width: 100%; box-sizing: border-box; }
    .alert-icon-cell { display: table-cell; vertical-align: middle; width: 50px; }
    .alert-text-cell { display: table-cell; vertical-align: middle; }
    .alert-title { font-weight: 700; color: #0f172a; font-size: 16px; margin-bottom: 4px; }
    .alert-desc { font-size: 13px; color: #475569; line-height: 1.5; margin: 0; }
    .section-title-container { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; margin-top: 8px; }
    .section-icon { display: inline-block; width: 28px; height: 28px; background-color: #0b1d33; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 13px; vertical-align: middle; margin-right: 8px; }
    .section-text { font-size: 15px; font-weight: 700; color: #0f172a; display: inline-block; vertical-align: middle; }
    .details-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
    .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; vertical-align: middle; }
    .details-table tr:last-child td { border-bottom: none; }
    .details-table td.label { font-weight: 500; color: #64748b; }
    .details-table td.value { font-weight: 600; text-align: right; color: #0f172a; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }
    .badge-success { background-color: #e6f4ea; color: #137333; border: 1px solid rgba(19, 115, 51, 0.2); }
    .badge-danger { background-color: #fce8e6; color: #c5221f; border: 1px solid rgba(197, 34, 31, 0.2); }
    .badge-warning { background-color: #fff0d4; color: #b06000; border: 1px solid #ffe0b2; }
    .badge-info { background-color: #e8f0fe; color: #1a73e8; border: 1px solid #d2e3fc; }
    .assistance-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 10px; }
    .assistance-table { width: 100%; border-collapse: collapse; }
    .assistance-left { width: 65%; padding-right: 20px; border-right: 1px solid #e2e8f0; vertical-align: top; }
    .assistance-right { width: 35%; padding-left: 20px; vertical-align: middle; }
    .assistance-icon { display: inline-block; width: 40px; height: 40px; background-color: #0b1d33; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; font-size: 18px; float: left; margin-right: 12px; }
    .assistance-text-container { overflow: hidden; }
    .assistance-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
    .assistance-desc { font-size: 12px; color: #64748b; margin: 0; line-height: 1.4; }
    .contact-item { font-size: 12px; color: #475569; margin-bottom: 8px; }
    .contact-item:last-child { margin-bottom: 0; }
    .footer { background-color: #0b1d33; padding: 24px; text-align: center; color: #ffffff; font-size: 11px; }
    .footer-divider { border: 0; height: 1px; background: rgba(255, 255, 255, 0.1); margin: 15px 0; position: relative; }
    .footer-divider-icon { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background-color: #0b1d33; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.1); line-height: 18px; color: #94a3b8; font-size: 10px; }
    .footer-slogan { color: #e2e8f0; font-size: 12px; font-weight: 600; margin-bottom: 6px; }
    .footer-copyright { color: #94a3b8; font-size: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <table class="header-table">
        <tr>
          <td class="logo-container">
            <img src="https://www.visualytes.com/wp-content/uploads/2020/08/cropped-v-favicon-270x270.png" width="38" height="38" alt="Visualytes Logo" style="vertical-align: middle; margin-right: 10px; display: inline-block; border-radius: 50%;">
            <div class="logo-text">
              <h1 class="logo-title">VISUALYTES</h1>
              <p class="logo-subtitle">WEB & MARKETING SOLUTIONS</p>
            </div>
          </td>
          <td class="header-right">
            <span style="font-size: 18px; vertical-align: middle; margin-right: 6px; color: #10b981; display: inline-block;">🛡️</span>
            <div class="header-right-text">
              <p class="header-right-title">Secure Today.</p>
              <p class="header-right-subtitle">Trusted Always.</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="gradient-bar"></div>
    <div class="content">
      <div class="alert-banner">
        <div class="alert-icon-cell">
          ${alertIcon}
        </div>
        <div class="alert-text-cell">
          <div class="alert-title">SSL Certificate Expiration Warning</div>
          <div class="alert-desc">The SSL certificate for the website listed below is approaching expiration. Please take the necessary steps to renew it before the expiration date to avoid any service disruption or security risks.</div>
        </div>
      </div>
      
      <div class="section-title-container">
        <div class="section-icon">📄</div>
        <div class="section-text">SSL Certificate Details</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🌐</span>
            Website Name
          </td>
          <td class="value">${websiteName}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🔗</span>
            Website URL
          </td>
          <td class="value"><a href="${websiteUrl}" style="color: #1a73e8; text-decoration: none;">${websiteUrl}</a></td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🛡️</span>
            SSL Status
          </td>
          <td class="value">
            <span class="badge ${sslStatusBadgeClass}">
              ${sslStatus === 'Valid' ? '✓ ' + sslStatus : sslStatus}
            </span>
          </td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">📅</span>
            Expiry Date
          </td>
          <td class="value">${expiryDate}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">⏳</span>
            Days Remaining
          </td>
          <td class="value" style="color: ${daysRemainingColor}; font-weight: bold;">${daysRemaining}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">⚠️</span>
            Alert Level
          </td>
          <td class="value"><span class="badge ${alertBadgeClass}">${alertLevel}</span></td>
        </tr>
      </table>

      <div class="assistance-box">
        <table class="assistance-table">
          <tr>
            <td class="assistance-left">
              <div class="assistance-icon">✉</div>
              <div class="assistance-text-container">
                <h4 class="assistance-title">Need Assistance?</h4>
                <p class="assistance-desc">If you have any questions or need help renewing your SSL certificate, please reply to this email or contact our support team.</p>
              </div>
            </td>
            <td class="assistance-right">
              <div class="contact-item">
                <span style="font-size: 14px; margin-right: 6px; vertical-align: middle;">✉</span>
                <a href="mailto:support@visualytes.com" style="color: ${themeColor}; text-decoration: none; font-weight: 600;">support@visualytes.com</a>
              </div>
              <div class="contact-item" style="color: #64748b;">
                <span style="font-size: 14px; margin-right: 6px; vertical-align: middle;">🕒</span>
                We typically respond within 24 business hours.
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="footer">
      <div class="footer-divider">
        <div class="footer-divider-icon">🔒</div>
      </div>
      <p class="footer-slogan">Thank you for trusting Visualytes.</p>
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 11px;">We're here to keep your website secure.</p>
      <p class="footer-copyright">© 2026 Visualytes Web & Marketing Solutions. All rights reserved.</p>
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

Generated By:
SiteWatch Monitor Portal
`;

  const mailOptions: any = {
    from: smtp.user || 'noreply@company.com',
    to: alertEmail,
    subject: `SSL Certificate Expiry Alert - ${alertLevel} - ${websiteName}`,
    html: htmlBody,
    text: textBody.trim()
  };

  if (smtp.globalCcEmail && smtp.globalCcEmail.trim() !== '') {
    mailOptions.cc = smtp.globalCcEmail.trim();
  }

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
        globalCcEmail: dbConfig.globalCcEmail,
      };
    } else {
      smtp = {
        host: '',
        port: '',
        user: '',
        pass: '',
        globalCcEmail: '',
      };
    }
  } catch (err: any) {
    console.log('Could not load SMTP config from database for Domain alert:', err.message);
  }

  const isUrgent = alertLevel.includes('Critical') || alertLevel.includes('Expired') || alertLevel.includes('Urgent');
  const themeColor = isUrgent ? '#be123c' : '#e11d48';
  const gradientBar = 'linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6, #3b82f6, #10b981)';
  const bannerBg = isUrgent ? '#fef2f2' : '#fff8f8';
  const bannerBorder = isUrgent ? '4px solid #be123c' : '4px solid #e11d48';
  
  const alertIcon = isUrgent
    ? '<span style="font-size: 32px; vertical-align: middle;">🚨</span>'
    : '<span style="font-size: 32px; vertical-align: middle;">⚠️</span>';

  const alertBadgeClass = isUrgent ? 'badge-danger' : 'badge-warning';
  const domainStatusBadgeClass = domainStatus === 'Secure' ? 'badge-success' : 'badge-danger';
  const daysRemainingColor = (typeof daysRemaining === 'number' && daysRemaining <= 7) ? '#ef4444' : (typeof daysRemaining === 'number' && daysRemaining <= 30) ? '#f59e0b' : '#3b82f6';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Domain Expiration Warning</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; padding: 20px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background-color: #0b1d33; padding: 20px; text-align: left; }
    .header-table { width: 100%; border-collapse: collapse; }
    .logo-container { vertical-align: middle; }
    .logo-text { display: inline-block; vertical-align: middle; }
    .logo-title { color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 0.5px; line-height: 1.2; }
    .logo-subtitle { color: #94a3b8; font-size: 8px; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
    .header-right { text-align: right; color: #ffffff; font-size: 11px; vertical-align: middle; }
    .header-right-text { display: inline-block; vertical-align: middle; text-align: left; margin-left: 8px; }
    .header-right-title { font-weight: 700; color: #ffffff; margin: 0; }
    .header-right-subtitle { color: #94a3b8; margin: 0; }
    .gradient-bar { height: 4px; background: ${gradientBar}; }
    .content { padding: 30px 24px; }
    .alert-banner { background-color: ${bannerBg}; border-left: ${bannerBorder}; padding: 18px; border-radius: 6px; margin-bottom: 24px; display: table; width: 100%; box-sizing: border-box; }
    .alert-icon-cell { display: table-cell; vertical-align: middle; width: 50px; }
    .alert-text-cell { display: table-cell; vertical-align: middle; }
    .alert-title { font-weight: 700; color: #0f172a; font-size: 16px; margin-bottom: 4px; }
    .alert-desc { font-size: 13px; color: #475569; line-height: 1.5; margin: 0; }
    .section-title-container { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; margin-top: 8px; }
    .section-icon { display: inline-block; width: 28px; height: 28px; background-color: #0b1d33; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 13px; vertical-align: middle; margin-right: 8px; }
    .section-text { font-size: 15px; font-weight: 700; color: #0f172a; display: inline-block; vertical-align: middle; }
    .details-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
    .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; vertical-align: middle; }
    .details-table tr:last-child td { border-bottom: none; }
    .details-table td.label { font-weight: 500; color: #64748b; }
    .details-table td.value { font-weight: 600; text-align: right; color: #0f172a; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }
    .badge-success { background-color: #e6f4ea; color: #137333; border: 1px solid rgba(19, 115, 51, 0.2); }
    .badge-danger { background-color: #fce8e6; color: #c5221f; border: 1px solid rgba(197, 34, 31, 0.2); }
    .badge-warning { background-color: #fff0d4; color: #b06000; border: 1px solid #ffe0b2; }
    .badge-info { background-color: #e8f0fe; color: #1a73e8; border: 1px solid #d2e3fc; }
    .assistance-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 10px; }
    .assistance-table { width: 100%; border-collapse: collapse; }
    .assistance-left { width: 65%; padding-right: 20px; border-right: 1px solid #e2e8f0; vertical-align: top; }
    .assistance-right { width: 35%; padding-left: 20px; vertical-align: middle; }
    .assistance-icon { display: inline-block; width: 40px; height: 40px; background-color: #0b1d33; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; font-size: 18px; float: left; margin-right: 12px; }
    .assistance-text-container { overflow: hidden; }
    .assistance-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
    .assistance-desc { font-size: 12px; color: #64748b; margin: 0; line-height: 1.4; }
    .contact-item { font-size: 12px; color: #475569; margin-bottom: 8px; }
    .contact-item:last-child { margin-bottom: 0; }
    .footer { background-color: #0b1d33; padding: 24px; text-align: center; color: #ffffff; font-size: 11px; }
    .footer-divider { border: 0; height: 1px; background: rgba(255, 255, 255, 0.1); margin: 15px 0; position: relative; }
    .footer-divider-icon { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background-color: #0b1d33; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.1); line-height: 18px; color: #94a3b8; font-size: 10px; }
    .footer-slogan { color: #e2e8f0; font-size: 12px; font-weight: 600; margin-bottom: 6px; }
    .footer-copyright { color: #94a3b8; font-size: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <table class="header-table">
        <tr>
          <td class="logo-container">
            <img src="https://www.visualytes.com/wp-content/uploads/2020/08/cropped-v-favicon-270x270.png" width="38" height="38" alt="Visualytes Logo" style="vertical-align: middle; margin-right: 10px; display: inline-block; border-radius: 50%;">
            <div class="logo-text">
              <h1 class="logo-title">VISUALYTES</h1>
              <p class="logo-subtitle">WEB & MARKETING SOLUTIONS</p>
            </div>
          </td>
          <td class="header-right">
            <span style="font-size: 18px; vertical-align: middle; margin-right: 6px; color: #10b981; display: inline-block;">🛡️</span>
            <div class="header-right-text">
              <p class="header-right-title">Secure Today.</p>
              <p class="header-right-subtitle">Trusted Always.</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="gradient-bar"></div>
    <div class="content">
      <div class="alert-banner">
        <div class="alert-icon-cell">
          ${alertIcon}
        </div>
        <div class="alert-text-cell">
          <div class="alert-title">Domain Expiration Warning</div>
          <div class="alert-desc">Your domain registration is approaching expiration. Please renew your domain registration before the expiry date to keep your website and online services active.</div>
        </div>
      </div>
      
      <div class="section-title-container">
        <div class="section-icon">📄</div>
        <div class="section-text">Domain Registration Details</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🌐</span>
            Website Name
          </td>
          <td class="value">${websiteName}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🔗</span>
            Website URL
          </td>
          <td class="value"><a href="${websiteUrl}" style="color: #1a73e8; text-decoration: none;">${websiteUrl}</a></td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🌐</span>
            Domain Name
          </td>
          <td class="value">${domainName}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">🛡️</span>
            Domain Status
          </td>
          <td class="value">
            <span class="badge ${domainStatusBadgeClass}">
              ${domainStatus === 'Secure' ? '✓ ' + domainStatus : domainStatus}
            </span>
          </td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">📅</span>
            Expiry Date
          </td>
          <td class="value">${expiryDate}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">⏳</span>
            Days Remaining
          </td>
          <td class="value" style="color: ${daysRemainingColor}; font-weight: bold;">${daysRemaining}</td>
        </tr>
        <tr>
          <td class="label">
            <span style="font-size: 16px; margin-right: 8px; vertical-align: middle;">⚠️</span>
            Alert Level
          </td>
          <td class="value"><span class="badge ${alertBadgeClass}">${alertLevel}</span></td>
        </tr>
      </table>

      <div class="assistance-box">
        <table class="assistance-table">
          <tr>
            <td class="assistance-left">
              <div class="assistance-icon">✉</div>
              <div class="assistance-text-container">
                <h4 class="assistance-title">Need Assistance?</h4>
                <p class="assistance-desc">If you have any questions or need help renewing your domain registration, please reply to this email or contact our support team.</p>
              </div>
            </td>
            <td class="assistance-right">
              <div class="contact-item">
                <span style="font-size: 14px; margin-right: 6px; vertical-align: middle;">✉</span>
                <a href="mailto:support@visualytes.com" style="color: ${themeColor}; text-decoration: none; font-weight: 600;">support@visualytes.com</a>
              </div>
              <div class="contact-item" style="color: #64748b;">
                <span style="font-size: 14px; margin-right: 6px; vertical-align: middle;">🕒</span>
                We typically respond within 24 business hours.
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="footer">
      <div class="footer-divider">
        <div class="footer-divider-icon">🔒</div>
      </div>
      <p class="footer-slogan">Thank you for trusting Visualytes.</p>
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 11px;">We're here to keep your website secure.</p>
      <p class="footer-copyright">© 2026 Visualytes Web & Marketing Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  const textBody = `
DOMAIN EXPIRATION WARNING

Your domain registration is approaching expiration.
Please renew your domain registration before the expiry date to keep your website and online services active.

Domain Details Section:

Website Name: ${websiteName}
Website URL: ${websiteUrl}
Domain Name: ${domainName}
Domain Status: ${domainStatus}
Expiry Date: ${expiryDate}
Days Remaining: ${daysRemaining}
Alert Level: ${alertLevel}

SiteWatch Monitor Portal
`;

  const mailOptions: any = {
    from: smtp.user || 'noreply@company.com',
    to: alertEmail,
    subject: `Domain Registration Expiry Alert - ${alertLevel} - ${websiteName}`,
    html: htmlBody,
    text: textBody.trim(),
  };

  if (smtp.globalCcEmail && smtp.globalCcEmail.trim() !== '') {
    mailOptions.cc = smtp.globalCcEmail.trim();
  }

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

