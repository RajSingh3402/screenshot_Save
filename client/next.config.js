import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const middlewarePath = path.join(__dirname, 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    fs.unlinkSync(middlewarePath);
    console.log('[Auto-Cleanup] Successfully deleted client/src/middleware.ts');
  }
} catch (err) {
  console.error('[Auto-Cleanup] Error deleting middleware.ts:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config updated to reload middleware - June 27 2026 16:38
};

export default nextConfig;

