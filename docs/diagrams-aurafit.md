# Diagram AuraFit

Diagram berikut adalah artefak desain yang diturunkan dari SRS AuraFit versi
0.5. Mermaid dapat dirender oleh GitHub dan editor yang mendukung Mermaid.

## Batas sistem dan aktor

```mermaid
flowchart LR
  guest[Tamu]
  user[Pengguna terdaftar]
  rec[Layanan rekomendasi]
  db[(PostgreSQL / Neon)]
  app[AuraFit Web]

  guest -->|daftar / masuk| app
  user -->|kelola profil| app
  user -->|lihat rencana dan catat progres| app
  user -->|lihat riwayat dan ringkasan| app
  app -->|minta rekomendasi| rec
  app -->|simpan dan baca data| db
```

## Use case utama

```mermaid
flowchart LR
  guest[Tamu] --> register((Mendaftar))
  guest --> login((Masuk))
  user[Pengguna terdaftar] --> profile((Mengelola profil))
  user --> plan((Melihat rencana harian))
  user --> manual((Membuat rencana manual))
  user --> progress((Mencatat progres))
  user --> history((Melihat riwayat))
  user --> summary((Melihat ringkasan mingguan))
  user --> correction((Mengoreksi riwayat))
  user --> streak((Melihat streak))
```

## Arsitektur logis

```mermaid
flowchart TB
  browser[Browser pengguna\nReact + Vite]
  api[Express API\nNode.js]
  auth[Autentikasi dan otorisasi]
  plan[Plan service\nrekomendasi dan manual]
  prog[Progress service]
  hist[History service]
  rec[Recommendation service]
  postgres[(PostgreSQL)]

  browser --> api
  api --> auth
  api --> plan
  api --> prog
  api --> hist
  plan --> rec
  auth --> postgres
  plan --> postgres
  prog --> postgres
  hist --> postgres
```

## Model data

```mermaid
erDiagram
  USERS ||--o{ DAILY_PLANS : owns
  DAILY_PLANS ||--o{ DAILY_PLAN_ITEMS : contains
  DAILY_PLAN_ITEMS ||--o| PLAN_ITEM_PROGRESS : has
  USERS ||--o{ AUTHENTICATIONS : receives

  USERS {
    uuid id PK
    string username UK
    string email UK
    string password_hash
    string gender
    decimal weight
    decimal height
    int age
    string goal
  }
  DAILY_PLANS {
    uuid id PK
    uuid user_id FK
    date plan_date UK
  }
  DAILY_PLAN_ITEMS {
    uuid id PK
    uuid daily_plan_id FK
    string type
    int position
    string name
    string description
  }
  PLAN_ITEM_PROGRESS {
    uuid id PK
    uuid plan_item_id FK
    boolean completed
  }
  AUTHENTICATIONS {
    uuid id PK
    uuid user_id FK
    string refresh_token
  }
```

## Alur pencatatan progres

```mermaid
sequenceDiagram
  actor U as Pengguna
  participant W as Browser
  participant A as AuraFit API
  participant D as PostgreSQL

  U->>W: Tekan tandai selesai
  W->>A: PATCH progres butir
  A->>A: Validasi sesi dan kepemilikan
  A->>D: Upsert progres berdasarkan plan_item_id
  D-->>A: Hasil penyimpanan
  A-->>W: Berhasil atau gagal
  W-->>U: Tampilkan status sebenarnya
```

## Alur fallback rencana

```mermaid
flowchart TD
  start([Pengguna membuka tanggal]) --> stored{Rencana tersimpan?}
  stored -->|Ya| show[Tampilkan rencana dari server]
  stored -->|Tidak| request[Minta rekomendasi]
  request --> available{Rekomendasi tersedia?}
  available -->|Ya| save[Simpan rencana satu kali]
  save --> show
  available -->|Tidak| manual[Pilih rencana manual]
  manual --> saveManual[Simpan rencana manual]
  saveManual --> show
```

## Catatan desain

- Diagram ini menggambarkan baseline desain, bukan bukti seluruh alur sudah
  diterima melalui UAT.
- Aturan tanggal, satuan, ringkasan, dan navigasi mengikuti keputusan pada
  `decision-log-aurafit.md` setelah disahkan.
- Perubahan skema atau aktor memerlukan pembaruan SRS, diagram, dan matriks
  pengujian secara bersamaan.
