import { useState } from 'react';
import AuraGlyph from './AuraGlyph';
import { AURA_OPTIONS, getAuraOption } from '../utils/aura';

// aura adalah nilai yang sudah dikonfirmasi server. pendingAura adalah pilihan
// yang sedang atau gagal disimpan; pilihan itu tidak pernah ditampilkan sebagai
// aura aktif sebelum server menjawab berhasil.
export default function AuraCheckIn({ aura, pendingAura, loading, saving, error, locked, onChange, onRetry, onAdjust }) {
  const [editing, setEditing] = useState(false);
  const selected = getAuraOption(aura);
  const pending = getAuraOption(pendingAura);
  const showOptions = !locked && (!selected || editing);

  async function pilih(value) {
    if (await onChange(value)) setEditing(false);
  }

  return (
    <section className="aura-checkin" aria-labelledby="aura-title">
      <div className="aura-checkin__head">
        <div>
          <p className="aura-checkin__eyebrow">Aura hari ini</p>
          <h2 id="aura-title" className="aura-checkin__title">Bagaimana auramu hari ini?</h2>
        </div>
        {showOptions ? <p className="aura-checkin__hint">Pilih kondisi yang paling mendekati.</p> : null}
      </div>

      {showOptions ? (
        <>
          <div className="aura-checkin__options" aria-label="Pilih aura hari ini" aria-busy={loading || saving}>
            {AURA_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`aura-option ${aura === option.value ? 'aura-option--selected' : ''} ${saving && pendingAura === option.value ? 'aura-option--saving' : ''}`}
                data-aura={option.value}
                aria-pressed={aura === option.value}
                disabled={loading || saving}
                onClick={() => pilih(option.value)}
              >
                <AuraGlyph aura={option.value} />
                <span className="aura-option__label">{option.label}</span>
                <span className="aura-option__detail">
                  {saving && pendingAura === option.value ? 'Menyimpan…' : option.detail}
                </span>
              </button>
            ))}
          </div>
          {selected ? <button type="button" className="aura-checkin__done" onClick={() => setEditing(false)} disabled={saving}>Batal</button> : null}
        </>
      ) : selected ? (
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
            {locked ? null : <button type="button" className="aura-checkin__action" onClick={() => setEditing(true)} disabled={saving}>Ubah aura</button>}
            {onAdjust ? <button type="button" className="aura-checkin__action" onClick={onAdjust} disabled={saving}>Tambah item sendiri</button> : null}
          </div>
        </div>
      ) : null}

      {loading ? <p className="aura-checkin__status" aria-live="polite">Memuat aura hari ini…</p> : null}
      {saving && pending ? <p className="aura-checkin__status" aria-live="polite">Menyimpan Aura {pending.label}…</p> : null}
      {!loading && !saving && selected ? (
        <p className="aura-checkin__status" aria-live="polite">
          <strong>{selected.label}.</strong> {selected.suggestion}
          {locked ? ' Rencana hari ini sudah disusun dari aura ini, jadi auranya tetap sampai besok.' : ''}
        </p>
      ) : null}
      {!loading && !saving && locked && !selected && !error ? (
        <p className="aura-checkin__status">Rencana hari ini sudah tersusun tanpa aura. Kamu bisa memilih aura besok.</p>
      ) : null}
      {error ? (
        <div className="aura-checkin__error" role="alert">
          <p>{error}</p>
          {onRetry ? <button type="button" className="aura-checkin__action" onClick={onRetry}>Coba lagi</button> : null}
        </div>
      ) : null}
    </section>
  );
}
