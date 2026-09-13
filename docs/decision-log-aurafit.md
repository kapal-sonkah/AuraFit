# Decision Log AuraFit

Dokumen ini menutup keputusan teknis yang masih terbuka pada SRS sebagai
**baseline usulan untuk ditinjau tim dan dosen**. Isinya belum menggantikan
persetujuan tertulis.

| ID | Keputusan | Baseline usulan | Dampak | Status |
|---|---|---|---|---|
| K-01 | Aturan tanggal dan zona waktu | Gunakan `Asia/Jakarta` untuk tanggal rencana, riwayat, ringkasan, dan batas pergantian hari | Backend, query tanggal, dan pengujian lintas hari harus memakai acuan yang sama | Menunggu pengesahan |
| K-02 | Satuan tampilan | Energi dalam kilokalori, massa dalam gram, tinggi dalam sentimeter, durasi dalam menit | Label UI, data uji, dan ringkasan memakai satuan tersebut | Menunggu pengesahan |
| K-03 | Rumus ringkasan mingguan | Tampilkan jumlah selesai dibanding jumlah rencana, terpisah untuk aktivitas dan makanan, pada tujuh tanggal terakhir | QA dapat menghitung hasil yang diharapkan secara manual | Menunggu pengesahan |
| K-04 | Prioritas requirement | Fungsionalitas keamanan, kepemilikan data, persistensi, pencatatan, dan fallback menjadi `Must`; fitur profil, keyboard, dan streak tetap mengikuti SRS | Menjadi dasar pengurangan cakupan bila jadwal tertekan | Menunggu pengesahan |
| K-05 | Data per butir | Pertahankan nama, keterangan, tipe, posisi, serta data nutrisi yang sudah tersedia; penambahan field memerlukan requirement baru | Skema tidak diperluas tanpa kebutuhan yang disetujui | Menunggu pengesahan |
| K-06 | Navigasi | Empat tujuan utama: Hari Ini, Riwayat, Progres, dan Profil | Menu utama dan pengujian navigasi memakai istilah yang sama | Menunggu pengesahan |
| K-07 | Target kalori personal | Tidak menghitung target kalori personal pada baseline ini; label dashboard harus menggambarkan sisa rencana hari ini | Mencegah pengguna mengira aplikasi memberi target medis atau diet personal | Menunggu pengesahan |
| K-08 | Pelaksanaan UAT | Jadwal, peserta, perangkat, dan penilai ditentukan setelah kalender mata kuliah dikonfirmasi | Tanpa data ini UAT belum dapat dinyatakan selesai | Menunggu pengesahan |

## Aturan perubahan

Perubahan terhadap baseline dicatat dengan tanggal, pengusul, alasan, dampak
terhadap SRS, serta requirement dan test case yang terdampak. Keputusan yang
belum disahkan tidak boleh dipakai untuk menyatakan fitur terkait telah
diterima.

## Pengesahan

| Peran | Nama | Tanggal | Status |
|---|---|---|---|
| Manajer proyek | Susena Yudha Wijaya |  | Menunggu tinjauan |
| Dosen pengampu | Dr. Ir. Elviawaty Muisa Zamzami |  | Menunggu tinjauan |
