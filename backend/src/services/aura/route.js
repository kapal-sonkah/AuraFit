import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { getAuraToday, setAuraToday } from './aura-controller.js';

const router = Router();

router.get('/aura/today', authenticateToken, getAuraToday);
router.put('/aura/today', authenticateToken, setAuraToday);

export default router;
