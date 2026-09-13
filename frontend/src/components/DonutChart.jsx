export default function DonutChart({ completed, total }) {
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - completed / total);

  const strokeColor = completed === 0 ? 'transparent' : 'var(--color-accent)';

  return (
    <svg width={radius * 2} height={radius * 2} className="donut-chart rotate-90" aria-hidden="true">
      <circle className="donut-chart__track" cx={radius} cy={radius} r={normalizedRadius} fill="none" strokeWidth={stroke} />
      <circle
        className="donut-chart__value"
        cx={radius} cy={radius} r={normalizedRadius} fill="none"
        stroke={strokeColor} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
}
