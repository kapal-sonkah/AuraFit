import jwt from 'jsonwebtoken';
import pool from '../../../database/pool.js';

class AuthenticationRepositories {
  constructor() {
    this.pool = pool;
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

  // Tabel authentications hanya menyimpan token tanpa id pengguna, dan refresh
  // token tidak pernah kedaluwarsa. Sesi seorang pengguna karena itu dicabut
  // dengan membaca id di dalam setiap token. Token yang tidak dapat diverifikasi
  // dibiarkan, karena sudah pasti ditolak saat dipakai.
  async deleteRefreshTokensForUser(userId) {
    const result = await this.pool.query('SELECT token FROM authentications');
    const milikPengguna = result.rows
      .map((row) => row.token)
      .filter((token) => {
        try {
          return jwt.verify(token, process.env.REFRESH_TOKEN_KEY).id === userId;
        } catch {
          return false;
        }
      });

    if (milikPengguna.length) {
      await this.pool.query('DELETE FROM authentications WHERE token = ANY($1)', [milikPengguna]);
    }
    return milikPengguna.length;
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
