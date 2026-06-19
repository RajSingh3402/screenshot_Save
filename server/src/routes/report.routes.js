import express from 'express';
import * as controller from '../controllers/report.controller.js';

const router = express.Router();

router.get('/', controller.getReports);
router.get('/:id/pdf', controller.getReportPdf);

export default router;
