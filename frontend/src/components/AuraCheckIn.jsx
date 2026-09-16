import { useState } from 'react';
import AuraGlyph from './AuraGlyph';
import { AURA_OPTIONS, getAuraOption } from '../utils/aura';

export default function AuraCheckIn({ aura, loading, saving, error, onChange, onAdjust }) {
  const [editing, setEditing] = useState(false);
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

      {selected && !editing ? (
        <div className="aura-checkin__mode" data-aura={selected.value}>
          <div className="aura-checkin__mode-copy">
            <AuraGlyph aura={selected.value} />
            <span>
              <small>Mode Aura</small>
              <strong>{selected.label}</strong>
              <em>{selected.detail}</em>
            </span>
          </div>
          <div className="aura-checkin__actions">
            <button type="button" className="aura-checkin__action" onClick={() => setEditing(true)} disabled={saving}>Ubah aura</button>
            {onAdjust ? <button type="button" className="aura-checkin__action aura-checkin__action--primary" onClick={onAdjust} disabled={saving}>Sesuaikan rencana</button> : null}
          </div>
        </div>
      ) : (
        <>
          <div className="aura-checkin__options" aria-label="Pilih aura hari ini" aria-busy={loading || saving}>
            {AURA_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`aura-option ${aura === option.value ? 'aura-option--selected' : ''}`}
                data-aura={option.value}
                aria-pressed={aura === option.value}
                disabled={loading || saving}
                onClick={() => { onChange(option.value); setEditing(false); }}
              >
                <AuraGlyph aura={option.value} />
                <span className="aura-option__label">{option.label}</span>
                <span className="aura-option__detail">{option.detail}</span>
              </button>
            ))}
          </div>
          {selected ? <button type="button" className="aura-checkin__done" onClick={() => setEditing(false)} disabled={saving}>Selesai</button> : null}
        </>
      )}

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
