# SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK

## AuraFit: Aplikasi Web Pencatatan Aktivitas Kebugaran dan Asupan Makanan Harian

**Versi:** 0.5 draft untuk peninjauan tim
**Tanggal:** 13 September 2026
**Mata kuliah:** Proyek Perangkat Lunak
**Dasar dokumen:** Project Charter AuraFit

MULAI-ISI

# BAB I. PENDAHULUAN

## 1.1 Tujuan Dokumen

Dokumen ini merupakan artefak Tahap Analisis Requirements pada siklus hidup
pengembangan perangkat lunak AuraFit. Isinya menjadi dasar desain,
implementasi, pengujian, dan penerimaan sistem.

Dokumen memuat empat keluaran yang diharapkan pada tahap ini: user story,
kriteria penerimaan, prioritas requirements, dan spesifikasi kebutuhan.

## 1.2 Ruang Lingkup Produk

AuraFit menyimpan rencana harian, progres pencatatan, dan riwayat pada satu
sumber data di server. Sasarannya adalah catatan yang dapat ditelusuri dan
konsisten ketika akun dibuka dari perangkat berbeda.

Cakupan dan batasan mengikuti Piagam Proyek AuraFit. Dokumen ini tidak
memperluas cakupan tersebut.

## 1.3 Definisi

Tabel 1.1  Definisi istilah

| Istilah | Arti |
|---|---|
| Rencana harian | Kumpulan butir aktivitas dan makanan yang disusun untuk seorang pengguna pada satu tanggal |
| Butir rencana | Satu aktivitas atau satu makanan di dalam rencana harian |
| Progres | Penandaan bahwa satu butir rencana telah diselesaikan atau dikonsumsi |
| Riwayat | Daftar rencana harian beserta progresnya pada rentang tanggal |
| Ringkasan mingguan | Rekapitulasi progres tujuh hari, dihitung dari data tersimpan |
| Layanan rekomendasi | Komponen penyusun rencana harian dari aturan berbasis BMI dan tujuan pengguna |
| Kondisi awal | Keadaan kode pada commit `f20c0ee`, tanggal 7 September 2026 |
| Implementasi saat ini | Perubahan terverifikasi sampai 13 September 2026, termasuk penyimpanan rencana, penyelarasan tanggal Asia/Jakarta, dan pembacaan fallback |

## 1.4 Metode Elisitasi

Requirements pada dokumen ini tidak diperoleh melalui wawancara pengguna.
Ketiadaan itu dinyatakan terbuka agar tidak disalahartikan sebagai hasil
penelitian lapangan.

Tabel 1.2  Sumber requirements

| Sumber | Yang diperoleh | Sifat |
|---|---|---|
| Piagam Proyek AuraFit | Tujuan, cakupan, dan sepuluh kriteria penerimaan | Disepakati tim, menunggu pengesahan |
| Audit Kondisi Awal | Kekurangan sistem yang terverifikasi terhadap kode | Bukti terperiksa |
| Telaah sistem berjalan | Perilaku yang sudah ada dan batasan lingkungan | Bukti terperiksa |

Validasi terhadap pengguna sasaran belum dilakukan. Kebutuhan yang bergantung
pada karakteristik pengguna nyata perlu ditinjau ulang setelah peserta uji
penerimaan ditetapkan.

## 1.5 Rujukan

[1] Piagam Proyek AuraFit, versi 0.3, 7 September 2026.

[2] Audit Kondisi Awal AuraFit terhadap commit `f20c0ee`, 7 September 2026.

[3] Decision Log AuraFit, baseline keputusan K-01 sampai K-08 untuk peninjauan tim dan dosen.

[4] Diagram AuraFit, artefak desain batas sistem, arsitektur, model data, dan alur utama.

[5] Matriks Test dan UAT AuraFit, rancangan verifikasi requirement dan kriteria penerimaan.

# BAB II. DESKRIPSI UMUM

## 2.1 Perspektif Produk

