# Spesifikasi Kebutuhan Perangkat Lunak

## AuraFit

**Versi:** 0.4 draft untuk peninjauan tim
**Tanggal:** 12 September 2026
**Mata kuliah:** Proyek Perangkat Lunak
**Dasar dokumen:** Project Charter AuraFit yang telah disetujui

## 1. Pendahuluan

### 1.1 Tujuan dokumen

Dokumen ini menjabarkan kebutuhan AuraFit sebagai dasar desain, implementasi, pengujian, penerimaan, dan pemeliharaan awal. Setiap kebutuhan memiliki identitas sehingga dapat ditelusuri ke user story, desain, dan bukti uji.

### 1.2 Ruang lingkup produk

AuraFit adalah aplikasi web bagi individu untuk mencatat aktivitas kebugaran dan asupan makanan harian. Sistem menyimpan rencana, progres, dan riwayat pada server agar data pada perangkat berbeda tetap konsisten. Sistem membantu pencatatan kebiasaan; sistem tidak melakukan diagnosis, konsultasi medis, atau menjanjikan hasil kesehatan.

### 1.3 Rujukan

1. Project Charter AuraFit, 7 September 2026.
2. Audit kondisi awal AuraFit.
3. Materi Tahapan Proyek Perangkat Lunak, 2026.

### 1.4 Istilah

| Istilah | Arti |
|---|---|
| Rencana harian | Kumpulan aktivitas dan makanan untuk satu pengguna pada satu tanggal. |
| Butir rencana | Satu aktivitas atau makanan di dalam rencana harian. |
| Progres | Status selesai atau dikonsumsi untuk satu butir rencana. |
| Riwayat | Rencana dan progres terdahulu yang tersimpan. |
| Ringkasan mingguan | Rekapitulasi tujuh hari berdasarkan data tersimpan. |

## 2. Deskripsi umum

### 2.1 Perspektif produk

AuraFit dikembangkan dari aplikasi SmartFit milik tim. Fokus pengembangan adalah keamanan akun, penyimpanan rencana dan progres pada server, konsistensi antarsesi, riwayat, ringkasan, serta umpan balik yang jujur saat penyimpanan gagal.

### 2.2 Kelas pengguna

| Kelas | Hak |
|---|---|
| Tamu | Melihat halaman awal, mendaftar, dan masuk. |
| Pengguna terdaftar | Mengelola profil dan seluruh catatan miliknya sendiri. |

Peran admin dan pelatih berada di luar cakupan.

### 2.3 Lingkungan operasi

| Komponen | Ketentuan |
|---|---|
| Antarmuka | React dan Vite pada peramban modern. |
| Layanan aplikasi | Express pada Node.js. |
| Basis data | PostgreSQL. |
| Penerapan | Lingkungan demonstrasi akademik berbasis layanan gratis. |
| Zona waktu | Asia/Jakarta untuk tanggal dan ringkasan pengguna. |

### 2.4 Batasan dan asumsi

- Rekomendasi memakai aturan berbasis data profil, bukan klaim AI klinis.
- Infrastruktur gratis dapat memiliki waktu bangun setelah tidak aktif.
- Peserta dan tanggal UAT ditetapkan tim sebelum pengujian penerimaan.
- Satuan yang dipakai: kilokalori, gram, sentimeter, kilogram, dan menit.

## 3. User story dan kriteria penerimaan

| ID | User story | Kriteria penerimaan |
|---|---|---|
| US-01 | Sebagai tamu, saya ingin mendaftar agar dapat memakai AuraFit. | Input wajib dan format tidak valid ditolak dengan pesan yang jelas. |
| US-02 | Sebagai pengguna, saya ingin masuk dengan aman. | Password tidak disimpan sebagai teks asli dan login sah berhasil. |
| US-03 | Sebagai pengguna, saya ingin catatan saya bersifat privat. | Permintaan atas data pengguna lain ditolak. |
| US-10 | Sebagai pengguna, saya ingin melihat rencana hari ini. | Rencana pada tanggal sama identik pada dua sesi. |
| US-20 | Sebagai pengguna, saya ingin menandai butir selesai. | Status tetap tersimpan setelah halaman dimuat ulang. |
| US-21 | Sebagai pengguna, saya ingin membatalkan penandaan yang salah. | Status kembali belum selesai dan tersimpan. |
| US-22 | Sebagai pengguna, saya ingin mengetahui kegagalan simpan. | Sistem tidak menampilkan sukses sebelum penyimpanan berhasil. |
| US-30 | Sebagai pengguna, saya ingin meninjau catatan terdahulu. | Data tanggal yang dipilih sesuai data tersimpan. |
| US-31 | Sebagai pengguna, saya ingin melihat ringkasan mingguan. | Nilai ringkasan sesuai perhitungan data uji. |

## 4. Kebutuhan fungsional

Prioritas memakai MoSCoW: **Must** wajib untuk penerimaan, **Should** bernilai tinggi namun dapat ditunda, dan **Could** dikerjakan bila waktu tersedia.

### 4.1 Akun dan autentikasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Sistem menerima pendaftaran dengan identitas, profil tubuh, dan tujuan pengguna. | Must |
| F-02 | Sistem memvalidasi kelengkapan, format, dan rentang input pendaftaran. | Must |
| F-03 | Sistem menyimpan password dengan hash satu arah, bukan teks asli. | Must |
| F-04 | Sistem menolak nama pengguna atau email yang sudah digunakan. | Must |
| F-05 | Sistem menerbitkan token akses dan token penyegar saat login sah. | Must |
| F-06 | Sistem memeriksa kepemilikan data pada setiap operasi pengguna. | Must |
| F-07 | Pengguna dapat mengubah berat, tinggi, umur, dan tujuan. | Should |

