import { Link } from "react-router-dom";
import Logo from '../assets/images/aurafit-mark.svg';
import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/network-data";
import '../auth.css';

const KELAS_INPUT = "auth-input";

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
  const [age, setAge] = React.useState('');
  const [sex, setSex] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [goal, setGoal] = React.useState('');

  const [galat, setGalat] = React.useState('');
  const [sedangKirim, setSedangKirim] = React.useState(false);

  const navigate = useNavigate();

  function keLangkahDua(event) {
    event.preventDefault();
    setGalat('');

    if (!firstName || !username || !email || !password) {
      setGalat('Lengkapi seluruh isian pada langkah ini.');
      return;
    }
    if (password.length < 8) {
      setGalat('Kata sandi minimal 8 karakter.');
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
    <main className="auth-shell">
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
                  <label htmlFor="signup-firstname">Nama Depan</label>
                  <input
                    id="signup-firstname"
                    type="text"
                    className={KELAS_INPUT}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-lastname">Nama Belakang</label>
                  <input
                    id="signup-lastname"
                    type="text"
                    className={KELAS_INPUT}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-username">Nama Pengguna</label>
                <input
                  id="signup-username"
                  type="text"
                  className={KELAS_INPUT}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="nama@contoh.com"
                  className={KELAS_INPUT}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password">Kata Sandi</label>
                <input
                  id="signup-password"
                  type="password"
                  className={KELAS_INPUT}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  aria-describedby="bantuan-sandi"
                />
                <p id="bantuan-sandi" className="text-xs text-gray-600 mt-1">Minimal 8 karakter.</p>
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
                  onChange={(e) => setSex(e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
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
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
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
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
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
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-goal">Tujuan</label>
                <select
                  id="signup-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={KELAS_INPUT}
                  required
                >
                  <option value="" disabled>Pilih tujuan</option>
                  <option value="lose_weight">Menurunkan berat badan</option>
                  <option value="maintain_weight">Mempertahankan berat badan</option>
                  <option value="gain_weight">Menambah berat badan</option>
                </select>
              </div>
            </fieldset>
          )}

          {galat ? (
            <p role="alert" className="auth-error">
              {galat}
            </p>
          ) : null}

          <div className="auth-actions">
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
              {langkah === 1 ? 'Lanjut' : sedangKirim ? 'Mendaftarkan…' : 'Daftar'}
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
