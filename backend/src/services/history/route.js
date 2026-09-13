import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { getHistory, getPlanByDate } from './history-controller.js';

const router = Router();

router.get('/history', authenticateToken, getHistory);
router.get('/plans/:date', authenticateToken, getPlanByDate);

export default router;
