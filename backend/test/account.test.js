import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.REFRESH_TOKEN_KEY ??= 'kunci-uji-refresh';

const [{ default: UserRepositories }, { default: AuthenticationRepositories }, { createUser, changePassword }] = await Promise.all([
  import('../src/services/users/repositories/user-repositories.js'),
  import('../src/services/authentication/repositories/authentication-repositories.js'),
  import('../src/services/users/controller/user-controller.js'),
]);

function resTiruan() {
  return { body: undefined, code: undefined, status(c) { this.code = c; return this; }, json(v) { this.body = v; return this; }, end() { return this; } };
}

const pendaftaran = {
  username: 'budi', email: '  Budi@Contoh.Test ', password: 'rahasia-123',
  first_name: 'Budi', last_name: 'Santoso', sex: 'male', weight: 60, height: 170, goal: 'maintain_weight', age: 21,
};

async function daftar(stubs) {
  const asli = { conflict: UserRepositories.findRegistrationConflict, create: UserRepositories.createUser };
  Object.assign(UserRepositories, stubs);
  const res = resTiruan();
  let galat;
  try {
    await createUser({ body: pendaftaran }, res, (e) => { galat = e; });
  } finally {
    UserRepositories.findRegistrationConflict = asli.conflict;
    UserRepositories.createUser = asli.create;
  }
  return { res, galat };
}

test('pendaftaran menolak email yang sudah terdaftar dengan pesan jelas', async () => {
  const { galat } = await daftar({
    findRegistrationConflict: async () => ({ username: false, email: true }),
    createUser: async () => { throw new Error('tidak boleh dipanggil'); },
  });
  assert.equal(galat?.statusCode, 400);
  assert.equal(galat.message, 'Email sudah terdaftar.');
});

test('email disimpan tanpa spasi dan dalam huruf kecil', async () => {
  let emailDiperiksa;
  let emailDisimpan;
  const { res } = await daftar({
    findRegistrationConflict: async (_u, email) => { emailDiperiksa = email; return { username: false, email: false }; },
    createUser: async (_u, email) => { emailDisimpan = email; return { id: 'user-baru' }; },
  });
  assert.equal(res.code, 201);
  assert.equal(emailDiperiksa, 'budi@contoh.test');
  assert.equal(emailDisimpan, 'budi@contoh.test');
});

test('pendaftaran bersamaan yang ditahan kendala unik dijawab 400, bukan 500', async () => {
  const { galat } = await daftar({
    findRegistrationConflict: async () => ({ username: false, email: false }),
    createUser: async () => { throw Object.assign(new Error('duplicate key'), { code: '23505' }); },
  });
  assert.equal(galat?.statusCode, 400);
  assert.doesNotMatch(galat.message, /duplicate key/);
});

test('kata sandi lama yang salah dijawab 400, bukan 401 yang dibaca sebagai sesi habis', async () => {
  const asli = UserRepositories.changePassword;
  UserRepositories.changePassword = async () => false;
  let galat;
  try {
    await changePassword({ user: { id: 'u1' }, body: { current_password: 'salah', new_password: 'baru-12345' } }, resTiruan(), (e) => { galat = e; });
    assert.equal(galat?.statusCode, 400);
  } finally {
    UserRepositories.changePassword = asli;
  }
});

test('ganti kata sandi menolak kata sandi baru yang terlalu pendek sebelum menyentuh basis data', async () => {
  const asli = UserRepositories.changePassword;
  UserRepositories.changePassword = async () => { throw new Error('tidak boleh dipanggil'); };
  let galat;
  try {
    await changePassword({ user: { id: 'u1' }, body: { current_password: 'lama-12345', new_password: 'pendek' } }, resTiruan(), (e) => { galat = e; });
    assert.equal(galat?.statusCode, 400);
  } finally {
    UserRepositories.changePassword = asli;
  }
});

test('pencabutan sesi hanya menghapus refresh token milik pengguna itu', async () => {
  const kunci = process.env.REFRESH_TOKEN_KEY;
  const milikBudi1 = jwt.sign({ id: 'budi' }, kunci);
  const milikBudi2 = jwt.sign({ id: 'budi', iat: 1 }, kunci);
  const milikAni = jwt.sign({ id: 'ani' }, kunci);
  const palsu = jwt.sign({ id: 'budi' }, 'kunci-lain');

  const originalPool = AuthenticationRepositories.pool;
  let dihapus = null;
  AuthenticationRepositories.pool = {
    query: async (text, params) => {
      if (text.startsWith('SELECT')) return { rows: [milikBudi1, milikAni, milikBudi2, palsu].map((token) => ({ token })) };
      dihapus = params[0];
      return { rows: [] };
    },
  };

  try {
    const jumlah = await AuthenticationRepositories.deleteRefreshTokensForUser('budi');
    assert.equal(jumlah, 2);
    assert.deepEqual(new Set(dihapus), new Set([milikBudi1, milikBudi2]));
  } finally {
    AuthenticationRepositories.pool = originalPool;
  }
});
