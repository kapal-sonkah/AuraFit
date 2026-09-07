import UserRepositories from '../users/repositories/user-repositories.js';
import { susunRencanaHarian } from './recommendation-service.js';
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

    const rencana = susunRencanaHarian(user, tanggalLokal());
    return response(res, 200, 'Rencana harian tersusun', rencana);
  } catch (err) {
    next(err);
  }
};
