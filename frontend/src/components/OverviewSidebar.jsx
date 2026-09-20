function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.5c.2 3.1-1.6 4.9-3.1 6.7C7.5 10.9 6 12.6 6 15.2a6 6 0 1 0 12 0c0-2.8-1.5-5.1-3.6-7.2.2 1.7-.1 3.1-.9 4.2-.4-2.2-1.5-4-3.1-5.5.2-1.6.5-3 .6-4.2Z" />
      <path fill="var(--color-surface)" d="M12 11.6c-1.1 1.3-1.8 2.4-1.8 3.6a1.8 1.8 0 1 0 3.6 0c0-1-.6-2.2-1.8-3.6Z" />
    </svg>
  );
}

function StatCard({ label, value, unit, sub, subColor, tone = '', icon = null }) {
  return (
    <article className={`stat-card ${tone ? `stat-card--${tone}` : ''}`}>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">
          {value} {unit && <span className="stat-card__unit">{unit}</span>}
        </p>
        <p className={`stat-card__sub ${subColor}`}>{sub}</p>
      </div>
      {icon ? <span className="stat-card__icon" aria-hidden="true">{icon}</span> : null}
    </article>
  );
}

export default function OverviewSidebar({ user, planStatus = 'memuat', completedActivities = 0, totalActivities = 0, consumedCalories = 0, dailyCalorieTarget = 0, streak = 0 }) {

  const planReady = planStatus === 'siap';

  const calorieRatio = dailyCalorieTarget > 0 ? consumedCalories / dailyCalorieTarget : 0;

  // Angka pembanding adalah jumlah kalori seluruh makanan pada rencana hari
  // ini, bukan kebutuhan kalori personal pengguna; sistem tidak menghitungnya.
  // Labelnya karena itu menyebut rencana, bukan sisa kebutuhan.
  //
  // Merah tidak dipakai untuk progres nol. Belum mencatat apa pun pada pagi
  // hari adalah keadaan normal, bukan peringatan.
  const calorieSubColor =
    calorieRatio >= 1 ? 'stat-card__sub--positive' :
    calorieRatio > 0 ? 'stat-card__sub--warning' : 'stat-card__sub--muted';

  const calorieSub = `${Math.max(dailyCalorieTarget - consumedCalories, 0)} kcal tersisa dari menu rencana hari ini`;
  const inactivePlanSub = planStatus === 'memuat'
    ? 'Memuat ringkasan…'
    : planStatus === 'menunggu-aura'
      ? 'Pilih aura untuk menyusun rencana hari ini'
      : 'Rencana belum tersedia';

  // Warna BMI
  const bmiSubColor =
    user?.bmi_category === 'Normal'      ? 'stat-card__sub--positive' :
    user?.bmi_category === 'Overweight'  ? 'stat-card__sub--warning' : 'stat-card__sub--muted';

  // Warna aktivitas
  const activitySubColor =
    completedActivities === 0 ? 'stat-card__sub--muted' :
    completedActivities < totalActivities ? 'stat-card__sub--warning' : 'stat-card__sub--positive';
    
  // Warna streak
  const streakSubColor = streak > 0 ? 'stat-card__sub--streak' : 'stat-card__sub--muted';

  return (
    <aside className="w-full shrink-0 overflow-hidden">
      <section aria-label="Ringkasan" className="overview-card">
        <div className="overview-card__head">
          <h2 className="overview-card__title">Ringkasan</h2>
          <p className="overview-card__hint">Pantauan singkat</p>
        </div>
        <StatCard 
          label="Kalori Tercatat" 
          value={planReady ? consumedCalories : '—'}
          unit={planReady ? 'kcal' : null}
          sub={planReady ? calorieSub : inactivePlanSub}
          subColor={calorieSubColor} 
        />

        <StatCard 
          label="BMI" 
          value={user?.bmi ?? '-'} 
          sub={user?.bmi_category ?? '-'}
          subColor={bmiSubColor} 
        />
        
        <StatCard 
          label="Aktivitas Tercatat" 
          value={planReady ? `${completedActivities} / ${totalActivities}` : '—'}
          sub={planReady ? 'selesai dari rencana' : inactivePlanSub}
          subColor={activitySubColor} />
        
        {/* Streak memakai warna hangat, satu-satunya aksen non-hijau pada
            ringkasan, agar capaian yang dikumpulkan berhari-hari tidak
            tenggelam di antara kartu lain. */}
        <StatCard 
          label="Streak" 
          value={planReady ? streak : '—'}
          sub={planReady ? 'hari berturut-turut' : inactivePlanSub}
          subColor={streakSubColor}
          tone={streak > 0 ? 'streak' : ''}
          icon={streak > 0 ? <FireIcon /> : null} />
      </section>
    </aside>
  );
}
