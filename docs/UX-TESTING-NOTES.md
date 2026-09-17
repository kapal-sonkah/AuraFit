# Catatan UX Testing AuraFit

Status: hampir seluruh temuan sudah diperbaiki; sisa pekerjaan tercantum di bawah.
Tanggal dicatat: 2026-09-17

Catatan ini merangkum keluhan dari testing (termasuk masukan teman penguji)
dan temuan audit kode yang perlu ditindaklanjuti.

## Sudah diperbaiki

| Keluhan | Hasil | Commit |
|---|---|---|
| Aura tidak terhubung dengan aktivitas | Rencana baru disusun setelah aura dipilih; aura menggeser intensitas satu tingkat | `5c3767c` |
| Tombol "Masuk" di mobile | Kepala halaman tetap satu baris, 130px → 77px, huruf 12.8px → 15.2px | `c78ad84` |
| Circle di "Aktivitas Tercatat" | Donut dihapus; ternyata menimpa teks keterangan sekitar 65px | `fae8185` |
| Rencana manual tidak jelas tersimpan | Ternyata data hilang diam-diam (API 201 tanpa menulis); kini ditambahkan | `a53f2c2` |
| Jarak tombol "Beranda" di mobile | Halaman daftar 0px → 24px | `d7891ca` |
| Ikon makanan seragam | 67 makanan kini memakai 67 ikon berbeda, tanpa petak kosong | `397096f` |
| Nama "Steamed Tuna" belum diterjemahkan | Seluruh 67 makanan kini berbahasa Indonesia | `9eceb42` |
| Aktivitas terasa sedikit | 3 → 4 per hari (batas katalog 6 per tingkat) | `de27c9f` |
| Butir rencana tidak bisa dihapus | Butir manual punya tombol Hapus dengan konfirmasi; butir rekomendasi dan milik orang lain ditolak (404) | `05b6f83` |
| Riwayat tidak menampilkan kalori | Riwayat, kartu makanan, dan popup menampilkan "porsi · kalori" | `13d572d` |
| Urutan section dasbor di mobile | Di HP rencana hari ini tampil lebih dulu, Ringkasan pindah ke bawah | `f67abdb` |
| Tanggal dari basis data bergeser sehari | Kolom DATE kini selalu teks. Selain field `date`, ternyata streak, Riwayat, dan tanggal aura ikut salah hitung saat backend berjalan di luar UTC | `7886729` |
| CORS terbuka untuk semua origin | Hanya aurafit-wheat.vercel.app dan localhost | `3be0d3a` |
| Streak menuntut seluruh butir selesai | Hari dihitung bila minimal satu aktivitas selesai; SRS US-32/F-40, TC-22, dan decision log K-09 diperbarui (menunggu pengesahan) | `477ca4f` |
| Butir rencana belum bisa diedit | Butir manual punya tombol Ubah; status progresnya tidak berubah | `de99d4f` |
| Aktivitas manual tanpa gambar | Kotak bergaris diganti ilustrasi ikon aktivitas | `1dc5917` |
| Tidak ada alur lupa kata sandi | Reset oleh admin (`npm run reset-password -- <nama_pengguna>`) yang mencabut semua sesi, borang ganti kata sandi di Profil, petunjuk di halaman masuk, dan email unik | `d1cab74`, `4a2641f` |
| Line ending tidak konsisten | Seluruh berkas di repositori kini LF | `4077866` |
| Foto "Morning Stretching" rusak di produksi | Path katalog salah ketik (`morning-streching.jpg`); kini benar dan dijaga uji | `ce7770c` |
| Katalog hanya enam aktivitas per tingkat | 12 aktivitas per tingkat dengan foto berlisensi Pexels dan nama berbahasa Indonesia | `f38a4b8` |
| Gambar aktivitas lama tanpa lisensi yang jelas | 24 gambar lama, termasuk yang ber-watermark Vecteezy dan bertanda Healthwise, diganti foto Pexels; seluruh sumber tercatat di `docs/image-credits.md` | `17b5fce` |
| Aktivitas baru belum punya video | 24 aktivitas baru kini punya video YouTube yang dapat diputar di aplikasi | `f1c6896` |
| Header Hari ini, Riwayat, dan Profil berbeda di HP | Satu komponen header untuk ketiganya; tetap satu baris dengan empat tombol sampai lebar 360px | `edbc836` |
| Konten dasbor terpotong di kanan pada iPhone | Kolom dasbor kini boleh menyempit (`minmax(0, 1fr)`) | `2415ead` |
| Kartu aktivitas dalam satu baris tidak rata | Judul memakan dua baris dan tombol berada di dasar kartu | `b757c21` |
| Pendaftaran lewat API menerima jenis kelamin dan tujuan sembarang | `POST /register` kini memakai aturan yang sama dengan ubah profil | (commit ini) |

