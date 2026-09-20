import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { changePassword, updateUserProfile } from '../utils/network-data';
import { collectFieldErrors } from '../utils/validation-messages';
import '../profile.css';

const GOALS = [
  ['lose_weight', 'Menurunkan berat badan'],
  ['maintain_weight', 'Mempertahankan berat badan'],
  ['gain_weight', 'Menambah berat badan'],
];

// Kolom NUMERIC dari basis data tiba sebagai teks "58.00"; tampilkan "58".
function angka(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(value);
  return Number.isFinite(n) ? String(n) : value;
}

function profileForm(user) {
  return {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    gender: user?.gender || '',
    weight: angka(user?.weight_kg),
    height: angka(user?.height_cm),
    goal: user?.goal || '',
    age: user?.age || '',
  };
}

function sameProfile(left, right) {
  return Object.keys(left).every((field) => String(left[field]) === String(right[field]));
}

function FieldError({ errors, name, prefix = 'profile' }) {
  return errors[name] ? <small id={`${prefix}-${name}-error`} className="profile-field__error">{errors[name]}</small> : null;
}

function PasswordCard() {
  const [fields, setFields] = useState({ current: '', next: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  function setField(field, value) {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status.message) setStatus({ type: '', message: '' });
  }

  function fieldProps(name) {
    return {
      name,
      'aria-invalid': Boolean(fieldErrors[name]),
      'aria-describedby': fieldErrors[name] ? `password-${name}-error` : undefined,
      onBlur: (event) => {
        const errors = collectFieldErrors(event.currentTarget.form);
        if (errors[name]) setFieldErrors((current) => ({ ...current, [name]: errors[name] }));
      },
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = collectFieldErrors(event.currentTarget);
    if (fields.next && fields.confirm && fields.next !== fields.confirm) errors.confirm = 'Konfirmasi kata sandi baru tidak sama.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstInvalid = event.currentTarget.querySelector(':invalid');
      (firstInvalid || (errors.confirm ? document.getElementById('password-confirm') : null))?.focus();
      return;
    }

    setSaving(true);
    const result = await changePassword(fields.current, fields.next);
    setSaving(false);

    if (result.error) {
      setStatus({ type: 'error', message: result.message });
      return;
    }
    setFields({ current: '', next: '', confirm: '' });
    setStatus({ type: 'success', message: 'Kata sandi berhasil diganti. Gunakan kata sandi baru saat masuk berikutnya.' });
  }

  return (
    <form className="profile-card" noValidate onSubmit={handleSubmit}>
      <div className="profile-card__head">
        <div>
          <p className="profile-card__eyebrow">Keamanan akun</p>
          <h2 className="profile-card__title">Ganti kata sandi</h2>
        </div>
      </div>

      <div className="profile-form-grid">
        <label className="profile-field profile-field--wide"><span>Kata sandi saat ini</span><input id="password-current" type="password" autoComplete="current-password" value={fields.current} onChange={(event) => setField('current', event.target.value)} required {...fieldProps('current')} /><FieldError errors={fieldErrors} name="current" prefix="password" /></label>
        <label className="profile-field"><span>Kata sandi baru</span><input id="password-next" type="password" autoComplete="new-password" minLength={8} value={fields.next} onChange={(event) => setField('next', event.target.value)} required {...fieldProps('next')} /><FieldError errors={fieldErrors} name="next" prefix="password" /></label>
        <label className="profile-field"><span>Ulangi kata sandi baru</span><input id="password-confirm" type="password" autoComplete="new-password" minLength={8} value={fields.confirm} onChange={(event) => setField('confirm', event.target.value)} required {...fieldProps('confirm')} /><FieldError errors={fieldErrors} name="confirm" prefix="password" /></label>
      </div>

      {status.message ? <p className={`profile-message profile-message--${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p> : null}
      <div className="profile-actions">
        <button type="submit" className="profile-action profile-action--primary" disabled={saving} aria-busy={saving}>{saving ? 'Menyimpan…' : 'Ganti kata sandi'}</button>
      </div>
    </form>
  );
}

export default function ProfilePage({ onLogout, user, onUserUpdated }) {
  const [form, setForm] = useState(() => profileForm(user));
  const [savedForm, setSavedForm] = useState(() => profileForm(user));
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const isDirty = !sameProfile(form, savedForm);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status.message) setStatus({ type: '', message: '' });
  }

  function fieldProps(name) {
    return {
      name,
      'aria-invalid': Boolean(fieldErrors[name]),
      'aria-describedby': fieldErrors[name] ? `profile-${name}-error` : undefined,
      onBlur: (event) => {
        const errors = collectFieldErrors(event.currentTarget.form);
        if (errors[name]) setFieldErrors((current) => ({ ...current, [name]: errors[name] }));
      },
    };
  }

  function resetChanges() {
    setForm(savedForm);
    setFieldErrors({});
    setStatus({ type: '', message: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    const errors = collectFieldErrors(event.currentTarget);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      event.currentTarget.querySelector(':invalid')?.focus();
      return;
    }
    setSaving(true);
    const result = await updateUserProfile(form);
    setSaving(false);

    if (result.error) {
      setStatus({ type: 'error', message: result.message || 'Profil belum dapat diperbarui.' });
      return;
    }

    const nextForm = profileForm(result.data);
    onUserUpdated(result.data);
    setForm(nextForm);
    setSavedForm(nextForm);
    setStatus({ type: 'success', message: 'Profil berhasil diperbarui. Rekomendasi berikutnya akan memakai data baru ini.' });
  }

  return (
    <div className="profile-shell">
      <div className="profile-frame">
        <AppHeader onLogout={onLogout} />

        <main className="profile-main">
          <section className="profile-hero" aria-labelledby="profile-title">
            <p className="profile-hero__eyebrow">Preferensi pribadi</p>
            <h1 id="profile-title" className="profile-hero__title">Buat rencana terasa lebih sesuai.</h1>
            <p className="profile-hero__copy">Perbarui data tubuh dan tujuanmu kapan saja. AuraFit akan menghitung ulang BMI setelah perubahan disimpan.</p>
          </section>

          <form className="profile-card" noValidate onSubmit={handleSubmit}>
            <div className="profile-card__head">
              <div>
                <p className="profile-card__eyebrow">Data profil</p>
                <h2 className="profile-card__title">Informasi yang dipakai AuraFit</h2>
              </div>
              <div className="profile-account">
                <span>@{user?.username}</span>
                <small>{user?.email}</small>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field"><span>Nama depan</span><input id="profile-first-name" value={form.first_name} onChange={(event) => setField('first_name', event.target.value)} maxLength={50} required {...fieldProps('first_name')} /><FieldError errors={fieldErrors} name="first_name" /></label>
              <label className="profile-field"><span>Nama belakang</span><input id="profile-last-name" value={form.last_name} onChange={(event) => setField('last_name', event.target.value)} maxLength={50} required {...fieldProps('last_name')} /><FieldError errors={fieldErrors} name="last_name" /></label>
              <label className="profile-field"><span>Jenis kelamin</span><select id="profile-gender" value={form.gender} onChange={(event) => setField('gender', event.target.value)} required {...fieldProps('gender')}><option value="" disabled>Pilih jenis kelamin</option><option value="male">Laki-laki</option><option value="female">Perempuan</option></select><FieldError errors={fieldErrors} name="gender" /></label>
              <label className="profile-field"><span>Umur (tahun)</span><input id="profile-age" type="number" min="10" max="120" value={form.age} onChange={(event) => setField('age', event.target.value)} required {...fieldProps('age')} /><FieldError errors={fieldErrors} name="age" /></label>
              <label className="profile-field"><span>Berat badan (kg)</span><input id="profile-weight" type="number" min="20" max="400" step="0.1" value={form.weight} onChange={(event) => setField('weight', event.target.value)} required {...fieldProps('weight')} /><FieldError errors={fieldErrors} name="weight" /></label>
              <label className="profile-field"><span>Tinggi badan (cm)</span><input id="profile-height" type="number" min="80" max="250" step="0.1" value={form.height} onChange={(event) => setField('height', event.target.value)} required {...fieldProps('height')} /><FieldError errors={fieldErrors} name="height" /></label>
              <label className="profile-field profile-field--wide"><span>Tujuan</span><select id="profile-goal" value={form.goal} onChange={(event) => setField('goal', event.target.value)} required {...fieldProps('goal')}><option value="" disabled>Pilih tujuan</option>{GOALS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><FieldError errors={fieldErrors} name="goal" /></label>
            </div>

            {status.message ? <p className={`profile-message profile-message--${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p> : null}
            {status.type === 'success' && !isDirty ? (
              <div className="profile-actions profile-actions--saved">
                <Link to="/dashboard" className="profile-action profile-action--primary">Kembali ke Hari ini</Link>
              </div>
            ) : (
              <div className="profile-actions">
                {isDirty ? (
                  <button type="button" className="profile-action profile-action--secondary" onClick={resetChanges}>Batalkan perubahan</button>
                ) : (
                  <Link to="/dashboard" className="profile-action profile-action--secondary">Kembali</Link>
                )}
                <button type="submit" className="profile-action profile-action--primary" disabled={saving || !isDirty} aria-busy={saving}>{saving ? 'Menyimpan…' : 'Simpan perubahan'}</button>
              </div>
            )}
          </form>

          <PasswordCard />
        </main>
      </div>
    </div>
  );
}
