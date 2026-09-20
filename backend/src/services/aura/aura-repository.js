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

  // Aura hanya dapat ditulis selama rencana tanggal itu belum ada. Rencana
  // tersimpan sekali dan tidak pernah disusun ulang (F-11), jadi aura yang
  // diubah sesudahnya tidak lagi menggambarkan rencana. Pemeriksaan ada di
  // dalam kueri yang sama agar tidak terlewati oleh permintaan bersamaan.
  // Mengembalikan null bila rencana sudah ada.
  async setToday(userId, aura, date = todayInJakarta()) {
    const result = await this.pool.query(`
      INSERT INTO daily_auras (id, user_id, aura_date, aura)
      SELECT $1, $2, $3, $4
      WHERE NOT EXISTS (
        SELECT 1 FROM daily_plans WHERE user_id = $5 AND plan_date = $6
      )
      ON CONFLICT (user_id, aura_date) DO UPDATE
        SET aura = EXCLUDED.aura,
            updated_at = NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM daily_plans
          WHERE user_id = $5 AND plan_date = $6
        )
      RETURNING aura_date, aura
    `, [nanoid(16), userId, date, aura, userId, date]);

    return result.rows[0] ?? null;
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
