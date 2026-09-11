import UserRepositories from '../users/repositories/user-repositories.js';
import { susunRencanaHarian } from './recommendation-service.js';
import PlanRepositories from '../plans/plan-repositories.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';

function tanggalLokal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const getRecommendationToday = async (req, res, next) => {
  try {
    const user = await UserRepositories.getUserById(req.user.id);
    if (!user) return next(new NotFoundError('Pengguna tidak ditemukan'));

    const tanggal = tanggalLokal();
    const rencanaBaru = susunRencanaHarian(user, tanggal);
    const rencana = await PlanRepositories.createPlanIfAbsent(
      user.id,
      { ...rencanaBaru, source: 'recommendation' },
      tanggal
    );
    return response(res, 200, 'Rencana harian tersusun', {
      ...rencana,
      streak: await PlanRepositories.getStreak(user.id, tanggal),
    });
  } catch (err) {
    next(err);
  }
};
