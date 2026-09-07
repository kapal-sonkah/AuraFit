import { Router } from 'express';
import authenticateToken from '../../middlewares/authentication.js';
import { getProgressToday, updateActivityProgress, updateFoodProgress } from './progress-controller.js';
import db from './db.js';

const router = Router();

router.get('/today', authenticateToken, getProgressToday);
router.post('/activity', authenticateToken, updateActivityProgress);
router.post('/food', authenticateToken, updateFoodProgress);

router.get('/cron/daily-reset', async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, '0');
    const d = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${y}-${m}-${d}`;

    // Reset streak user yang tidak menyelesaikan aktivitas kemarin
    await db.query(`
      UPDATE streaks
      SET current_streak = 0, updated_at = NOW()
      WHERE last_completed_date < $1 AND current_streak > 0
    `, [yesterdayStr]);

    res.status(200).json({ status: 'success', message: 'Streak reset check completed.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;