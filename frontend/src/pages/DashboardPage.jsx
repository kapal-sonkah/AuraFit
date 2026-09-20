import { useState, useMemo, useEffect, useCallback } from "react";
import AppHeader from '../components/AppHeader';
import OverviewSidebar from "../components/OverviewSidebar";
import DailyActivities from "../components/DailyActivities";
import CaloriesLog from "../components/CaloriesLog";
import AuraCheckIn from '../components/AuraCheckIn';
import ManualPlanForm from '../components/ManualPlanForm';
import ConfirmDialog from '../components/ConfirmDialog';
import PlanSkeleton from '../components/PlanSkeleton';
import NextStepCard from '../components/NextStepCard';
import { savePlanItemProgress } from '../utils/progress-storage';
import { deletePlanItem, getAIRecommendations, getAuraToday, saveAuraToday, updatePlanItem } from '../utils/network-data';
import { getAuraOption } from '../utils/aura';
import '../dashboard.css';
export default function DashboardPage({ onLogout, user }) {
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
  // value hanya berisi aura yang sudah dikonfirmasi server; pending adalah
  // pilihan yang sedang atau gagal disimpan, dipakai ulang oleh "Coba lagi".
  const [auraState, setAuraState] = useState({ status: 'loading', value: null, pending: null, error: '' });
  const [sumberRencana, setSumberRencana] = useState(null);
  // Butir manual yang menunggu konfirmasi hapus: { itemId, nama } atau null.
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(null);
  const batalHapus = useCallback(() => setKonfirmasiHapus(null), []);

  function terapkanRencana(data) {
    // Rencana baru baru disusun setelah aura hari itu dipilih, sehingga
    // isinya mengikuti aura. Selama belum dipilih, backend menjawab tanpa
    // rencana dan dasbor menampilkan pemilihan auranya lebih dulu.
    if (data.awaiting_aura) {
      setStreak(Number(data.streak) || 0);
      setStatusRencana('menunggu-aura');
      return;
    }

    setSumberRencana(data.source ?? null);
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
  function hapusButir(itemId, nama) {
    setKonfirmasiHapus({ itemId, nama });
  }

  async function lanjutkanHapus() {
    const { itemId } = konfirmasiHapus;
    setKonfirmasiHapus(null);
    setGalatSimpan('');
    const { error, data, message } = await deletePlanItem(itemId);
    if (error) {
      setGalatSimpan(message);
      return;
    }
    terapkanRencana(data);
  }

  // Mengembalikan pesan galat untuk ditampilkan di borang ubah, atau null bila
  // tersimpan. Rencana terbaru langsung diterapkan seperti saat menghapus.
  async function ubahButir(itemId, fields) {
    const { error, data, message } = await updatePlanItem(itemId, fields);
    if (error) return message;
    terapkanRencana(data);
    return null;
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
    setAuraState({ status: 'loading', value: null, pending: null, error: '' });
    const { error, data } = await getAuraToday();
    setAuraState({
      status: error ? 'error' : 'ready',
      value: error ? null : data?.aura ?? null,
      pending: null,
      error: error ? 'Aura hari ini belum dapat dimuat.' : '',
    });
  }, [user]);

  // Aura baru tampil aktif setelah server mengonfirmasi (F-22). Mengembalikan
  // true bila tersimpan agar pemilih aura dapat ditutup.
  async function ubahAura(value) {
    setAuraState((s) => ({ ...s, status: 'saving', pending: value, error: '' }));
    const { error, locked, message, data } = await saveAuraToday(value);
    if (error) {
      setAuraState((s) => ({
        ...s,
        status: 'ready',
        pending: locked ? null : value,
        error: locked ? message : 'Aura belum tersimpan. Periksa koneksi, lalu coba lagi.',
      }));
      // Rencana ternyata sudah tersusun, misalnya dari perangkat lain.
      if (locked) await ambilRencana();
      return false;
    }
    setAuraState({ status: 'ready', value: data?.aura ?? value, pending: null, error: '' });

    // Rencana hari ini belum ada selama auranya belum dipilih. Begitu
    // tersimpan, rencananya diambil agar tersusun menurut aura tersebut.
    if (statusRencana === 'menunggu-aura') await ambilRencana();
    return true;
  }

  const cobaUlangAura = auraState.pending ? () => ubahAura(auraState.pending) : ambilAura;
  // Rencana tersimpan sekali dan tidak disusun ulang (F-11), jadi aura
  // dikunci begitu rencana hari ini ada.
  const auraTerkunci = statusRencana === 'siap';

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void ambilRencana(); });
    return () => cancelAnimationFrame(frame);
  }, [ambilRencana]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void ambilAura(); });
    return () => cancelAnimationFrame(frame);
  }, [ambilAura]);

  return (
    <div className="dashboard-shell" data-aura={auraState.value || 'none'}>
      <div className="dashboard-frame">
        <AppHeader onLogout={onLogout} />

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
              <>
                <p className="visually-hidden" aria-live="polite">Menyusun rencana hari ini…</p>
                <PlanSkeleton />
              </>
            ) : statusRencana === 'menunggu-aura' ? (
              <>
                {/* Pemilih aura didahulukan karena itulah satu-satunya langkah
                    yang bisa dilakukan sebelum rencana ada. */}
                <AuraCheckIn
                  aura={auraState.value}
                  pendingAura={auraState.pending}
                  loading={auraState.status === 'loading'}
                  saving={auraState.status === 'saving'}
                  error={auraState.error}
                  onChange={ubahAura}
                  onRetry={cobaUlangAura}
                />
                <div className="dashboard-state" aria-live="polite">
                  <p className="dashboard-state__copy">
                    Rencana hari ini disusun dari aura yang kamu pilih dan tetap sama sampai hari
                    berganti, jadi pilih kondisi yang paling mendekati.
                  </p>
                </div>
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
                {/* Langkah berikutnya didahulukan; ringkasan dan daftar tetap
                    di bawahnya untuk yang ingin melihat keseluruhan hari. */}
                <NextStepCard
                  activities={activities}
                  completedActivityIds={completedActivityIds}
                  onDone={(id, selesai) => handlePlanItemToggle(id, selesai, 'activity')}
                />
                <section className="dashboard-hero" aria-labelledby="today-plan-title">
                  <div className="dashboard-hero__copyblock">
                    <p className="dashboard-hero__eyebrow">Hari ini</p>
                    <h2 id="today-plan-title" className="dashboard-hero__title">Mulai dari satu langkah kecil.</h2>
                    <p className="dashboard-hero__copy">
                    Ada {activities.length} aktivitas dan {foods.length} makanan dalam rencanamu. {sumberRencana === 'manual'
                      ? 'Rencana ini kamu susun sendiri.'
                      : auraOption
                        ? `Rencana ini disusun dari Aura ${auraOption.label} yang kamu pilih hari ini.`
                        : 'Rencana ini sudah tersimpan untuk hari ini.'}
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
                      pendingAura={auraState.pending}
                      loading={auraState.status === 'loading'}
                      saving={auraState.status === 'saving'}
                      error={auraState.error}
                      locked={auraTerkunci}
                      onChange={ubahAura}
                      onRetry={cobaUlangAura}
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
                  onEdit={ubahButir}
                />
                <CaloriesLog
                  foods={foods}
                  onConsume={(id, dikonsumsi) => handlePlanItemToggle(id, dikonsumsi, 'food')}
                  onDelete={hapusButir}
                  onEdit={ubahButir}
                  consumedFoodIds={consumedFoodIds}
                />
              </>
            )}
          </div>
        </main>

      </div>
      {konfirmasiHapus ? (
        <ConfirmDialog
          title="Hapus butir ini?"
          message={`"${konfirmasiHapus.nama}" akan dihapus dari rencana hari ini beserta catatannya.`}
          confirmLabel="Hapus"
          onConfirm={lanjutkanHapus}
          onCancel={batalHapus}
        />
      ) : null}
    </div>
  );
}
