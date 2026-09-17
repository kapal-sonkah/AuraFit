// Mengatur ulang kata sandi satu pengguna oleh admin, karena AuraFit belum
// memiliki layanan pengiriman email untuk tautan reset mandiri.
//
//   npm run reset-password -- <nama_pengguna>
//
// Skrip membuat kata sandi sementara, menyimpannya sebagai hash, mencabut semua
// refresh token pengguna itu, lalu mencetak kata sandi sementara satu kali.
// Serahkan lewat jalur pribadi dan minta pengguna segera menggantinya di Profil.
// Access token yang sudah terbit tetap berlaku hingga kedaluwarsa (paling lama
// tiga jam).
import dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';

dotenv.config();

const username = process.argv[2];
if (!username) {
  console.error('Pemakaian: npm run reset-password -- <nama_pengguna>');
  process.exit(1);
}
if (!process.env.REFRESH_TOKEN_KEY) {
  console.error('REFRESH_TOKEN_KEY wajib diisi agar sesi lama dapat dicabut.');
  process.exit(1);
}

const { default: UserRepositories } = await import('../src/services/users/repositories/user-repositories.js');
const { default: AuthenticationRepositories } = await import('../src/services/authentication/repositories/authentication-repositories.js');

let exitCode = 0;
try {
  const kataSandiSementara = randomBytes(12).toString('base64url');
  const userId = await UserRepositories.resetPasswordByUsername(username, kataSandiSementara);

  if (!userId) {
    console.error(`Pengguna "${username}" tidak ditemukan. Tidak ada yang diubah.`);
    exitCode = 1;
  } else {
    const dicabut = await AuthenticationRepositories.deleteRefreshTokensForUser(userId);
    console.log(`Kata sandi "${username}" diatur ulang. ${dicabut} sesi dicabut.`);
    console.log(`Kata sandi sementara: ${kataSandiSementara}`);
  }
} finally {
  await UserRepositories.pool.end();
}
process.exit(exitCode);
