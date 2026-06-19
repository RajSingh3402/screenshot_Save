import express from 'express';
import * as controller from '../controllers/excel.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/process', requireRoles(['Editor', 'Admin']), controller.processExcel);

export default router;
