import { NavLink, Link } from 'react-router-dom';
import '../app-header.css';

// Satu header untuk Hari ini, Riwayat, dan Profil. Sebelumnya tiap halaman
// punya CSS header sendiri sehingga di HP jumlah tombol, jarak, dan
// pembungkusan barisnya berbeda saat berpindah halaman.
function NavIcon({ type }) {
  const paths = {
    today: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />,
    history: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    profile: <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  };

  return (
    <svg className="app-header__nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[type]}
    </svg>
  );
}

export default function AppHeader() {
  const kelas = ({ isActive }) => `app-header__link${isActive ? ' app-header__link--active' : ''}`;

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">AuraFit</Link>
      <nav className="app-header__nav" aria-label="Navigasi utama">
        <NavLink to="/dashboard" className={kelas}><NavIcon type="today" /><span>Hari ini</span></NavLink>
        <NavLink to="/history" className={kelas}><NavIcon type="history" /><span>Riwayat</span></NavLink>
        <NavLink to="/profile" className={kelas}><NavIcon type="profile" /><span>Profil</span></NavLink>
      </nav>
    </header>
  );
}
