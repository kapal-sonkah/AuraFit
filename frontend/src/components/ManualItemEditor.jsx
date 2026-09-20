import { useState } from 'react';
import { collectFieldErrors } from '../utils/validation-messages';

// Borang ubah untuk satu butir yang dicatat sendiri. onSave mengembalikan pesan
// galat bila gagal, atau null bila tersimpan.
export default function ManualItemEditor({ item, type, onSave, onCancel }) {
  const [name, setName] = useState(item.name ?? '');
  const [description, setDescription] = useState(item.description ?? '');
  const [portion, setPortion] = useState(item.portion ?? '');
  const [kcal, setKcal] = useState(item.kcal ?? '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function setField(field, setter, value) {
    setter(value);
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (error) setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = collectFieldErrors(event.currentTarget);
    if (name.trim().length < 2) errors.name = 'Nama wajib diisi, minimal dua huruf.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      event.currentTarget.querySelector(':invalid')?.focus();
      return;
    }

    setSaving(true);
    setError('');
    const pesan = await onSave(item.id, type === 'activity'
      ? { name, description }
      : { name, portion, kcal });
    setSaving(false);
    if (pesan) setError(pesan);
  }

  return (
    <form className="plan-item-editor" noValidate onSubmit={handleSubmit}>
      <label className="manual-plan-form__field">
        <span>{type === 'activity' ? 'Nama aktivitas' : 'Nama makanan'}</span>
        <input id="editor-name" name="name" value={name} onChange={(e) => setField('name', setName, e.target.value)} maxLength={150} minLength={2} required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'editor-name-error' : undefined} />
        {fieldErrors.name ? <small id="editor-name-error" className="manual-plan-form__field-error">{fieldErrors.name}</small> : null}
      </label>
      {type === 'activity' ? (
        <label className="manual-plan-form__field">
          <span>Catatan singkat</span>
          <input id="editor-description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Opsional" />
        </label>
      ) : (
        <>
          <label className="manual-plan-form__field">
            <span>Porsi</span>
            <input id="editor-portion" name="portion" value={portion} onChange={(e) => setField('portion', setPortion, e.target.value)} maxLength={80} placeholder="Opsional" />
          </label>
          <label className="manual-plan-form__field">
            <span>Kalori (kcal)</span>
            <input id="editor-kcal" name="kcal" type="number" min="0" max="100000" value={kcal} onChange={(e) => setField('kcal', setKcal, e.target.value)} placeholder="Opsional" aria-invalid={Boolean(fieldErrors.kcal)} aria-describedby={fieldErrors.kcal ? 'editor-kcal-error' : undefined} />
            {fieldErrors.kcal ? <small id="editor-kcal-error" className="manual-plan-form__field-error">{fieldErrors.kcal}</small> : null}
          </label>
        </>
      )}
      {error ? <p className="manual-plan-form__error" role="alert">{error}</p> : null}
      <div className="plan-item-editor__actions">
        <button type="button" className="manual-plan-form__secondary" onClick={onCancel} disabled={saving}>Batal</button>
        <button type="submit" className="manual-plan-form__primary" disabled={saving} aria-busy={saving}>
          {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
