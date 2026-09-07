import ProgressRepositories from './progress-repositoires.js';
import response from '../../utils/response.js';

export const getProgressToday = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await ProgressRepositories.getProgressToday(userId);
    const streak = await ProgressRepositories.getStreak(userId);

    return response(res, 200, 'Progress retrieved', {
      ...progress,
      streak: streak?.current_streak ?? 0,
    });
  } catch (err) {
    next(err);
  }
};

export const updateActivityProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { activity_id, completed } = req.body;

    const completedBool = completed === true || completed === 'true' || completed === 1;
    
    await ProgressRepositories.upsertActivityProgress(userId, activity_id, completedBool);

    // Cek dan update streak setiap kali activity diupdate
    if (completedBool) {
      await ProgressRepositories.updateStreak(userId);
    }

    const streak = await ProgressRepositories.getStreak(userId);

    return response(res, 200, 'Activity progress updated', {
      streak: streak?.current_streak ?? 0,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFoodProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { food_id, consumed } = req.body;

    const consumedBool = consumed === true || consumed === 'true' || consumed === 1;

    await ProgressRepositories.upsertFoodProgress(userId, food_id, consumedBool);

    if (consumedBool) {
      await ProgressRepositories.updateStreak(userId);
    }

    const streak = await ProgressRepositories.getStreak(userId);

    return response(res, 200, 'Food progress updated', {
      streak: streak?.current_streak ?? 0,
    });
  } catch (err) {
    next(err);
  }
};