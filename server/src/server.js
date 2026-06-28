import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { loadEnv } from './config/env.js';
import { initLogger } from './middleware/logger.js';
import { initDb } from './services/db.service.js';
import { initScheduler } from './services/scheduler.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically delete conflicting middleware.ts if it exists
try {
  const middlewarePath = path.resolve(__dirname, '..', '..', 'client', 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    fs.unlinkSync(middlewarePath);
    console.log('[Auto-Cleanup] Successfully deleted conflicting middleware.ts from client/src');
  }
} catch (cleanupErr) {
  console.error('[Auto-Cleanup] Failed to clean up middleware.ts:', cleanupErr.message);
}

// Ensure environment variables are loaded
loadEnv();

// Initialize remote logging overrides
initLogger();

const PORT = process.env.PORT || 8080;

async function startServer() {
  // Initialize Database connection via Prisma
  await initDb();
  
  // Register background schedule checkers
  initScheduler();

  // Start listener
  app.listen(PORT, () => {
    console.log(`SiteWatch backend API & server listening on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical server startup error:", err);
  process.exit(1);
});
