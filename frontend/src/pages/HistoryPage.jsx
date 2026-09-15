import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, getPlanByDate } from '../utils/network-data';
import { savePlanItemProgress } from '../utils/progress-storage';
import { presentActivity, presentFood } from '../utils/presentation';
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

function formatWeekday(dateString) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(`${dateString}T12:00:00`));
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />
      <path d="M8 13h2M14 13h2M8 16h2M14 16h2" />
    </svg>
  );
}

function ActivityIcon({ name }) {
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

function HistoryDatePicker({ value, min, max, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => shiftDate(max, index - 6)), [max]);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="history-date-picker" ref={rootRef}>
      <span className="history-date-picker__label">Pilih tanggal</span>
      <button
        type="button"
        className="history-date-picker__trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{formatDate(value, { weekday: 'short', year: 'numeric' })}</span>
        <CalendarIcon />
      </button>
      {open ? (
        <div className="history-date-picker__popover" role="dialog" aria-label="Pilih tanggal riwayat">
          <div className="history-date-picker__head">
            <span>7 hari terakhir</span>
            <strong>{formatDate(min)}–{formatDate(max, { year: 'numeric' })}</strong>
          </div>
          <div className="history-date-picker__options">
            {dates.map((date) => (
              <button
                type="button"
                className={`history-date-option ${date === value ? 'history-date-option--selected' : ''}`}
                key={date}
                aria-pressed={date === value}
                onClick={() => { onChange(date); setOpen(false); }}
              >
                <span>{formatWeekday(date)}</span>
                <strong>{new Date(`${date}T12:00:00`).getDate()}</strong>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
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
  const presented = type === 'activity' ? presentActivity(item) : presentFood(item);
  const actionLabel = saving
    ? 'Menyimpan…'
    : item.completed
      ? type === 'activity' ? 'Batalkan selesai' : 'Batalkan catatan'
      : type === 'activity' ? 'Tandai selesai' : 'Catat sudah dimakan';

  return (
    <article className={`history-plan-item ${item.completed ? 'history-plan-item--done' : ''}`}>
      <div className="history-plan-item__icon" aria-hidden="true">
        {type === 'activity' ? <ActivityIcon name={presented.name} /> : presented.emoji || '•'}
      </div>
      <div className="history-plan-item__body">
        <p className="history-plan-item__name">{presented.name}</p>
        <p className="history-plan-item__meta">
          {presented.portion || presented.description || 'Bagian dari rencana harian'}
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
          {actionLabel}
        </button>
      </div>
    </article>
  );
}

export default function HistoryPage({ onLogout }) {
  const today = useMemo(() => localDateString(), []);
  const weekStart = useMemo(() => shiftDate(today, -6), [today]);
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

  const summaryCards = [
    ['Item selesai', `${summary.completed}/${summary.total}`, `${summary.rate}% dari rencana`],
    ['Hari dengan rencana', summary.activeDays, 'tanggal dengan rencana tersimpan'],
    ['Aktivitas', summary.activities, 'rencana olahraga tersimpan'],
    ['Makanan', summary.foods, 'rekomendasi makanan tersimpan'],
  ];

  return (
    <div className="history-shell">
      <div className="history-frame">
        <header className="history-header">
          <div className="history-brand">
            <Link to="/" className="history-brand__name">AuraFit</Link>
          </div>
            <nav className="history-nav" aria-label="Navigasi utama">
            <Link to="/dashboard" className="history-nav__link">Hari ini</Link>
            <Link to="/history" className="history-nav__link history-nav__link--active" aria-current="page">Riwayat</Link>
            <Link to="/profile" className="history-nav__link history-nav__link--profile">Profil</Link>
            <button type="button" className="history-nav__logout" onClick={onLogout}>Keluar</button>
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
            <HistoryDatePicker value={selectedDate} min={weekStart} max={today} onChange={setSelectedDate} />
          </section>

          {historyState.status === 'error' ? (
            <div className="history-alert" role="alert">
              Riwayat belum dapat dimuat. Periksa koneksi, lalu coba lagi.
              <button type="button" className="history-alert__action" onClick={loadHistory}>Coba lagi</button>
            </div>
          ) : null}

          {historyState.status === 'loading' ? (
            <section className="history-summary history-summary--loading" aria-label="Memuat ringkasan tujuh hari" aria-busy="true">
              {summaryCards.map(([label], index) => <SummaryCard key={label} label={label} value={<span className="history-loading-bar" aria-hidden="true" />} hint={index === 0 ? 'Menyiapkan data…' : 'Menyiapkan ringkasan…'} />)}
            </section>
          ) : (
            <section className="history-summary" aria-label="Ringkasan tujuh hari">
              {summaryCards.map(([label, value, hint]) => <SummaryCard key={label} label={label} value={value} hint={hint} />)}
            </section>
          )}

          <section className="history-panel" aria-labelledby="history-week-title">
            <div className="history-panel__head">
              <div>
                <p className="history-panel__eyebrow">Progres tujuh hari</p>
                <h2 id="history-week-title" className="history-panel__title">Tujuh hari terakhir</h2>
              </div>
              <p className="history-panel__hint">Pilih hari untuk melihat rinciannya.</p>
            </div>
            <div className={`history-days ${historyState.status === 'loading' ? 'history-days--loading' : ''}`} aria-busy={historyState.status === 'loading'}>
              {historyState.status === 'loading' ? Array.from({ length: 7 }, (_, index) => (
                <div className="history-day history-day--placeholder" key={`loading-${index}`} aria-hidden="true">
                  <span className="history-loading-bar" />
                  <strong className="history-loading-bar history-loading-bar--large" />
                  <span className="history-loading-bar" />
                  <span className="history-loading-bar history-loading-bar--short" />
                </div>
              )) : days.slice().reverse().map((day) => (
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
    </div>
  );
}
