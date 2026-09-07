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

  pgm.createTable('activity_progress', {
    id:          { type: 'VARCHAR(50)', primaryKey: true },
    user_id:     { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    date:        { type: 'date', notNull: true },
    activity_id: { type: 'int', notNull: true },
    completed:   { type: 'boolean', default: false },
  });
  pgm.addConstraint('activity_progress', 'unique_activity_progress', 'UNIQUE(user_id, date, activity_id)');

  pgm.createTable('food_progress', {
    id:       { type: 'VARCHAR(50)', primaryKey: true },
    user_id:  { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    date:     { type: 'date', notNull: true },
    food_id:  { type: 'int', notNull: true },
    consumed: { type: 'boolean', default: false },
  });
  pgm.addConstraint('food_progress', 'unique_food_progress', 'UNIQUE(user_id, date, food_id)');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('activity_progress');
  pgm.dropTable('food_progress');
};
