/**
 * Satu check-in aura untuk setiap pengguna pada setiap hari.
 *
 * Migrasi ini hanya menambah tabel baru; riwayat rencana dan data pengguna
 * yang sudah ada tidak disentuh. Kendala unik membuat penyimpanan check-in
 * dapat diulang dengan aman ketika pengguna mengganti pilihannya.
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('daily_auras', {
    id:         { type: 'VARCHAR(50)', primaryKey: true },
    user_id:    { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    aura_date:  { type: 'date', notNull: true },
    aura:       { type: 'VARCHAR(20)', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  pgm.addConstraint('daily_auras', 'unique_daily_aura_per_user', 'UNIQUE(user_id, aura_date)');
  pgm.addConstraint('daily_auras', 'daily_aura_value_valid',
    "CHECK (aura IN ('redup', 'tenang', 'seimbang', 'bersemangat', 'menyala'))");
};

export const down = (pgm) => {
  pgm.dropTable('daily_auras');
};
