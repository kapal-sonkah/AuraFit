import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { createManualPlan, deleteManualItem } from './manual-plan-controller.js';

const router = Router();

router.post('/plans/manual', authenticateToken, createManualPlan);
router.delete('/plan-items/:itemId', authenticateToken, deleteManualItem);

export default router;
