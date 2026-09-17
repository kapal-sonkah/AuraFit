/**
 * Email pengguna dibuat unik tanpa membedakan huruf besar dan kecil.
 *
 * Login menerima nama pengguna atau email. Selama email boleh ganda, login lewat
 * email dapat masuk ke akun yang salah, dan kata sandi tidak dapat diatur ulang
 * berdasarkan email dengan aman. Pendaftaran juga memeriksa email ganda lebih
 * dulu; indeks ini menjadi pengaman terakhir terhadap permintaan bersamaan.
 *
 * Migrasi ini gagal bila data yang ada sudah memuat email ganda. Periksa dengan
 * SELECT lower(email), count(*) FROM users GROUP BY 1 HAVING count(*) > 1;
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql('CREATE UNIQUE INDEX users_email_lower_unique ON users (lower(email))');
};

export const down = (pgm) => {
  pgm.sql('DROP INDEX users_email_lower_unique');
};