AuraFit dikembangkan dari kode SmartFit yang telah dimiliki tim. Kondisi awalnya
tercatat pada commit `f20c0ee` dan diperiksa melalui audit statis. Implementasi
terkini menyimpan rencana dan progres di server, menyediakan riwayat, dan
memisahkan alur profil, rencana manual, serta koreksi catatan. Audit awal
menemukan tiga kekurangan yang menjadi dasar kebutuhan pada dokumen ini:

1. Rencana harian tersimpan di peramban sedangkan progres tersimpan di basis
   data, sehingga keduanya dapat tidak sesuai.
2. Kata sandi tersimpan sebagai teks asli dan diverifikasi melalui perbandingan
   langsung di dalam kueri.
3. Antarmuka menandai pencatatan sebagai berhasil sebelum hasil penyimpanan
   diketahui.

## 2.2 Kelas Pengguna

Tabel 2.1  Kelas pengguna

| Kelas | Keterangan | Hak |
|---|---|---|
| Tamu | Belum masuk | Melihat halaman muka, mendaftar, masuk |
| Pengguna terdaftar | Sudah masuk | Seluruh fungsi pencatatan atas datanya sendiri |

Peran administrator dan pelatih berada di luar cakupan sesuai Piagam Proyek.

## 2.3 Lingkungan Operasi

Tabel 2.2  Lingkungan operasi

| Komponen | Teknologi |
|---|---|
| Antarmuka | React dan Vite, dijalankan pada peramban modern |
| Layanan aplikasi | Express 5 pada Node.js |
| Basis data | PostgreSQL |
| Penerapan | Lingkungan demonstrasi akademik berjenjang gratis |
| Zona waktu | Asia/Jakarta untuk tanggal rencana dan ringkasan |

## 2.4 Batasan Perancangan

1. Rekomendasi disusun dari aturan yang tertulis, bukan dari model. Pelatihan
   dan evaluasi model berada di luar cakupan.
2. Basis data pada jenjang gratis dapat tidur ketika menganggur, sehingga
   permintaan pertama setelah menganggur memerlukan waktu lebih lama.
3. Migrasi lama untuk tabel progres dan streak masih ada sebagai artefak basis
   data, tetapi jalur runtime saat ini memakai tabel rencana baru. Retensi atau
   penghapusannya belum diputuskan.
4. Perhitungan rekomendasi bukan diagnosis atau konsultasi medis.

# BAB III. USER STORY DAN KRITERIA PENERIMAAN

Setiap user story disertai kriteria penerimaan yang dapat diuji, dan menjadi
sumber kebutuhan fungsional pada Bab IV.

Tabel 3.1  User story akun dan profil

| ID | User story | Kriteria penerimaan |
|---|---|---|
| US-01 | Sebagai pengunjung, saya ingin mendaftar akun agar dapat mulai mencatat aktivitas dan asupan saya | Pendaftaran dengan data lengkap berhasil; data yang tidak lengkap atau di luar rentang wajar ditolak dengan pesan yang menyebut medan bersangkutan |
| US-02 | Sebagai pengguna, saya ingin kata sandi saya tersimpan aman agar akun saya tidak mudah diambil alih | Kata sandi tidak tersimpan sebagai teks asli, dan login yang sah tetap berhasil |
| US-03 | Sebagai pengguna, saya ingin data saya tidak dapat dilihat orang lain agar catatan pribadi saya terjaga | Permintaan atas data akun lain ditolak, meskipun memakai token yang sah |
| US-04 | Sebagai pengguna, saya ingin memperbarui data profil dan tubuh agar rencana harian tetap sesuai kondisi saya | Perubahan tersimpan dan dipakai pada penyusunan rencana berikutnya |

Tabel 3.2  User story rencana harian

