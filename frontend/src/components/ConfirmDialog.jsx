import { useEffect, useRef } from 'react';

// Pengganti window.confirm yang tampil seperti dialog lain di aplikasi.
// Dialog bawaan peramban tidak dapat diberi gaya, dan pada sebagian
// lingkungan ditutup otomatis sehingga tombol Hapus tampak tidak bekerja.
export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Fokus awal pada Batal agar Enter tidak langsung menghapus.
    cancelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-card__head">
          <h2 id="confirm-dialog-title" className="modal-card__title">{title}</h2>
        </div>
        <p id="confirm-dialog-message" className="confirm-dialog__message">{message}</p>
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="modal-action" onClick={onCancel}>Batal</button>
          <button type="button" className="modal-action modal-action--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
