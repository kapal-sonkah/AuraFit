/**
 * Nilai makanan harus menjadi snapshot pada butir rencana, bukan dibaca lagi
 * dari katalog yang dapat berubah. Dengan begitu riwayat tetap dapat dihitung
 * secara konsisten.
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.addColumns('daily_plan_items', {
    portion: { type: 'VARCHAR(50)' },
    calorie_kcal: { type: 'INTEGER' },
    emoji: { type: 'VARCHAR(20)' },
  });
  pgm.addConstraint('daily_plan_items', 'daily_plan_item_calorie_valid',
    'CHECK (calorie_kcal IS NULL OR calorie_kcal >= 0)');
};

export const down = (pgm) => {
  pgm.dropConstraint('daily_plan_items', 'daily_plan_item_calorie_valid');
  pgm.dropColumns('daily_plan_items', ['portion', 'calorie_kcal', 'emoji']);
};
