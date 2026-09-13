import UserRepositories from '../users/repositories/user-repositories.js';
import { susunRencanaHarian } from './recommendation-service.js';
import PlanRepositories from '../plans/plan-repositories.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import { todayInJakarta } from '../../utils/date.js';

export const getRecommendationToday = async (req, res, next) => {
  try {
    const user = await UserRepositories.getUserById(req.user.id);
    if (!user) return next(new NotFoundError('Pengguna tidak ditemukan'));

    const tanggal = todayInJakarta();
    const tersimpan = await PlanRepositories.getPlan(user.id, tanggal);
    if (tersimpan) {
      return response(res, 200, 'Rencana harian diambil dari penyimpanan', {
        ...tersimpan,
        streak: await PlanRepositories.getStreak(user.id, tanggal),
      });
    }

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
