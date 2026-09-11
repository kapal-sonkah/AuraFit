import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error('DATABASE_URL wajib diisi sebelum AuraFit terhubung ke database.');
}

const isNeon = connectionString.includes('neon.tech');

const poolConfig = { connectionString };
if (isNeon) poolConfig.ssl = { rejectUnauthorized: false };

const pool = new Pool(poolConfig);

export default pool;
