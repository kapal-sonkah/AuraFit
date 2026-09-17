// Ikon garis untuk aktivitas, dipilih dari nama aktivitas. Dipakai di Riwayat
// dan sebagai pengganti gambar untuk aktivitas yang tidak punya foto.
export default function ActivityIcon({ name }) {
  const normalized = name.toLowerCase();

  if (normalized.includes('renang')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="16" cy="7" r="2" />
        <path d="m5 12 4-3 4 3 3-2 3 2M3 16c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1M3 20c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      </svg>
    );
  }

  if (normalized.includes('zumba') || normalized.includes('aerobik')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5" r="2" />
        <path d="m8 11 4-3 4 3M12 8v6m0 0-4 6m4-6 5 5M7 10l-3 3m13-3 3 3" />
      </svg>
    );
  }

  if (normalized.includes('lari') || normalized.includes('jog') || normalized.includes('jalan')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="15" cy="4" r="2" />
        <path d="m8 10 4-3 3 3 4 1M12 7l-2 6 4 2 2 5m-6-7-4 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
    </svg>
  );
}
