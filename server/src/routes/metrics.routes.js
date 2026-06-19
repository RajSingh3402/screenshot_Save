import express from 'express';
import { getMetricsHistory } from '../controllers/metrics.controller.js';

const router = express.Router();

router.get('/', getMetricsHistory);

export default router;
