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
  { default: AuraRepository },
] = await Promise.all([
  import('../src/services/plans/plan-repositories.js'),
  import('../src/services/users/repositories/user-repositories.js'),
  import('../src/services/recommendations/recommendation-controller.js'),
  import('../src/utils/date.js'),
  import('../src/services/recommendations/recommendation-service.js'),
  import('../src/services/recommendations/katalog.js'),
  import('../src/services/aura/aura-repository.js'),
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

test('rencana rekomendasi lama ditambah pilihan aktivitas tanpa menghapus progres', async () => {
  const asli = {
    getUserById: UserRepositories.getUserById,
    getPlan: PlanRepositories.getPlan,
    addItems: PlanRepositories.addItems,
    getStreak: PlanRepositories.getStreak,
    getToday: AuraRepository.getToday,
  };
  const tersimpan = {
    id: 'saved-plan',
    source: 'recommendation',
    activities: [
      { id: 'plan-item-1', source_ref: 1 },
      { id: 'plan-item-2', source_ref: 2 },
      { id: 'plan-item-3', source_ref: 3 },
      { id: 'plan-item-4', source_ref: 4 },
    ],
    foods: [],
  };
  let tambahan;

  UserRepositories.getUserById = async () => ({
    id: 'user-test', weight_kg: 62, height_cm: 168, goal: 'maintain_weight',
  });
  PlanRepositories.getPlan = async () => tersimpan;
  AuraRepository.getToday = async () => ({ aura: 'seimbang' });
  PlanRepositories.addItems = async (_userId, payload) => {
    tambahan = payload;
    return { ...tersimpan, activities: [...tersimpan.activities, ...payload.activities] };
  };
  PlanRepositories.getStreak = async () => 1;

  let body;
  try {
    await getRecommendationToday({ user: { id: 'user-test' } }, {
      status() { return this; },
      json(value) { body = value; return this; },
      end() { return this; },
    }, (error) => { throw error; });
    assert.equal(tambahan.source, 'recommendation');
    assert.equal(tambahan.activities.length, 2);
    assert.equal(body.data.activities.length, 6);
    assert.equal(body.data.streak, 1);
  } finally {
    UserRepositories.getUserById = asli.getUserById;
    PlanRepositories.getPlan = asli.getPlan;
    PlanRepositories.addItems = asli.addItems;
    PlanRepositories.getStreak = asli.getStreak;
    AuraRepository.getToday = asli.getToday;
  }
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

test('streak berjalan mundur selama tiap hari punya minimal satu aktivitas selesai', async () => {
  const originalTimeZone = process.env.TZ;
  const originalPool = PlanRepositories.pool;
  process.env.TZ = 'Pacific/Kiritimati';
  PlanRepositories.pool = {
    query: async () => ({
      rows: [
        { plan_date: '2026-09-13', aktivitas_selesai: 1 },
        { plan_date: '2026-09-12', aktivitas_selesai: 4 },
        { plan_date: '2026-09-11', aktivitas_selesai: 0 },
        { plan_date: '2026-09-10', aktivitas_selesai: 2 },
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

// pg bawaan mengubah kolom DATE menjadi Date pada tengah malam zona server,
// lalu toISOString() mundur satu hari di zona seperti Asia/Jakarta. Pool
// AuraFit menimpa parser itu agar tanggal tetap teks.
test('kolom DATE dari basis data tetap teks di zona waktu mana pun', async () => {
  const { default: pg } = await import('pg');
  const originalTimeZone = process.env.TZ;
  process.env.TZ = 'Asia/Jakarta';
  try {
    const hasil = pg.types.getTypeParser(1082)('2026-09-17');
    assert.equal(typeof hasil, 'string');
    assert.equal(hasil, '2026-09-17');
  } finally {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

// Path gambar yang salah ketik tidak menimbulkan galat, hanya gambar rusak di
// peramban. "morning-streching.jpg" sempat tampil rusak di produksi karena itu.
test('setiap gambar aktivitas di katalog benar-benar ada di frontend', async () => {
  const { existsSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  // URL.pathname tidak mendekode spasi dan diawali "/C:" di Windows, sehingga
  // seluruh gambar terbaca hilang bila folder proyek memuat spasi.
  const publik = fileURLToPath(new URL('../../frontend/public', import.meta.url));
  const hilang = Object.values(KATALOG)
    .flatMap((kolam) => kolam.activities)
    .filter((a) => !existsSync(publik + a.image))
    .map((a) => `${a.name}: ${a.image}`);
  assert.deepEqual(hilang, []);
});

test('setiap makanan di katalog punya foto yang benar-benar ada di frontend', async () => {
  const { existsSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const publik = fileURLToPath(new URL('../../frontend/public', import.meta.url));
  const hilang = Object.values(KATALOG)
    .flatMap((kolam) => kolam.foods)
    .filter((f) => !f.image || !existsSync(publik + f.image))
    .map((f) => `${f.name}: ${f.image}`);
  assert.deepEqual(hilang, []);
});

test('setiap aktivitas di katalog punya nama berbahasa Indonesia', async () => {
  const { presentActivity } = await import('../../frontend/src/utils/presentation.js');
  const namaSama = new Set(['Kickboxing', 'Futsal', 'Deadlift']);
  const belum = Object.values(KATALOG)
    .flatMap((kolam) => kolam.activities)
    .filter((a) => !namaSama.has(a.name) && presentActivity(a).name === a.name)
    .map((a) => a.name);
  assert.deepEqual(belum, []);
});
