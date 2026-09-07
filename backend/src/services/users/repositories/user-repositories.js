import { Pool } from "pg";
import { nanoid } from "nanoid";

class UserRepositories {
  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/smartfit';

    const isCloudDB = dbUrl.includes('neon.tech') || process.env.NODE_ENV === 'production';

    const poolConfig = {
      connectionString: dbUrl,
    };

    if (isCloudDB) poolConfig.ssl = { rejectUnauthorized: false };

    this.pool = new Pool(poolConfig);
  }

  async createUser(username, email, password, first_name, last_name, gender, weight, height, goal, age) {
    const id = nanoid(16);
    const bmi = weight / ((height / 100) ** 2);
    const bmi_category = 
      bmi < 18.5 ? 'Underweight' :
      bmi < 25 ? 'Normal' :
      bmi < 30 ? 'Overweight' : 'Obese';

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
      values: [id, username, email, password, first_name, last_name, gender, weight, height, goal, bmi, bmi_category, age]
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
      text: `SELECT id FROM users 
            WHERE (username = $1 OR email = $1) AND password = $2`,
      values: [username_email, password]
    }

    const result = await this.pool.query(query);
    if (result.rows.length === 0) return null;

    return result.rows[0].id;
  }
}

export default new UserRepositories();