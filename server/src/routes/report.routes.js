import express from 'express';
import * as controller from '../controllers/report.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const requireWriteAccess = requireRoles(['Editor', 'Admin']);

router.get('/', controller.getReports);
router.get('/:id/pdf', controller.getReportPdf);
router.delete('/', requireWriteAccess, controller.deleteAllReports);

export default router;

