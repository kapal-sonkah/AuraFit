export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('daily_auras', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    aura_date: { type: 'date', notNull: true },
    aura: { type: 'VARCHAR(20)', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });
  pgm.addConstraint('daily_auras', 'unique_daily_aura_per_user_date', 'UNIQUE(user_id, aura_date)');
  pgm.addConstraint('daily_auras', 'daily_aura_value_valid', "CHECK (aura IN ('redup', 'tenang', 'seimbang', 'bersemangat', 'menyala'))");
  pgm.createIndex('daily_auras', ['user_id', 'aura_date']);
};

export const down = (pgm) => pgm.dropTable('daily_auras');