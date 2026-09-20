import { presentActivity } from '../utils/presentation';

// Durasi sudah tertulis di dalam keterangan aktivitas ("selama 30 menit"),
// jadi tidak ada data baru yang perlu disimpan (K-05).
function durasi(keterangan = '') {
  const m = keterangan.match(/(\d+)\s*menit/i);
  return m ? `${m[1]} menit` : null;
}

// Dasbor sebelumnya dibuka dengan ringkasan dan daftar panjang, sehingga
// langkah berikutnya harus dicari sendiri. Kartu ini menjawab satu pertanyaan:
// apa yang perlu saya lakukan sekarang.
export default function NextStepCard({ activities, completedActivityIds, onDone }) {
  const berikutnya = activities.find((a) => !completedActivityIds.has(a.id));

  if (!berikutnya) {
    return (
      <section className="next-step next-step--done" aria-labelledby="next-step-title">
        <p className="next-step__eyebrow">Aktivitas hari ini</p>
        <h2 id="next-step-title" className="next-step__title">Semua aktivitas selesai.</h2>
        <p className="next-step__meta">Catatan hari ini sudah lengkap. Sampai jumpa besok.</p>
      </section>
    );
  }

  const item = presentActivity(berikutnya);
  const lama = durasi(item.description);

  return (
    <section className="next-step" aria-labelledby="next-step-title">
      <p className="next-step__eyebrow">Berikutnya</p>
      <h2 id="next-step-title" className="next-step__title">{item.name}</h2>
      <p className="next-step__meta">
        {lama ? `${lama} · ` : ''}Cukup satu aktivitas selesai untuk menjaga streak.
      </p>
      <div className="next-step__actions">
        <button type="button" className="next-step__primary" onClick={() => onDone(berikutnya.id, true)}>
          Tandai selesai
        </button>
        <a className="next-step__secondary" href="#aktivitas-hari-ini">Lihat semua aktivitas</a>
      </div>
    </section>
  );
}
