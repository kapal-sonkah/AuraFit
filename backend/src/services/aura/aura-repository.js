import { nanoid } from 'nanoid';
import pool from '../../database/pool.js';
import { todayInJakarta } from '../../utils/date.js';

class AuraRepository {
  constructor() {
    this.pool = pool;
  }

  async getToday(userId, date = todayInJakarta()) {
    const result = await this.pool.query(`
      SELECT aura_date, aura
      FROM daily_auras
      WHERE user_id = $1 AND aura_date = $2
    `, [userId, date]);

    return result.rows[0] ?? null;
  }

  async setToday(userId, aura, date = todayInJakarta()) {
    const result = await this.pool.query(`
      INSERT INTO daily_auras (id, user_id, aura_date, aura)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, aura_date) DO UPDATE
        SET aura = EXCLUDED.aura,
            updated_at = NOW()
      RETURNING aura_date, aura
    `, [nanoid(16), userId, date, aura]);

    return result.rows[0];
  }

  async getRange(userId, fromDate, toDate) {
    const result = await this.pool.query(`
      SELECT aura_date, aura
      FROM daily_auras
      WHERE user_id = $1 AND aura_date BETWEEN $2 AND $3
      ORDER BY aura_date
    `, [userId, fromDate, toDate]);

    return result.rows;
  }
}

export default new AuraRepository();
