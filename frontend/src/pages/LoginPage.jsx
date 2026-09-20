import { Link } from "react-router-dom";
import Logo from '../assets/images/aurafit-mark.svg';
import PasswordVisibilityIcon from '../components/PasswordVisibilityIcon';
import FieldErrorSummary from '../components/FieldErrorSummary';
import { login } from '../utils/network-data';
import { collectFieldErrors } from '../utils/validation-messages';
import React from "react";
import '../auth.css';

function LoginPage({ loginSuccess }) {

  const [username_email, setUsernameEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [galat, setGalat] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [sedangKirim, setSedangKirim] = React.useState(false);
  const errorSummaryRef = React.useRef(null);

  function clearFieldError(name) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function fieldProps(name) {
    return {
      name,
      'aria-invalid': Boolean(fieldErrors[name]),
      'aria-describedby': fieldErrors[name] ? `login-${name}-error` : undefined,
      onBlur: (event) => {
        const errors = collectFieldErrors(event.currentTarget.form);
        if (errors[name]) setFieldErrors((current) => ({ ...current, [name]: errors[name] }));
      },
    };
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setGalat('');
    const fieldErrorsNext = collectFieldErrors(event.currentTarget);
    setFieldErrors(fieldErrorsNext);
    if (Object.keys(fieldErrorsNext).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
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
    <main className="auth-shell" data-route-main tabIndex="-1">
      <section className="auth-panel auth-panel--form">
        <Link to="/" className="auth-back">← Beranda</Link>
        <div className="auth-content">
          <p className="auth-kicker">Selamat datang kembali</p>
          <h1 className="auth-title">Masuk ke AuraFit</h1>
          <p className="auth-intro">Lanjutkan rencana aktivitas dan asupan harianmu dari perangkat mana pun.</p>

          <form noValidate onSubmit={onSubmitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-username">Nama pengguna atau email</label>
            <input
              id="login-username"
              type="text"
              className="auth-input"
              autoComplete="username"
              value={username_email}
              onChange={(e) => { setUsernameEmail(e.target.value); clearFieldError('username_email'); setGalat(''); }}
              required
              {...fieldProps('username_email')}
            />
            {fieldErrors.username_email ? <p id="login-username_email-error" className="auth-field__error">{fieldErrors.username_email}</p> : null}
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
              onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); setGalat(''); }}
              required
              {...fieldProps('password')}
            />
              <button type="button" className="auth-password__toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword}>
                <PasswordVisibilityIcon visible={showPassword} />
              </button>
            </div>
            {fieldErrors.password ? <p id="login-password-error" className="auth-field__error">{fieldErrors.password}</p> : null}
            <p className="auth-help">
              Lupa kata sandi? Minta admin AuraFit membuat kata sandi sementara, lalu ganti di halaman Profil setelah masuk.
            </p>
          </div>

          <FieldErrorSummary
            ref={errorSummaryRef}
            errors={fieldErrors}
            prefix="login"
            getFieldId={(name) => name === 'username_email' ? 'login-username' : `login-${name}`}
          />
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
