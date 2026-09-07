import { Pool } from 'pg';
import { nanoid } from 'nanoid';

function toLocalDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

class PlanRepositories {
  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/aurafit';

    const isCloudDB = dbUrl.includes('neon.tech') || process.env.NODE_ENV === 'production';

    const poolConfig = { connectionString: dbUrl };
    if (isCloudDB) poolConfig.ssl = { rejectUnauthorized: false };

    this.pool = new Pool(poolConfig);
  }

  /**
   * Mengambil rencana pengguna untuk satu tanggal beserta status progresnya.
   * Mengembalikan null bila rencana untuk tanggal itu belum tersimpan.
   */
  async getPlan(userId, planDate = toLocalDateStr()) {
    const plan = await this.pool.query(
      'SELECT id, plan_date, source FROM daily_plans WHERE user_id = $1 AND plan_date = $2',
      [userId, planDate]
    );
    if (!plan.rows.length) return null;

    const { id, plan_date, source } = plan.rows[0];

    const items = await this.pool.query(`
      SELECT i.id, i.item_type, i.position, i.source_ref, i.name,
             i.description, i.image_url, i.video_url,
             COALESCE(p.completed, FALSE) AS completed
      FROM daily_plan_items i
      LEFT JOIN plan_item_progress p ON p.plan_item_id = i.id
      WHERE i.plan_id = $1
      ORDER BY i.item_type, i.position
    `, [id]);

    return {
      id,
      date: plan_date,
      source,
      activities: items.rows.filter(r => r.item_type === 'activity'),
      foods: items.rows.filter(r => r.item_type === 'food'),
    };
  }

  /**
   * Menyimpan rencana satu tanggal bila belum ada, lalu mengembalikannya.
   *
   * Penyimpanan berjalan dalam satu transaksi. Ketika dua permintaan tiba
   * bersamaan untuk pengguna dan tanggal yang sama, kendala unik menahan
   * penyimpanan kedua dan rencana yang sudah tersimpan dikembalikan apa
   * adanya. Rencana yang sudah ada tidak pernah ditimpa, sehingga rencana
   * hari itu tetap sama meskipun dibuka dari perangkat lain.
   */
  async createPlanIfAbsent(userId, { activities = [], foods = [], source = 'recommendation' } = {}, planDate = toLocalDateStr()) {
    const existing = await this.getPlan(userId, planDate);
    if (existing) return existing;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const planId = nanoid(16);
      const inserted = await client.query(`
        INSERT INTO daily_plans (id, user_id, plan_date, source)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, plan_date) DO NOTHING
        RETURNING id
      `, [planId, userId, planDate, source]);

      // Permintaan lain sudah menyimpan rencana untuk tanggal ini.
      if (!inserted.rows.length) {
        await client.query('ROLLBACK');
        return this.getPlan(userId, planDate);
      }

      const butir = [
        ...activities.map((a, k) => ['activity', k + 1, a]),
        ...foods.map((f, k) => ['food', k + 1, f]),
      ];

      for (const [tipe, posisi, isi] of butir) {
        await client.query(`
          INSERT INTO daily_plan_items
            (id, plan_id, item_type, position, source_ref, name, description, image_url, video_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          nanoid(16), planId, tipe, posisi,
          Number.isInteger(isi.id) ? isi.id : null,
          isi.name, isi.description ?? null, isi.image ?? null, isi.youtube_url ?? null,
        ]);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return this.getPlan(userId, planDate);
  }

  /**
   * Menandai satu butir rencana selesai atau belum.
   *
   * Kepemilikan diperiksa di dalam kueri: butir hanya tersentuh bila
   * rencananya milik pengguna yang meminta. Mengembalikan false bila butir
   * tidak ada atau bukan milik pengguna tersebut.
   */
  async setItemProgress(userId, planItemId, completed) {
    const milik = await this.pool.query(`
      SELECT i.id
      FROM daily_plan_items i
      JOIN daily_plans p ON p.id = i.plan_id
      WHERE i.id = $1 AND p.user_id = $2
    `, [planItemId, userId]);

    if (!milik.rows.length) return false;

    await this.pool.query(`
      INSERT INTO plan_item_progress (id, plan_item_id, completed, completed_at, updated_at)
      VALUES ($1, $2, $3::boolean, CASE WHEN $3::boolean THEN NOW() ELSE NULL END, NOW())
      ON CONFLICT (plan_item_id) DO UPDATE
        SET completed = EXCLUDED.completed,
            completed_at = EXCLUDED.completed_at,
            updated_at = NOW()
    `, [nanoid(16), planItemId, completed]);

    return true;
  }

  /**
   * Riwayat rencana pengguna pada rentang tanggal, beserta jumlah butir yang
   * selesai. Dipakai untuk riwayat harian dan ringkasan mingguan.
   */
  async getHistory(userId, fromDate, toDate) {
    const result = await this.pool.query(`
      SELECT p.plan_date,
             i.item_type,
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE pr.completed)::int AS selesai
      FROM daily_plans p
      JOIN daily_plan_items i ON i.plan_id = p.id
      LEFT JOIN plan_item_progress pr ON pr.plan_item_id = i.id
      WHERE p.user_id = $1 AND p.plan_date BETWEEN $2 AND $3
      GROUP BY p.plan_date, i.item_type
      ORDER BY p.plan_date DESC, i.item_type
    `, [userId, fromDate, toDate]);

    return result.rows;
  }
}

export default new PlanRepositories();
