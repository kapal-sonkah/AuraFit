const ACTIVITY_COPY = {
  'morning stretching': ['Peregangan pagi', 'Peregangan otot ringan selama 15 menit untuk membantu melancarkan sirkulasi darah.'],
  'leisurely walk': ['Jalan santai', 'Jalan santai di sekitar rumah selama 20 menit.'],
  'chair yoga': ['Yoga dengan kursi', 'Gerakan yoga ringan sambil duduk untuk meregangkan tulang belakang.'],
  'basic tai chi': ['Tai Chi dasar', 'Latihan pernapasan dan gerakan perlahan selama 15 menit.'],
  'neck & shoulder stretch': ['Peregangan leher dan bahu', 'Berfokus pada pelemasan otot tubuh bagian atas selama 10 menit.'],
  'marching in place': ['Jalan di tempat', 'Berjalan di tempat sambil menonton televisi selama 15 menit.'],
  'basic yoga': ['Yoga dasar', 'Gerakan yoga ringan selama 30 menit untuk meningkatkan kelenturan.'],
  'brisk walking': ['Jalan cepat', 'Berjalan dengan langkah cepat selama 30 menit untuk meningkatkan detak jantung.'],
  'beginner pilates': ['Pilates pemula', 'Latihan otot inti ringan selama 20 menit.'],
  'leisurely cycling': ['Bersepeda santai', 'Bersepeda santai di rute datar selama 30 menit.'],
  'light aerobics': ['Aerobik ringan', 'Aerobik berdampak rendah selama 25 menit.'],
  'evening walk': ['Jalan sore', 'Jalan santai sejauh 2–3 kilometer.'],
  'morning cardio run': ['Lari kardio pagi', 'Lari pagi selama 30 menit dengan kecepatan sedang.'],
  'intense cycling': ['Bersepeda intensif', 'Bersepeda dengan kecepatan sedang hingga cepat selama 45 menit.'],
  swimming: ['Berenang', 'Berenang gaya bebas secara berkelanjutan selama 30 menit.'],
  'zumba / aerobics': ['Zumba atau aerobik', 'Aerobik dengan intensitas sedang selama 45 menit.'],
  'bodyweight training': ['Latihan berat badan', 'Gabungan push-up, sit-up, dan lunge selama 30 menit.'],
  'evening jog': ['Joging sore', 'Joging ringan sejauh 3–5 kilometer.'],
  'hiit training': ['Latihan HIIT', 'Latihan interval intensitas tinggi selama 25 menit, termasuk burpee, mountain climber, dan squat jump.'],
  'jump rope': ['Lompat tali', 'Lompat tali selama 20 menit secara terus-menerus atau dengan jeda singkat.'],
  'sprint intervals': ['Interval sprint', 'Lari sprint 30 detik bergantian dengan jalan 1 menit, diulang 10 kali.'],
  'strength training': ['Latihan kekuatan', 'Latihan beban dengan dumbel atau barbel yang berfokus pada kelompok otot besar.'],
  'basic crossfit': ['Sirkuit CrossFit dasar', 'Latihan sirkuit intensif yang menggabungkan kardio dan beban ringan.'],
  kickboxing: ['Kickboxing', 'Latihan kardio kickboxing intensitas tinggi selama 40 menit.'],
};

const FOOD_NAMES = {
  oatmeal: 'Oatmeal', banana: 'Pisang', 'greek yogurt': 'Yogurt Yunani',
  'whole wheat bread': 'Roti gandum utuh', 'boiled egg': 'Telur rebus', apple: 'Apel',
  'almond milk': 'Susu almond', almonds: 'Kacang almond', 'green tea': 'Teh hijau',
  strawberries: 'Stroberi', 'cucumber slices': 'Irisan mentimun', watermelon: 'Semangka',
  pear: 'Pir', 'chia seeds': 'Biji chia', 'carrot sticks': 'Potongan wortel',
  'rice cakes': 'Kue beras', 'soy milk': 'Susu kedelai', blueberries: 'Bluberi',
  'vegetable salad': 'Salad sayuran', 'boiled egg whites': 'Putih telur rebus',
  avocado: 'Alpukat', 'clear chicken soup': 'Sup ayam bening', 'steamed tofu': 'Tahu kukus',
  edamame: 'Edamame', 'dragon fruit': 'Buah naga', 'brown rice': 'Nasi merah',
  'cherry tomatoes': 'Tomat ceri', orange: 'Jeruk', papaya: 'Pepaya',
  'steamed spinach': 'Bayam kukus', 'multigrain crackers': 'Biskuit multigrain',
  'boiled corn': 'Jagung rebus', 'melon slices': 'Irisan melon', 'miso soup': 'Sup miso',
  'boiled pumpkin': 'Labu rebus', grapefruit: 'Jeruk bali', 'chicken breast': 'Dada ayam',
  'lean beef': 'Daging sapi tanpa lemak', salmon: 'Ikan salmon', 'protein shake': 'Minuman protein',
  'roasted asparagus': 'Asparagus panggang', 'peanut butter': 'Selai kacang',
  'cottage cheese': 'Keju cottage', 'tuna salad': 'Salad tuna', 'beef jerky': 'Dendeng sapi',
  'protein bar': 'Batang protein', 'sweet potato mash': 'Puree ubi jalar', 'mixed nuts': 'Kacang campur',
  'sardines (in water)': 'Sarden dalam air', 'whey protein isolate': 'Isolat protein whey',
  'roasted chicken thigh': 'Paha ayam panggang', 'grilled tempeh': 'Tempe panggang', quinoa: 'Quinoa',
  'boiled broccoli': 'Brokoli rebus', 'boiled sweet potato': 'Ubi jalar rebus',
  'grilled chicken breast': 'Dada ayam panggang', 'whole wheat pasta': 'Pasta gandum utuh',
  'black beans': 'Kacang hitam', 'grilled tilapia': 'Ikan nila panggang', 'soba noodles': 'Mi soba',
  'lentil soup': 'Sup lentil', 'roasted chickpeas': 'Kacang arab panggang', 'baked potato': 'Kentang panggang',
  'boiled shrimp': 'Udang rebus', 'turkey breast': 'Dada kalkun', couscous: 'Kuskus',
};

function keyOf(value) {
  return String(value || '').trim().toLocaleLowerCase('en-US');
}

function localizePortion(value) {
  return String(value || '')
    .replace(/\bpieces?\b/gi, 'butir')
    .replace(/\bglass(es)?\b/gi, 'gelas')
    .replace(/\btbsp\b/gi, 'sdm')
    .replace(/\bscoop(s)?\b/gi, 'takaran')
    .replace(/\bserving(s)?\b/gi, 'porsi');
}

export function presentActivity(item) {
  const copy = ACTIVITY_COPY[keyOf(item?.name)];
  return copy ? { ...item, name: copy[0], description: copy[1] } : item;
}

export function presentFood(item) {
  const name = FOOD_NAMES[keyOf(item?.name)];
  return name ? { ...item, name, portion: localizePortion(item.portion) } : { ...item, portion: localizePortion(item?.portion) };
}
