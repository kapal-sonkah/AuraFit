import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const { default: PlanRepositories } = await import('../src/services/plans/plan-repositories.js');

/**
 * Pool tiruan yang mencatat setiap kueri, sehingga uji dapat memeriksa perintah
 * apa saja yang benar-benar dikirim ke basis data.
 */
function poolTiruan(posisiTerpakai) {
  const queries = [];
  const client = {
    query: async (text, params) => {
      queries.push({ text, params });
      if (/FROM daily_plans/.test(text) && /FOR UPDATE/.test(text)) {
        return { rows: [{ id: 'plan-1' }] };
      }
      if (/MAX\(position\)/.test(text)) {
        return { rows: posisiTerpakai };
      }
      return { rows: [] };
    },
    release() {},
  };

  return {
    queries,
    pool: {
      connect: async () => client,
      query: async () => ({ rows: [] }),
    },
  };
}

async function jalankanAddItems(posisiTerpakai) {
  const originalPool = PlanRepositories.pool;
  const originalGetPlan = PlanRepositories.getPlan;
  const { queries, pool } = poolTiruan(posisiTerpakai);

  PlanRepositories.pool = pool;
  PlanRepositories.getPlan = async () => ({ id: 'plan-1', activities: [], foods: [] });

  try {
    await PlanRepositories.addItems('user-test', {
      activities: [{ name: 'Jalan santai 10 menit' }],
      foods: [{ name: 'Bubur ayam', portion: '1 mangkuk', kcal: 350 }],
    }, '2026-09-17');
    return queries;
  } finally {
    PlanRepositories.pool = originalPool;
    PlanRepositories.getPlan = originalGetPlan;
  }
}

// Posisi butir baru diambil dari parameter INSERT: [id, plan_id, item_type, position, ...]
function posisiPerJenis(queries) {
  const inserts = queries.filter((q) => /INSERT INTO daily_plan_items/.test(q.text));
  return Object.fromEntries(inserts.map((q) => [q.params[2], q.params[3]]));
}

test('penyimpanan manual tidak pernah menghapus butir rencana yang sudah ada', async () => {
  const queries = await jalankanAddItems([
    { item_type: 'activity', posisi: 3 },
    { item_type: 'food', posisi: 6 },
  ]);

  const sql = queries.map((q) => q.text).join('\n');
  assert.ok(
    !/\bDELETE\s+FROM\b|\bTRUNCATE\b/i.test(sql),
    'butir rencana tidak boleh dihapus: plan_item_progress merujuknya dengan ON DELETE CASCADE, '
    + 'sehingga menulis ulang rencana ikut menghapus progres dan streak hari itu'
  );
  assert.ok(queries.some((q) => /COMMIT/.test(q.text)), 'transaksi harus di-commit');
});

test('posisi butir baru melanjutkan nomor terakhir pada jenis yang sama', async () => {
  const queries = await jalankanAddItems([
    { item_type: 'activity', posisi: 3 },
    { item_type: 'food', posisi: 6 },
  ]);

  const posisi = posisiPerJenis(queries);
  assert.equal(posisi.activity, 4);
  assert.equal(posisi.food, 7);
});

test('rencana yang masih kosong mulai dari posisi pertama', async () => {
  const queries = await jalankanAddItems([]);

  const posisi = posisiPerJenis(queries);
  assert.equal(posisi.activity, 1);
  assert.equal(posisi.food, 1);
});
