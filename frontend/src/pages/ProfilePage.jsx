import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateUserProfile } from '../utils/network-data';
import '../profile.css';

const GOALS = [
  ['lose_weight', 'Menurunkan berat badan'],
  ['maintain_weight', 'Mempertahankan berat badan'],
  ['gain_weight', 'Menambah berat badan'],
];

function profileForm(user) {
  return {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    gender: user?.gender || '',
    weight: user?.weight_kg || '',
    height: user?.height_cm || '',
    goal: user?.goal || '',
    age: user?.age || '',
  };
}

function sameProfile(left, right) {
  return Object.keys(left).every((field) => String(left[field]) === String(right[field]));
}

export default function ProfilePage({ onLogout, user, onUserUpdated }) {
  const [form, setForm] = useState(() => profileForm(user));
  const [savedForm, setSavedForm] = useState(() => profileForm(user));
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const isDirty = !sameProfile(form, savedForm);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status.message) setStatus({ type: '', message: '' });
  }

  function resetChanges() {
    setForm(savedForm);
    setStatus({ type: '', message: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
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
        <header className="profile-header">
          <div className="profile-brand">
            <Link to="/" className="profile-brand__name">AuraFit</Link>
            <span className="profile-brand__context">Profil pengguna</span>
          </div>
          <nav className="profile-nav" aria-label="Navigasi utama">
            <Link to="/dashboard">Hari ini</Link>
            <Link to="/history">Riwayat</Link>
            <Link to="/profile" className="profile-nav__link--active" aria-current="page">Profil</Link>
            <button type="button" className="profile-nav__logout" onClick={onLogout}>Keluar</button>
          </nav>
        </header>

        <main className="profile-main">
          <section className="profile-hero" aria-labelledby="profile-title">
            <p className="profile-hero__eyebrow">Preferensi pribadi</p>
            <h1 id="profile-title" className="profile-hero__title">Buat rencana terasa lebih sesuai.</h1>
            <p className="profile-hero__copy">Perbarui data tubuh dan tujuanmu kapan saja. AuraFit akan menghitung ulang BMI setelah perubahan disimpan.</p>
          </section>

          <form className="profile-card" onSubmit={handleSubmit}>
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
              <label className="profile-field"><span>Nama depan</span><input value={form.first_name} onChange={(event) => setField('first_name', event.target.value)} maxLength={50} required /></label>
              <label className="profile-field"><span>Nama belakang</span><input value={form.last_name} onChange={(event) => setField('last_name', event.target.value)} maxLength={50} required /></label>
              <label className="profile-field"><span>Jenis kelamin</span><select value={form.gender} onChange={(event) => setField('gender', event.target.value)} required><option value="" disabled>Pilih jenis kelamin</option><option value="male">Laki-laki</option><option value="female">Perempuan</option></select></label>
              <label className="profile-field"><span>Umur (tahun)</span><input type="number" min="10" max="120" value={form.age} onChange={(event) => setField('age', event.target.value)} required /></label>
              <label className="profile-field"><span>Berat badan (kg)</span><input type="number" min="20" max="400" step="0.1" value={form.weight} onChange={(event) => setField('weight', event.target.value)} required /></label>
              <label className="profile-field"><span>Tinggi badan (cm)</span><input type="number" min="80" max="250" step="0.1" value={form.height} onChange={(event) => setField('height', event.target.value)} required /></label>
              <label className="profile-field profile-field--wide"><span>Tujuan</span><select value={form.goal} onChange={(event) => setField('goal', event.target.value)} required><option value="" disabled>Pilih tujuan</option>{GOALS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
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
        </main>
      </div>
    </div>
  );
}
