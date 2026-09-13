import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import OverviewSidebar from "../components/OverviewSidebar";
import DailyActivities from "../components/DailyActivities";
import CaloriesLog from "../components/CaloriesLog";
import ProfilePopup from "../components/ProfilePopUp";
import { savePlanItemProgress } from '../utils/progress-storage';
import { getAIRecommendations } from '../utils/network-data';
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
  const completedItems = completedActivityIds.size + consumedFoodIds.size;
  const totalItems = activities.length + foods.length;
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
    <div className="dashboard-shell">
      <div className="dashboard-frame">
        <header className={`dashboard-header ${scrolled ? 'dashboard-header--scrolled' : ''}`}>
          <div className="dashboard-brand">
            <h1 className="dashboard-brand__name">AuraFit</h1>
            <span className="dashboard-brand__context">Rencana harian</span>
          </div>
          <nav aria-label="Navigasi utama">
            <Link to="/history" className="dashboard-nav-link">Riwayat</Link>
            <button
              type="button"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="menu-trigger__lines" aria-hidden="true">
                {[0, 1, 2].map((i) => <span key={i} />)}
              </span>
            </button>
          </nav>
        </header>

        <main className="dashboard-layout">
          <div className="dashboard-summary">
            <OverviewSidebar
              user={user}
              completedActivities={completedActivities}
              totalActivities={activities.length}
              consumedCalories={consumedCalories}
              streak={streak}
              dailyCalorieTarget={dailyCalorieTarget}
            />
          </div>
          <div className="dashboard-content">
            {galatSimpan ? (
              <div role="alert" className="dashboard-alert">
                {galatSimpan}
              </div>
            ) : null}

            {statusRencana === 'memuat' ? (
              <div className="dashboard-state" aria-live="polite">
                <p className="dashboard-state__title">Menyusun rencana hari ini…</p>
              </div>
            ) : statusRencana === 'gagal' ? (
              <div role="alert" className="dashboard-state">
                <p className="dashboard-state__title">Rencana hari ini gagal dimuat.</p>
                <p className="dashboard-state__copy">
                  Catatan yang sudah tersimpan tidak hilang. Periksa koneksi, lalu coba lagi.
                </p>
                <button
                  onClick={ambilRencana}
                  className="dashboard-button"
                >
                  Coba lagi
                </button>
              </div>
            ) : activities.length === 0 && foods.length === 0 ? (
              <div className="dashboard-state">
                <p className="dashboard-state__title">Belum ada rencana untuk hari ini.</p>
              </div>
            ) : (
              <>
                <section className="dashboard-hero" aria-labelledby="today-plan-title">
                  <div>
                    <p className="dashboard-hero__eyebrow">Hari ini</p>
                    <h2 id="today-plan-title" className="dashboard-hero__title">Mulai dari satu langkah kecil.</h2>
                    <p className="dashboard-hero__copy">
                    Ada {activities.length} aktivitas dan {foods.length} makanan dalam rencanamu. Buka kartu untuk melihat detail, lalu catat saat selesai atau dikonsumsi.
                    </p>
                  </div>
                  <div className="dashboard-progress" aria-label={`Progres hari ini: ${completedItems} dari ${totalItems} item selesai`}>
                    <span className="dashboard-progress__label">Progres hari ini</span>
                    <span className="dashboard-progress__value">{completedItems}/{totalItems}</span>
                    <span className="dashboard-progress__hint">item selesai</span>
                  </div>
                  <a className="dashboard-hero__action" href="#aktivitas-hari-ini">Mulai aktivitas</a>
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
