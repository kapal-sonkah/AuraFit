/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    email: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    first_name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    last_name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    gender: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
    weight_kg: {
      type: 'DECIMAL(5,2)',
      notNull: true,
    },
    height_cm: {
      type: 'DECIMAL(5,2)',
      notNull: true
    },
    goal: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    bmi: {
      type: 'DECIMAL(4,2)',
    },
    bmi_category: {
      type: 'VARCHAR(20)',
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users');
};
