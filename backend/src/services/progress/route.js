import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { getProgressToday, updatePlanItemProgress } from './progress-controller.js';

const router = Router();

router.get('/today', authenticateToken, getProgressToday);
router.put('/plan-items/:itemId/progress', authenticateToken, updatePlanItemProgress);

export default router;
