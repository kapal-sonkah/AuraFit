/**
 * Rencana harian disimpan di server.
 *
 * Sebelumnya rencana hanya tersimpan di localStorage peramban, sedangkan
 * progres tersimpan di basis data. Kolom activity_id dan food_id pada tabel
 * progres berisi nomor 1 sampai 6 yang berasal dari keluaran layanan
 * rekomendasi. Nomor tersebut tidak menunjuk entitas tetap: kolam pilihannya
 * berbeda menurut kategori BMI, dan isinya diambil acak pada setiap
 * permintaan. Akibatnya progres yang tersimpan tidak dapat ditelusuri kembali
 * ke rencana yang menghasilkannya, dan pengguna yang berpindah perangkat
 * menerima rencana berbeda dengan progres lama yang tetap terbawa.
 *
 * Migrasi ini memindahkan rencana harian ke server dan memberinya identitas
 * yang stabil, sehingga progres dapat dikaitkan ke butir rencana yang tepat.
 *
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('daily_plans', {
    id:         { type: 'VARCHAR(50)', primaryKey: true },
    user_id:    { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    plan_date:  { type: 'date', notNull: true },
    // 'recommendation' bila berasal dari layanan rekomendasi,
    // 'manual' bila pengguna menyusun sendiri karena layanan tidak tersedia.
    source:     { type: 'VARCHAR(20)', notNull: true, default: 'recommendation' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Satu pengguna memiliki tepat satu rencana untuk satu tanggal. Kendala ini
  // yang membuat rencana tetap sama ketika akun dibuka dari perangkat lain.
  pgm.addConstraint('daily_plans', 'unique_daily_plan_per_user_date', 'UNIQUE(user_id, plan_date)');

  pgm.createTable('daily_plan_items', {
    id:          { type: 'VARCHAR(50)', primaryKey: true },
    plan_id:     { type: 'VARCHAR(50)', notNull: true, references: 'daily_plans(id)', onDelete: 'CASCADE' },
    // 'activity' atau 'food'
    item_type:   { type: 'VARCHAR(10)', notNull: true },
    // urutan tampil dalam rencana, dimulai dari 1
    position:    { type: 'int', notNull: true },
    // nomor asal dari layanan rekomendasi; disimpan sebagai rujukan, bukan
    // identitas. Kosong untuk butir yang dicatat manual.
    source_ref:  { type: 'int' },
    name:        { type: 'VARCHAR(150)', notNull: true },
    description: { type: 'text' },
    image_url:   { type: 'text' },
    video_url:   { type: 'text' },
  });

  pgm.addConstraint('daily_plan_items', 'daily_plan_item_type_valid',
    "CHECK (item_type IN ('activity', 'food'))");
  pgm.addConstraint('daily_plan_items', 'unique_daily_plan_item_position',
    'UNIQUE(plan_id, item_type, position)');

  // Progres melekat pada butir rencana, bukan pada nomor lepas. Karena satu
  // butir rencana hanya dimiliki satu pengguna pada satu tanggal, hubungannya
  // satu lawan satu dan tanggal tidak perlu disimpan ulang.
  pgm.createTable('plan_item_progress', {
    id:           { type: 'VARCHAR(50)', primaryKey: true },
    plan_item_id: { type: 'VARCHAR(50)', notNull: true, unique: true, references: 'daily_plan_items(id)', onDelete: 'CASCADE' },
    completed:    { type: 'boolean', notNull: true, default: false },
    completed_at: { type: 'timestamp' },
    updated_at:   { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Riwayat dan ringkasan mingguan membaca rencana berdasarkan pengguna dan
  // rentang tanggal.
  pgm.createIndex('daily_plans', ['user_id', 'plan_date']);
  pgm.createIndex('daily_plan_items', ['plan_id', 'item_type']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('plan_item_progress');
  pgm.dropTable('daily_plan_items');
  pgm.dropTable('daily_plans');
};
