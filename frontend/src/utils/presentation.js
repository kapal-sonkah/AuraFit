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

const ACTIVITY_IMAGE_FALLBACK = '/images/activities/bodyweight-training.jpg';

// Aktivitas yang dicatat sendiri tidak selalu membawa image dari backend.
// Peta ini menjaga kartu tetap visual tanpa menyimpan URL gambar baru di data.
const ACTIVITY_IMAGE_BY_KEY = {
  swimming: '/images/activities/swimming.jpg',
  'zumba / aerobics': '/images/activities/zumba.jpg',
  'evening jog': '/images/activities/evening-jog.jpg',
  'morning cardio run': '/images/activities/morning-cardio-run.jpg',
  'trail running': '/images/activities/trail-running.jpg',
  'leisurely walk': '/images/activities/leisurely-walk.jpg',
  'brisk walking': '/images/activities/brisk-walking.jpg',
  'evening walk': '/images/activities/evening-walk.jpg',
  'treadmill walking': '/images/activities/treadmill-walking.jpg',
  'leisurely cycling': '/images/activities/leisurely-cycling.jpg',
  'intense cycling': '/images/activities/intense-cycling.jpg',
  'stationary bike': '/images/activities/stationary-bike.jpg',
  'basic yoga': '/images/activities/basic-yoga.jpg',
  'chair yoga': '/images/activities/chair-yoga.jpg',
  'morning stretching': '/images/activities/morning-stretching.jpg',
  'neck & shoulder stretch': '/images/activities/neck-shoulder-stretch.jpg',
  'deep breathing': '/images/activities/deep-breathing.jpg',
  'light aerobics': '/images/activities/light-aerobics.jpg',
  'futsal': '/images/activities/futsal.jpg',
  basketball: '/images/activities/basketball.jpg',
  'casual badminton': '/images/activities/casual-badminton.jpg',
  'calisthenics circuit': '/images/activities/calisthenics-circuit.jpg',
  'bodyweight training': '/images/activities/bodyweight-training.jpg',
  'strength training': '/images/activities/strength-training.jpg',
  'dumbbell full body': '/images/activities/dumbbell-full-body.jpg',
  'step-ups': '/images/activities/step-ups.jpg',
};

const ACTIVITY_IMAGE_RULES = [
  { terms: ['berenang', 'renang', 'swim'], image: '/images/activities/swimming.jpg' },
  { terms: ['jog', 'lari', 'run', 'sprint'], image: '/images/activities/evening-jog.jpg' },
  { terms: ['jalan', 'walking', 'treadmill'], image: '/images/activities/leisurely-walk.jpg' },
  { terms: ['sepeda', 'cycling', 'bike'], image: '/images/activities/leisurely-cycling.jpg' },
  { terms: ['yoga'], image: '/images/activities/basic-yoga.jpg' },
  { terms: ['peregangan', 'stretch'], image: '/images/activities/morning-stretching.jpg' },
  { terms: ['zumba', 'aerobik', 'aerobic'], image: '/images/activities/zumba.jpg' },
  { terms: ['futsal', 'sepak bola'], image: '/images/activities/futsal.jpg' },
  { terms: ['basket'], image: '/images/activities/basketball.jpg' },
  { terms: ['bulu tangkis', 'badminton'], image: '/images/activities/casual-badminton.jpg' },
  { terms: ['angkat beban', 'dumbbell', 'barbel', 'kekuatan', 'strength', 'gym'], image: '/images/activities/strength-training.jpg' },
  { terms: ['squat', 'kalistenik', 'push-up', 'push up', 'lunge'], image: '/images/activities/bodyweight-training.jpg' },
  { terms: ['tangga', 'bangku', 'step up'], image: '/images/activities/step-ups.jpg' },
  { terms: ['pernapasan', 'breathing'], image: '/images/activities/deep-breathing.jpg' },
];

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

const FOOD_IMAGE_FALLBACK = '/images/foods/vegetable-salad.jpg';

