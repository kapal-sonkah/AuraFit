import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AuraFitMark from './assets/images/aurafit-mark.svg';
import React from 'react';
import { getAccessToken, getUserLogged, putAccessToken, logout } from './utils/network-data';

// Judul tab per halaman, agar riwayat peramban dan tab yang terbuka bersamaan
// dapat dibedakan.
const PAGE_TITLES = {
  '/signup': 'Daftar',
  '/login': 'Masuk',
  '/dashboard': 'Hari ini',
  '/history': 'Riwayat',
  '/profile': 'Profil',
};

function RouteScrollReset() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const judul = PAGE_TITLES[location.pathname];
    document.title = judul ? `${judul} · AuraFit` : 'AuraFit';
    const frame = window.requestAnimationFrame(() => {
      document.querySelector('main[data-route-main]')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return null;
}

function App() {
  const [authedUser, setAuthedUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  async function onLoginSuccess({ accessToken }) {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();

    setAuthedUser(data);
  }

  async function onLogout() {
    await logout();
    setAuthedUser(null);
  }

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAccessToken();
        if (!token) return;
        
        const { data } = await getUserLogged();
        setAuthedUser(data);
      } catch {
        setAuthedUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <main className="app-loading" aria-live="polite">
        <div className="app-loading__mark" aria-hidden="true">
          <img src={AuraFitMark} alt="" />
        </div>
        <p className="app-loading__label">Menyiapkan AuraFit…</p>
      </main>
    );
  }
  
  return (
    <>
      <RouteScrollReset />
      {authedUser === null ? (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/login' element={<LoginPage loginSuccess={onLoginSuccess} />}/>
        {/* <Route path='/dashboard' element={<DashboardPage />}/> */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      ) : (
      <Routes>
        <Route path='/' element={<LandingPage loggedIn />} />
        <Route path='/dashboard' element={<DashboardPage onLogout={onLogout} user={authedUser} />} />
        <Route path='/history' element={<HistoryPage onLogout={onLogout} user={authedUser} />} />
        <Route path='/profile' element={<ProfilePage onLogout={onLogout} user={authedUser} onUserUpdated={setAuthedUser} />} />
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
      )}
    </>
  )
}

export default App
