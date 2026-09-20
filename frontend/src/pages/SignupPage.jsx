import { Link } from "react-router-dom";
import Logo from '../assets/images/aurafit-mark.svg';
import PasswordVisibilityIcon from '../components/PasswordVisibilityIcon';
import FieldErrorSummary from '../components/FieldErrorSummary';
import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/network-data";
import { collectFieldErrors } from '../utils/validation-messages';
import '../auth.css';

const KELAS_INPUT = "auth-input";

function SignupFieldError({ errors, name }) {
  return errors[name] ? <p id={`signup-${name}-error`} className="auth-field__error">{errors[name]}</p> : null;
}

// Pendaftaran dibagi menjadi dua langkah.
//
// Sebelumnya sepuluh medan tampil sekaligus, sehingga pengguna harus mengisi
// seluruhnya sebelum melihat apa pun. Pembagian ini memperpendek layar yang
// dihadapi sekali waktu, dan memisahkan data akun dari data tubuh.
//
// Akun tetap dibuat sekali kirim pada akhir langkah kedua, karena backend
// mewajibkan seluruh kolom terisi. Memisahkan pembuatan akun dari pengisian
// profil memerlukan perubahan skema, dan itu keputusan tersendiri.
function SignupPage() {
  const [langkah, setLangkah] = React.useState(1);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [sex, setSex] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [goal, setGoal] = React.useState('');

  const [galat, setGalat] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [sedangKirim, setSedangKirim] = React.useState(false);
  const errorSummaryRef = React.useRef(null);

  const navigate = useNavigate();

  function clearFieldError(name) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function ubahField(name, setter, value) {
    setter(value);
    clearFieldError(name);
    if (galat) setGalat('');
  }

  function validasi(form) {
    const errors = collectFieldErrors(form);
    setFieldErrors(errors);
    const firstInvalid = form.querySelector(':invalid');
    if (Object.keys(errors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } else {
      firstInvalid?.focus();
    }
    return Object.keys(errors).length === 0;
  }

  function fieldProps(name, describedBy = '') {
    return {
      name,
      'aria-invalid': Boolean(fieldErrors[name]),
      'aria-describedby': [describedBy, fieldErrors[name] ? `signup-${name}-error` : ''].filter(Boolean).join(' ') || undefined,
      onBlur: (event) => {
        const errors = collectFieldErrors(event.currentTarget.form);
        setFieldErrors((current) => ({ ...current, ...(errors[name] ? { [name]: errors[name] } : {}) }));
      },
    };
  }

  function keLangkahDua(event) {
    event.preventDefault();
    setGalat('');

    const form = event.currentTarget;
    if (!validasi(form)) {
      setGalat('Lengkapi seluruh isian pada langkah ini.');
      return;
    }
    setLangkah(2);
  }

  function kembali() {
    setGalat('');
    setLangkah(1);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setGalat('');

    const form = event.currentTarget;
    if (!validasi(form)) {
      setGalat('Lengkapi seluruh isian pada langkah ini.');
      return;
    }

    if (!sex) return setGalat('Pilih jenis kelamin terlebih dahulu.');
    if (!goal) return setGalat('Pilih tujuan terlebih dahulu.');

    setSedangKirim(true);
    const response = await register({ username, email, password, firstName, lastName, sex, weight, height, goal, age });
    setSedangKirim(false);

    if (response.error) {
      // Bentrok nama pengguna atau surel berasal dari langkah pertama, sehingga
      // pengguna dikembalikan ke sana untuk memperbaikinya.
      const pesan = String(response.message || '');
      if (/username|email|sudah|exists|duplicate/i.test(pesan)) setLangkah(1);
      setGalat(pesan);
      return;
    }
    navigate('/login', { state: { baruMendaftar: true } });
  }

  return (
    <main className="auth-shell" data-route-main tabIndex="-1">
      <section className="auth-panel auth-panel--form">
        <Link to="/" className="auth-back">← Beranda</Link>
        <div className="auth-content">
          <p className="auth-kicker">Mulai dengan langkah sederhana</p>
          <h1 className="auth-title">Buat akun AuraFit</h1>
          <p className="auth-intro">Isi data akun, lalu lengkapi profil agar rencana harianmu lebih sesuai.</p>
          <div className="auth-progress" aria-label={`Langkah ${langkah} dari 2`}>
            <span className="auth-progress__label">Langkah {langkah} dari 2</span>
            <div className="auth-progress__track" aria-hidden="true">
              <span className="auth-progress__step auth-progress__step--active" />
              <span className={`auth-progress__step ${langkah === 2 ? 'auth-progress__step--active' : ''}`} />
            </div>
          </div>

        <form
          noValidate
          onSubmit={langkah === 1 ? keLangkahDua : onSubmitHandler}
          className="auth-form"
        >
          {langkah === 1 ? (
            <fieldset className="auth-fieldset">
              <legend className="auth-legend">Akun</legend>
              <p className="auth-help">
                Dipakai untuk masuk ke AuraFit.
              </p>

              <div className="auth-grid-2">
                <div className="auth-field">
                  <label htmlFor="signup-first-name">Nama Depan</label>
                  <input
                    id="signup-first-name"
                    type="text"
                    autoComplete="given-name"
                    className={KELAS_INPUT}
                    value={firstName}
                    onChange={(e) => ubahField('firstName', setFirstName, e.target.value)}
                    required
                    {...fieldProps('firstName')}
                  />
                  <SignupFieldError errors={fieldErrors} name="firstName" />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-last-name">Nama Belakang</label>
                  <input
                    id="signup-last-name"
                    type="text"
                    autoComplete="family-name"
                    className={KELAS_INPUT}
                    value={lastName}
                    onChange={(e) => ubahField('lastName', setLastName, e.target.value)}
                    required
                    {...fieldProps('lastName')}
                  />
                  <SignupFieldError errors={fieldErrors} name="lastName" />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-username">Nama Pengguna</label>
                  <input
                    id="signup-username"
                    type="text"
                    autoComplete="username"
                  className={KELAS_INPUT}
                  value={username}
                  onChange={(e) => ubahField('username', setUsername, e.target.value)}
                  required
                  {...fieldProps('username')}
                />
                <SignupFieldError errors={fieldErrors} name="username" />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@contoh.com"
                  className={KELAS_INPUT}
                  value={email}
                  onChange={(e) => ubahField('email', setEmail, e.target.value)}
                  required
                  {...fieldProps('email')}
                />
                <SignupFieldError errors={fieldErrors} name="email" />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password">Kata Sandi</label>
                  <div className="auth-password">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={KELAS_INPUT}
                      value={password}
                      onChange={(e) => ubahField('password', setPassword, e.target.value)}
                      minLength={8}
                      required
                      {...fieldProps('password', 'bantuan-sandi')}
                    />
                    <button type="button" className="auth-password__toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword}>
                      <PasswordVisibilityIcon visible={showPassword} />
                    </button>
                  </div>
                <p id="bantuan-sandi" className="text-xs text-gray-600 mt-1">Minimal 8 karakter.</p>
                <SignupFieldError errors={fieldErrors} name="password" />
              </div>
            </fieldset>
          ) : (
            <fieldset className="auth-fieldset">
              <legend className="auth-legend">Data tubuh</legend>
              <p className="auth-help">
                Dipakai untuk menghitung BMI dan menyusun rencana harianmu. Data ini
                hanya terlihat olehmu.
              </p>

              <div className="auth-field">
                <label htmlFor="signup-sex">Jenis Kelamin</label>
                <select
                  id="signup-sex"
                  className={KELAS_INPUT}
                  value={sex}
                  onChange={(e) => ubahField('sex', setSex, e.target.value)}
                  required
                  {...fieldProps('sex')}
                >
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                <SignupFieldError errors={fieldErrors} name="sex" />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-age">Umur (tahun)</label>
                <input
                  id="signup-age"
                  type="number"
                  min={10}
                  max={120}
                  className={KELAS_INPUT}
                  value={age}
                  onChange={(e) => ubahField('age', setAge, e.target.value)}
                  required
                  {...fieldProps('age')}
                />
                <SignupFieldError errors={fieldErrors} name="age" />
              </div>

              <div className="auth-grid-2">
                <div className="auth-field">
                  <label htmlFor="signup-weight">Berat Badan (kg)</label>
                  <input
                    id="signup-weight"
                    type="number"
                    min={20}
                    max={400}
                    className={KELAS_INPUT}
                    value={weight}
                    onChange={(e) => ubahField('weight', setWeight, e.target.value)}
                    required
                    {...fieldProps('weight')}
                  />
                  <SignupFieldError errors={fieldErrors} name="weight" />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-height">Tinggi Badan (cm)</label>
                  <input
                    id="signup-height"
                    type="number"
                    min={80}
                    max={250}
                    className={KELAS_INPUT}
                    value={height}
                    onChange={(e) => ubahField('height', setHeight, e.target.value)}
                    required
                    {...fieldProps('height')}
                  />
                  <SignupFieldError errors={fieldErrors} name="height" />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-goal">Tujuan</label>
                <select
                  id="signup-goal"
                  value={goal}
                    onChange={(e) => ubahField('goal', setGoal, e.target.value)}
                    className={KELAS_INPUT}
                    required
                    {...fieldProps('goal')}
                  >
                  <option value="" disabled>Pilih tujuan</option>
                  <option value="lose_weight">Menurunkan berat badan</option>
                  <option value="maintain_weight">Mempertahankan berat badan</option>
                  <option value="gain_weight">Menambah berat badan</option>
                </select>
                <SignupFieldError errors={fieldErrors} name="goal" />
              </div>
            </fieldset>
          )}

          <FieldErrorSummary ref={errorSummaryRef} errors={fieldErrors} prefix="signup" />
          {galat ? (
            <p role="alert" className="auth-error">
              {galat}
            </p>
          ) : null}

          <div className={langkah === 1 ? "auth-actions auth-actions--single" : "auth-actions"}>
            {langkah === 2 ? (
              <button
                type="button"
                onClick={kembali}
                className="auth-secondary"
              >
                Kembali
              </button>
            ) : null}

            <button
              type="submit"
              disabled={sedangKirim}
              aria-busy={sedangKirim}
              className="auth-submit"
            >
              {langkah === 1 ? 'Lanjut ke data tubuh' : sedangKirim ? 'Mendaftarkan…' : 'Daftar'}
            </button>
          </div>
        </form>

        <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </section>

      <aside className="auth-brand-panel">
        <div className="auth-brand-panel__content">
          <h2 className="auth-brand-panel__name">AuraFit</h2>
          <p className="auth-brand-panel__tagline">Profil yang lebih lengkap, rencana yang lebih mudah dipahami.</p>
        </div>
        <img src={Logo} alt="" aria-hidden="true" className="auth-brand-panel__mark" />
        <p className="auth-brand-panel__footer">Personal digital health coach</p>
      </aside>
    </main>
  );
}

export default SignupPage;
