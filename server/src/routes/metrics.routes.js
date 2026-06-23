import express from 'express';
import { getMetricsHistory, deleteAllMetrics } from '../controllers/metrics.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const requireWriteAccess = requireRoles(['Editor', 'Admin']);

router.get('/', getMetricsHistory);
router.delete('/', requireWriteAccess, deleteAllMetrics);

export default router;

