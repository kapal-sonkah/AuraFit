import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import PlanRepositories from './plan-repositories.js';
import { todayInJakarta } from '../../utils/date.js';

const MAX_ITEMS_PER_TYPE = 10;

function cleanText(value, field, { required = false, maxLength = 500 } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new InvariantError(`${field} wajib diisi.`);
    return null;
  }

  if (typeof value !== 'string') throw new InvariantError(`${field} tidak valid.`);
  const text = value.trim();
  if (required && text.length < 2) throw new InvariantError(`${field} wajib diisi.`);
  if (text.length > maxLength) throw new InvariantError(`${field} terlalu panjang.`);
  return text || null;
}

function cleanItem(item, type, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new InvariantError(`Butir ${type} ke-${index + 1} tidak valid.`);
  }

  const name = cleanText(item.name, `Nama ${type} ke-${index + 1}`, { required: true, maxLength: 150 });
  const description = cleanText(item.description, 'Deskripsi', { maxLength: 500 });
  const portion = cleanText(item.portion, 'Porsi', { maxLength: 80 });
  const emoji = cleanText(item.emoji, 'Ikon', { maxLength: 8 });

  let kcal = null;
  if (item.kcal !== undefined && item.kcal !== null && item.kcal !== '') {
    kcal = Number(item.kcal);
    if (!Number.isFinite(kcal) || kcal < 0 || kcal > 100000) {
      throw new InvariantError(`Kalori ${type} ke-${index + 1} tidak valid.`);
    }
  }

  return { name, description, portion, emoji, kcal };
}

export const deleteManualItem = async (req, res, next) => {
  try {
    const planDate = await PlanRepositories.deleteManualItem(req.user.id, req.params.itemId);
    if (!planDate) {
      return next(new NotFoundError('Butir tidak ditemukan atau bukan catatan manual.'));
    }

    return response(res, 200, 'Butir rencana dihapus', {
      ...(await PlanRepositories.getPlan(req.user.id, planDate)),
      streak: await PlanRepositories.getStreak(req.user.id, planDate),
    });
  } catch (error) {
    return next(error);
  }
};

export const createManualPlan = async (req, res, next) => {
  try {
    const { activities = [], foods = [] } = req.body ?? {};
    if (!Array.isArray(activities) || !Array.isArray(foods)) {
      return next(new InvariantError('Aktivitas dan makanan harus berupa daftar.'));
    }
    if (activities.length > MAX_ITEMS_PER_TYPE || foods.length > MAX_ITEMS_PER_TYPE) {
      return next(new InvariantError(`Maksimal ${MAX_ITEMS_PER_TYPE} aktivitas dan ${MAX_ITEMS_PER_TYPE} makanan.`));
    }
    if (activities.length + foods.length === 0) {
      return next(new InvariantError('Tambahkan minimal satu aktivitas atau makanan.'));
    }

    const planDate = todayInJakarta();

    // Batas dihitung terhadap isi rencana yang sudah tersimpan, karena
    // penyimpanan menambah butir pada rencana hari itu dan bukan menggantinya.
    const tersimpan = await PlanRepositories.getPlan(req.user.id, planDate);
    if ((tersimpan?.activities.length ?? 0) + activities.length > MAX_ITEMS_PER_TYPE
      || (tersimpan?.foods.length ?? 0) + foods.length > MAX_ITEMS_PER_TYPE) {
      return next(new InvariantError(
        `Rencana satu hari memuat paling banyak ${MAX_ITEMS_PER_TYPE} aktivitas dan ${MAX_ITEMS_PER_TYPE} makanan.`
      ));
    }

    const plan = await PlanRepositories.addItems(req.user.id, {
      activities: activities.map((item, index) => cleanItem(item, 'aktivitas', index)),
      foods: foods.map((item, index) => cleanItem(item, 'makanan', index)),
      source: 'manual',
    }, planDate);

    return response(res, 201, 'Rencana manual tersimpan', {
      ...plan,
      streak: await PlanRepositories.getStreak(req.user.id, planDate),
    });
  } catch (error) {
    return next(error);
  }
};
