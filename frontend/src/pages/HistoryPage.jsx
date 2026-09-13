import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePopup from '../components/ProfilePopUp';
import { getHistory, getPlanByDate } from '../utils/network-data';
import { savePlanItemProgress } from '../utils/progress-storage';
import '../history.css';

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function formatDate(dateString, options = {}) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    ...options,
  }).format(new Date(`${dateString}T12:00:00`));
}

function itemStatus(item, type) {
  if (item.completed) return type === 'activity' ? 'Selesai' : 'Sudah dicatat';
  return type === 'activity' ? 'Belum dimulai' : 'Belum dicatat';
}

function SummaryCard({ label, value, hint }) {
  return (
    <article className="history-summary__card">
      <p className="history-summary__label">{label}</p>
      <p className="history-summary__value">{value}</p>
      <p className="history-summary__hint">{hint}</p>
    </article>
  );
}

function PlanItem({ item, type, onToggle, saving }) {
  return (
    <article className={`history-plan-item ${item.completed ? 'history-plan-item--done' : ''}`}>
      <div className="history-plan-item__icon" aria-hidden="true">
        {type === 'activity' ? '↗' : item.emoji || '•'}
      </div>
      <div className="history-plan-item__body">
        <p className="history-plan-item__name">{item.name}</p>
        <p className="history-plan-item__meta">
          {item.portion || item.description || 'Bagian dari rencana harian'}
        </p>
      </div>
      <div className="history-plan-item__actions">
        <span className="history-plan-item__status">{itemStatus(item, type)}</span>
        <button
          type="button"
          className="history-plan-item__toggle"
          onClick={() => onToggle(item.id, !item.completed)}
          disabled={saving}
          aria-pressed={item.completed}
        >
          {saving ? 'Menyimpan…' : item.completed ? 'Batalkan' : 'Tandai selesai'}
        </button>
      </div>
    </article>
  );
}

