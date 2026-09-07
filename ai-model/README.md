# FitStreak API — Backend Documentation

Dokumentasi lengkap 8 endpoint REST untuk aplikasi FitStreak. Backend menggunakan model Neural Network (`smartfit.keras`) beserta artefak preprocessing yang dihasilkan dari notebook capstone.

---

## Artefak ML yang Dibutuhkan

| File | Keterangan |
|---|---|
| `smartfit.keras` | Model Neural Network utama (train dari notebook) |
| `scaler_nn.pkl` | StandardScaler — fit pada X_train (5 fitur) |
| `le_intensity.pkl` | LabelEncoder untuk `Intensity_Level` |
| `le_category.pkl` | LabelEncoder untuk `Category` |
| `le_goal.pkl` | LabelEncoder untuk `Goal_Tag` |

**Urutan kelas encoder (penting untuk inference):**

```
le_intensity : ['Light', 'Moderate', 'Sedentary', 'Vigorous']
le_category  : ['Conditioning Exercise', 'Resistance Training', 'Running',
                 'Sports', 'Walking', 'Water Activities']
le_goal      : ['Cardio & Agility', 'Cardio & Endurance', 'Core & Stamina',
                 'Full Body Cardio', 'Health Maintenance', 'Muscle Gain']
```

**5 fitur input model (urutan wajib sama):**

```
[MET_Value, Category_Encoded, Goal_Encoded, User_BMI, Streak_Week]
```

---

## Base URL

```
https://api.fitstreak.app/v1
```

Semua request menggunakan `Content-Type: application/json`. Endpoint yang memerlukan autentikasi menggunakan JWT Bearer token di header `Authorization`.

---

## Endpoint

### 1. `POST /register`

User mendaftar akun baru. BMI awal langsung dihitung dari data yang dikirim.

**Request Body**

```json
{
  "name":       "Budi Santoso",
  "email":      "budi@example.com",
  "password":   "rahasia123",
  "age":        28,
  "gender":     "L",
  "weight_kg":  85,
  "height_cm":  170,
  "goal":       "Weight Loss"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `name` | string | ✅ | Nama lengkap |
| `email` | string | ✅ | Harus unik |
| `password` | string | ✅ | Min 8 karakter |
| `age` | integer | ✅ | Dalam tahun |
| `gender` | string | ✅ | `"L"` atau `"P"` |
| `weight_kg` | float | ✅ | Berat badan (kg) |
| `height_cm` | float | ✅ | Tinggi badan (cm) |
| `goal` | string | ✅ | Salah satu dari nilai Goal Tag di bawah |

**Nilai `goal` yang valid:**
`Weight Loss` · `Cardio & Agility` · `Cardio & Endurance` · `Health Maintenance` · `Full Body Cardio` · `Core & Stamina` · `Muscle Gain`

**Kalkulasi BMI di backend:**

```python
bmi = round(weight_kg / (height_cm / 100) ** 2, 1)
```

**Response `201 Created`**

```json
{
  "user_id":    "usr_abc123",
  "name":       "Budi Santoso",
  "email":      "budi@example.com",
  "token":      "eyJhbGciOiJIUzI1NiIs...",
  "bmi": {
    "value":    29.4,
    "category": "Overweight"
  },
  "bmr":        1840,
  "ideal_weight_kg": 63.5,
  "message":    "Akun berhasil dibuat"
}
```

**Error Responses**

| Status | Kode | Keterangan |
|---|---|---|
| 409 | `EMAIL_EXISTS` | Email sudah terdaftar |
| 422 | `INVALID_GOAL` | Nilai goal tidak dikenali |

---

### 2. `GET /recommendations/today`

**Endpoint utama.** Memanggil Neural Network dan mengembalikan rekomendasi olahraga untuk hari ini, disesuaikan dengan BMI dan streak user.

**Headers:** `Authorization: Bearer <token>`

**Query Params (opsional)**

| Param | Default | Keterangan |
|---|---|---|
| `duration_override` | auto | Override durasi latihan (menit) |

**Logika Backend**

```python
# 1. Ambil data user dari DB
# 2. Hitung MET estimasi dari BMI
met_estimasi = max(1.0, 8.0 - (bmi - 18.5) * 0.2)

# 3. Encode fitur
cat_enc  = le_category.transform([category_str])[0]
goal_enc = le_goal.transform([user_goal])[0]

# 4. Scale & prediksi
fitur        = [[met_estimasi, cat_enc, goal_enc, bmi, streak_week]]
fitur_scaled = scaler_nn.transform(fitur)
pred_proba   = nn_model.predict(fitur_scaled)[0]
pred_intensity = le_intensity.classes_[np.argmax(pred_proba)]

