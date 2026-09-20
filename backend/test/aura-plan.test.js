import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const [
  { tentukanIntensitas, susunRencanaHarian },
  { default: PlanRepositories },
  { default: AuraRepository },
  { default: UserRepositories },
  { getRecommendationToday },
] = await Promise.all([
  import('../src/services/recommendations/recommendation-service.js'),
  import('../src/services/plans/plan-repositories.js'),
  import('../src/services/aura/aura-repository.js'),
  import('../src/services/users/repositories/user-repositories.js'),
  import('../src/services/recommendations/recommendation-controller.js'),
]);

// Pengguna dengan BMI normal dan tujuan menjaga berat badan berada di tengah
// tangga intensitas, sehingga pergeseran ke dua arah masih terlihat.
const BMI_NORMAL = 22;

test('aura menggeser intensitas ke dua arah', () => {
  assert.equal(tentukanIntensitas(BMI_NORMAL, 'maintain_weight', 'seimbang'), 'Moderate');
  assert.equal(tentukanIntensitas(BMI_NORMAL, 'maintain_weight', 'redup'), 'Light');
  assert.equal(tentukanIntensitas(BMI_NORMAL, 'maintain_weight', 'menyala'), 'Vigorous');
});

test('tanpa aura intensitas sama seperti sebelum aura diperkenalkan', () => {
  assert.equal(
    tentukanIntensitas(BMI_NORMAL, 'maintain_weight', null),
    tentukanIntensitas(BMI_NORMAL, 'maintain_weight')
  );
});

// Kategori Obese sengaja dimulai dari tingkat paling ringan demi beban sendi.
// Aura tidak boleh membatalkan pertimbangan itu dengan lompatan besar.
test('aura tidak melompati batas keamanan intensitas pada kategori Obese', () => {
  const obese = 34;
  assert.equal(tentukanIntensitas(obese, 'maintain_weight', 'menyala'), 'Light');
  assert.equal(tentukanIntensitas(obese, 'maintain_weight', 'redup'), 'Sedentary');
});

test('aura berbeda menghasilkan daftar aktivitas yang berbeda', () => {
  const pengguna = { id: 'user-test', weight_kg: 62, height_cm: 168, goal: 'maintain_weight' };
  const redup = susunRencanaHarian(pengguna, '2026-09-17', 'redup');
  const menyala = susunRencanaHarian(pengguna, '2026-09-17', 'menyala');

  assert.notEqual(redup.intensity, menyala.intensity);
  assert.notDeepEqual(
    redup.activities.map((a) => a.name),
    menyala.activities.map((a) => a.name)
  );
});

test('penyimpanan aura memisahkan parameter untuk pemeriksaan rencana', async () => {
  const asli = AuraRepository.pool;
  let captured;
  AuraRepository.pool = {
    query: async (query, params) => {
      captured = { query, params };
      return { rows: [{ aura_date: '2026-09-20', aura: 'seimbang' }] };
    },
  };

  try {
    const result = await AuraRepository.setToday('user-test', 'seimbang', '2026-09-20');
    assert.deepEqual(result, { aura_date: '2026-09-20', aura: 'seimbang' });
    assert.match(captured.query, /daily_plans WHERE user_id = \$5 AND plan_date = \$6/);
    assert.deepEqual(captured.params.slice(1), [
      'user-test',
      '2026-09-20',
      'seimbang',
      'user-test',
      '2026-09-20',
    ]);
  } finally {
    AuraRepository.pool = asli;
  }
});

test('aura tidak dapat diubah setelah rencana hari itu tersusun', async () => {
  const { setAuraToday } = await import('../src/services/aura/aura-controller.js');
  const asli = AuraRepository.setToday;
  // Repositori mengembalikan null ketika rencana tanggal itu sudah ada.
  AuraRepository.setToday = async () => null;

  let nextError;
  let body;
  const res = {
    status() { return this; },
    json(value) { body = value; return this; },
  };
  try {
    await setAuraToday({ user: { id: 'user-test' }, body: { aura: 'menyala' } }, res, (e) => { nextError = e; });
    assert.equal(body, undefined);
    assert.equal(nextError?.statusCode, 409);
  } finally {
    AuraRepository.setToday = asli;
  }
});

test('rencana tidak disusun selama aura hari itu belum dipilih', async () => {
  const asli = {
    getUserById: UserRepositories.getUserById,
    getPlan: PlanRepositories.getPlan,
    getStreak: PlanRepositories.getStreak,
    createPlanIfAbsent: PlanRepositories.createPlanIfAbsent,
    getAuraToday: AuraRepository.getToday,
  };

  UserRepositories.getUserById = async () => ({
    id: 'user-test', weight_kg: 62, height_cm: 168, goal: 'maintain_weight',
  });
  PlanRepositories.getPlan = async () => null;
  PlanRepositories.getStreak = async () => 0;
  AuraRepository.getToday = async () => null;
  PlanRepositories.createPlanIfAbsent = async () => {
    throw new Error('rencana tidak boleh dibuat sebelum aura dipilih');
  };

  let body;
  let nextError;
  const res = {
    status() { return this; },
    json(value) { body = value; return this; },
    end() { return this; },
  };

  try {
    await getRecommendationToday({ user: { id: 'user-test' } }, res, (e) => { nextError = e; });
    assert.equal(nextError, undefined);
    assert.equal(body.data.awaiting_aura, true);
    assert.equal(body.data.activities, undefined);
  } finally {
    UserRepositories.getUserById = asli.getUserById;
    PlanRepositories.getPlan = asli.getPlan;
    PlanRepositories.getStreak = asli.getStreak;
    PlanRepositories.createPlanIfAbsent = asli.createPlanIfAbsent;
    AuraRepository.getToday = asli.getAuraToday;
  }
});