export default function HistoryPage({ onLogout, user }) {
  const today = useMemo(() => localDateString(), []);
  const weekStart = useMemo(() => shiftDate(today, -6), [today]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [historyState, setHistoryState] = useState({ status: 'loading', data: null });
  const [planState, setPlanState] = useState({ status: 'loading', data: null });
  const [savingItemId, setSavingItemId] = useState(null);
  const [editError, setEditError] = useState('');

  const loadHistory = useCallback(async () => {
    setHistoryState({ status: 'loading', data: null });
    const { error, data } = await getHistory({ from: weekStart, to: today });
    setHistoryState({ status: error ? 'error' : 'ready', data: error ? null : data });
  }, [today, weekStart]);

  const loadPlan = useCallback(async (date) => {
    setPlanState({ status: 'loading', data: null });
    const { error, data } = await getPlanByDate(date);
    setPlanState({ status: error ? 'error' : 'ready', data: error ? null : data });
  }, []);

  async function handlePlanItemToggle(itemId, completed) {
    const previous = planState.data;
    if (!previous) return;
    setEditError('');
    setSavingItemId(itemId);
    setPlanState((current) => ({
      ...current,
      data: {
        ...current.data,
        activities: current.data.activities.map((item) => item.id === itemId ? { ...item, completed } : item),
        foods: current.data.foods.map((item) => item.id === itemId ? { ...item, completed } : item),
      },
    }));

    const result = await savePlanItemProgress(itemId, completed);
    if (!result.ok) {
      setPlanState((current) => ({ ...current, data: previous }));
      setEditError('Perubahan catatan belum tersimpan. Periksa koneksi, lalu coba lagi.');
      setSavingItemId(null);
      return;
    }

    await loadHistory();
    setSavingItemId(null);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void loadHistory(); });
    return () => cancelAnimationFrame(frame);
  }, [loadHistory]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void loadPlan(selectedDate); });
    return () => cancelAnimationFrame(frame);
  }, [loadPlan, selectedDate]);

  const days = useMemo(() => historyState.data?.days ?? [], [historyState.data]);
  const selectedDay = days.find((day) => day.date === selectedDate);
  const summary = useMemo(() => {
    const result = days.reduce((total, day) => ({
      total: total.total + day.total,
      completed: total.completed + day.completed,
      activeDays: total.activeDays + (day.hasPlan ? 1 : 0),
      activities: total.activities + day.activities.total,
      foods: total.foods + day.foods.total,
    }), { total: 0, completed: 0, activeDays: 0, activities: 0, foods: 0 });

    return {
      ...result,
      rate: result.total === 0 ? 0 : Math.round((result.completed / result.total) * 100),
    };
  }, [days]);

  return (
    <div className="history-shell">
      <div className="history-frame">
        <header className="history-header">
          <div className="history-brand">
            <Link to="/" className="history-brand__name">AuraFit</Link>
            <span className="history-brand__context">Rencana harian</span>
          </div>
          <nav className="history-nav" aria-label="Navigasi utama">
            <Link to="/dashboard" className="history-nav__link">Hari ini</Link>
            <span className="history-nav__link history-nav__link--active" aria-current="page">Riwayat</span>
            <button
              type="button"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
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

        <main className="history-main">
          <section className="history-hero" aria-labelledby="history-title">
            <div>
              <p className="history-hero__eyebrow">Tujuh hari terakhir</p>
              <h1 id="history-title" className="history-hero__title">Lihat kebiasaanmu bertumbuh.</h1>
              <p className="history-hero__copy">
                Baca kembali rencana dan progres yang sudah tersimpan untuk melihat pola tanpa harus mengingat semuanya.
              </p>
            </div>
            <label className="history-date-picker">
              <span>Pilih tanggal</span>
              <input
                type="date"
                value={selectedDate}
                min={weekStart}
                max={today}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>
          </section>

          {historyState.status === 'error' ? (
            <div className="history-alert" role="alert">
              Riwayat belum dapat dimuat. Periksa koneksi, lalu coba lagi.
              <button type="button" className="history-alert__action" onClick={loadHistory}>Coba lagi</button>
            </div>
          ) : null}

          <section className="history-summary" aria-label="Ringkasan tujuh hari">
            <SummaryCard label="Item selesai" value={`${summary.completed}/${summary.total}`} hint={`${summary.rate}% dari rencana`} />
            <SummaryCard label="Hari aktif" value={summary.activeDays} hint="dengan rencana tersimpan" />
            <SummaryCard label="Aktivitas" value={summary.activities} hint="item dalam periode ini" />
            <SummaryCard label="Makanan" value={summary.foods} hint="item dalam periode ini" />
          </section>

          <section className="history-panel" aria-labelledby="history-week-title">
            <div className="history-panel__head">
              <div>
                <p className="history-panel__eyebrow">Progress</p>
                <h2 id="history-week-title" className="history-panel__title">Minggu ini</h2>
              </div>
              <p className="history-panel__hint">Pilih hari untuk melihat rinciannya.</p>
            </div>
            <div className="history-days">
              {days.slice().reverse().map((day) => (
                <button
                  type="button"
                  key={day.date}
                  className={`history-day ${day.date === selectedDate ? 'history-day--selected' : ''}`}
                  aria-pressed={day.date === selectedDate}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <span className="history-day__date">{formatDate(day.date, { weekday: 'short' })}</span>
                  <strong className="history-day__rate">{day.hasPlan ? `${day.completionRate}%` : '—'}</strong>
                  <span className="history-day__bar" aria-hidden="true">
                    <span className="history-day__fill" style={{ width: `${day.completionRate}%` }} />
                  </span>
                  <span className="history-day__count">{day.hasPlan ? `${day.completed}/${day.total} selesai` : 'Tanpa rencana'}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="history-panel" aria-labelledby="history-detail-title">
            <div className="history-panel__head">
              <div>
                <p className="history-panel__eyebrow">Rincian tanggal</p>
                <h2 id="history-detail-title" className="history-panel__title">{formatDate(selectedDate, { weekday: 'long', year: 'numeric' })}</h2>
              </div>
              <p className="history-panel__hint">Kamu dapat mengoreksi status catatan.</p>
            </div>

            {planState.status === 'loading' ? (
              <div className="history-state" aria-live="polite">Memuat rincian rencana…</div>
            ) : planState.status === 'error' ? (
              <div className="history-state history-state--error" role="alert">Rincian tanggal belum dapat dimuat.</div>
            ) : !planState.data ? (
              <div className="history-state">
                <strong>Belum ada rencana pada tanggal ini.</strong>
                <span>Rencana akan muncul di sini setelah tersimpan.</span>
              </div>
            ) : (
              <div className="history-plan">
                <div className="history-plan__stats">
                  <span>{selectedDay?.completed ?? 0}/{selectedDay?.total ?? 0} item selesai</span>
                  <span>{planState.data.source === 'manual' ? 'Rencana manual' : 'Rekomendasi AuraFit'}</span>
                </div>
                {editError ? <div className="history-alert" role="alert">{editError}</div> : null}
                <div className="history-plan__columns">
                  <div>
                    <h3 className="history-plan__heading">Aktivitas</h3>
                    <div className="history-plan__list">
                      {planState.data.activities.map((item) => <PlanItem key={item.id} item={item} type="activity" onToggle={handlePlanItemToggle} saving={savingItemId === item.id} />)}
                    </div>
                  </div>
                  <div>
                    <h3 className="history-plan__heading">Makanan</h3>
                    <div className="history-plan__list">
                      {planState.data.foods.map((item) => <PlanItem key={item.id} item={item} type="food" onToggle={handlePlanItemToggle} saving={savingItemId === item.id} />)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
      <ProfilePopup open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={onLogout} user={user} />
    </div>
  );
}
