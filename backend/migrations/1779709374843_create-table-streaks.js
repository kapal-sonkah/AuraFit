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
  pgm.createTable('streaks', {
    id:                  { type: 'VARCHAR(50)', primaryKey: true },
    user_id:             { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE', unique: true },
    current_streak:      { type: 'int', default: 0 },
    longest_streak:      { type: 'int', default: 0 },
    last_completed_date: { type: 'date' },
    updated_at:          { type: 'timestamp', default: pgm.func('NOW()') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('streaks');
};
