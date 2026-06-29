import { Client } from 'ssh2';
import fs from 'fs';
import { prisma } from '../../lib/prisma';
import { sendEmail } from '../../services/mail.service';

/**
 * Parses the capacity percentage from POSIX `df -P /` output.
 */
export function parseDfOutput(output: string): number | null {
  const lines = output.trim().split('\n');
  if (lines.length < 2) return null;
  
  // Find a line that ends with " /" or contains the root mount
  const targetLine = lines.find(l => l.trim().endsWith(' /')) || lines[1];
  if (!targetLine) return null;
  
  const parts = targetLine.trim().split(/\s+/);
  // POSIX: Filesystem 1024-blocks Used Available Capacity Mounted_on
  // Usually the 5th column (index 4) contains the capacity string ending with "%"
  const capacityPart = parts[4];
  if (capacityPart && capacityPart.endsWith('%')) {
    const usage = parseInt(capacityPart.replace('%', ''), 10);
    if (!isNaN(usage)) return usage;
  }
  
  // Fallback: look for any token in the split parts ending with "%"
  for (const part of parts) {
    if (part.endsWith('%')) {
      const usage = parseInt(part.replace('%', ''), 10);
      if (!isNaN(usage)) return usage;
    }
  }
  return null;
}

/**
 * Tests an SSH connection and credentials before saving/modifying a server.
 */
export function testSshConnection(config: {
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  passphrase?: string;
}): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    try {
      if (!fs.existsSync(config.privateKeyPath)) {
        return resolve({ success: false, error: 'Missing private key' });
      }
      const privateKey = fs.readFileSync(config.privateKeyPath);
      const conn = new Client();
      
      conn.on('ready', () => {
        conn.end();
        resolve({ success: true });
      }).on('error', (err: any) => {
        let errMsg = err.message || String(err);
        if (
          errMsg.includes('passphrase') || 
          errMsg.includes('parse key') || 
          errMsg.includes('Unsupported key type') || 
          errMsg.includes('encrypted') || 
          errMsg.includes('Encrypted')
        ) {
          errMsg = 'Incorrect Passphrase';
        } else if (
          errMsg.includes('Authentication failed') || 
          errMsg.includes('authentication failed') || 
          errMsg.includes('All configured authentication methods failed')
        ) {
          errMsg = 'SSH Authentication Failed';
        } else if (
          errMsg.includes('ENOTFOUND') || 
          errMsg.includes('ETIMEDOUT') || 
          errMsg.includes('ECONNREFUSED') || 
          errMsg.includes('EHOSTUNREACH') || 
          errMsg.includes('timed out') || 
          errMsg.includes('timeout')
        ) {
          errMsg = 'Host Unreachable';
        }
        resolve({ success: false, error: errMsg });
      }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        privateKey,
        ...(config.passphrase ? { passphrase: config.passphrase } : {}),
        readyTimeout: 10000 // 10s timeout
      });
    } catch (err: any) {
      let errMsg = err.message || String(err);
      if (
        errMsg.includes('passphrase') || 
        errMsg.includes('parse key') || 
        errMsg.includes('Unsupported key type') || 
        errMsg.includes('encrypted') || 
        errMsg.includes('Encrypted')
      ) {
        errMsg = 'Incorrect Passphrase';
      }
      resolve({ success: false, error: errMsg });
    }
  });
}

/**
 * Connects over SSH, executes `df -P /`, and resolves the capacity usage as percentage.
 */
