import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { getRecommendationToday } from './recommendation-controller.js';

const router = Router();

router.get('/recommendations/today', authenticateToken, getRecommendationToday);

export default router;