# 5. Durasi progresif (naik 5 menit per minggu streak, max 60)
durasi_base = {'Sedentary': 15, 'Light': 20, 'Moderate': 30, 'Vigorous': 40}
durasi = min(durasi_base[pred_intensity] + streak_week * 5, 60)
```

**Response `200 OK`**

```json
{
  "date": "2025-07-15",
  "user": {
    "bmi":              29.4,
    "bmi_category":    "Overweight",
    "bmr":              1840,
    "ideal_weight_kg":  63.5,
    "weight_to_lose_kg": 21.5,
    "estimated_days_to_goal": 552
  },
  "recommendation": {
    "activity_description": "Moderate-paced Hiking workout",
    "category":             "Walking",
    "intensity":            "Moderate",
    "confidence_pct":       87.3,
    "duration_min":         30,
    "met_value":            4.5,
    "calories_burned":      191.3,
    "estimated_steps":      3825
  },
  "streak": {
    "current_week": 4,
    "streak_days":  28
  }
}
```

---

### 3. `POST /workouts/complete`

User menandai olahraga hari ini sebagai selesai. Streak naik, kalori tersimpan.

**Headers:** `Authorization: Bearer <token>`

**Request Body**

```json
{
  "date":           "2025-07-15",
  "activity_code":  10342,
  "duration_min":   30,
  "calories_burned": 191.3,
  "notes":          "Terasa lebih ringan dari biasanya"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `date` | string (ISO 8601) | ✅ | Tanggal latihan |
| `activity_code` | integer | ✅ | Kode aktivitas dari dataset |
| `duration_min` | integer | ✅ | Durasi aktual (menit) |
| `calories_burned` | float | ✅ | Kalori aktual |
| `notes` | string | ❌ | Catatan opsional user |

**Logika Backend**

```python
# Hitung streak
if workout_yesterday == "completed":
    streak_days += 1
    if streak_days % 7 == 0:
        streak_week += 1
else:
    streak_days = 1   # mulai ulang dari 1 (hari ini)
    streak_week = streak_days // 7
```

**Response `200 OK`**

```json
{
  "status":          "completed",
  "streak_days":     29,
  "streak_week":     4,
  "calories_today":  191.3,
  "total_calories_week": 1123.8,
  "badge_earned":    null,
  "message":         "Mantap! Streak kamu 29 hari berturut-turut 🔥"
}
```

**Error Responses**

| Status | Kode | Keterangan |
|---|---|---|
| 409 | `ALREADY_COMPLETED` | Workout hari ini sudah di-complete |
| 404 | `ACTIVITY_NOT_FOUND` | `activity_code` tidak ditemukan |

---

### 4. `POST /workouts/skip`

User melewatkan olahraga hari ini. Streak putus, tapi kalori minggu ini tetap tersimpan.

**Headers:** `Authorization: Bearer <token>`

**Request Body**

```json
{
  "date":   "2025-07-15",
  "reason": "Sakit kepala"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `date` | string (ISO 8601) | ✅ | Tanggal yang di-skip |
| `reason` | string | ❌ | Alasan skip (untuk catatan) |

**Logika Backend**

```python
streak_days = 0
streak_week = 0
# calories_week TIDAK di-reset, hanya streak yang putus
```

**Response `200 OK`**

```json
{
  "status":               "skipped",
  "streak_days":          0,
  "streak_week":          0,
  "calories_week_saved":  1123.8,
  "message":              "Streak putus. Yuk mulai lagi besok! 💪"
}
```

---

### 5. `GET /workouts/history`

Mengembalikan data kalender streak ala Duolingo — status setiap hari dalam rentang tanggal.

**Headers:** `Authorization: Bearer <token>`

**Query Params**

| Param | Default | Keterangan |
|---|---|---|
| `from` | 30 hari lalu | Tanggal mulai (ISO 8601) |
| `to` | Hari ini | Tanggal akhir (ISO 8601) |

**Contoh Request**

```
GET /workouts/history?from=2025-06-15&to=2025-07-15
```

**Response `200 OK`**

```json
{
  "from": "2025-06-15",
  "to":   "2025-07-15",
  "summary": {
    "total_days":      31,
    "completed_days":  22,
    "skipped_days":    5,
    "missed_days":     4,
    "longest_streak":  14,
    "total_calories":  4218.5
  },
  "calendar": [
    {
      "date":             "2025-06-15",
      "status":           "completed",
      "activity":         "Moderate-paced Jogging workout",
      "duration_min":     30,
      "calories_burned":  245.0
    },
    {
      "date":   "2025-06-16",
      "status": "skipped",
      "reason": "Libur"
    },
    {
      "date":   "2025-06-17",
      "status": "missed"
    }
  ]
}
```

**Nilai `status`:**

| Status | Keterangan |
|---|---|
| `completed` | Workout selesai (POST /workouts/complete dipanggil) |
| `skipped` | User eksplisit skip (POST /workouts/skip dipanggil) |
| `missed` | Tidak ada aksi sama sekali di hari itu |
| `rest` | Hari istirahat yang dijadwalkan (fitur future) |

---

### 6. `GET /users/dashboard`

Data lengkap untuk home screen aplikasi — dipanggil sekali saat app dibuka.

**Headers:** `Authorization: Bearer <token>`

**Response `200 OK`**

```json
{
  "user": {
    "user_id":           "usr_abc123",
    "name":              "Budi Santoso",
    "goal":              "Weight Loss",
    "weight_kg":         85.0,
    "height_cm":         170.0,
    "age":               28,
    "gender":            "L"
  },
  "body_stats": {
    "bmi":               29.4,
    "bmi_category":     "Overweight",
    "bmr":               1840,
    "ideal_weight_kg":   63.5,
    "weight_to_lose_kg": 21.5,
    "estimated_days_to_goal": 552
  },
  "streak": {
    "streak_days":       29,
    "streak_week":       4,
    "longest_streak":    29,
    "last_completed":   "2025-07-14"
  },
  "weekly_summary": {
    "calories_burned":   1123.8,
    "workouts_done":     5,
    "avg_duration_min":  28
  },
  "today": {
    "status":            "pending",
    "recommendation_ready": true
  }
}
```

**Nilai `today.status`:**

| Status | Keterangan |
|---|---|
| `pending` | Belum ada aksi hari ini |
| `completed` | Sudah selesai workout |
| `skipped` | Sudah di-skip |

---

### 7. `PUT /users/profile`

Update data profil user. BMI, BMR, dan berat ideal otomatis dihitung ulang.

**Headers:** `Authorization: Bearer <token>`

**Request Body** (semua field opsional, kirim hanya yang berubah)

```json
{
  "weight_kg":  83.0,
  "goal":       "Cardio & Endurance"
}
```

**Response `200 OK`**

```json
{
  "updated_fields": ["weight_kg", "goal"],
  "body_stats": {
    "bmi":               28.7,
    "bmi_category":     "Overweight",
    "bmr":               1826,
    "ideal_weight_kg":   63.5,
    "weight_to_lose_kg": 19.5
  },
  "message": "Profil berhasil diperbarui"
}
```

---

### 8. `GET /users/stats`

Statistik agregat user — untuk layar progress/achievement.

**Headers:** `Authorization: Bearer <token>`

**Query Params**

| Param | Default | Keterangan |
|---|---|---|
| `period` | `month` | `week` · `month` · `all_time` |

**Response `200 OK`**

```json
{
  "period": "month",
  "stats": {
    "total_workouts":      22,
    "total_calories":      4218.5,
    "total_duration_min":  660,
    "avg_calories_per_day": 136.1,
    "most_common_intensity": "Moderate",
    "most_common_category":  "Walking",
    "current_streak_days":   29,
    "longest_streak_days":   29,
    "completion_rate_pct":   71.0
  },
  "intensity_breakdown": {
    "Light":    5,
    "Moderate": 12,
    "Vigorous": 5
  },
  "category_breakdown": {
    "Walking":               8,
    "Running":               6,
    "Conditioning Exercise": 5,
    "Sports":                3
  }
}
```

---

## Cara Load Artefak di Backend

```python
import pickle
import numpy as np

# Load sekali saat server startup
with open('scaler_nn.pkl',    'rb') as f: scaler_nn    = pickle.load(f)
with open('le_intensity.pkl', 'rb') as f: le_intensity = pickle.load(f)
with open('le_category.pkl',  'rb') as f: le_category  = pickle.load(f)
with open('le_goal.pkl',      'rb') as f: le_goal      = pickle.load(f)

import tensorflow as tf
nn_model = tf.keras.models.load_model('smartfit.keras')
```

---

## Goal → Category Heuristic Map

Mapping yang dipakai backend sebelum memanggil model:

```python
goal_heuristic_map = {
    'Weight Loss':        'Walking',
    'Cardio & Agility':   'Sports',
    'Cardio & Endurance': 'Running',
    'Health Maintenance': 'Walking',
    'Full Body Cardio':   'Water Activities',
    'Core & Stamina':     'Conditioning Exercise',
    'Muscle Gain':        'Resistance Training',
}
```

---

## Kode Error Umum

| HTTP Status | Kode | Keterangan |
|---|---|---|
| 400 | `BAD_REQUEST` | Body tidak valid / field kurang |
| 401 | `UNAUTHORIZED` | Token tidak ada atau expired |
| 403 | `FORBIDDEN` | Token valid tapi akses ditolak |
| 404 | `NOT_FOUND` | Resource tidak ditemukan |
| 409 | `CONFLICT` | Duplikasi data |
| 422 | `UNPROCESSABLE` | Data valid secara sintaks tapi gagal validasi bisnis |
| 500 | `SERVER_ERROR` | Error internal, cek log backend |
