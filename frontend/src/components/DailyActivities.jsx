import { useState } from 'react';
import AuraGlyph from './AuraGlyph';
import { getAuraOption } from '../utils/aura';
import ActivityIcon from './ActivityIcon';
import ActivityPopup from './ActivityPopup';
import ManualItemEditor from './ManualItemEditor';
import { activityMinutes, presentActivity } from '../utils/presentation';

function ActivityCard({ activity, active, onClick, onDone, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <article className="activity-card">
        <ManualItemEditor
          item={activity}
          type="activity"
          onCancel={() => setEditing(false)}
          onSave={async (id, fields) => {
            const pesan = await onEdit(id, fields);
            if (!pesan) setEditing(false);
            return pesan;
          }}
        />
      </article>
    );
  }

  return (
    <article className={`activity-card ${active ? 'activity-card--done' : ''} ${activity.optional ? 'activity-card--optional' : ''}`}>
      <button
        type="button"
        className="activity-card__detail"
        onClick={onClick}
        aria-label={`Lihat detail ${activity.name}`}
      >
        <span className="activity-card__head">
          <span className="activity-card__name">
            <span className="activity-card__title">{activity.name}</span>
            <span className="activity-card__tags" aria-label="Label aktivitas">
              {/* Butir tanpa source_ref dicatat sendiri oleh pengguna; tanpa
                  penanda, butir tambahan tampak seperti rekomendasi sistem. */}
              {activity.source_ref == null ? <span className="plan-item-tag plan-item-tag--custom">Tambahanmu</span> : null}
              {activity.optional ? <span className="plan-item-tag plan-item-tag--optional">Pilihan tambahan</span> : null}
            </span>
          </span>
          <span className={`activity-card__status ${active ? 'activity-card__status--done' : ''}`}>
            {active ? <><span aria-hidden="true">✓ </span>Selesai</> : 'Belum dimulai'}
          </span>
        </span>
        {activity.image ? (
          <img
            src={activity.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="activity-card__media"
            onError={(event) => {
              event.currentTarget.hidden = true;
              if (event.currentTarget.nextElementSibling) event.currentTarget.nextElementSibling.hidden = false;
            }}
          />
        ) : null}
        <span className="activity-card__media activity-card__media--empty" hidden={Boolean(activity.image)} role="img" aria-label={`Ilustrasi ${activity.name}`}>
          <ActivityIcon name={activity.name} />
        </span>
        <span className="activity-card__hint">Lihat detail →</span>
      </button>
      <button
        type="button"
        className={`activity-card__action ${active ? 'activity-card__action--done' : ''}`}
        onClick={() => onDone(activity.id, !active)}
        aria-pressed={active}
      >
        {active ? 'Batalkan selesai' : 'Tandai selesai'}
      </button>
      {activity.source_ref == null && onDelete && onEdit ? (
        <div className="plan-item-manage">
          <button type="button" className="plan-item-edit" onClick={() => setEditing(true)}>Ubah</button>
          <button type="button" className="plan-item-delete" onClick={() => onDelete(activity.id, activity.name)}>Hapus</button>
        </div>
      ) : null}
    </article>
  );
}

export default function DailyActivities({ activities = [], completedActivityIds, aura, onDone, onDelete, onEdit }) {
  const [selected, setSelected] = useState(null);
  const auraOption = getAuraOption(aura);

  // Total durasi membuat isi hari terbaca sekilas. Menit diambil dari
  // keterangan aktivitas, jadi butir manual tanpa durasi tidak ikut dihitung.
  const aktivitasUtama = activities.filter((activity) => !activity.optional);
  const aktivitasPilihan = activities.filter((activity) => activity.optional);
  const totalMenit = activities.reduce((jumlah, a) => jumlah + (activityMinutes(a) ?? 0), 0);
  const ringkasanRencana = [
    `${aktivitasUtama.length} utama`,
    aktivitasPilihan.length ? `${aktivitasPilihan.length} pilihan` : null,
    totalMenit ? `${totalMenit} menit` : null,
    '1 aktivitas cukup untuk menjaga streak',
    aktivitasPilihan.length ? 'aktivitas tambahan juga menjaga streak' : null,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <section id="aktivitas-hari-ini" aria-label="Aktivitas hari ini" className="dashboard-section dashboard-section--activities">
        <div className="dashboard-section__head">
          <div>
            <p className="section-kicker">Gerak hari ini</p>
            <h2 className="dashboard-section__title">Aktivitas Hari Ini</h2>
          </div>
          <div className="dashboard-section__head-side">
            {auraOption ? <p className="activity-aura-context"><AuraGlyph aura={auraOption.value} /><span><strong>Mode {auraOption.label}</strong> · {auraOption.suggestion}</span></p> : null}
            <p className="dashboard-section__count">{ringkasanRencana}</p>
          </div>
        </div>
        <ul className="dashboard-list dashboard-list--activities" role="list">
          {activities.map((a) => {
            const activity = presentActivity(a);
            return (
            <li key={a.id}>
              <ActivityCard 
                activity={activity}
                active={completedActivityIds.has(a.id)}
                onClick={() => setSelected(activity)}
                onDone={onDone}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </li>
            );
          })}
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