export function queryServerDiskUsage(server: {
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  passphrase?: string;
}): Promise<number | null> {
  return new Promise((resolve) => {
    try {
      if (!fs.existsSync(server.privateKeyPath)) {
        console.error(`[Server Scanner] Private key file not found: ${server.privateKeyPath}`);
        return resolve(null);
      }
      const privateKey = fs.readFileSync(server.privateKeyPath);
      const conn = new Client();
      
      conn.on('ready', () => {
        conn.exec('df -P /', (err, stream) => {
          if (err) {
            conn.end();
            return resolve(null);
          }
          let stdout = '';
          stream.on('close', () => {
            conn.end();
            const usage = parseDfOutput(stdout);
            resolve(usage);
          }).on('data', (chunk: Buffer) => {
            stdout += chunk.toString();
          }).stderr.on('data', () => {});
        });
      }).on('error', (err) => {
        console.error(`[Server Scanner] SSH query error for ${server.host}:`, err);
        resolve(null);
      }).connect({
        host: server.host,
        port: server.port,
        username: server.username,
        privateKey,
        ...(server.passphrase ? { passphrase: server.passphrase } : {}),
        readyTimeout: 10000
      });
    } catch (err) {
      console.error(`[Server Scanner] SSH setup error for ${server.host}:`, err);
      resolve(null);
    }
  });
}

/**
 * Scans all servers in the database, updates their status, usage, and alerts email recipients.
 */
export async function runServerScan() {
  console.log('[Server Scanner] Starting SSH capacity scan...');
  try {
    const servers = await prisma.server.findMany();
    
    for (const server of servers) {
      try {
        const usage = await queryServerDiskUsage({
          host: server.host,
          port: Number(server.port),
          username: server.username,
          privateKeyPath: server.privateKeyPath,
          passphrase: (server as any).passphrase || undefined,
        });

        let status = 'Offline';
        let lastUsage = server.lastUsage;
        let alertSent = server.alertSent;

        if (usage !== null) {
          lastUsage = usage;
          status = usage >= 80 ? 'Warning' : 'Healthy';
          
          if (usage >= 80) {
            if (!alertSent) {
              await triggerEmailAlert(server, usage);
              alertSent = true;
            }
          } else {
            // Usage dropped below threshold
            alertSent = false;
          }
        } else {
          status = 'Offline';
        }

        await prisma.server.update({
          where: { id: server.id },
          data: {
            lastUsage,
            status,
            alertSent,
            lastChecked: new Date(),
          },
        });
      } catch (err) {
        console.error(`[Server Scanner] Error scanning server ${server.name} (${server.host}):`, err);
      }
    }
  } catch (dbErr) {
    console.error('[Server Scanner] Database fetch failed:', dbErr);
  }
  console.log('[Server Scanner] SSH capacity scan finished.');
}

/**
 * Triggers nodemailer notification for a server exceeding 80% usage threshold.
 */
async function triggerEmailAlert(server: any, usage: number) {
  try {
    const recipients = await prisma.emailRecipient.findMany();
    if (recipients.length === 0) {
      console.log('[Server Scanner] Warning alert triggered, but no email recipients configured.');
      return;
    }
    const to = recipients.map(r => r.email).join(', ');
    
    await sendEmail({
      to,
      subject: `🚨 SiteWatch Alert: Disk Usage Warning for Server [${server.name}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ef4444; margin-top: 0;">🚨 Disk Usage Warning Alert</h2>
          <p>This is an automated notification from your <strong>SiteWatch Monitor Portal</strong>.</p>
          <p>The disk usage on your external server <strong>${server.name}</strong> has reached or exceeded the warning threshold of 80%.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7; width: 40%;">Server Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${server.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7;">Host/IP</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${server.host}:${server.port}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7;">SSH User</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${server.username}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7;">Current Disk Usage</td>
              <td style="padding: 8px 0; color: #ef4444; font-weight: bold; border-bottom: 1px solid #edf2f7;">${usage}%</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7;">Status</td>
              <td style="padding: 8px 0; color: #ef4444; font-weight: bold; border-bottom: 1px solid #edf2f7;">Warning</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #edf2f7;">Last Checked</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          
          <p style="color: #4a5568; font-size: 14px;">Please connect to this server and clean up disk space to avoid service interruption.</p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <p style="font-size: 11px; color: #a0aec0; text-align: center;">SiteWatch website & server monitoring portal</p>
        </div>
      `
    });
    console.log(`[Server Scanner] Warning email successfully sent to ${to} for server ${server.name}.`);
  } catch (err) {
    console.error('[Server Scanner] Failed to send warning email alert:', err);
  }
}
