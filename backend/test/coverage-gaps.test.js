import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const [
  { default: PlanRepositories },
  { default: UserRepositories },
  { updatePlanItemProgress },
  { changePassword },
  { hashPassword, verifyPassword },
  { todayInJakarta },
] = await Promise.all([
  import('../src/services/plans/plan-repositories.js'),
  import('../src/services/users/repositories/user-repositories.js'),
  import('../src/services/progress/progress-controller.js'),
  import('../src/services/users/controller/user-controller.js'),
  import('../src/security/password.js'),
  import('../src/utils/date.js'),
]);

const BACKEND = fileURLToPath(new URL('..', import.meta.url));

function fakeRes() {
  const state = { status: null, body: null };
  return {
    state,
    status(code) { state.status = code; return this; },
    json(value) { state.body = value; return this; },
    end() { return this; },
  };
}

// F-23: percobaan menyimpan ulang tidak boleh menghasilkan catatan ganda.
// Jaminannya ada di dua tempat: kolom unik pada tabel dan penulisan upsert.
test('progres butir ditulis sebagai upsert, bukan insert baru tiap permintaan', async () => {
  const asliPool = PlanRepositories.pool;
  const asliStreak = PlanRepositories.getStreak;
  const kueri = [];

  PlanRepositories.pool = {
    query: async (sql, params) => {
      kueri.push({ sql, params });
      if (/SELECT i\.id/.test(sql)) return { rows: [{ id: 'item-1', plan_date: todayInJakarta() }] };
      return { rows: [] };
    },
  };
  PlanRepositories.getStreak = async () => 3;

  try {
    const pertama = await PlanRepositories.setItemProgress('user-1', 'item-1', true);
    const kedua = await PlanRepositories.setItemProgress('user-1', 'item-1', true);
    assert.deepEqual([pertama.ok, kedua.ok], [true, true]);

    const tulis = kueri.filter((k) => /INSERT INTO plan_item_progress/.test(k.sql));
    assert.equal(tulis.length, 2, 'setiap permintaan menulis tepat sekali');
    for (const k of tulis) {
      assert.match(k.sql, /ON CONFLICT \(plan_item_id\) DO UPDATE/);
    }
  } finally {
    PlanRepositories.pool = asliPool;
    PlanRepositories.getStreak = asliStreak;
  }
});

// F-24: progres melekat pada butir rencana. Kolom unik menjaga hubungan satu
// lawan satu, dan ON DELETE CASCADE menjaga progres tidak tertinggal.
test('migrasi mengikat progres pada satu butir rencana dan ikut terhapus', () => {
  const migrasi = readFileSync(
    path.join(BACKEND, 'migrations', '1780012000000_create-table-daily-plans.js'),
    'utf8'
  );
  const baris = migrasi.split('\n').find((l) => l.includes('plan_item_id:'));
  assert.ok(baris, 'kolom plan_item_id ada pada plan_item_progress');
  assert.match(baris, /unique: true/);
  assert.match(baris, /references: 'daily_plan_items\(id\)'/);
  assert.match(baris, /onDelete: 'CASCADE'/);
});

// F-06 dan N-02: butir milik akun lain tidak boleh tersentuh. Kueri kepemilikan
// tidak menemukan baris, sehingga permintaan dijawab 404 tanpa menulis apa pun.
test('progres butir milik akun lain ditolak tanpa menulis ke basis data', async () => {
  const asliPool = PlanRepositories.pool;
  let menulis = false;

  PlanRepositories.pool = {
    query: async (sql) => {
      if (/INSERT|UPDATE|DELETE/.test(sql)) menulis = true;
      return { rows: [] }; // butir tidak ditemukan untuk pengguna ini
    },
  };

  try {
    const res = fakeRes();
    let galat;
    await updatePlanItemProgress(
      { user: { id: 'penyusup' }, params: { itemId: 'item-milik-orang-lain' }, body: { completed: true } },
      res,
      (e) => { galat = e; }
    );
    assert.equal(menulis, false);
    assert.equal(galat?.statusCode, 404);
    assert.equal(res.state.body, null);
  } finally {
    PlanRepositories.pool = asliPool;
  }
});

