import { useState } from 'react';
import ActivityPopup from './ActivityPopup';

const CHECKER = {
  backgroundImage: "repeating-linear-gradient(45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%)",
  backgroundSize: "20px 20px",
};

function ActivityCard({ activity, active, onClick }) {
  return (
    <article 
      className={`hover:scale-105 hover:shadow-lg transition-all rounded-lg p-3 flex flex-col gap-2 ${active ? "bg-green-300/70 ring-2 ring-green-400" : "bg-white/80"}`}
      onClick={onClick}
    >
      <p className="text-gray-700 font-semibold text-sm text-center">{activity.name}</p>
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
    </article>
  );
}

export default function DailyActivities({ activities = [], completedActivityIds, onDone }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section aria-label="Daily Activities" className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
        <h2 className="text-black font-bold text-lg text-center mb-4">Daily Activities</h2>
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
        onDone={(id) => { onDone(id); setSelected(null);}}
      />
    </>
  );
}