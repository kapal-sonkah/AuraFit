## Menjalankan AI Service (CATATAN: Harus menggunakan Python versi 3.12 atau 3.11)

```bash
cd ai-model

# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Aktifkan (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn api:app --port 8000
```