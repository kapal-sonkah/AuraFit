import KATALOG, { TINGKAT } from './katalog.js';

// Penyusunan rencana harian dari aturan yang tertulis, menggantikan layanan
// klasifikasi terdahulu.
//
// Layanan lama memuat model Keras untuk memetakan berat badan dan BMI menjadi
// salah satu dari empat tingkat intensitas, lalu mengambil butir secara acak
// dari katalog tetap. Karena katalognya memang tetap dan pemetaannya dapat
// dinyatakan sebagai aturan, keduanya dipindahkan ke sini. Akibatnya rencana
// harian menjadi dapat dihitung di muka dan dapat diuji, dan sistem tidak lagi
// memerlukan TensorFlow.

export const KATEGORI_BMI = [
  { nama: 'Underweight', batasAtas: 18.5 },
  { nama: 'Normal', batasAtas: 25 },
  { nama: 'Overweight', batasAtas: 30 },
  { nama: 'Obese', batasAtas: Infinity },
];

export function hitungBmi(beratKg, tinggiCm) {
  const tinggiM = tinggiCm / 100;
  if (!(tinggiM > 0)) throw new Error('Tinggi badan harus lebih besar dari nol');
  if (!(beratKg > 0)) throw new Error('Berat badan harus lebih besar dari nol');
  return beratKg / (tinggiM ** 2);
}

export function kategoriBmi(bmi) {
  return KATEGORI_BMI.find((k) => bmi < k.batasAtas).nama;
}

// Intensitas dasar menurut kategori BMI.
//
// Underweight tidak diberi intensitas tertinggi karena tujuannya menambah
// massa, bukan membakar. Obese dimulai dari tingkat paling ringan agar beban
// sendi tidak berlebihan pada awal program.
const INTENSITAS_DASAR = {
  Underweight: 'Light',
  Normal: 'Moderate',
  Overweight: 'Light',
  Obese: 'Sedentary',
};

// Penyesuaian satu tingkat menurut tujuan pengguna.
const GESER_TUJUAN = {
  lose_weight: 1,
  maintain_weight: 0,
  gain_weight: -1,
};

// Nilai goal pernah ditulis dengan tanda hubung pada bagian lain kode, karena
// itu dinormalkan lebih dulu. Nilai yang tidak dikenali tidak menggeser apa pun.
function normalkanTujuan(tujuan) {
  return String(tujuan ?? '').trim().toLowerCase().replace(/-/g, '_');
}

export function tentukanIntensitas(bmi, tujuan) {
  const dasar = INTENSITAS_DASAR[kategoriBmi(bmi)];
  const geser = GESER_TUJUAN[normalkanTujuan(tujuan)] ?? 0;
  const indeks = TINGKAT.indexOf(dasar) + geser;
  return TINGKAT[Math.min(Math.max(indeks, 0), TINGKAT.length - 1)];
}

// Pemilihan butir bersifat tetap untuk pasangan pengguna dan tanggal yang sama.
//
// Layanan lama memakai random.sample, sehingga satu pengguna dapat menerima
// rencana berbeda pada permintaan berulang di hari yang sama. Di sini urutan
// diacak memakai benih yang diturunkan dari identitas pengguna dan tanggal,
// sehingga hasilnya dapat dihitung ulang dan diuji.
function benih(teks) {
  let h = 2166136261;
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function acakBerbenih(nilaiBenih) {
  let s = nilaiBenih;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function ambil(daftar, jumlah, nilaiBenih) {
  const acak = acakBerbenih(nilaiBenih);
  const salinan = [...daftar];
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
  }
  return salinan.slice(0, Math.min(jumlah, salinan.length));
}

export const JUMLAH_AKTIVITAS = 3;
export const JUMLAH_MAKANAN = 6;

/**
 * Menyusun rencana harian untuk satu pengguna pada satu tanggal.
 *
 * Keluarannya berbentuk sama dengan tanggapan layanan rekomendasi terdahulu,
 * ditambah keterangan bmi, kategori, dan intensitas agar dasar penyusunannya
 * dapat ditelusuri.
 */
export function susunRencanaHarian({ id, weight_kg, height_cm, goal }, tanggal) {
  const bmi = hitungBmi(Number(weight_kg), Number(height_cm));
  const kategori = kategoriBmi(bmi);
  const intensitas = tentukanIntensitas(bmi, goal);
  const kolam = KATALOG[intensitas];

  const dasar = benih(`${id}|${tanggal}|${intensitas}`);

  return {
    bmi: Number(bmi.toFixed(2)),
    bmi_category: kategori,
    intensity: intensitas,
    activities: ambil(kolam.activities, JUMLAH_AKTIVITAS, dasar),
    foods: ambil(kolam.foods, JUMLAH_MAKANAN, dasar ^ 0x9e3779b9),
  };
}

export default { susunRencanaHarian, hitungBmi, kategoriBmi, tentukanIntensitas };