| ID | User story | Kriteria penerimaan |
|---|---|---|
| US-10 | Sebagai pengguna, saya ingin menerima rencana aktivitas dan makanan setiap hari agar tahu apa yang perlu dilakukan | Rencana tersusun berdasarkan kategori BMI dan tujuan saya |
| US-11 | Sebagai pengguna, saya ingin rencana hari ini sama ketika saya buka dari ponsel maupun laptop agar catatan saya tidak kacau | Rencana pada tanggal yang sama terbaca identik dari sesi mana pun |
| US-12 | Sebagai pengguna, saya ingin tetap melihat rencana meskipun layanan rekomendasi bermasalah agar tetap dapat mencatat | Rencana yang sudah tersimpan terbaca tanpa memanggil layanan rekomendasi |
| US-13 | Sebagai pengguna, saya ingin menyusun rencana sendiri ketika rekomendasi tidak tersedia agar hari itu tidak terlewat | Rencana manual dapat dibuat dan diperlakukan sama dengan rencana rekomendasi |
| US-14 | Sebagai pengguna, saya ingin tahu apakah sistem sedang memuat atau gagal agar tidak menyangka aplikasinya rusak | Keadaan sedang memuat, gagal memuat, dan belum ada rencana ditampilkan berbeda |

Tabel 3.3  User story pencatatan

| ID | User story | Kriteria penerimaan |
|---|---|---|
| US-20 | Sebagai pengguna, saya ingin menandai aktivitas atau makanan sebagai selesai agar progres saya tercatat | Penandaan tersimpan dan tetap ada setelah halaman dimuat ulang |
| US-21 | Sebagai pengguna, saya ingin membatalkan penandaan yang keliru agar catatan saya benar | Pembatalan tersimpan, dan butir tidak lagi tertandai setelah dimuat ulang |
| US-22 | Sebagai pengguna, saya ingin tahu ketika pencatatan gagal tersimpan agar tidak salah mengira sudah tercatat | Kegagalan ditampilkan sebagai kegagalan, bukan keberhasilan, dan dapat dicoba lagi |
| US-23 | Sebagai pengguna, saya ingin mencoba menyimpan ulang tanpa takut catatan menjadi ganda | Permintaan berulang atas butir yang sama tidak menghasilkan catatan ganda |
| US-24 | Sebagai pengguna yang memakai papan ketik, saya ingin dapat mencatat tanpa tetikus agar tetap dapat memakai aplikasi | Seluruh alur pencatatan dapat diselesaikan dengan papan ketik, dan elemen terfokus terlihat |

Tabel 3.4  User story riwayat dan ringkasan

| ID | User story | Kriteria penerimaan |
|---|---|---|
| US-30 | Sebagai pengguna, saya ingin melihat catatan pada tanggal tertentu agar dapat meninjau kebiasaan saya | Rencana dan progres pada tanggal yang dipilih tampil sesuai data tersimpan |
| US-31 | Sebagai pengguna, saya ingin melihat ringkasan tujuh hari terakhir agar tahu perkembangan saya | Ringkasan dihitung dari data tersimpan dan sesuai perhitungan manual atas data uji |
| US-32 | Sebagai pengguna, saya ingin melihat jumlah hari berturut-turut saya menjalankan rencana agar termotivasi melanjutkan | Hitungan bertambah ketika minimal satu aktivitas pada rencana harian diselesaikan pada satu hari |
| US-33 | Sebagai pengguna, saya ingin mengoreksi status catatan pada tanggal lampau agar riwayat tetap benar | Status butir pada tanggal yang dipilih dapat ditandai atau dibatalkan dan tersimpan |

# BAB IV. KEBUTUHAN FUNGSIONAL

Prioritas memakai tiga tingkat sesuai metode MoSCoW.

Tabel 4.1  Arti tingkat prioritas

| Tingkat | Arti |
|---|---|
| Must | Penyerahan dinyatakan tidak lengkap tanpanya |
| Should | Berdampak nyata namun dapat ditunda bila jadwal tertekan |
| Could | Dikerjakan hanya bila waktu tersisa |

Kolom prioritas pada bab ini merupakan **usulan** dan memerlukan persetujuan
manajer proyek sebelum dipakai sebagai dasar pengurangan cakupan.