// N-02: setiap kueri rencana menyertakan pemiliknya. Tanpa pemeriksaan ini,
// satu kueri baru yang lupa user_id dapat lolos tanpa terlihat.
test('setiap kueri pada rencana menyertakan user_id', () => {
  const sumber = readFileSync(
    path.join(BACKEND, 'src', 'services', 'plans', 'plan-repositories.js'),
    'utf8'
  );
  const kueri = sumber.match(/`[^`]*daily_plan[^`]*`/g) ?? [];
  assert.ok(kueri.length >= 5, 'kueri rencana ditemukan');
  // Penulisan butir memakai plan_id yang sudah diperiksa pemiliknya lebih dulu.
  const tanpaPemilik = kueri.filter(
    (q) => !/user_id/.test(q) && !/INSERT INTO daily_plan_items/.test(q)
  );
  assert.deepEqual(tanpaPemilik.map((q) => q.slice(0, 60)), []);
});

// F-08: jalur berhasil mengganti kata sandi, bukan hanya penolakannya.
test('kata sandi lama yang benar mengganti hash dan menghapus kata sandi lama', async () => {
  const asliPool = UserRepositories.pool;
  const lama = 'kataSandiLama1';
  const baru = 'kataSandiBaru9';
  const hashLama = await hashPassword(lama);
  let tersimpan;

  UserRepositories.pool = {
    query: async (sql, params) => {
      if (/^SELECT password/.test(sql.trim())) {
        return { rows: [{ password: null, password_hash: hashLama }] };
      }
      tersimpan = { sql, params };
      return { rows: [] };
    },
  };

  try {
    const res = fakeRes();
    let galat;
    await changePassword(
      { user: { id: 'user-1' }, body: { current_password: lama, new_password: baru } },
      res,
      (e) => { galat = e; }
    );
    assert.equal(galat, undefined);
    assert.equal(res.state.status, 200);
    assert.match(tersimpan.sql, /UPDATE users SET password_hash = \$2, password = NULL/);
    assert.equal(await verifyPassword(baru, tersimpan.params[1]), true);
    assert.equal(await verifyPassword(lama, tersimpan.params[1]), false);
  } finally {
    UserRepositories.pool = asliPool;
  }
});

// N-01: kunci dan kata sandi tidak boleh ikut ke repositori. Uji ini memeriksa
// berkas pada kondisi kerja saat ini; riwayat Git diperiksa terpisah.
test('tidak ada kunci atau kata sandi yang tertulis di berkas repositori', () => {
  const akar = path.join(BACKEND, '..');
  const lewati = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'images', 'screenshots']);
  const polaRahasia = [
    [/postgres(?:ql)?:\/\/[^\s'"$]+:[^\s'"$@]+@([^\s'"\/:]+)/i, 'URL basis data beserta kata sandi'],
    [/\b(ACCESS_TOKEN_KEY|REFRESH_TOKEN_KEY|CRON_SECRET|DATABASE_URL)\s*=\s*['"][^'"\n]{8,}/i, 'nilai variabel rahasia'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'kunci privat'],
    [/\bAIza[0-9A-Za-z_-]{20,}/, 'kunci Google API'],
    [/\bsk-[A-Za-z0-9]{20,}/, 'kunci API rahasia'],
  ];
  const temuan = [];

  const telusuri = (dir) => {
    for (const nama of readdirSync(dir)) {
      if (lewati.has(nama)) continue;
      const berkas = path.join(dir, nama);
      const info = statSync(berkas);
      if (info.isDirectory()) { telusuri(berkas); continue; }
      if (info.size > 512 * 1024) continue;
      if (!/\.(js|jsx|json|md|yml|yaml|env|example|txt|html|css|sql)$/i.test(nama)) continue;
      const isi = readFileSync(berkas, 'utf8');
      for (const [pola, arti] of polaRahasia) {
        const cocok = isi.match(pola);
        // Berkas contoh dan basis data uji lokal memakai penanda, bukan nilai
        // sebenarnya: postgresql://test:test@localhost dipakai agar uji dapat
        // berjalan tanpa kredensial nyata.
        const penanda = /contoh|example|placeholder|dummy|xxx|<your/i.test(cocok?.[0] ?? '');
        const lokalUji = /^(localhost|127\.0\.0\.1)$/i.test(cocok?.[1] ?? '');
        if (cocok && !penanda && !lokalUji) {
          temuan.push(`${path.relative(akar, berkas)}: ${arti}`);
        }
      }
    }
  };

  telusuri(akar);
  assert.deepEqual(temuan, []);
});
