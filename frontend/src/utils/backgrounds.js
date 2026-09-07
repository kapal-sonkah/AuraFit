// Latar halaman.
//
// Sebelumnya memakai dua berkas PNG berukuran 1,9 MB dan 0,8 MB yang ternyata
// foto stok berwatermark dan belum dilisensikan. Keduanya diganti gradien agar
// tidak ada masalah lisensi dan halaman tidak perlu memuat berkas besar.
//
// Bila kelak tersedia foto yang jelas lisensinya, cukup ganti nilai di berkas
// ini; seluruh halaman mengikutinya.

export const LATAR_UTAMA =
  'radial-gradient(120% 90% at 12% 0%, #16653480 0%, #14532d00 55%), ' +
  'radial-gradient(100% 80% at 88% 100%, #05966980 0%, #05966900 60%), ' +
  'linear-gradient(160deg, #0b1f16 0%, #123524 45%, #06120c 100%)';

export const LATAR_AUTENTIKASI =
  'radial-gradient(90% 70% at 50% 0%, #16653499 0%, #14532d00 60%), ' +
  'linear-gradient(200deg, #0d2318 0%, #14532d 55%, #071009 100%)';