## 4.1 Autentikasi dan Akun

Tabel 4.2  Kebutuhan autentikasi dan akun

| ID | Kebutuhan | Asal | Prioritas |
|---|---|---|---|
| F-01 | Sistem menerima pendaftaran dengan nama pengguna, surel, kata sandi, nama, jenis kelamin, berat badan, tinggi badan, umur, dan tujuan | US-01 | Must |
| F-02 | Sistem menolak pendaftaran yang medannya tidak lengkap, di luar rentang wajar, atau berformat salah, disertai pesan yang menyebut medan bersangkutan | US-01 | Must |
| F-03 | Sistem menyimpan kata sandi dalam bentuk terenkripsi satu arah, bukan teks asli | US-02 | Must |
| F-04 | Sistem menolak pendaftaran dengan surel atau nama pengguna yang sudah terpakai | US-01 | Must |
| F-05 | Sistem menerbitkan token akses dan token penyegar pada login yang sah | US-02 | Must |
| F-06 | Sistem menolak setiap permintaan atas data pengguna lain | US-03 | Must |
| F-07 | Pengguna dapat mengubah nama, jenis kelamin, berat badan, tinggi badan, umur, dan tujuan | US-04 | Should |

## 4.2 Rencana Harian

Tabel 4.3  Kebutuhan rencana harian

| ID | Kebutuhan | Asal | Prioritas |
|---|---|---|---|
| F-10 | Sistem menyusun rencana harian dari aturan berbasis kategori BMI dan tujuan pengguna | US-10 | Must |
| F-11 | Rencana satu pengguna pada satu tanggal disimpan tepat satu kali dan tidak pernah ditimpa | US-11 | Must |
| F-12 | Rencana yang sama terbaca identik dari sesi maupun perangkat mana pun | US-11 | Must |
| F-13 | Butir rencana menyimpan nama dan keterangannya, sehingga terbaca tanpa memanggil layanan rekomendasi | US-12 | Must |
| F-14 | Pengguna dapat menyusun rencana harian secara manual ketika layanan rekomendasi tidak tersedia | US-13 | Must |
| F-15 | Sistem menampilkan keadaan sedang memuat, gagal memuat, dan belum ada rencana sebagai tiga keadaan berbeda | US-14 | Must |

## 4.3 Pencatatan Progres

Tabel 4.4  Kebutuhan pencatatan progres

| ID | Kebutuhan | Asal | Prioritas |
|---|---|---|---|
| F-20 | Pengguna dapat menandai satu butir rencana sebagai selesai | US-20 | Must |
| F-21 | Pengguna dapat membatalkan penandaan yang keliru | US-21 | Must |
| F-22 | Sistem menampilkan hasil penyimpanan apa adanya: berhasil, sedang diproses, atau gagal | US-22 | Must |
| F-23 | Percobaan menyimpan ulang tidak menghasilkan catatan ganda | US-23 | Must |
| F-24 | Progres melekat pada butir rencana sehingga tidak dapat terlepas dari rencana yang menghasilkannya | US-20 | Must |
| F-25 | Seluruh alur pencatatan dapat diselesaikan memakai papan ketik | US-24 | Should |

## 4.4 Riwayat dan Ringkasan

Tabel 4.5  Kebutuhan riwayat dan ringkasan

| ID | Kebutuhan | Asal | Prioritas |
|---|---|---|---|
| F-30 | Pengguna dapat memilih tanggal dan melihat rencana beserta progres pada tanggal itu | US-30 | Must |
| F-31 | Sistem menampilkan ringkasan tujuh hari terakhir yang dihitung dari data tersimpan | US-31 | Must |
| F-32 | Ringkasan menampilkan jumlah butir selesai terhadap jumlah butir rencana, terpisah untuk aktivitas dan makanan | US-31 | Must |
| F-33 | Pengguna dapat mengoreksi status catatan pada tanggal yang telah lewat | US-33 | Could |

## 4.5 Streak

Tabel 4.6  Kebutuhan streak

