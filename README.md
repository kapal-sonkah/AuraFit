# AuraFit - Pelatih Kesehatan Digital Pribadi Anda

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/e95dc3d6-55c5-4bf3-9902-e7bb136f2245" />
<img width="1000" alt="image" src="https://github.com/user-attachments/assets/9f349a85-089e-4fac-b76b-0f88323ad75c" />


## Deskripsi Singkat
AuraFit merupakan aplikasi web kesehatan inovatif yang dirancang sebagai solusi personal untuk mengatasi rencana nutrisi dan olahraga yang terlalu umum. Aplikasi ini dapat mentransformasi pendekatan konvensional dengan menggabungkan **analisis data fisik presisi** dan **algoritma adaptif** untuk menciptakan rencana kesehatan yang dipersonalisasi.

Aplikasi ini dibangun menggunakan library React.js dan menggunakan Tailwind CSS sebagai framework CSS untuk merancang antarmukanya.

## Fitur Utama
Aplikasi web AuraFit dibangun dengan cakupan fitur utama sebagai berikut:

* **Onboarding & Profiling Sistematis:** Analisis data fisik awal secara presisi mencakup BMI, usia, komposisi tubuh, dan tingkat aktivitas harian.
* **Goal Setting & Path Prediction:** Penentuan jalur target kesehatan otomatis (seperti *weight loss* atau *muscle gain*) berdasarkan profil fisik awal.
* **Calorie & Activity Dashboard:** Visualisasi data pelacakan asupan nutrisi harian serta kalkulasi defisit atau surplus kalori secara dinamis.
* **Sistem Rekomendasi Harian:** Panduan menu makanan dan jenis latihan fisik harian, disusun dari aturan berbasis BMI dan tujuan pengguna.
* **Gamifikasi Streak:** Sistem pelacakan konsistensi harian dengan indikator visual interaktif untuk meningkatkan motivasi, kedisiplinan, dan retensi pengguna.

## Cara setup aplikasi di lokal

### Persyaratan
1. Git: Untuk melakukan clone repositori dari GitHub.
2. Node.js (Versi LTS - 20.x atau terbaru) & npm: Untuk menjalankan framework Vite (Frontend) dan Express.js (Backend).
3. PostgreSQL: sebagai database aplikasi. Buat database dengan nama 'aurafit'
4. Sediakan Port 3000 untuk service backend

### Langkah-langkah
1. Clone repositori ini ke direktori lokal anda.
```bash
git clone https://github.com/kapal-sonkah/AuraFit.git
```

2. Masuk ke dalam direktori project
```bash
cd AuraFit
```

3. Masuk ke folder backend untuk menjalankan server backend

```bash
cd backend

# Install packages
npm install
```

4. Buat file .env berdasarkan file .env.example. Ubah value yang diberi comment (#) sesuai dengan konfigurasi sistem anda

5. Jalankan command untuk migrate database
```cmd
npm run migrate up
```

6. Jalankan server
```cmd
npm run start:dev
```

7. Server berjalan pada local di port 3000

8. Buka terminal baru, pergi ke folder frontend
```bash
cd frontend
```

9. Install packages
```bash
npm install
```

10. Jalankan program
```bash
npm run dev
```

11. Buka http://localhost:5173/ di browser. Aplikasi sudah siap untuk digunakan

## Link aplikasi 
https://aurafit-app.vercel.app/
## Rekomendasi harian

Rekomendasi aktivitas dan makanan disusun backend dari aturan berbasis BMI pada
`backend/src/services/recommendations/`. Sistem tidak memerlukan layanan model
terpisah maupun Python.

Layanan klasifikasi dari proyek capstone terdahulu disimpan di
`arsip/model-capstone/` sebagai rujukan; berkas di sana tidak dijalankan.
