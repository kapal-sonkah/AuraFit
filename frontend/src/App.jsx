import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import React from 'react';
import { getAccessToken, getUserLogged, putAccessToken, logout } from './utils/network-data';

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

  if (loading) return null;
  
  return (
    authedUser === null ? (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/login' element={<LoginPage loginSuccess={onLoginSuccess} />}/>
        {/* <Route path='/dashboard' element={<DashboardPage />}/> */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    ) : (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<DashboardPage onLogout={onLogout} user={authedUser} />} />
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    )
  )
}

export default App
