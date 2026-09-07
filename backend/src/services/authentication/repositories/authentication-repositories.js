import { Pool } from "pg";

class AuthenticationRepositories {
  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/smartfit';

    const isCloudDB = dbUrl.includes('neon.tech') || process.env.NODE_ENV === 'production';

    const poolConfig = {
      connectionString: dbUrl,
    };

    if (isCloudDB) poolConfig.ssl = { rejectUnauthorized: false };

    this.pool = new Pool(poolConfig);
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      return false;
    }

    return result.rows[0];
  }
}

export default new AuthenticationRepositories();