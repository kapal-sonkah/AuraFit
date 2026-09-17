import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const { default: PlanRepositories } = await import('../src/services/plans/plan-repositories.js');
const { todayInJakarta } = await import('../src/utils/date.js');

async function ubahProgres(planDate) {
  const tulis = [];
  const asli = { pool: PlanRepositories.pool, streak: PlanRepositories.getStreak };
  PlanRepositories.pool = {
    query: async (text) => {
      if (/SELECT i\.id, p\.plan_date/.test(text)) return { rows: [{ id: 'item-1', plan_date: planDate }] };
      tulis.push(text);
      return { rows: [] };
    },
  };
  PlanRepositories.getStreak = async () => 1;
  try {
    return { hasil: await PlanRepositories.setItemProgress('user-1', 'item-1', false), tulis };
  } finally {
    PlanRepositories.pool = asli.pool;
    PlanRepositories.getStreak = asli.streak;
  }
}

test('progres hari ini masih bisa dibatalkan', async () => {
  const { hasil, tulis } = await ubahProgres(todayInJakarta());
  assert.equal(hasil.ok, true);
  assert.equal(tulis.length, 1);
});

test('progres hari yang sudah lewat dikunci tanpa menulis ke basis data', async () => {
  const kemarin = todayInJakarta(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const { hasil, tulis } = await ubahProgres(kemarin);
  assert.equal(hasil.ok, false);
  assert.equal(hasil.locked, true);
  assert.equal(tulis.length, 0);
});
