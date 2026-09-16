# Catatan UX Testing AuraFit

Status: temuan dari testing, belum diperbaiki.
Tanggal dicatat: 2026-09-16

Catatan ini merangkum empat keluhan yang perlu ditindaklanjuti. Screenshot yang dikirim pada sesi testing menjadi bukti visual untuk reproduksi.

## 1. Aura belum terhubung dengan aktivitas

- Aura berhasil tersimpan sebagai mood harian, tetapi aktivitas masih berasal dari rencana terpisah.
- Pengguna belum melihat hubungan yang jelas antara pilihan Aura dan aktivitas/makanan yang ditampilkan.
- Perbaikan yang diharapkan: tentukan dan tampilkan alur yang jelas apakah Aura memengaruhi rekomendasi atau hanya menjadi konteks progres.
- Validasi: pilih Aura, muat ulang halaman, lalu pastikan hubungan Aura dan rencana tetap terlihat serta konsisten.

## 2. Tombol “Masuk” di mobile kurang nyaman

- Pada layar mobile, tombol masuk perlu ditinjau ulang dari sisi ukuran area sentuh, jarak, posisi, dan keterbacaan.
- Perbaikan yang diharapkan: tombol mudah ditemukan dan disentuh tanpa layout bergeser atau bertumpuk.
- Validasi: uji lebar layar mobile kecil dan besar dalam kondisi login serta validasi error.

## 3. Circle pada ringkasan aktivitas mengganggu

- Donut/circle di kartu “Aktivitas Tercatat” mengambil perhatian terlalu besar pada tampilan mobile.
- Perbaikan yang diharapkan: hapus atau ganti dengan indikator progres yang lebih sederhana dan tetap informatif.
- Validasi: pastikan angka progres tetap terbaca dan kartu tidak terasa penuh pada mobile.

## 4. Deskripsi aktivitas dan makanan di Riwayat tidak lengkap

- Data rencana manual sebenarnya sudah tersimpan dan jumlah item muncul di Riwayat.
- Masalahnya, deskripsi aktivitas serta detail makanan (misalnya porsi dan kalori) tidak selalu tampil lengkap pada Riwayat/detail.
- Perbaikan yang diharapkan: pertahankan data deskripsi dari penyimpanan sampai UI, tampilkan teks lengkap dengan wrapping yang baik, dan gunakan fallback hanya bila memang kosong.
- Validasi: simpan rencana manual berisi deskripsi, porsi, dan kalori; buka Riwayat; pilih tanggal; pastikan seluruh detail tampil.

## Checklist tindak lanjut

- [ ] Reproduksi keempat temuan di mobile dan desktop.
- [ ] Tentukan solusi UX untuk hubungan Aura dan rencana.
- [ ] Perbaiki layout tombol Masuk mobile.
- [ ] Sederhanakan indikator circle pada ringkasan.
- [ ] Telusuri mapping API/database ke tampilan Riwayat dan lengkapi deskripsi.
- [ ] Jalankan lint, build, dan uji ulang alur terkait sebelum deploy.
