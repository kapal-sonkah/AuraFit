# SmartFit - Pelatih Kesehatan Digital Pribadi Anda

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/e95dc3d6-55c5-4bf3-9902-e7bb136f2245" />
<img width="1000" alt="image" src="https://github.com/user-attachments/assets/9f349a85-089e-4fac-b76b-0f88323ad75c" />


## Deskripsi Singkat
SmartFit merupakan aplikasi web kesehatan inovatif yang dirancang sebagai solusi personal untuk mengatasi rencana nutrisi dan olahraga yang terlalu umum. Aplikasi ini dapat mentransformasi pendekatan konvensional dengan menggabungkan **analisis data fisik presisi** dan **algoritma adaptif** untuk menciptakan rencana kesehatan yang dipersonalisasi.

Aplikasi ini dibangun menggunakan library React.js dan menggunakan Tailwind CSS sebagai framework CSS untuk merancang antarmukanya.

## Fitur Utama
Aplikasi web SmartFit dibangun dengan cakupan fitur utama sebagai berikut:

* **Onboarding & Profiling Sistematis:** Analisis data fisik awal secara presisi mencakup BMI, usia, komposisi tubuh, dan tingkat aktivitas harian.
* **Goal Setting & Path Prediction:** Penentuan jalur target kesehatan otomatis (seperti *weight loss* atau *muscle gain*) berdasarkan profil fisik awal.
* **Calorie & Activity Dashboard:** Visualisasi data pelacakan asupan nutrisi harian serta kalkulasi defisit atau surplus kalori secara dinamis.
* **Sistem Rekomendasi Adaptif:** Panduan menu makanan (nutrisi) dan jenis latihan fisik harian yang disesuaikan khusus dengan kebutuhan kalori pengguna.
* **Re-kalibrasi Mingguan Berbasis AI:** Analitik mingguan yang otomatis memperbarui target dan rekomendasi berdasarkan progres nyata performa fisik pengguna.
* **Gamifikasi Streak:** Sistem pelacakan konsistensi harian dengan indikator visual interaktif untuk meningkatkan motivasi, kedisiplinan, dan retensi pengguna.

## Model AI
https://drive.google.com/drive/folders/1aKqEcjae_mxVht5zLzDN71-BF6qRahdf?usp=sharing

## Cara setup aplikasi di lokal

### Persyaratan
1. Git: Untuk melakukan clone repositori dari GitHub.
2. Node.js (Versi LTS - 20.x atau terbaru) & npm: Untuk menjalankan framework Vite (Frontend) dan Express.js (Backend).
3. Python (Wajib versi 3.11 atau lebih baru): Untuk menjalankan inferensi model AI
4. PostgreSQL: sebagai database aplikasi. Buat database dengan nama 'smartfit'
5. Sediakan Port 3000 untuk service backend

### Langkah-langkah
1. Clone repositori ini ke direktori lokal anda.
```bash
git clone https://github.com/susenayw/SmartFit.git
```

2. Masuk ke dalam direktori project
```bash
cd SmartFit
```

3. Anda sudah masuk ke direktori root project. Masuk ke folder ai-model untuk mengaktifkan server api model
```bash
cd ai-model/smartfit-ai-model
```

4. Jalankan service AI model
```bash
# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn api:app --reload
```
5. Buka terminal baru, lalu masuk ke folder backend untuk mengaktifkan server backend

```bash
cd backend

# Install packages
npm install 
```

6. Buat file .env berdasarkan file .env.example. Ubah value yang diberi comment (#) sesuai dengan konfigurasi sistem anda

7. Jalankan command untuk migrate database
```cmd
npm run migrate up
```

8. Jalankan server
```cmd
npm run start:dev
```

9. Server berjalan pada local di port 3000

10. Buka terminal baru, pergi ke folder frontend
```bash
cd frontend
```

11. Install packages
```bash
npm install
```

12. Jalankan program
```bash
npm run dev
```

13. Buka http://localhost:5173/ di browser. Aplikasi sudah siap untuk digunakan

## Link aplikasi 
https://smartfit-app.vercel.app/