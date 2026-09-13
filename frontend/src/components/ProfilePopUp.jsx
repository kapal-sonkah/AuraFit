import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function MenuButton({ onClick, children, variant = "default" }) {
  const base = "profile-menu__button";
  const styles = {
    default: base,
    danger:  `${base} profile-menu__button--danger`,
  };
  return (
    <button type="button" className={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
}

export default function ProfilePopup({ open, onClose, onLogout, user }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    function handler(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function handleLogout() {
    onLogout();
    onClose();
  }

  return (
    /* Backdrop */
    <div className="modal-backdrop modal-backdrop--profile" onClick={onClose}>
      {/* Dimmed backdrop */}
      <div className="absolute inset-0" aria-hidden="true" />

      {/* Popup card */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menu profil"
        className="profile-menu"
        onClick={(event) => event.stopPropagation()}
      >
        {/* User info */}
        <div className="profile-menu__identity">
          <p className="profile-menu__name">{user?.first_name} {user?.last_name}</p>
          <p className="profile-menu__username">@{user?.username}</p>
        </div>

        <div className="profile-menu__actions">
          <Link to="/dashboard" className="profile-menu__button inline-flex items-center justify-center">Hari ini</Link>
          <Link to="/history" className="profile-menu__button inline-flex items-center justify-center">Riwayat</Link>
          <Link to="/profile" className="profile-menu__button inline-flex items-center justify-center">Edit profil</Link>
          <Link to="/" className="profile-menu__button inline-flex items-center justify-center">Beranda</Link>
          <MenuButton variant="danger" onClick={handleLogout}>Keluar</MenuButton>
        </div>
      </div>
    </div>
  );
}
