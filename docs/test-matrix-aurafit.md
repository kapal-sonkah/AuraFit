# Matriks Test dan UAT AuraFit

Dokumen ini menjadi rancangan pengujian setelah SRS disahkan. Kolom hasil dan
bukti sengaja dibiarkan untuk diisi saat pengujian formal; bukti build atau
demo sebelumnya tidak otomatis menjadi bukti UAT.

## Data dan prasyarat uji

- Gunakan akun uji yang tidak berisi data pribadi nyata.
- Siapkan dua sesi atau perangkat untuk memeriksa persistensi lintas sesi.
- Catat tanggal uji, browser, perangkat, commit aplikasi, dan environment.
- Untuk skenario gagal, gunakan simulasi terkontrol dan pulihkan environment
  setelah pengujian.

## Functional test matrix

| ID | Requirement | Skenario | Hasil yang diharapkan | Bukti | Status |
|---|---|---|---|---|---|
| TC-01 | F-01, F-02 | Daftar dengan data valid, kosong, format salah, dan nilai di luar rentang | Data valid diterima; setiap data invalid ditolak dengan medan yang jelas |  | Belum diuji formal |
| TC-02 | F-03 | Periksa penyimpanan password dan login dengan password benar | Password tidak tersimpan sebagai teks asli; login sah berhasil |  | Belum diuji formal |
| TC-03 | F-04 | Daftar memakai surel atau nama pengguna yang sudah ada | Pendaftaran ditolak tanpa membuat akun ganda |  | Belum diuji formal |
| TC-04 | F-05 | Login valid, password salah, token kedaluwarsa | Sesi valid diterbitkan; akses invalid ditolak |  | Belum diuji formal |
| TC-05 | F-06, N-02 | Akses dan ubah data menggunakan identitas akun lain | Permintaan ditolak dan data akun lain tidak berubah |  | Belum diuji formal |
| TC-06 | F-07 | Ubah nama, jenis kelamin, berat, tinggi, umur, dan tujuan | Data valid tersimpan dan dipakai pada rencana berikutnya |  | Belum diuji formal |
| TC-07 | F-10 | Minta rencana untuk profil dengan beberapa kategori BMI dan tujuan | Rencana mengikuti aturan BMI dan tujuan yang disepakati |  | Belum diuji formal |
| TC-08 | F-11 | Minta rencana pengguna yang sama pada tanggal yang sama berulang kali | Hanya ada satu rencana; data awal tidak tertimpa |  | Belum diuji formal |
| TC-09 | F-12 | Buka tanggal yang sama dari dua sesi atau perangkat | Rencana dan isi butir identik |  | Belum diuji formal |
| TC-10 | F-13 | Buka hari yang sudah memiliki rencana tersimpan ketika layanan rekomendasi dibuat gagal | Rencana tersimpan tetap terbaca lengkap dan layanan rekomendasi tidak diperlukan |  | Belum diuji formal |
| TC-11 | F-14 | Buat rencana manual ketika rekomendasi gagal | Rencana manual tersimpan dan dapat dicatat seperti rencana lain |  | Belum diuji formal |
| TC-12 | F-15, N-03 | Muat normal, layanan gagal, dan tanggal tanpa rencana | Loading, error, dan empty state berbeda serta dapat dipahami |  | Belum diuji formal |
| TC-13 | F-20 | Tandai aktivitas dan makanan selesai, lalu muat ulang halaman | Status tersimpan dan tetap tampil |  | Belum diuji formal |
| TC-14 | F-21 | Batalkan status selesai, lalu muat ulang halaman | Status kembali belum selesai |  | Belum diuji formal |
| TC-15 | F-22 | Putuskan penyimpanan secara terkontrol | UI menampilkan gagal atau tertunda, bukan sukses palsu |  | Belum diuji formal |
| TC-16 | F-23 | Ulangi penyimpanan butir yang sama | Tidak ada progres ganda dan hasil tetap konsisten |  | Belum diuji formal |
| TC-17 | F-24 | Periksa relasi butir dan progres di database | Progres selalu melekat pada butir rencana asal |  | Belum diuji formal |
| TC-18 | F-25, N-06 | Selesaikan pencatatan dengan keyboard saja | Semua kontrol dapat dicapai, diaktifkan, dan fokus terlihat |  | Belum diuji formal |
| TC-19 | F-30 | Pilih tanggal lampau dan tanggal tanpa data | Riwayat menampilkan tanggal dan progres yang sesuai |  | Belum diuji formal |
| TC-20 | F-31, F-32 | Bandingkan ringkasan tujuh hari dengan perhitungan manual | Jumlah aktivitas dan makanan selesai sesuai data uji |  | Belum diuji formal |
| TC-21 | F-33 | Tandai dan batalkan status pada tanggal lampau | Koreksi tersimpan dan muncul pada riwayat serta ringkasan |  | Belum diuji formal |
| TC-22 | F-40 | Selesaikan minimal satu aktivitas beberapa hari berurutan, lalu biarkan satu hari tanpa aktivitas selesai meskipun makanan dicatat | Streak menghitung hari dengan minimal satu aktivitas selesai dan berhenti pada hari tanpa aktivitas selesai |  | Belum diuji formal |

## Non-functional matrix

| ID | Requirement | Pemeriksaan | Kriteria penerimaan | Bukti | Status |
|---|---|---|---|---|---|
| NTC-01 | N-01 | Cari secret pada source, konfigurasi, dan artefak rilis | Tidak ada password atau kunci yang ikut ke repository |  | Belum diuji formal |
| NTC-02 | N-03 | Jalankan error jaringan, validasi, dan database | Pesan yang tampil dapat dipahami pengguna |  | Belum diuji formal |
| NTC-03 | N-04 | Ukur kontras teks pada halaman utama dan form | Rasio teks normal sekurang-kurangnya 4,5:1 |  | Belum diuji formal |
| NTC-04 | N-05 | Periksa ukuran kontrol interaktif pada viewport mobile | Sasaran sentuh sekurang-kurangnya 44 x 44 piksel |  | Belum diuji formal |
| NTC-05 | N-07 | Aktifkan preferensi reduced motion | Animasi tidak mengganggu dan gerak berkurang |  | Belum diuji formal |
| NTC-06 | N-08 | Buka halaman pada lebar 320, 375, 414, dan 768 piksel | Tidak ada gulir horizontal dan konten utama terbaca |  | Belum diuji formal |
| NTC-07 | N-09 | Inventarisasi gambar, font, dan ikon | Setiap aset memiliki sumber atau lisensi yang dapat dicatat |  | Belum diuji formal |

## Exit criteria UAT

UAT dapat dinyatakan selesai jika seluruh test case `Must` lulus, tidak ada
defect kritis terbuka, hasil `Should` dicatat, bukti setiap test case tersimpan,
dan keputusan pada `decision-log-aurafit.md` sudah disahkan atau dikecualikan
secara tertulis.

## Bukti teknis yang sudah ada

Commit `52021dd` telah memuat alur rencana manual, profil, dan koreksi riwayat.
Perubahan lanjutan menyelaraskan zona waktu dan pembacaan rencana tersimpan
sebelum kalkulasi rekomendasi
serta sebelumnya telah melewati pemeriksaan lint, build, test backend, dan
smoke check produksi. Daftar tersebut menjadi bukti teknis awal; status UAT pada
tabel di atas tetap belum diisi sampai pengujian formal dilakukan dan buktinya
dicatat.
