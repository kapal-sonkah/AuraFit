import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const [
  { default: PlanRepositories },
  { default: UserRepositories },
  { getRecommendationToday },
  { todayInJakarta },
  { JUMLAH_AKTIVITAS, JUMLAH_MAKANAN, susunRencanaHarian },
  { default: KATALOG },
] = await Promise.all([
  import('../src/services/plans/plan-repositories.js'),
  import('../src/services/users/repositories/user-repositories.js'),
  import('../src/services/recommendations/recommendation-controller.js'),
  import('../src/utils/date.js'),
  import('../src/services/recommendations/recommendation-service.js'),
  import('../src/services/recommendations/katalog.js'),
]);

// ambil() memotong permintaan sebesar isi kolamnya, sehingga jumlah yang
// melebihi katalog tidak menimbulkan galat, hanya menghasilkan butir lebih
// sedikit daripada angka yang tertulis. Uji ini menjaga agar angkanya tetap
// sesuai dengan apa yang benar-benar dapat disusun.
test('jumlah butir harian tidak melebihi isi katalog tiap tingkat', () => {
  for (const [tingkat, kolam] of Object.entries(KATALOG)) {
    assert.ok(
      JUMLAH_AKTIVITAS <= kolam.activities.length,
      `tingkat ${tingkat} hanya memuat ${kolam.activities.length} aktivitas, kurang dari ${JUMLAH_AKTIVITAS} yang diminta`
    );
    assert.ok(
      JUMLAH_MAKANAN <= kolam.foods.length,
      `tingkat ${tingkat} hanya memuat ${kolam.foods.length} makanan, kurang dari ${JUMLAH_MAKANAN} yang diminta`
    );
  }
});

test('rencana memuat butir sebanyak yang dijanjikan', () => {
  const rencana = susunRencanaHarian(
    { id: 'user-test', weight_kg: 62, height_cm: 168, goal: 'maintain_weight' },
    '2026-09-17',
    'seimbang'
  );
  assert.equal(rencana.activities.length, JUMLAH_AKTIVITAS);
  assert.equal(rencana.foods.length, JUMLAH_MAKANAN);
});

test('tanggal bawaan repository mengikuti Asia/Jakarta', async () => {
  const originalTimeZone = process.env.TZ;
  const originalPool = PlanRepositories.pool;
  process.env.TZ = 'Pacific/Kiritimati';

  let capturedDate;
  PlanRepositories.pool = {
    query: async (_query, params) => {
      capturedDate = params[1];
      return { rows: [] };
    },
  };

  try {
    await PlanRepositories.getPlan('user-test');
    assert.equal(capturedDate, todayInJakarta());
  } finally {
    PlanRepositories.pool = originalPool;
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

test('streak berjalan mundur berdasarkan tanggal kalender', async () => {
  const originalTimeZone = process.env.TZ;
  const originalPool = PlanRepositories.pool;
  process.env.TZ = 'Pacific/Kiritimati';
  PlanRepositories.pool = {
    query: async () => ({
      rows: [
        { plan_date: '2026-09-13', total: 2, selesai: 2 },
        { plan_date: '2026-09-12', total: 2, selesai: 2 },
        { plan_date: '2026-09-11', total: 2, selesai: 1 },
      ],
    }),
  };

  try {
    assert.equal(await PlanRepositories.getStreak('user-test', '2026-09-13'), 2);
  } finally {
    PlanRepositories.pool = originalPool;
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

test('endpoint rekomendasi mengembalikan rencana tersimpan sebelum menghitung ulang', async () => {
  const originalGetUserById = UserRepositories.getUserById;
  const originalGetPlan = PlanRepositories.getPlan;
  const originalGetStreak = PlanRepositories.getStreak;
  const originalCreatePlanIfAbsent = PlanRepositories.createPlanIfAbsent;
  const storedPlan = { id: 'saved-plan', activities: [], foods: [] };

  UserRepositories.getUserById = async () => ({
    id: 'user-test',
    weight_kg: 0,
    height_cm: 0,
    goal: 'maintain_weight',
  });
  PlanRepositories.getPlan = async () => storedPlan;
  PlanRepositories.getStreak = async () => 2;
  PlanRepositories.createPlanIfAbsent = async () => {
    throw new Error('rekomendasi tidak boleh dipanggil untuk rencana tersimpan');
  };

  let body;
  let nextError;
  const res = {
    status() { return this; },
    json(value) { body = value; return this; },
    end() { return this; },
  };

  try {
    await getRecommendationToday({ user: { id: 'user-test' } }, res, (error) => {
      nextError = error;
    });
    assert.equal(nextError, undefined);
    assert.equal(body.data.id, 'saved-plan');
    assert.equal(body.data.streak, 2);
  } finally {
    UserRepositories.getUserById = originalGetUserById;
    PlanRepositories.getPlan = originalGetPlan;
    PlanRepositories.getStreak = originalGetStreak;
    PlanRepositories.createPlanIfAbsent = originalCreatePlanIfAbsent;
  }
});
