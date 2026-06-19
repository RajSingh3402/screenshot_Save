import app from './app.js';
import { loadEnv } from './config/env.js';
import { initLogger } from './middleware/logger.js';
import { initDb } from './services/db.service.js';
import { initScheduler } from './services/scheduler.service.js';

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
