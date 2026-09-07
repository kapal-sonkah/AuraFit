// Latar halaman.
//
// Sebelumnya memakai dua berkas PNG berukuran 1,9 MB dan 0,8 MB yang ternyata
// foto stok berwatermark dan belum dilisensikan. Keduanya diganti gradien agar
// tidak ada masalah lisensi dan halaman tidak perlu memuat berkas besar.
//
// Gradien disusun berlapis, bukan satu sapuan datar: dua sorot melengkung di
// sudut berlawanan memberi arah cahaya, sehingga bidang tidak terbaca sebagai
// blok warna tunggal.
//
// Bila kelak tersedia foto yang jelas lisensinya, letakkan di
// frontend/public/images/ lalu ganti nilai di bawah menjadi
// `url('/images/nama-berkas.jpg')`; seluruh halaman mengikutinya.

export const LATAR_UTAMA =
  'radial-gradient(140% 100% at 8% -10%, #22c55e33 0%, #16653400 45%), ' +
  'radial-gradient(110% 90% at 95% 105%, #0d948840 0%, #0d948800 55%), ' +
  'radial-gradient(90% 60% at 50% 45%, #14532d55 0%, #14532d00 70%), ' +
  'linear-gradient(165deg, #071310 0%, #0d2b1e 40%, #061a12 72%, #030b08 100%)';

export const LATAR_AUTENTIKASI =
  'radial-gradient(120% 80% at 50% -15%, #22c55e2e 0%, #14532d00 55%), ' +
  'radial-gradient(90% 70% at 10% 110%, #0d948836 0%, #0d948800 60%), ' +
  'linear-gradient(190deg, #071310 0%, #103a27 50%, #040f0a 100%)';
