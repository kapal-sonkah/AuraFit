import DonutChart from "./DonutChart";

function StatCard({ label, value, unit, sub, subColor, right }) {
  return (
    <article className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
      <div className="flex flex-col items-center flex-1">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-gray-800 text-3xl font-bold mt-1">
          {value} {unit && <span className="text-xl font-semibold text-gray-600">{unit}</span>}
        </p>
        <p className={`text-sm font-semibold mt-0.5 ${subColor}`}>{sub}</p>
      </div>
      {right && <div className="ml-2">{right}</div>}
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
    calorieRatio >= 1 ? 'text-green-600' :
    calorieRatio > 0 ? 'text-yellow-600' : 'text-gray-600';

  const calorieSub = `${Math.max(dailyCalorieTarget - consumedCalories, 0)} kcal tersisa dari rencana hari ini`;

  // Warna BMI
  const bmiSubColor =
    user?.bmi_category === 'Normal'      ? 'text-green-500' :
    user?.bmi_category === 'Overweight'  ? 'text-yellow-500' : 'text-red-500';

  // Warna aktivitas
  const activitySubColor =
    completedActivities === 0 ? 'text-gray-600' :
    completedActivities < totalActivities ? 'text-yellow-500' : 'text-green-500';
    
  // Warna streak
  const streakSubColor = streak > 0 ? 'text-green-500' : 'text-gray-400';
  const streakIcon = streak > 0
    ? <span className="text-5xl select-none" role="img" aria-label="fire streak">🔥</span>
    : <span className="text-5xl select-none grayscale" role="img" aria-label="no streak">🔥</span>;

  return (
    <aside className="w-full lg:w-72 shrink-0 overflow-hidden">
      <section aria-label="Overview" className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 h-full overflow-y-auto scrollbar-hide">
        <h2 className="text-black text-center font-bold text-lg">Ringkasan</h2>
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
          subColor={activitySubColor} 
          right={<DonutChart completed={completedActivities} total={totalActivities || 1} />} />
        
        <StatCard 
          label="Streak" 
          value={streak} 
          sub="hari berturut-turut" 
          subColor={streakSubColor}
          right={streakIcon} />
      </section>
    </aside>
  );
}