### 4.2 Rencana harian dan progres

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-10 | Sistem menyusun rencana dari kategori BMI dan tujuan pengguna. | Must |
| F-11 | Sistem menyimpan paling banyak satu rencana per pengguna per tanggal. | Must |
| F-12 | Sistem menampilkan rencana yang sama pada sesi dan perangkat berbeda. | Must |
| F-13 | Butir rencana menyimpan informasi yang cukup agar rencana lama dapat dibaca kembali. | Must |
| F-14 | Pengguna dapat membuat rencana manual ketika rekomendasi tidak tersedia. | Must |
| F-15 | Sistem membedakan keadaan memuat, gagal, dan belum ada rencana. | Must |
| F-20 | Pengguna dapat menandai dan membatalkan status satu butir rencana. | Must |
| F-21 | Progres melekat pada butir rencana dan tidak dapat berdiri sendiri. | Must |
| F-22 | Sistem memberi status berhasil, sedang diproses, atau gagal secara akurat. | Must |
| F-23 | Percobaan simpan ulang tidak menghasilkan progres ganda. | Must |
| F-24 | Alur pencatatan dapat diselesaikan menggunakan papan ketik. | Should |

### 4.3 Riwayat dan ringkasan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-30 | Pengguna dapat memilih tanggal dan melihat rencana beserta progresnya. | Must |
| F-31 | Sistem menampilkan ringkasan tujuh hari dari data tersimpan. | Must |
| F-32 | Ringkasan memisahkan jumlah aktivitas dan makanan selesai dari total rencana. | Must |
| F-33 | Pengguna dapat mengoreksi catatan tanggal lampau. | Could |
| F-40 | Sistem menghitung streak bila pengguna menyelesaikan setidaknya satu butir pada suatu hari. | Should |

## 5. Kebutuhan nonfungsional

| ID | Kebutuhan | Kategori |
|---|---|---|
| N-01 | Secret dan password tidak ikut tersimpan pada kode atau repositori. | Keamanan |
| N-02 | Endpoint yang mengubah data memeriksa autentikasi dan kepemilikan. | Keamanan |
| N-03 | Pesan gagal dapat dipahami pengguna dan tidak membocorkan detail teknis. | Keandalan |
| N-04 | Kontras teks utama minimal 4,5:1 dan fokus papan ketik terlihat. | Aksesibilitas |
| N-05 | Sasaran sentuh utama minimal 44 x 44 piksel. | Aksesibilitas |
| N-06 | Halaman tidak memiliki gulir mendatar pada lebar 320 piksel. | Kegunaan |
| N-07 | Aplikasi mendukung lebar ponsel, tablet, dan desktop. | Kegunaan |
| N-08 | Aset dan dependensi pihak ketiga memiliki lisensi yang dapat ditelusuri. | Legal |

## 6. Aturan bisnis dan data

1. Kategori BMI memakai ambang 18,5; 25; dan 30.
2. Tanggal rencana dan ringkasan memakai Asia/Jakarta.
3. Ringkasan mingguan dihitung dari jumlah butir selesai dibanding jumlah butir rencana, dipisahkan antara aktivitas dan makanan.
4. Satu `daily_plan` unik untuk pasangan pengguna dan tanggal.
5. Satu `plan_item_progress` hanya merujuk kepada satu butir rencana.

| Entitas | Tujuan |
|---|---|
| users | Identitas, profil tubuh, tujuan, dan kredensial pengguna. |
| daily_plans | Rencana pengguna pada satu tanggal. |
| daily_plan_items | Aktivitas dan makanan dalam suatu rencana. |
| plan_item_progress | Status progres tiap butir rencana. |
| authentications | Token penyegar yang aktif. |

## 7. Ketertelusuran dan pengujian

| Kriteria charter | Kebutuhan terkait | Bukti minimum |
|---|---|---|
| Rencana dan progres konsisten antarsesi | F-11, F-12, F-21 | Uji dua sesi atau perangkat. |
| Password tidak tersimpan asli | F-03, N-01 | Pemeriksaan basis data dan uji login. |
| Data pengguna tidak dapat diakses pengguna lain | F-06, N-02 | Uji negatif otorisasi. |
| Kegagalan simpan tidak terlihat sebagai sukses | F-22, F-23, N-03 | Uji gangguan jaringan dan ulang permintaan. |
| Riwayat dan ringkasan benar | F-30, F-31, F-32 | Perbandingan dengan data uji yang dihitung manual. |
| Tidak ada defect kritis pada alur wajib | Semua Must | Daftar defect, regresi, dan UAT. |

## 8. Keputusan terbuka

| ID | Keputusan | Usulan awal |
|---|---|---|
| K-01 | Peserta dan tanggal UAT | Tetapkan minimal dua peserta serta jadwal setelah desain disetujui. |
| K-02 | Prioritas Must, Should, Could | Manajer proyek meninjau sebelum baseline kebutuhan dibekukan. |
| K-03 | Struktur navigasi akhir | Hari Ini, Riwayat, Progres, dan Profil. |
| K-04 | Target kalori personal | Jangan menampilkan target personal sebelum aturan perhitungannya disetujui. |

## 9. Persetujuan dan perubahan

Versi ini adalah draft kerja. Perubahan kebutuhan harus mencatat ID requirement terdampak, alasan, dampak terhadap jadwal, desain, pengujian, dan pihak yang menyetujui.
