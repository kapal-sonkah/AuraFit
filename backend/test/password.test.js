import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, isAcceptablePassword, verifyPassword } from '../src/security/password.js';

test('hash kata sandi tidak memuat plaintext dan dapat diverifikasi', async () => {
  const password = 'kata-sandi-kuat';
  const hash = await hashPassword(password);

  assert.match(hash, /^scrypt\$/);
  assert.equal(hash.includes(password), false);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('kata-sandi-salah', hash), false);
});

test('kata sandi baru memiliki panjang minimal delapan karakter', () => {
  assert.equal(isAcceptablePassword('1234567'), false);
  assert.equal(isAcceptablePassword('12345678'), true);
});
