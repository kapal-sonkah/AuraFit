import { useRef, useState } from 'react';
import { createManualPlan } from '../utils/network-data';
import FieldErrorSummary from './FieldErrorSummary';

function emptyActivity() {
  return { name: '', description: '' };
}

function emptyFood() {
  return { name: '', portion: '', kcal: '' };
}

function Field({ id, label, value, onChange, error, onBlur, ...props }) {
  return (
    <label className="manual-plan-form__field">
      <span>{label}</span>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error ? <small id={`${id}-error`} className="manual-plan-form__field-error">{error}</small> : null}
    </label>
  );
}

export default function ManualPlanForm({ onCancel, onSaved, auraLabel = null }) {
  const [activities, setActivities] = useState([emptyActivity()]);
  const [foods, setFoods] = useState([emptyFood()]);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const errorSummaryRef = useRef(null);

  function fieldKey(group, index, field) {
    return `${group}-${index}-${field}`;
  }

  function clearFieldError(key) {
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateRow(setRows, index, field, value) {
    setRows((rows) => rows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    )));
    clearFieldError(fieldKey(setRows === setActivities ? 'activity' : 'food', index, field));
    if (error) setError('');
  }

  function removeRow(setRows, index, emptyRow) {
    setRows((rows) => rows.length === 1 ? [emptyRow()] : rows.filter((_, rowIndex) => rowIndex !== index));
    setFieldErrors({});
  }

  function validateRowField(group, index, field, value) {
    const rows = group === 'activity' ? activities : foods;
    const row = rows[index];
    const otherValues = Object.entries({ ...row, [field]: value })
      .some(([key, entry]) => key !== field && String(entry).trim());
    let message = '';
    if (field === 'name' && !value.trim() && otherValues) message = `${group === 'activity' ? 'Nama aktivitas' : 'Nama makanan'} wajib diisi jika baris ini digunakan.`;
    if (field === 'name' && value.trim() && value.trim().length < 2) message = 'Nama harus berisi minimal dua huruf.';
    if (field === 'kcal' && value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 100000)) message = 'Kalori harus berada di antara 0 dan 100.000 kcal.';
    const key = fieldKey(group, index, field);
    if (message) setFieldErrors((current) => ({ ...current, [key]: message }));
    else clearFieldError(key);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const nextErrors = {};
    activities.forEach((item, index) => {
      if (!item.name.trim() && item.description.trim()) nextErrors[fieldKey('activity', index, 'name')] = 'Nama aktivitas wajib diisi jika catatan diisi.';
      if (item.name.trim() && item.name.trim().length < 2) nextErrors[fieldKey('activity', index, 'name')] = 'Nama harus berisi minimal dua huruf.';
    });
    foods.forEach((item, index) => {
      if (!item.name.trim() && (item.portion.trim() || item.kcal !== '')) nextErrors[fieldKey('food', index, 'name')] = 'Nama makanan wajib diisi jika baris ini digunakan.';
      if (item.name.trim() && item.name.trim().length < 2) nextErrors[fieldKey('food', index, 'name')] = 'Nama harus berisi minimal dua huruf.';
      if (item.kcal !== '' && (!Number.isFinite(Number(item.kcal)) || Number(item.kcal) < 0 || Number(item.kcal) > 100000)) nextErrors[fieldKey('food', index, 'kcal')] = 'Kalori harus berada di antara 0 dan 100.000 kcal.';
    });

    const cleanActivities = activities
      .map((item) => ({ ...item, name: item.name.trim(), description: item.description.trim() }))
      .filter((item) => item.name);
    const cleanFoods = foods
      .map((item) => ({ ...item, name: item.name.trim(), portion: item.portion.trim() }))
      .filter((item) => item.name);

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError('Lengkapi field yang ditandai sebelum menyimpan.');
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

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
    <form className="manual-plan-form" noValidate onSubmit={handleSubmit}>
      <div className="manual-plan-form__head">
        <div>
          <p className="manual-plan-form__eyebrow">{auraLabel ? `Mode Aura ${auraLabel}` : 'Mode cadangan'}</p>
          <h2 className="manual-plan-form__title">{auraLabel ? 'Sesuaikan rencana hari ini' : 'Susun rencana sendiri'}</h2>
          <p className="manual-plan-form__copy">{auraLabel ? `Pilih aktivitas dan makanan yang terasa pas untuk Aura ${auraLabel}.` : 'Tambahkan hal yang memang ingin kamu lakukan dan catat hari ini.'}</p>
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
                id={`activity-${index}-name`}
                label={`Aktivitas ${index + 1}`}
                type="text"
                placeholder="Nama aktivitas"
                value={item.name}
                onChange={(value) => updateRow(setActivities, index, 'name', value)}
                onBlur={(event) => validateRowField('activity', index, 'name', event.target.value)}
                error={fieldErrors[fieldKey('activity', index, 'name')]}
                maxLength={150}
              />
              <Field
                id={`activity-${index}-description`}
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
                id={`food-${index}-name`}
                label={`Makanan ${index + 1}`}
                type="text"
                placeholder="Nama makanan"
                value={item.name}
                onChange={(value) => updateRow(setFoods, index, 'name', value)}
                onBlur={(event) => validateRowField('food', index, 'name', event.target.value)}
                error={fieldErrors[fieldKey('food', index, 'name')]}
                maxLength={150}
              />
              <Field
                id={`food-${index}-portion`}
                label="Porsi"
                type="text"
                placeholder="Opsional"
                value={item.portion}
                onChange={(value) => updateRow(setFoods, index, 'portion', value)}
                maxLength={80}
              />
              <Field
                id={`food-${index}-kcal`}
                label="Kalori (kcal)"
                type="number"
                min="0"
                max="100000"
                placeholder="Opsional"
                value={item.kcal}
                onChange={(value) => updateRow(setFoods, index, 'kcal', value)}
                onBlur={(event) => validateRowField('food', index, 'kcal', event.target.value)}
                error={fieldErrors[fieldKey('food', index, 'kcal')]}
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

      <FieldErrorSummary
        ref={errorSummaryRef}
        errors={fieldErrors}
        prefix="manual"
        getFieldId={(name) => name}
      />
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
