import { useState } from 'react';
import { createManualPlan } from '../utils/network-data';

function emptyActivity() {
  return { name: '', description: '' };
}

function emptyFood() {
  return { name: '', portion: '', kcal: '' };
}

function Field({ label, value, onChange, ...props }) {
  return (
    <label className="manual-plan-form__field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} {...props} />
    </label>
  );
}

export default function ManualPlanForm({ onCancel, onSaved }) {
  const [activities, setActivities] = useState([emptyActivity()]);
  const [foods, setFoods] = useState([emptyFood()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateRow(setRows, index, field, value) {
    setRows((rows) => rows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    )));
  }

  function removeRow(setRows, index, emptyRow) {
    setRows((rows) => rows.length === 1 ? [emptyRow()] : rows.filter((_, rowIndex) => rowIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const cleanActivities = activities
      .map((item) => ({ ...item, name: item.name.trim(), description: item.description.trim() }))
      .filter((item) => item.name);
    const cleanFoods = foods
      .map((item) => ({ ...item, name: item.name.trim(), portion: item.portion.trim() }))
      .filter((item) => item.name);

    if (cleanActivities.length + cleanFoods.length === 0) {
      setError('Tambahkan minimal satu aktivitas atau makanan.');
      return;
    }

    setSaving(true);
    const result = await createManualPlan({ activities: cleanActivities, foods: cleanFoods });
    setSaving(false);
    if (result.error) {
      setError(result.message || 'Rencana manual belum dapat disimpan.');
      return;
    }

    onSaved(result.data);
  }

  return (
    <form className="manual-plan-form" onSubmit={handleSubmit}>
      <div className="manual-plan-form__head">
        <div>
          <p className="manual-plan-form__eyebrow">Mode cadangan</p>
          <h2 className="manual-plan-form__title">Susun rencana sendiri</h2>
          <p className="manual-plan-form__copy">Tambahkan hal yang memang ingin kamu lakukan dan catat hari ini.</p>
        </div>
        <span className="manual-plan-form__badge">Tersimpan di akunmu</span>
      </div>

      <fieldset className="manual-plan-form__section">
        <legend>Aktivitas</legend>
        <p className="manual-plan-form__hint">Contoh: jalan kaki 20 menit, stretching, atau latihan ringan.</p>
        <div className="manual-plan-form__rows">
          {activities.map((item, index) => (
            <div className="manual-plan-form__row" key={`activity-${index}`}>
              <Field
                label={`Aktivitas ${index + 1}`}
                type="text"
                placeholder="Nama aktivitas"
                value={item.name}
                onChange={(value) => updateRow(setActivities, index, 'name', value)}
                maxLength={150}
              />
              <Field
                label="Catatan singkat"
                type="text"
                placeholder="Opsional"
                value={item.description}
                onChange={(value) => updateRow(setActivities, index, 'description', value)}
                maxLength={500}
              />
              <button type="button" className="manual-plan-form__remove" onClick={() => removeRow(setActivities, index, emptyActivity)} aria-label={`Hapus aktivitas ${index + 1}`}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="manual-plan-form__add" onClick={() => setActivities((rows) => [...rows, emptyActivity()])}>
          + Tambah aktivitas
        </button>
      </fieldset>

      <fieldset className="manual-plan-form__section">
        <legend>Makanan</legend>
        <p className="manual-plan-form__hint">Porsi dan kalori membantu ringkasan harian tetap informatif, tetapi keduanya opsional.</p>
        <div className="manual-plan-form__rows">
          {foods.map((item, index) => (
            <div className="manual-plan-form__row manual-plan-form__row--food" key={`food-${index}`}>
              <Field
                label={`Makanan ${index + 1}`}
                type="text"
                placeholder="Nama makanan"
                value={item.name}
                onChange={(value) => updateRow(setFoods, index, 'name', value)}
                maxLength={150}
              />
              <Field
                label="Porsi"
                type="text"
                placeholder="Opsional"
                value={item.portion}
                onChange={(value) => updateRow(setFoods, index, 'portion', value)}
                maxLength={80}
              />
              <Field
                label="Kalori (kcal)"
                type="number"
                min="0"
                max="100000"
                placeholder="Opsional"
                value={item.kcal}
                onChange={(value) => updateRow(setFoods, index, 'kcal', value)}
              />
              <button type="button" className="manual-plan-form__remove" onClick={() => removeRow(setFoods, index, emptyFood)} aria-label={`Hapus makanan ${index + 1}`}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="manual-plan-form__add" onClick={() => setFoods((rows) => [...rows, emptyFood()])}>
          + Tambah makanan
        </button>
      </fieldset>

      {error ? <p className="manual-plan-form__error" role="alert">{error}</p> : null}
      <div className="manual-plan-form__actions">
        <button type="button" className="manual-plan-form__secondary" onClick={onCancel} disabled={saving}>Batal</button>
        <button type="submit" className="manual-plan-form__primary" disabled={saving} aria-busy={saving}>
          {saving ? 'Menyimpan…' : 'Simpan rencana'}
        </button>
      </div>
    </form>
  );
}
