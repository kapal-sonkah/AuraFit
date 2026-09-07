import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function MenuButton({ onClick, children, variant = "default" }) {
  const base = "w-full py-3 px-3 rounded-lg text-sm font-bold transition-all duration-150 active:scale-95";
  const styles = {
    default: `${base} bg-white/0 border text-black hover:bg-black/5`,
    danger:  `${base} bg-red-500 text-white hover:bg-red-600 shadow-md`,
  };
  return (
    <button className={styles[variant]} onClick={onClick}>
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
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Popup card */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Profile menu"
        className="relative z-10 w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex flex-col gap-3 shadow-2xl animate-[fadeSlideIn_0.18s_ease-out]"
        style={{ animationFillMode: "both" }}
      >
        {/* User info */}
        <div className="flex flex-col items-center pb-1">
          <p className="text-black text-1xl font-bold">{user?.first_name} {user?.last_name}</p>
          <p className="text-gray-500 text-base">@{user?.username}</p>
        </div>

        {/* About */}
        <Link to="/">
          <MenuButton>About</MenuButton>
        </Link>

        <MenuButton variant="danger" onClick={handleLogout}>
          Log Out
        </MenuButton>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
}