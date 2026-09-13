import { useState } from 'react';
import ActivityPopup from './ActivityPopup';

function ActivityCard({ activity, active, onClick }) {
  return (
    // Elemen article tidak menerima fokus papan ketik dan tidak menanggapi
    // Enter maupun Spasi, sehingga kartu sebelumnya hanya dapat dibuka dengan
    // tetikus. Diganti button agar seluruh alur pencatatan dapat diselesaikan
    // dengan papan ketik.
    <button
      type="button"
      className={`activity-card ${active ? 'activity-card--done' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div className="activity-card__head">
        <p className="activity-card__name">{activity.name}</p>
        <span className={`activity-card__status ${active ? 'activity-card__status--done' : ''}`}>
          {active ? 'Selesai' : 'Belum dimulai'}
        </span>
      </div>
      {activity.image ? (
        <img 
          src={activity.image} 
          alt={activity.name}
          className="activity-card__media"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} 
        />
      ) : null}
      <div className="activity-card__media activity-card__media--empty" style={{ display: activity.image ? 'none' : 'block' }} role="img" aria-label="Placeholder gambar aktivitas" />
      <p className="activity-card__hint">Lihat detail →</p>
    </button>
  );
}

export default function DailyActivities({ activities = [], completedActivityIds, onDone }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section id="aktivitas-hari-ini" aria-label="Aktivitas hari ini" className="dashboard-section">
        <div className="dashboard-section__head">
          <div>
            <p className="section-kicker">Gerak hari ini</p>
            <h2 className="dashboard-section__title">Aktivitas Hari Ini</h2>
          </div>
          <p className="dashboard-section__count">{activities.length} pilihan</p>
        </div>
        <ul className="dashboard-list dashboard-list--activities" role="list">
          {activities.map((a) => (
            <li key={a.id}>
              <ActivityCard 
                activity={a}
                active={completedActivityIds.has(a.id)}
                onClick={() => setSelected(a)} 
              />
            </li>
          ))}
        </ul>
      </section>

      <ActivityPopup 
        activity={selected} 
        completed={selected ? completedActivityIds.has(selected.id) : false}
        onClose={() => setSelected(null)} 
        onDone={(id, selesai) => { onDone(id, selesai); setSelected(null); }}
      />
    </>
  );
}
