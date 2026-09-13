import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { createManualPlan } from './manual-plan-controller.js';

const router = Router();

router.post('/plans/manual', authenticateToken, createManualPlan);

export default router;