// Nama makanan manual biasanya lebih singkat daripada nama katalog, misalnya
// "ayam" alih-alih "chicken breast". Pencocokan kata kunci membuat input
// tersebut tetap mendapat foto lokal yang masuk akal.
const FOOD_IMAGE_RULES = [
  { terms: ['ayam panggang', 'grilled chicken'], image: '/images/foods/grilled-chicken-breast.jpg' },
  { terms: ['ayam', 'chicken'], image: '/images/foods/chicken-breast.jpg' },
  { terms: ['tuna'], image: '/images/foods/steamed-tuna.jpg' },
  { terms: ['ikan', 'fish', 'salmon'], image: '/images/foods/salmon.jpg' },
  { terms: ['nasi', 'rice'], image: '/images/foods/brown-rice.jpg' },
  { terms: ['sayur', 'salad', 'vegetable'], image: '/images/foods/vegetable-salad.jpg' },
  { terms: ['telur', 'egg'], image: '/images/foods/boiled-egg.jpg' },
  { terms: ['ubi', 'sweet potato'], image: '/images/foods/boiled-sweet-potato.jpg' },
  { terms: ['kentang', 'potato'], image: '/images/foods/baked-potato.jpg' },
  { terms: ['tempe'], image: '/images/foods/grilled-tempeh.jpg' },
  { terms: ['tahu', 'tofu'], image: '/images/foods/steamed-tofu.jpg' },
  { terms: ['mi', 'mie', 'noodle', 'soba'], image: '/images/foods/soba-noodles.jpg' },
  { terms: ['roti', 'bread'], image: '/images/foods/whole-wheat-bread.jpg' },
  { terms: ['jagung', 'corn'], image: '/images/foods/boiled-corn.jpg' },
  { terms: ['brokoli', 'broccoli'], image: '/images/foods/boiled-broccoli.jpg' },
  { terms: ['bayam', 'spinach'], image: '/images/foods/steamed-spinach.jpg' },
  { terms: ['kacang arab', 'chickpea'], image: '/images/foods/roasted-chickpeas.jpg' },
  { terms: ['almond'], image: '/images/foods/almonds.jpg' },
  { terms: ['kacang', 'nut'], image: '/images/foods/mixed-nuts.jpg' },
  { terms: ['quinoa'], image: '/images/foods/quinoa.jpg' },
  { terms: ['oat', 'havermut'], image: '/images/foods/oatmeal.jpg' },
  { terms: ['pisang', 'banana'], image: '/images/foods/banana.jpg' },
  { terms: ['apel', 'apple'], image: '/images/foods/apple.jpg' },
];

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

function activityImageOf(item) {
  if (item?.image) return item.image;

  const kunci = keyOf(item?.name);
  if (ACTIVITY_IMAGE_BY_KEY[kunci]) return ACTIVITY_IMAGE_BY_KEY[kunci];

  const teks = `${item?.name ?? ''} ${item?.description ?? ''}`.toLocaleLowerCase('id-ID');
  const cocok = ACTIVITY_IMAGE_RULES.find((rule) => rule.terms.some((term) => teks.includes(term)));
  return cocok?.image ?? ACTIVITY_IMAGE_FALLBACK;
}

export function presentActivity(item) {
  const copy = ACTIVITY_COPY[keyOf(item?.name)];
  return {
    ...item,
    ...(copy ? { name: copy[0], description: copy[1] } : {}),
    image: activityImageOf(item),
  };
}

// Porsi dan kalori sama-sama opsional pada makanan yang dicatat sendiri, jadi
// hanya bagian yang terisi yang digabungkan.
export function foodMeta(food, { includeCalories = true } = {}) {
  return [food.portion, includeCalories && food.kcal != null && food.kcal !== '' ? `${food.kcal} kcal` : '']
    .filter(Boolean)
    .join(' · ');
}

// Rencana yang tersimpan sebelum katalog makanan punya foto tidak membawa
// image, jadi butir katalog yang dikenal diarahkan ke fotonya menurut nama.
// Butir manual memakai alias kata kunci, lalu foto umum bila namanya baru.
function foodImageOf(kunci, item) {
  if (FOOD_NAMES[kunci]) {
    return `/images/foods/${kunci.replace('(in water)', '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`;
  }

  const teks = `${kunci} ${item?.description ?? ''}`.toLocaleLowerCase('id-ID');
  const cocok = FOOD_IMAGE_RULES.find((rule) => rule.terms.some((term) => teks.includes(term)));
  return cocok?.image ?? FOOD_IMAGE_FALLBACK;
}

export function presentFood(item) {
  const kunci = keyOf(item?.name);
  return {
    ...item,
    name: FOOD_NAMES[kunci] ?? item?.name,
    image: item?.image || foodImageOf(kunci, item),
    emoji: FOOD_EMOJI[kunci] ?? item?.emoji ?? FOOD_EMOJI_FALLBACK,
    portion: localizePortion(item?.portion),
  };
}
