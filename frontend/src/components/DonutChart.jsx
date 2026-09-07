export default function DonutChart({ completed, total }) {
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - completed / total);

  const strokeColor = 
    completed === 0 ? 'transparent' :
    completed === total ? '#22c55e' : '#eab308';

  return (
    <svg width={radius * 2} height={radius * 2} className="rotate-90">
      <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={radius} cy={radius} r={normalizedRadius} fill="none"
        stroke={strokeColor} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
}