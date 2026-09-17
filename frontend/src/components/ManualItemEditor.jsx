import { useState } from 'react';

// Borang ubah untuk satu butir yang dicatat sendiri. onSave mengembalikan pesan
// galat bila gagal, atau null bila tersimpan.
export default function ManualItemEditor({ item, type, onSave, onCancel }) {
  const [name, setName] = useState(item.name ?? '');
  const [description, setDescription] = useState(item.description ?? '');
  const [portion, setPortion] = useState(item.portion ?? '');
  const [kcal, setKcal] = useState(item.kcal ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError('Nama wajib diisi, minimal dua huruf.');
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
    <form className="plan-item-editor" onSubmit={handleSubmit}>
      <label className="manual-plan-form__field">
        <span>{type === 'activity' ? 'Nama aktivitas' : 'Nama makanan'}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={150} required />
      </label>
      {type === 'activity' ? (
        <label className="manual-plan-form__field">
          <span>Catatan singkat</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Opsional" />
        </label>
      ) : (
        <>
          <label className="manual-plan-form__field">
            <span>Porsi</span>
            <input value={portion} onChange={(e) => setPortion(e.target.value)} maxLength={80} placeholder="Opsional" />
          </label>
          <label className="manual-plan-form__field">
            <span>Kalori (kcal)</span>
            <input type="number" min="0" max="100000" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="Opsional" />
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
