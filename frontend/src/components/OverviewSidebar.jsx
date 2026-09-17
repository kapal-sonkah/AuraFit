function StatCard({ label, value, unit, sub, subColor }) {
  return (
    <article className="stat-card">
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">
          {value} {unit && <span className="stat-card__unit">{unit}</span>}
        </p>
        <p className={`stat-card__sub ${subColor}`}>{sub}</p>
      </div>
    </article>
  );
}

export default function OverviewSidebar({ user, completedActivities = 0, totalActivities = 0, consumedCalories = 0, dailyCalorieTarget = 0, streak = 0 }) {

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

  const calorieSub = `${Math.max(dailyCalorieTarget - consumedCalories, 0)} kcal tersisa dari rencana hari ini`;

  // Warna BMI
  const bmiSubColor =
    user?.bmi_category === 'Normal'      ? 'stat-card__sub--positive' :
    user?.bmi_category === 'Overweight'  ? 'stat-card__sub--warning' : 'stat-card__sub--muted';

  // Warna aktivitas
  const activitySubColor =
    completedActivities === 0 ? 'stat-card__sub--muted' :
    completedActivities < totalActivities ? 'stat-card__sub--warning' : 'stat-card__sub--positive';
    
  // Warna streak
  const streakSubColor = streak > 0 ? 'stat-card__sub--positive' : 'stat-card__sub--muted';

  return (
    <aside className="w-full shrink-0 overflow-hidden">
      <section aria-label="Ringkasan" className="overview-card">
        <div className="overview-card__head">
          <h2 className="overview-card__title">Ringkasan</h2>
          <p className="overview-card__hint">Pantauan singkat</p>
        </div>
        <StatCard 
          label="Kalori Tercatat" 
          value={consumedCalories} 
          unit="kcal" 
          sub={calorieSub}
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
          value={`${completedActivities} / ${totalActivities}`}
          sub="selesai dari rencana"
          subColor={activitySubColor} />
        
        <StatCard 
          label="Streak" 
          value={streak}
          sub="hari berturut-turut"
          subColor={streakSubColor} />
      </section>
    </aside>
  );
}
