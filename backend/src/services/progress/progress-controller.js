import PlanRepositories from '../plans/plan-repositories.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';

export const getProgressToday = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await PlanRepositories.getTodayProgress(userId);

    return response(res, 200, 'Progress retrieved', {
      ...progress,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePlanItemProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return next(new NotFoundError('Status progres tidak valid'));
    }

    const result = await PlanRepositories.setItemProgress(userId, req.params.itemId, completed);
    if (!result.ok) return next(new NotFoundError('Butir rencana tidak ditemukan'));

    return response(res, 200, 'Progres rencana diperbarui', { streak: result.streak });
  } catch (err) {
    next(err);
  }
};
