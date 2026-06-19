import fs from 'fs';
import path from 'path';

export function initLogger() {
  // Save log file at root or active working directory
  const logFile = path.join(process.cwd(), 'server_logs.txt');
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    logStream.write(`[LOG ${new Date().toLocaleTimeString()}] ${msg}\n`);
    process.stdout.write(msg + '\n');
  };

  console.error = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    logStream.write(`[ERR ${new Date().toLocaleTimeString()}] ${msg}\n`);
    process.stderr.write(msg + '\n');
  };
}