| ID | Kebutuhan | Asal | Prioritas |
|---|---|---|---|
| F-40 | Sistem menghitung jumlah hari berturut-turut pengguna menyelesaikan minimal satu aktivitas pada rencana harian; kelengkapan seluruh butir ditampilkan terpisah sebagai progres | US-32 | Should |

# BAB V. KEBUTUHAN NON-FUNGSIONAL

Tabel 5.1  Kebutuhan non-fungsional

| ID | Kebutuhan | Kategori |
|---|---|---|
| N-01 | Kata sandi dan kunci tidak pernah tertulis di dalam kode maupun berkas yang ikut ke repositori | Keamanan |
| N-02 | Setiap titik akhir yang mengubah data memeriksa kepemilikan sebelum bertindak | Keamanan |
| N-03 | Kegagalan mengembalikan pesan yang dapat dipahami pengguna, bukan galat teknis | Keandalan |
| N-04 | Antarmuka memenuhi rasio kontras teks sekurang-kurangnya 4,5 banding 1 | Aksesibilitas |
| N-05 | Sasaran sentuh berukuran sekurang-kurangnya 44 kali 44 piksel | Aksesibilitas |
| N-06 | Elemen yang dapat ditekan menerima fokus papan ketik dan menampilkannya | Aksesibilitas |
| N-07 | Antarmuka menghormati preferensi sistem untuk mengurangi gerak | Aksesibilitas |
| N-08 | Antarmuka terbaca tanpa gulir mendatar pada lebar 320 piksel | Kegunaan |
| N-09 | Aset yang dipakai memiliki lisensi yang jelas | Legal |

# BAB VI. ATURAN BISNIS DAN MODEL DATA

## 6.1 Aturan Penyusunan Rencana

Kategori BMI memakai ambang 18,5 dan 25 dan 30.

Tabel 6.1  Intensitas dasar menurut kategori BMI

| Kategori | Intensitas dasar | Alasan |
|---|---|---|
| Underweight | Light | Tujuannya menambah massa, bukan membakar |
| Normal | Moderate | Kondisi acuan |
| Overweight | Light | Beban dijaga tetap terkendali |
| Obese | Sedentary | Beban sendi tidak berlebihan pada awal program |

Tujuan pengguna menggeser satu tingkat: menurunkan berat badan naik satu
tingkat, menambah berat badan turun satu tingkat, mempertahankan berat badan
tidak menggeser. Hasilnya dijepit pada rentang tingkat yang tersedia.

Pemilihan butir memakai benih yang diturunkan dari identitas pengguna dan
tanggal, sehingga rencana satu hari dapat dihitung ulang dan diuji.

## 6.2 Model Data

Tabel 6.2  Entitas utama

| Entitas | Isi | Kendala kunci |
|---|---|---|
| users | Identitas dan data tubuh pengguna | Nama pengguna unik; surel wajib unik |
| daily_plans | Rencana satu pengguna pada satu tanggal | Unik atas pasangan pengguna dan tanggal |
| daily_plan_items | Butir rencana beserta isinya | Unik atas rencana, tipe, dan posisi |
| plan_item_progress | Progres satu butir rencana | Satu lawan satu terhadap butir rencana |
| authentications | Token penyegar yang masih berlaku | Token unik |

Kendala unik pada `daily_plans` adalah mekanisme yang menjamin F-11 dan F-12.
Hubungan satu lawan satu pada `plan_item_progress` adalah mekanisme yang
menjamin F-24. Keduanya menjadikan ketidaksesuaian rencana dan progres tidak
mungkin terjadi secara struktur, bukan sekadar dijaga oleh kode.

# BAB VII. KETERTELUSURAN

Tabel 7.1  Kriteria penerimaan piagam terhadap kebutuhan

