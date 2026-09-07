import DonutChart from "./DonutChart";

function StatCard({ label, value, unit, sub, subColor, right }) {
  return (
    <article className="bg-white hover:scale-105 hover:shadow-lg transition-all rounded-lg p-4 flex items-center justify-between shadow-sm">
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

export default function OverviewSidebar({ user, completedActivities = 0, consumedCalories = 0, dailyCalorieTarget = 0, streak = 0 }) {

  const calorieRatio = dailyCalorieTarget > 0 ? consumedCalories / dailyCalorieTarget : 0;

  const calorieSubColor = 
    calorieRatio < 0.2 ? 'text-red-500' :
    calorieRatio < 1 ? 'text-yellow-500' : 'text-green-500';
  
  const calorieSub = `${dailyCalorieTarget - consumedCalories}kcal remaining`;

  // Warna BMI
  const bmiSubColor =
    user?.bmi_category === 'Normal'      ? 'text-green-500' :
    user?.bmi_category === 'Overweight'  ? 'text-yellow-500' : 'text-red-500';

  // Warna aktivitas
  const activitySubColor =
    completedActivities === 0 ? 'text-red-500' :
    completedActivities < 3   ? 'text-yellow-500' : 'text-green-500';
    
  // Warna streak
  const streakSubColor = streak > 0 ? 'text-green-500' : 'text-gray-400';
  const streakIcon = streak > 0
    ? <span className="text-5xl select-none" role="img" aria-label="fire streak">🔥</span>
    : <span className="text-5xl select-none grayscale" role="img" aria-label="no streak">🔥</span>;

  return (
    <aside className="w-full lg:w-72 shrink-0 overflow-hidden">
      <section aria-label="Overview" className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 h-full overflow-y-auto scrollbar-hide">
        <h2 className="text-black text-center font-bold text-lg">Overview</h2>
        <StatCard 
          label="Today Calories" 
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
          label="Today Activities" 
          value={`${completedActivities} / 3`} 
          sub="Completed"
          subColor={activitySubColor} 
          right={<DonutChart completed={completedActivities} total={3} />} />
        
        <StatCard 
          label="Streak" 
          value={streak} 
          sub="Completed" 
          subColor={streakSubColor}
          right={streakIcon} />
      </section>
    </aside>
  );
}