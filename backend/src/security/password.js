import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const N = 16384;
const R = 8;
const P = 1;

function validPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export async function hashPassword(password, { allowShort = false } = {}) {
  if (typeof password !== 'string' || (!allowShort && !validPassword(password))) {
    throw new Error('Kata sandi minimal 8 karakter.');
  }

  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password, encodedHash) {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') return false;

  const [scheme, n, r, p, saltText, hashText] = encodedHash.split('$');
  const cost = { N: Number(n), r: Number(r), p: Number(p) };
  if (
    scheme !== 'scrypt' ||
    !Number.isInteger(cost.N) || !Number.isInteger(cost.r) || !Number.isInteger(cost.p) ||
    cost.N < 1024 || cost.r < 1 || cost.p < 1 ||
    !saltText || !hashText
  ) return false;

  try {
    const salt = Buffer.from(saltText, 'base64url');
    const expected = Buffer.from(hashText, 'base64url');
    const actual = await scrypt(password, salt, expected.length, cost);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function isAcceptablePassword(password) {
  return validPassword(password);
}