| Kriteria penerimaan pada piagam | User story | Kebutuhan |
|---|---|---|
| Kebutuhan berprioritas wajib terimplementasi dan lulus uji | Seluruhnya | Seluruh kebutuhan Must |
| Rencana dan progres konsisten antarsesi dan perangkat | US-11 | F-11, F-12, F-24 |
| Catatan tetap tersedia setelah keluar dan masuk kembali | US-20, US-30 | F-11, F-30 |
| Pengguna tidak dapat mengakses data akun lain | US-03 | F-06, N-02 |
| Kata sandi tidak tersimpan sebagai teks asli | US-02 | F-03, N-01 |
| Pencatatan tetap mungkin saat layanan rekomendasi mati | US-12, US-13 | F-13, F-14, F-15 |
| Kegagalan simpan tampil sebagai kegagalan, ulangan tidak menggandakan | US-22, US-23 | F-22, F-23 |
| Riwayat dan ringkasan sesuai data uji dan aturan tanggal | US-30, US-31, US-33 | F-30, F-31, F-32, F-33 |
| Tidak ada defect kritis pada alur wajib | Seluruhnya | Seluruh kebutuhan Must |
| Artefak, demonstrasi, dan UAT diselesaikan | Tidak ada | Di luar kebutuhan perangkat lunak |

Seluruh sepuluh kriteria penerimaan pada piagam telah tercakup. Tidak terdapat
kebutuhan pada Bab IV yang tidak berasal dari user story pada Bab III.

# BAB VIII. KEPUTUSAN YANG BELUM DITETAPKAN

Bagian ini memuat hal yang **tidak dapat ditetapkan tanpa keputusan tim atau
dosen pengampu**. Selama belum diputuskan, implementasi yang bergantung
padanya tidak dapat dinyatakan selesai.

Tabel 8.1  Keputusan terbuka

| ID | Keputusan | Mengapa mendesak | Usulan |
|---|---|---|---|
| K-01 | Aturan tanggal dan zona waktu | Sebelumnya beberapa jalur memakai tanggal lokal server; implementasi kini sudah memakai `Asia/Jakarta`, tetapi keputusan perlu dicatat sebagai aturan resmi | Tetapkan Asia/Jakarta sebagai satu-satunya acuan, dan hitung batas hari di server |
| K-02 | Satuan yang ditampilkan | Ringkasan tidak dapat diverifikasi tanpa satuan yang disepakati | Kilokalori untuk energi, gram untuk massa, sentimeter untuk tinggi, menit untuk durasi |
| K-03 | Cara menghitung ringkasan mingguan | Menentukan bentuk keluaran dan cara mengujinya | Jumlah butir selesai dibagi jumlah butir rencana, dihitung terpisah untuk aktivitas dan makanan |
| K-04 | Prioritas Must, Should, dan Could | Piagam menyatakan pengurangan cakupan mendahulukan yang wajib | Pakai kolom prioritas pada Bab IV setelah ditinjau manajer proyek |
| K-05 | Data tambahan yang dicatat per butir | Menentukan skema basis data | Cukup yang ada sekarang; penambahan memerlukan kebutuhan baru |
| K-06 | Struktur navigasi | Menentukan pekerjaan antarmuka | Empat tujuan: Hari Ini, Riwayat, Progres, dan Profil |
| K-07 | Apakah kebutuhan kalori personal dihitung | Sistem belum memiliki rumus kebutuhan kalori personal yang disepakati | Tidak dihitung pada baseline; label menggambarkan sisa rencana hari ini |
| K-08 | Tanggal pelaksanaan dan peserta uji penerimaan | Menentukan jadwal dan bukti penerimaan | Menunggu kalender mata kuliah |

## Catatan Penyusunan

Requirements pada dokumen ini diturunkan dari tiga sumber yang dapat diperiksa,
sebagaimana dirinci pada Bagian 1.4. Tidak terdapat kebutuhan yang berasal dari
dugaan tanpa dasar.

Dokumen belum ditinjau maupun disetujui. Kolom prioritas pada Bab IV dan
seluruh isi Bab VIII memerlukan keputusan manajer proyek, sebagian di antaranya
setelah konfirmasi kepada dosen pengampu.
