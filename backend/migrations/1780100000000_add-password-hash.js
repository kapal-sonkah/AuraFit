/**
 * Kata sandi baru disimpan sebagai hasil scrypt. Kolom lama dipertahankan
 * sementara agar akun yang sudah ada dapat dimigrasikan secara terkontrol
 * melalui skrip backfill, lalu dikosongkan per akun.
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.addColumn('users', {
    password_hash: { type: 'VARCHAR(255)' },
  });
  pgm.alterColumn('users', 'password', { notNull: false });
};

export const down = (pgm) => {
  pgm.alterColumn('users', 'password', { notNull: true });
  pgm.dropColumn('users', 'password_hash');
};
