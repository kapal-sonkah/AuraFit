import { Link } from "react-router-dom";
import Logo from '../assets/images/aurafit-mark.svg';
import { login } from '../utils/network-data';
import React from "react";
import '../auth.css';

function LoginPage({ loginSuccess }) {

  const [username_email, setUsernameEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [galat, setGalat] = React.useState('');
  const [sedangKirim, setSedangKirim] = React.useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setGalat('');
    setSedangKirim(true);

    const { error, data, message } = await login({ username_email, password });
    setSedangKirim(false);

    if (error) {
      setGalat(message);
      return;
    }
    loginSuccess(data);
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel--form">
        <Link to="/" className="auth-back">← Beranda</Link>
        <div className="auth-content">
          <p className="auth-kicker">Selamat datang kembali</p>
          <h1 className="auth-title">Masuk ke AuraFit</h1>
          <p className="auth-intro">Lanjutkan rencana aktivitas dan asupan harianmu dari perangkat mana pun.</p>

          <form onSubmit={onSubmitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-username">Nama pengguna atau email</label>
            <input
              id="login-username"
              type="text"
              className="auth-input"
              autoComplete="username"
              value={username_email}
              onChange={(e) => setUsernameEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Kata sandi</label>
            <div className="auth-password">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="auth-password__toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword}>
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {galat ? (
            <p role="alert" className="auth-error">
              {galat}
            </p>
          ) : null}

            <button
              type="submit"
              disabled={sedangKirim}
              aria-busy={sedangKirim}
              className="auth-submit"
            >
              {sedangKirim ? 'Memproses…' : 'Masuk'}
            </button>
          </form>

          <p className="auth-switch">Belum punya akun? <Link to="/signup">Daftar sekarang</Link></p>
        </div>
      </section>

      <aside className="auth-brand-panel">
        <div className="auth-brand-panel__content">
          <h2 className="auth-brand-panel__name">AuraFit</h2>
          <p className="auth-brand-panel__tagline">Rencana harian yang terasa lebih mudah untuk dijalani.</p>
        </div>
        <img src={Logo} alt="" aria-hidden="true" className="auth-brand-panel__mark" />
        <p className="auth-brand-panel__footer">Personal digital health coach</p>
      </aside>
    </main>
  );
}

export default LoginPage;
