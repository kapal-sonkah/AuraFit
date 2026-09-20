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
  'sit to stand': ['Duduk-berdiri dari kursi', 'Berdiri dari kursi lalu duduk kembali perlahan, 10 kali sebanyak 3 set.'],
  'wall push-up': ['Push-up dinding', 'Push-up bertumpu pada dinding, 10 kali sebanyak 3 set.'],
  'seated chair exercises': ['Senam duduk di kursi', 'Gerakan lengan dan kaki sambil duduk di kursi selama 15 menit.'],
  'deep breathing': ['Latihan pernapasan dalam', 'Tarik napas dalam lalu hembuskan perlahan selama 10 menit untuk merilekskan tubuh.'],
  'balance exercise': ['Latihan keseimbangan', 'Berdiri dengan satu kaki di dekat pegangan, 30 detik per sisi, diulang 5 kali.'],
  'resistance band stretch': ['Peregangan dengan karet resistensi', 'Peregangan ringan memakai karet resistensi selama 15 menit.'],
  'stair walking': ['Naik turun tangga', 'Naik turun tangga dengan tempo nyaman selama 10 menit.'],
  'stationary bike': ['Sepeda statis', 'Mengayuh sepeda statis dengan beban ringan selama 20 menit.'],
  'treadmill walking': ['Jalan di treadmill', 'Berjalan di treadmill dengan kecepatan stabil selama 25 menit.'],
  'bodyweight squats': ['Squat tanpa beban', 'Squat tanpa beban, 12 kali sebanyak 3 set.'],
  'resistance band workout': ['Latihan karet resistensi', 'Latihan ringan seluruh tubuh memakai karet resistensi selama 20 menit.'],
  'casual badminton': ['Bulu tangkis santai', 'Bermain bulu tangkis santai selama 30 menit.'],
  hiking: ['Mendaki bukit', 'Mendaki jalur bukit selama 60 menit.'],
  futsal: ['Futsal', 'Bermain futsal selama 40 menit.'],
  'calisthenics circuit': ['Sirkuit kalistenik', 'Sirkuit push-up, dips, dan squat selama 30 menit.'],
  'step-ups': ['Naik turun bangku', 'Naik turun bangku atau kotak selama 20 menit.'],
  'dumbbell full body': ['Latihan dumbel seluruh tubuh', 'Latihan seluruh tubuh dengan dumbel ringan hingga sedang selama 30 menit.'],
  basketball: ['Bola basket', 'Bermain bola basket selama 40 menit.'],
  deadlift: ['Deadlift', 'Deadlift dengan barbel dan teknik yang benar, 5 set masing-masing 5 kali.'],
  'pull-ups': ['Pull-up', 'Pull-up pada palang, 4 set hingga hampir lelah.'],
  'rowing machine': ['Mesin dayung', 'Interval mesin dayung selama 20 menit.'],
  'trail running': ['Lari lintas alam', 'Berlari di jalur alam selama 40 menit.'],
  'kettlebell swing': ['Ayunan kettlebell', 'Ayunan kettlebell, 5 set masing-masing 20 kali.'],
  'box jumps': ['Lompat kotak', 'Lompat ke atas kotak, 4 set masing-masing 10 kali.'],
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
  'steamed tuna': 'Tuna kukus',
  'roasted chicken thigh': 'Paha ayam panggang', 'grilled tempeh': 'Tempe panggang', quinoa: 'Quinoa',
  'boiled broccoli': 'Brokoli rebus', 'boiled sweet potato': 'Ubi jalar rebus',
  'grilled chicken breast': 'Dada ayam panggang', 'whole wheat pasta': 'Pasta gandum utuh',
  'black beans': 'Kacang hitam', 'grilled tilapia': 'Ikan nila panggang', 'soba noodles': 'Mi soba',
  'lentil soup': 'Sup lentil', 'roasted chickpeas': 'Kacang arab panggang', 'baked potato': 'Kentang panggang',
  'boiled shrimp': 'Udang rebus', 'turkey breast': 'Dada kalkun', couscous: 'Kuskus',
};

// Sebagian butir katalog berbagi satu ikon, sehingga jenis makanan sulit
// dibedakan sekilas: tiga butir ayam memakai ikon yang sama, begitu pula tiga
// butir susu, tiga butir kacang, dan tiga butir ikan. Peta ini hanya menimpa
// ikon yang berulang; butir yang ikonnya sudah khas tetap memakai ikon katalog.
//
// Penimpaan ditaruh di sini, bukan di katalog, karena ikon adalah urusan
// tampilan: katalog backend tetap menyimpan data makanan apa adanya.
const FOOD_EMOJI = {
  grapefruit: '🍋',
  'grilled chicken breast': '🍖',
  'roasted chicken thigh': '🐔',
  'multigrain crackers': '🫓',
  couscous: '🥘',
  quinoa: '🌾',
  'sweet potato mash': '🫕',
  'lentil soup': '🍛',
  'grilled tilapia': '🐠',
  'sardines (in water)': '🥫',
  'tuna salad': '🥪',
  'boiled egg whites': '🍳',
  'soy milk': '🫗',
  'whey protein isolate': '💪',
  almonds: '🌰',
  'peanut butter': '🧈',
  'miso soup': '🥢',
  'grilled tempeh': '🍢',
  'beef jerky': '🥓',
  'turkey breast': '🦃',
};

// Butir yang dicatat sendiri oleh pengguna tidak membawa ikon apa pun. Tanpa
// cadangan ini petaknya tampil sebagai kotak berwarna yang kosong.
const FOOD_EMOJI_FALLBACK = '🍽️';

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

// Durasi aktivitas sudah tertulis di dalam keterangannya ("selama 30 menit"),
// sehingga tidak ada kolom baru yang perlu disimpan (K-05). Mengembalikan
// jumlah menit, atau null bila keterangannya tidak menyebut durasi.
export function activityMinutes(item) {
  const teks = ACTIVITY_COPY[keyOf(item?.name)]?.[1] ?? item?.description ?? '';
  const cocok = teks.match(/(\d+)\s*menit/i);
  return cocok ? Number(cocok[1]) : null;
}

export function presentActivity(item) {
  const copy = ACTIVITY_COPY[keyOf(item?.name)];
  return copy ? { ...item, name: copy[0], description: copy[1] } : item;
}

// Porsi dan kalori sama-sama opsional pada makanan yang dicatat sendiri, jadi
// hanya bagian yang terisi yang digabungkan.
export function foodMeta(food) {
  return [food.portion, food.kcal != null && food.kcal !== '' ? `${food.kcal} kcal` : '']
    .filter(Boolean)
    .join(' · ');
}

// Rencana yang tersimpan sebelum katalog makanan punya foto tidak membawa
// image, jadi butir katalog yang dikenal diarahkan ke fotonya menurut nama.
// Butir yang dicatat sendiri tidak punya foto dan tetap memakai ikon.
function foodImageOf(kunci) {
  if (!FOOD_NAMES[kunci]) return null;
  return `/images/foods/${kunci.replace('(in water)', '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`;
}

export function presentFood(item) {
  const kunci = keyOf(item?.name);
  return {
    ...item,
    name: FOOD_NAMES[kunci] ?? item?.name,
    image: item?.image ?? foodImageOf(kunci),
    emoji: FOOD_EMOJI[kunci] ?? item?.emoji ?? FOOD_EMOJI_FALLBACK,
    portion: localizePortion(item?.portion),
  };
}
