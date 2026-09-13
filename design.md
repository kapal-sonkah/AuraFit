# Design — AuraFit

Sistem desain bersama untuk aplikasi AuraFit. Dokumen ini menjaga login,
onboarding, dashboard, dan halaman informasi agar memakai bahasa visual yang
sama.

## Genre

playful yang tenang: ramah, jelas, dan berorientasi pada kebiasaan harian.

## Macrostructure family

- Marketing pages: Bento Grid dengan blok kontributor dan CTA utama.
- App pages: Bento Grid dengan ringkasan progres dan daftar tindakan.
- Content pages: Long Document bila halaman dokumentasi ditambahkan.

## Theme

- Paper: sage sangat terang.
- Ink: hijau arang.
- Accent: hijau daun untuk aksi dan progres.
- Surfaces: putih hangat untuk kartu; hijau tua hanya untuk chrome dan panel brand.

## Typography

- Display: Special Gothic Expanded One, normal.
- Body: Montserrat.
- Display dipakai untuk judul pendek; body dipakai untuk label, bantuan, dan status.

## Spacing

Gunakan skala 4-point dari `frontend/src/tokens.css`. Komponen baru memakai
token semantik atau utility yang sudah tersedia, bukan nilai warna acak.

## Motion

- Transisi hanya pada opacity dan transform.
- Hover kartu mengangkat permukaan sedikit.
- `prefers-reduced-motion` mematikan gerak spasial.

## Microinteractions

- Sukses dicatat secara tenang di kartu.
- Tombol memiliki state hover, focus-visible, active, disabled, loading, dan error.
- Modal dapat ditutup dengan Escape atau klik backdrop.

## CTA voice

- Primary: kata kerja langsung, misalnya “Mulai aktivitas” atau “Masuk”.
- Secondary: aksi pendukung, misalnya “Lihat detail” atau “Kembali”.

## What pages must share

- Wordmark AuraFit.
- Hijau AuraFit sebagai aksen terbatas.
- Tipografi dan focus ring yang sama.
- Border radius dan jarak yang konsisten.
- Copy berbahasa Indonesia, dengan istilah produk yang tetap jelas.
