import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import OverviewSidebar from "../components/OverviewSidebar";
import DailyActivities from "../components/DailyActivities";
import CaloriesLog from "../components/CaloriesLog";
import AuraCheckIn from '../components/AuraCheckIn';
import ManualPlanForm from '../components/ManualPlanForm';
import { savePlanItemProgress } from '../utils/progress-storage';
import { deletePlanItem, getAIRecommendations, getAuraToday, saveAuraToday } from '../utils/network-data';
import { getAuraOption } from '../utils/aura';
import '../dashboard.css';

export default function DashboardPage({ onLogout, user }) {
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
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualPlanMode, setManualPlanMode] = useState('default');

  // Pesan kegagalan penyimpanan. Kosong berarti tidak ada kegagalan tertunda.
  const [galatSimpan, setGalatSimpan] = useState('');
  const [auraState, setAuraState] = useState({ status: 'loading', value: null, error: '' });

  function terapkanRencana(data) {
    // Rencana baru baru disusun setelah aura hari itu dipilih, sehingga
    // isinya mengikuti aura. Selama belum dipilih, backend menjawab tanpa
    // rencana dan dasbor menampilkan pemilihan auranya lebih dulu.
    if (data.awaiting_aura) {
      setStreak(Number(data.streak) || 0);
      setStatusRencana('menunggu-aura');
      return;
    }

    setActivities(data.activities ?? []);
    setFoods(data.foods ?? []);
    setCompletedActivityIds(new Set((data.activities ?? []).filter((item) => item.completed).map((item) => item.id)));
    setConsumedFoodIds(new Set((data.foods ?? []).filter((item) => item.completed).map((item) => item.id)));
    setStreak(Number(data.streak) || 0);
    setStatusRencana('siap');
  }

  const dailyCalorieTarget = useMemo(() =>
    foods.reduce((total, food) => total + (Number(food.kcal) || 0), 0)
  , [foods]);

  const completedActivities = completedActivityIds.size;
  const completedFoods = consumedFoodIds.size;
  const completedItems = completedActivityIds.size + consumedFoodIds.size;
  const totalItems = activities.length + foods.length;
  const completionPercentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  const auraOption = getAuraOption(auraState.value);
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

    terapkanRencana(data);
  }, [user]);

  // Hanya butir manual yang punya tombol hapus. Rencana yang dikembalikan
  // backend langsung diterapkan agar progres dan streak ikut terbarui.
  async function hapusButir(itemId, nama) {
    if (!window.confirm(`Hapus "${nama}" dari rencana hari ini?`)) return;
    setGalatSimpan('');
    const { error, data, message } = await deletePlanItem(itemId);
    if (error) {
      setGalatSimpan(message);
      return;
    }
    terapkanRencana(data);
  }

  function simpanRencanaManual(data) {
    setShowManualForm(false);
    setManualPlanMode('default');
    terapkanRencana(data);
  }

  function bukaPenyesuaianAura() {
    setManualPlanMode('aura');
    setShowManualForm(true);
  }

  const ambilAura = useCallback(async () => {
    if (!user) return;
    setAuraState({ status: 'loading', value: null, error: '' });
    const { error, data } = await getAuraToday();
    setAuraState({
      status: error ? 'error' : 'ready',
      value: error ? null : data?.aura ?? null,
      error: error ? 'Aura belum dapat dimuat. Kamu masih bisa mencoba memilihnya lagi.' : '',
    });
  }, [user]);

  async function ubahAura(value) {
    const previous = auraState.value;
    setAuraState({ status: 'saving', value, error: '' });
    const { error, data } = await saveAuraToday(value);
    if (error) {
      setAuraState({ status: 'ready', value: previous, error: 'Aura belum tersimpan. Periksa koneksi, lalu coba lagi.' });
      return;
    }
    setAuraState({ status: 'ready', value: data?.aura ?? value, error: '' });

    // Rencana hari ini belum ada selama auranya belum dipilih. Begitu
    // tersimpan, rencananya diambil agar tersusun menurut aura tersebut.
    if (statusRencana === 'menunggu-aura') await ambilRencana();
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void ambilRencana(); });
    return () => cancelAnimationFrame(frame);
  }, [ambilRencana]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void ambilAura(); });
    return () => cancelAnimationFrame(frame);
  }, [ambilAura]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="dashboard-shell" data-aura={auraState.value || 'none'}>
      <div className="dashboard-frame">
        <header className={`dashboard-header ${scrolled ? 'dashboard-header--scrolled' : ''}`}>
          <div className="dashboard-brand">
            <Link to="/" className="dashboard-brand__name">AuraFit</Link>
          </div>
          <nav aria-label="Navigasi utama">
            <Link to="/dashboard" className="dashboard-nav-link dashboard-nav-link--active" aria-current="page">Hari ini</Link>
            <Link to="/history" className="dashboard-nav-link">Riwayat</Link>
            <Link to="/profile" className="dashboard-nav-link dashboard-nav-link--profile">Profil</Link>
            <button type="button" className="dashboard-nav-logout" onClick={onLogout}>Keluar</button>
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
            ) : statusRencana === 'menunggu-aura' ? (
              <>
                <div className="dashboard-state" aria-live="polite">
                  <p className="dashboard-state__title">Mulai dari auramu hari ini.</p>
                  <p className="dashboard-state__copy">
                    Rencana hari ini disusun mengikuti aura yang kamu pilih, jadi pilih dulu kondisi
                    yang paling mendekati. Rencananya menyusul begitu auramu tersimpan.
                  </p>
                </div>
                <AuraCheckIn
                  aura={auraState.value}
                  loading={auraState.status === 'loading'}
                  saving={auraState.status === 'saving'}
                  error={auraState.error}
                  onChange={ubahAura}
                />
              </>
            ) : statusRencana === 'gagal' ? (
              showManualForm ? (
                <ManualPlanForm
                  auraLabel={manualPlanMode === 'aura' ? auraOption?.label : null}
                  onCancel={() => { setShowManualForm(false); setManualPlanMode('default'); }}
                  onSaved={simpanRencanaManual}
                />
              ) : (
                <div role="alert" className="dashboard-state">
                  <p className="dashboard-state__title">Rencana hari ini gagal dimuat.</p>
                  <p className="dashboard-state__copy">
                    Catatan yang sudah tersimpan tidak hilang. Coba lagi atau susun rencana sendiri untuk hari ini.
                  </p>
                  <div className="dashboard-state__actions">
                    <button type="button" onClick={ambilRencana} className="dashboard-button dashboard-button--secondary">Coba lagi</button>
                    <button type="button" onClick={() => setShowManualForm(true)} className="dashboard-button">Buat rencana manual</button>
                  </div>
                </div>
              )
            ) : showManualForm ? (
              <ManualPlanForm
                auraLabel={manualPlanMode === 'aura' ? auraOption?.label : null}
                onCancel={() => { setShowManualForm(false); setManualPlanMode('default'); }}
                onSaved={simpanRencanaManual}
              />
            ) : activities.length === 0 && foods.length === 0 ? (
              <div className="dashboard-state">
                <p className="dashboard-state__title">Belum ada rencana untuk hari ini.</p>
              </div>
            ) : (
              <>
                <section className="dashboard-hero" aria-labelledby="today-plan-title">
                  <div className="dashboard-hero__copyblock">
                    <p className="dashboard-hero__eyebrow">Hari ini</p>
                    <h2 id="today-plan-title" className="dashboard-hero__title">Mulai dari satu langkah kecil.</h2>
                    <p className="dashboard-hero__copy">
                    Ada {activities.length} aktivitas dan {foods.length} makanan dalam rencanamu. {auraOption ? `Rencana ini disusun mengikuti Aura ${auraOption.label} yang kamu pilih hari ini.` : 'Rencana ini tersimpan dari hari sebelumnya.'}
                    </p>
                  </div>
                  <div className="dashboard-hero__metrics">
                    <div className="dashboard-progress">
                      <div className="dashboard-progress__head">
                        <span className="dashboard-progress__label">Progres hari ini</span>
                        <span className="dashboard-progress__percentage">{completionPercentage}%</span>
                      </div>
                      <div
                        className="dashboard-progress__track"
                        role="progressbar"
                        aria-label="Progres rencana hari ini"
                        aria-valuemin={0}
                        aria-valuemax={totalItems}
                        aria-valuenow={completedItems}
                        aria-valuetext={`${completedItems} dari ${totalItems} item tercatat`}
                      >
                        <span className="dashboard-progress__bar" style={{ width: `${completionPercentage}%` }} />
                      </div>
                      <div className="dashboard-progress__summary">
                        <span className="dashboard-progress__value">{completedItems}/{totalItems}</span>
                        <span className="dashboard-progress__hint">item tercatat</span>
                      </div>
                      <div className="dashboard-progress__breakdown" aria-label="Rincian progres">
                        <span>{completedActivities}/{activities.length} aktivitas</span>
                        <span>{completedFoods}/{foods.length} makanan</span>
                      </div>
                    </div>
                    <AuraCheckIn
                      aura={auraState.value}
                      loading={auraState.status === 'loading'}
                      saving={auraState.status === 'saving'}
                      error={auraState.error}
                      onChange={ubahAura}
                      onAdjust={bukaPenyesuaianAura}
                    />
                  </div>
                </section>
                <DailyActivities
                  activities={activities}
                  completedActivityIds={completedActivityIds}
                  aura={auraState.value}
                  onDone={(id, selesai) => handlePlanItemToggle(id, selesai, 'activity')}
                  onDelete={hapusButir}
                />
                <CaloriesLog
                  foods={foods}
                  onConsume={(id, dikonsumsi) => handlePlanItemToggle(id, dikonsumsi, 'food')}
                  onDelete={hapusButir}
                  consumedFoodIds={consumedFoodIds}
                />
              </>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
