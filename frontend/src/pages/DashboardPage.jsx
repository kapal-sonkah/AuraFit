import { useState, useMemo, useEffect, useCallback } from "react";
import OverviewSidebar from "../components/OverviewSidebar";
import DailyActivities from "../components/DailyActivities";
import CaloriesLog from "../components/CaloriesLog";
import ProfilePopup from "../components/ProfilePopUp";
import { savePlanItemProgress } from '../utils/progress-storage';
import { getAIRecommendations } from '../utils/network-data';
import { LATAR_UTAMA } from '../utils/backgrounds';
import '../dashboard.css';

export default function DashboardPage({ onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [completedActivityIds, setCompletedActivityIds] = useState(new Set());
  const [consumedFoodIds, setConsumedFoodIds] = useState(new Set());
  const [streak, setStreak] = useState(0);

  const [activities, setActivities] = useState([]);
  const [foods, setFoods] = useState([]);

  // Tiga keadaan pemuatan rencana dibedakan: 'memuat', 'siap', dan 'gagal'.
  // Sebelumnya hanya ada penanda boolean yang tidak pernah dibaca, sehingga
  // ketiganya tampil sama, yaitu dashboard tanpa isi.
  const [statusRencana, setStatusRencana] = useState('memuat');

  // Pesan kegagalan penyimpanan. Kosong berarti tidak ada kegagalan tertunda.
  const [galatSimpan, setGalatSimpan] = useState('');

  const dailyCalorieTarget = useMemo(() =>
    foods.reduce((total, food) => total + (Number(food.kcal) || 0), 0)
  , [foods]);

  const completedActivities = completedActivityIds.size;
  const consumedCalories = foods
    .filter(f => consumedFoodIds.has(f.id))
    .reduce((total, f) => total + (Number(f.kcal) || 0), 0);

  // Penandaan diterapkan lebih dulu agar antarmuka terasa responsif, lalu
  // dikembalikan bila penyimpanan gagal. Tanpa pengembalian itu, kegagalan
  // tampil sebagai keberhasilan dan pengguna mengira catatannya tersimpan.
  function ubahHimpunan(himpunan, id, aktif) {
    const salinan = new Set(himpunan);
    if (aktif) salinan.add(id); else salinan.delete(id);
    return salinan;
  }

  async function handlePlanItemToggle(itemId, selesai, jenis) {
    const sebelum = jenis === 'activity' ? completedActivityIds : consumedFoodIds;
    const setStatus = jenis === 'activity' ? setCompletedActivityIds : setConsumedFoodIds;
    setStatus(ubahHimpunan(sebelum, itemId, selesai));
    setGalatSimpan('');

    const { ok, streak: streakBaru } = await savePlanItemProgress(itemId, selesai);
    if (!ok) {
      setStatus(sebelum);
      setGalatSimpan(jenis === 'activity'
        ? 'Perubahan aktivitas gagal disimpan. Periksa koneksi, lalu coba lagi.'
        : 'Perubahan catatan makanan gagal disimpan. Periksa koneksi, lalu coba lagi.');
      return;
    }
    if (streakBaru !== null) setStreak(streakBaru);
  }

  // Pengambilan rencana dipisahkan agar dapat dipanggil ulang oleh tombol
  // coba lagi ketika pengambilan pertama gagal.
  const ambilRencana = useCallback(async () => {
    if (!user) return;

    setStatusRencana('memuat');
    const { error, data } = await getAIRecommendations();

    if (error || !data) {
      setStatusRencana('gagal');
      return;
    }

    setActivities(data.activities ?? []);
    setFoods(data.foods ?? []);
    setCompletedActivityIds(new Set((data.activities ?? []).filter((item) => item.completed).map((item) => item.id)));
    setConsumedFoodIds(new Set((data.foods ?? []).filter((item) => item.completed).map((item) => item.id)));
    setStreak(Number(data.streak) || 0);
    setStatusRencana('siap');
  }, [user]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void ambilRencana(); });
    return () => cancelAnimationFrame(frame);
  }, [ambilRencana]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen">

      {/* fixed background layers */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: LATAR_UTAMA, backgroundColor: "#0b1f16" }}
      />
      <div className="fixed inset-0 bg-green-900/50 pointer-events-none" />

      {/* scroll container */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 gap-4">

        <header className={`sticky top-0 z-20 flex items-center justify-between py-2 -mx-4 px-4 transition-colors duration-300 ${scrolled ? 'bg-green-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
          <h1 className="text-white text-3xl tracking-wide font-special-gothic-expanded-one select-none">
            AuraFit
          </h1>
          <nav aria-label="Main navigation">
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex flex-col items-center justify-center gap-1.5 min-w-11 min-h-11 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {[0, 1, 2].map((i) => <span key={i} className="block w-6 h-0.5 bg-white rounded" />)}
            </button>
          </nav>
        </header>

        <main className="flex flex-col lg:flex-row gap-4 flex-1">
          <div className="order-2 lg:order-1">
            <OverviewSidebar
              user={user}
              completedActivities={completedActivities}
              totalActivities={activities.length}
              consumedCalories={consumedCalories}
              streak={streak}
              dailyCalorieTarget={dailyCalorieTarget}
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-4 flex-1">
            {galatSimpan ? (
              <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {galatSimpan}
              </div>
            ) : null}

            {statusRencana === 'memuat' ? (
              <div className="dashboard-lead" aria-live="polite">
                <p className="dashboard-lead__eyebrow">Hari ini</p>
                <p className="dashboard-lead__title">Menyusun rencana hari ini…</p>
              </div>
            ) : statusRencana === 'gagal' ? (
              <div role="alert" className="rounded-2xl bg-white/70 backdrop-blur-sm p-8 text-center flex flex-col items-center gap-3">
                <p className="text-black font-semibold">Rencana hari ini gagal dimuat.</p>
                <p className="text-gray-700 text-sm max-w-md">
                  Catatan yang sudah tersimpan tidak hilang. Periksa koneksi, lalu coba lagi.
                </p>
                <button
                  onClick={ambilRencana}
                  className="rounded-lg px-6 py-2.5 bg-green-900 hover:bg-green-800 text-white font-semibold transition-colors cursor-pointer"
                >
                  Coba lagi
                </button>
              </div>
            ) : activities.length === 0 && foods.length === 0 ? (
              <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-8 text-center">
                <p className="text-black font-semibold">Belum ada rencana untuk hari ini.</p>
              </div>
            ) : (
              <>
                <section className="dashboard-lead" aria-labelledby="today-plan-title">
                  <p className="dashboard-lead__eyebrow">Hari ini</p>
                  <h2 id="today-plan-title" className="dashboard-lead__title">Pilih satu langkah untuk mulai.</h2>
                  <p className="dashboard-lead__copy">
                    Ada {activities.length} aktivitas dan {foods.length} makanan dalam rencanamu. Buka kartu untuk melihat detail, lalu catat saat selesai atau dikonsumsi.
                  </p>
                </section>
                <DailyActivities
                  activities={activities}
                  completedActivityIds={completedActivityIds}
                  onDone={(id, selesai) => handlePlanItemToggle(id, selesai, 'activity')}
                />
                <CaloriesLog
                  foods={foods}
                  onConsume={(id, dikonsumsi) => handlePlanItemToggle(id, dikonsumsi, 'food')}
                  consumedFoodIds={consumedFoodIds}
                />
              </>
            )}
          </div>
        </main>

      </div>

      <ProfilePopup open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={onLogout} user={user} />
    </div>
  );
}
