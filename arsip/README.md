# Arsip

Berkas pada folder ini **tidak dijalankan** oleh sistem AuraFit dan tidak
dirujuk kode mana pun. Isinya disimpan sebagai rujukan dan bukti asal-usul,
bukan sebagai komponen aplikasi.

Akar repositori karenanya hanya memuat komponen yang benar-benar berjalan,
yaitu `backend/` dan `frontend/`.

## model-capstone

Layanan klasifikasi dan rekomendasi dari proyek capstone terdahulu, berupa
FastAPI dengan model Keras. Layanan ini memetakan berat badan dan BMI menjadi
salah satu dari empat tingkat intensitas, lalu mengambil butir secara acak dari
katalog aktivitas dan makanan yang ditulis tetap di dalam kode.

Pada AuraFit, pemetaan tersebut dinyatakan ulang sebagai aturan yang tertulis
di `backend/src/services/recommendations/`. Katalognya dipindahkan apa adanya
ke `backend/src/services/recommendations/katalog.js`.

Alasan pemindahan:

1. Katalog rekomendasi memang berupa daftar tetap di dalam kode, sehingga tidak
   memerlukan model untuk membacanya.
2. Pemilihan butir sebelumnya memakai `random.sample`, sehingga rencana harian
   satu pengguna dapat berbeda pada permintaan berulang di hari yang sama.
   Rencana yang tidak dapat dihitung di muka tidak dapat diuji terhadap
   kriteria penerimaan.
3. Layanan lama bergantung pada TensorFlow, yang melampaui batas ukuran
   lingkungan deployment yang tersedia bagi tim.

## data-science

Dasbor Streamlit untuk rekalibrasi BMI dan aktivitas mingguan, beserta berkas
data yang dipakainya.

Piagam proyek menempatkan rekalibrasi mingguan berbasis AI **di luar cakupan**;
ringkasan mingguan yang termasuk cakupan adalah pelaporan data tersimpan.
Dasbor ini karenanya bukan bagian sistem yang dibangun, dan tidak dipanggil
aplikasi mana pun.

## Dokumen proyek terdahulu

`Project Plan SmartFit.pdf` dan `Project Brief - CC26-PSU224.pdf` adalah
dokumen perencanaan dari proyek capstone. Keduanya disimpan sebagai catatan
sejarah; dokumen perencanaan yang berlaku untuk AuraFit adalah piagam proyek
yang disusun terpisah.
