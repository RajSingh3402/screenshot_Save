import express from 'express';
import * as controller from '../controllers/website.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

const requireWriteAccess = requireRoles(['Editor', 'Admin']);

router.get('/', controller.getWebsites);
router.post('/', requireWriteAccess, controller.createWebsite);
router.put('/:id', requireWriteAccess, controller.updateWebsite);
router.delete('/', requireWriteAccess, controller.deleteAllWebsites);
router.delete('/:id', requireWriteAccess, controller.deleteWebsite);
router.post('/bulk', requireWriteAccess, controller.bulkInsertWebsites);

export default router;
