import UserRepositories from '../users/repositories/user-repositories.js';
import { susunRencanaHarian } from './recommendation-service.js';
import PlanRepositories from '../plans/plan-repositories.js';
import AuraRepository from '../aura/aura-repository.js';
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

    // Rencana hari itu disusun dari aura yang dipilih pengguna, sehingga
    // pilihan aura benar-benar menentukan isinya.
    //
    // Selama aura belum dipilih rencana sengaja tidak dibuat. Rencana satu
    // tanggal hanya dibuat sekali dan tidak pernah disusun ulang, karena
    // menyusun ulang berarti menghapus butir lama beserta progres yang
    // melekat padanya. Menyusun rencana lebih dulu karena itu akan mengunci
    // rencana yang tidak mengenal aura untuk sisa hari itu.
    const auraHariIni = await AuraRepository.getToday(user.id, tanggal);
    if (!auraHariIni) {
      return response(res, 200, 'Aura hari ini belum dipilih', {
        awaiting_aura: true,
        streak: await PlanRepositories.getStreak(user.id, tanggal),
      });
    }

    const rencanaBaru = susunRencanaHarian(user, tanggal, auraHariIni.aura);
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
