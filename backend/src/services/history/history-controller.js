import PlanRepositories from '../plans/plan-repositories.js';
import ClientError from '../../exceptions/client-error.js';
import response from '../../utils/response.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function todayInJakarta() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}

function parseDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  return date;
}

function shiftDate(dateString, days) {
  const date = parseDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateString(date);
}

function storedDateString(value) {
  if (typeof value === 'string') return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function emptyDay(date) {
  return {
    date,
    hasPlan: false,
    activities: { total: 0, completed: 0 },
    foods: { total: 0, completed: 0 },
    total: 0,
    completed: 0,
    completionRate: 0,
  };
}

function buildDays(fromDate, toDate, rows) {
  const days = [];
  const byDate = new Map();
  const start = parseDate(fromDate);
  const end = parseDate(toDate);

  for (let timestamp = start.getTime(); timestamp <= end.getTime(); timestamp += DAY_MS) {
    const day = emptyDay(toDateString(new Date(timestamp)));
    days.push(day);
    byDate.set(day.date, day);
  }

  for (const row of rows) {
    const day = byDate.get(storedDateString(row.plan_date));
    if (!day) continue;

    const bucket = row.item_type === 'activity' ? day.activities : day.foods;
    bucket.total = Number(row.total) || 0;
    bucket.completed = Number(row.selesai) || 0;
    day.hasPlan = true;
  }

  for (const day of days) {
    day.total = day.activities.total + day.foods.total;
    day.completed = day.activities.completed + day.foods.completed;
    day.completionRate = day.total === 0 ? 0 : Math.round((day.completed / day.total) * 100);
  }

  return days;
}

function readDate(value, fallback) {
  if (value === undefined) return fallback;
  if (Array.isArray(value) || parseDate(value) === null) return null;
  return value;
}

export const getHistory = async (req, res, next) => {
  try {
    const today = todayInJakarta();
    const toDate = readDate(req.query.to, today);
    const fromDate = readDate(req.query.from, toDate ? shiftDate(toDate, -6) : null);

    if (!fromDate || !toDate) {
      return next(new ClientError('Rentang tanggal tidak valid'));
    }

    const from = parseDate(fromDate);
    const to = parseDate(toDate);
    const dayCount = Math.floor((to.getTime() - from.getTime()) / DAY_MS) + 1;

    if (from > to || dayCount > 31) {
      return next(new ClientError('Rentang riwayat maksimal 31 hari'));
    }

    const rows = await PlanRepositories.getHistory(req.user.id, fromDate, toDate);
    return response(res, 200, 'Riwayat rencana diambil', {
      from: fromDate,
      to: toDate,
      days: buildDays(fromDate, toDate, rows),
    });
  } catch (err) {
    next(err);
  }
};

export const getPlanByDate = async (req, res, next) => {
  try {
    if (parseDate(req.params.date) === null) {
      return next(new ClientError('Tanggal rencana tidak valid'));
    }

    const plan = await PlanRepositories.getPlan(req.user.id, req.params.date);
    return response(res, 200, 'Rencana tanggal diambil', plan);
  } catch (err) {
    next(err);
  }
};
