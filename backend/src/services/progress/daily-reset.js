// scheduler/dailyReset.js — tambahkan reset streak
import cron from 'node-cron';
import db from './db.js';

cron.schedule('0 0 * * *', async () => {
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

}, { timezone: 'Asia/Jakarta' });