import { NavLink, Link } from 'react-router-dom';
import '../app-header.css';

// Satu header untuk Hari ini, Riwayat, dan Profil. Sebelumnya tiap halaman
// punya CSS header sendiri sehingga di HP jumlah tombol, jarak, dan
// pembungkusan barisnya berbeda saat berpindah halaman.
export default function AppHeader({ onLogout }) {
  const kelas = ({ isActive }) => `app-header__link${isActive ? ' app-header__link--active' : ''}`;

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">AuraFit</Link>
      <nav className="app-header__nav" aria-label="Navigasi utama">
        <NavLink to="/dashboard" className={kelas}>Hari ini</NavLink>
        <NavLink to="/history" className={kelas}>Riwayat</NavLink>
        <NavLink to="/profile" className={kelas}>Profil</NavLink>
        <button type="button" className="app-header__logout" onClick={onLogout}>Keluar</button>
      </nav>
    </header>
  );
}
