import { nanoid } from "nanoid";
import { hashPassword, verifyPassword } from '../../../security/password.js';
import pool from '../../../database/pool.js';

class UserRepositories {
  constructor() {
    this.pool = pool;
  }

  async createUser(username, email, password, first_name, last_name, gender, weight, height, goal, age) {
    const id = nanoid(16);
    const bmi = weight / ((height / 100) ** 2);
    const bmi_category = 
      bmi < 18.5 ? 'Underweight' :
      bmi < 25 ? 'Normal' :
      bmi < 30 ? 'Overweight' : 'Obese';

    const passwordHash = await hashPassword(password);
    const query = {
      text: `INSERT INTO users
        (id, username, email, password, password_hash, first_name, last_name, gender, weight_kg, height_cm, goal, bmi, bmi_category, age)
        VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id`,
      values: [id, username, email, passwordHash, first_name, last_name, gender, weight, height, goal, bmi, bmi_category, age]
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, first_name, last_name, email, gender, weight_kg, height_cm, goal, bmi, bmi_category, age FROM users WHERE id = $1',
      values: [id],
    };
    const user = await this.pool.query(query);
    return user.rows[0];
  }

  async verifyUserCredential(username_email, password) {
    const query = {
      text: `SELECT id, password, password_hash FROM users
            WHERE username = $1 OR email = $1
            LIMIT 1`,
      values: [username_email]
    }

    const result = await this.pool.query(query);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    if (user.password_hash) {
      return (await verifyPassword(password, user.password_hash)) ? user.id : null;
    }

    // Jalur sementara untuk akun lama. Setelah login yang sah, plaintext
    // segera diganti dengan hash dan tidak dipakai lagi pada login berikutnya.
    if (typeof user.password !== 'string' || user.password !== password) return null;
    const passwordHash = await hashPassword(password, { allowShort: true });
    await this.pool.query(
      'UPDATE users SET password_hash = $2, password = NULL WHERE id = $1 AND password_hash IS NULL',
      [user.id, passwordHash]
    );
    return user.id;
  }

  async getLegacyPasswordUsers(limit = 100) {
    const result = await this.pool.query(
      'SELECT id, password FROM users WHERE password_hash IS NULL AND password IS NOT NULL ORDER BY id LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  async replaceLegacyPassword(id, plaintextPassword, passwordHash) {
    const result = await this.pool.query(
      `UPDATE users
       SET password_hash = $3, password = NULL
       WHERE id = $1 AND password = $2 AND password_hash IS NULL`,
      [id, plaintextPassword, passwordHash]
    );
    return result.rowCount === 1;
  }
}

export default new UserRepositories();
