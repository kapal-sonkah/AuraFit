import AuraGlyph from './AuraGlyph';
import { AURA_OPTIONS, getAuraOption } from '../utils/aura';

export default function AuraCheckIn({ aura, loading, saving, error, onChange }) {
  const selected = getAuraOption(aura);

  return (
    <section className="aura-checkin" aria-labelledby="aura-title">
      <div className="aura-checkin__head">
        <div>
          <p className="aura-checkin__eyebrow">Aura hari ini</p>
          <h2 id="aura-title" className="aura-checkin__title">Bagaimana auramu hari ini?</h2>
        </div>
        <p className="aura-checkin__hint">Pilih kondisi yang paling mendekati.</p>
      </div>

      <div className="aura-checkin__options" aria-label="Pilih aura hari ini" aria-busy={loading || saving}>
        {AURA_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`aura-option ${aura === option.value ? 'aura-option--selected' : ''}`}
            data-aura={option.value}
            aria-pressed={aura === option.value}
            disabled={loading || saving}
            onClick={() => onChange(option.value)}
          >
            <AuraGlyph aura={option.value} />
            <span className="aura-option__label">{option.label}</span>
            <span className="aura-option__detail">{option.detail}</span>
          </button>
        ))}
      </div>

      {loading ? <p className="aura-checkin__status" aria-live="polite">Memuat aura hari ini…</p> : null}
      {!loading && selected ? (
        <p className="aura-checkin__status" aria-live="polite">
          <strong>{selected.label}.</strong> {selected.suggestion}
        </p>
      ) : null}
      {error ? <p className="aura-checkin__error" role="alert">{error}</p> : null}
    </section>
  );
}