Seluruh perubahan di atas diuji pada Postgres lokal dengan backend berjalan di zona
Asia/Jakarta: 34 skenario API (termasuk email ganda, streak, ubah butir, ganti dan reset
kata sandi, pencabutan sesi, CORS) dan pemeriksaan tampilan di browser, termasuk layar
"pilih aura dulu".

## 1. Migrasi email unik belum dijalankan di Neon

- Migrasi `backend/migrations/1780300000000_unique-user-email.js` membuat indeks unik `lower(email)`.
- Belum dijalankan di produksi karena `DATABASE_URL` pada `backend/.env` ditolak Neon (password authentication failed); kredensialnya kemungkinan sudah diganti.
- Tanpa migrasi ini aplikasi tetap aman: pendaftaran memeriksa email ganda di tingkat aplikasi. Indeks hanya pengaman terakhir terhadap pendaftaran bersamaan.
- Langkah: perbarui `DATABASE_URL` di `backend/.env`, periksa duplikat dengan `SELECT lower(email), count(*) FROM users GROUP BY 1 HAVING count(*) > 1;`, lalu jalankan `npm run migrate up` di folder `backend`. Bila ada duplikat, rapikan dulu datanya.

## 2. Video YouTube lama yang tidak cocok dengan aktivitasnya

- Ke-24 tautan YouTube lama masih aktif dan dapat diputar di aplikasi (diperiksa lewat oEmbed pada 2026-09-17), tetapi beberapa isinya tidak sesuai:
  - Bersepeda santai (tingkat ringan) memakai video HIIT indoor cycling, yang justru intensitas tinggi.
  - Joging sore dan Interval sprint memakai video penjelasan ("apa yang terjadi pada tubuh…"), bukan latihan.
  - Sirkuit CrossFit dasar memakai video latihan dumbel.
- Perbaikan yang diharapkan: ganti dengan video tutorial atau latihan yang sesuai intensitas tingkatnya.

## 3. Catatan kecil

- Popup aktivitas: bila foto gagal dimuat, `onError` menyembunyikan foto lalu menampilkan elemen sesudahnya (paragraf deskripsi), bukan ilustrasi pengganti. Kartu di dasbor sudah benar.
- Access token yang sudah terbit tetap berlaku hingga tiga jam setelah reset kata sandi oleh admin; refresh token sudah dicabut.
- Pengiriman tautan reset lewat email belum ada. Dapat ditambahkan kelak bila tersedia layanan email.

## Checklist tindak lanjut

- [x] Hapus butir rencana manual
- [x] Tampilkan kalori di Riwayat
- [x] Urutan section dasbor di mobile
- [x] Tanggal dari basis data tetap teks
- [x] Batasi CORS
- [x] Aturan streak minimal satu aktivitas (menunggu pengesahan K-09)
- [x] Edit butir rencana manual
- [x] Ilustrasi untuk aktivitas tanpa gambar
- [x] Reset kata sandi oleh admin dan ganti kata sandi di Profil
- [x] Layar pilih aura dilihat di browser
- [x] Normalisasi line ending
- [ ] Jalankan migrasi email unik di Neon
- [x] Tambah 24 aktivitas dengan foto berlisensi Pexels
- [x] Tautan YouTube untuk 24 aktivitas baru
- [x] Ganti gambar aktivitas lama yang lisensinya tidak jelas
- [ ] Hapus 18 berkas gambar yang tidak dipakai dan tidak tercatat sumbernya
- [ ] Ganti video YouTube lama yang tidak cocok dengan aktivitasnya
