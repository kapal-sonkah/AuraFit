import pg, { Pool } from 'pg';

// Kolom DATE dibiarkan sebagai teks YYYY-MM-DD. Bawaan pg mengubahnya menjadi
// Date pada tengah malam zona waktu server, sehingga toISOString() mundur satu
// hari di zona seperti Asia/Jakarta dan streak serta riwayat salah hitung.
// OID 1082 adalah tipe DATE.
pg.types.setTypeParser(1082, (value) => value);

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error('DATABASE_URL wajib diisi sebelum AuraFit terhubung ke database.');
}

const isNeon = connectionString.includes('neon.tech');

const poolConfig = { connectionString };
if (isNeon) poolConfig.ssl = { rejectUnauthorized: false };

const pool = new Pool(poolConfig);

export default pool;
