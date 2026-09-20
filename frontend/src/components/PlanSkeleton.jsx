// Kerangka rencana hari ini. Teks "Menyusun rencana hari ini…" sendirian
// membuat layar terasa kosong dan tidak memberi petunjuk apa yang akan muncul.
// Bentuk kerangka mengikuti tata letak sebenarnya agar isi tidak melompat.
export default function PlanSkeleton() {
  return (
    <div className="plan-skeleton" aria-hidden="true">
      <div className="plan-skeleton__hero">
        <span className="skeleton-bar skeleton-bar--kicker" />
        <span className="skeleton-bar skeleton-bar--title" />
        <span className="skeleton-bar skeleton-bar--copy" />
        <div className="plan-skeleton__metrics">
          <span className="skeleton-block" />
          <span className="skeleton-block" />
        </div>
      </div>
      <div className="plan-skeleton__section">
        <span className="skeleton-bar skeleton-bar--heading" />
        <div className="plan-skeleton__cards">
          {[0, 1, 2].map((i) => <span key={i} className="skeleton-card" />)}
        </div>
      </div>
    </div>
  );
}
