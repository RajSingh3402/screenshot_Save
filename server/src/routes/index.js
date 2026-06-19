import express from 'express';
import authRouter from './auth.routes.js';
import websiteRouter from './website.routes.js';
import reportRouter from './report.routes.js';
import metricsRouter from './metrics.routes.js';
import userRouter from './user.routes.js';
import settingsRouter from './settings.routes.js';
import excelRouter from './excel.routes.js';
import { getCaptureProgress, triggerCapture } from '../controllers/capture.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public auth routes
router.use('/auth', authRouter);

// All other API routes require authentication
router.use(requireAuth);

// Admin-only routes
router.use('/users', requireRoles(['Admin']), userRouter);
router.use('/settings', requireRoles(['Admin']), settingsRouter);

// General protected routes (internally checking roles if needed)
router.use('/websites', websiteRouter);
router.use('/reports', reportRouter);
router.use('/metrics', metricsRouter);
router.use('/excel', excelRouter);

// Capture progress and trigger (Trigger is Editor/Admin, progress is all authenticated)
router.get('/capture-progress', getCaptureProgress);
router.post('/capture-now', requireRoles(['Editor', 'Admin']), triggerCapture);

export default router;
