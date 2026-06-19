import express from 'express';
import * as controller from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', controller.getUsers);
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);
router.put('/:id/password', controller.resetPassword);
router.delete('/:id', controller.deleteUser);

export default router;
