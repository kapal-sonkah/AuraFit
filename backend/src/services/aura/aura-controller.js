import ClientError from '../../exceptions/client-error.js';
import response from '../../utils/response.js';
import { todayInJakarta } from '../../utils/date.js';
import AuraRepository from './aura-repository.js';

const AURA_VALUES = new Set(['redup', 'tenang', 'seimbang', 'bersemangat', 'menyala']);

export const getAuraToday = async (req, res, next) => {
  try {
    const date = todayInJakarta();
    const record = await AuraRepository.getToday(req.user.id, date);

    return response(res, 200, 'Aura hari ini diambil', {
      date,
      aura: record?.aura ?? null,
    });
  } catch (error) {
    next(error);
  }
};

export const setAuraToday = async (req, res, next) => {
  try {
    const { aura } = req.body;
    if (!AURA_VALUES.has(aura)) {
      return next(new ClientError('Pilihan aura tidak valid'));
    }

    const record = await AuraRepository.setToday(req.user.id, aura);
    return response(res, 200, 'Aura hari ini disimpan', {
      date: record.aura_date,
      aura: record.aura,
    });
  } catch (error) {
    next(error);
  }
};
