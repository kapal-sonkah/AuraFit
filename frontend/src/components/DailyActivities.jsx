import { useState } from 'react';
import ActivityPopup from './ActivityPopup';

const CHECKER = {
  backgroundImage: "repeating-linear-gradient(45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%)",
  backgroundSize: "20px 20px",
};

function ActivityCard({ activity, active, onClick }) {
  return (
    // Elemen article tidak menerima fokus papan ketik dan tidak menanggapi
    // Enter maupun Spasi, sehingga kartu sebelumnya hanya dapat dibuka dengan
    // tetikus. Diganti button agar seluruh alur pencatatan dapat diselesaikan
    // dengan papan ketik.
    <button
      type="button"
      className={`w-full text-left hover:scale-105 hover:shadow-lg transition-all rounded-lg p-3 flex flex-col gap-2 cursor-pointer ${active ? "bg-green-300/70 ring-2 ring-green-400" : "bg-white/80"}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <p className="text-gray-700 font-semibold text-sm text-center">{activity.name}</p>
      {active ? (
        <p className="text-green-800 text-xs font-semibold text-center">Sudah selesai</p>
      ) : null}
      {activity.image ? (
        <img 
          src={activity.image} 
          alt={activity.name}
          className="w-full h-32 rounded-lg object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} 
        />
      ) : null}
      <div className="w-full h-32 rounded-lg bg-gray-200" style={{ ...CHECKER, display: activity.image ? 'none' : 'block' }} role="img" aria-label="Activity image placeholder" />
    </button>
  );
}

export default function DailyActivities({ activities = [], completedActivityIds, onDone }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section aria-label="Aktivitas hari ini" className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
        <h2 className="text-black font-bold text-lg text-center mb-4">Aktivitas Hari Ini</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="list">
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