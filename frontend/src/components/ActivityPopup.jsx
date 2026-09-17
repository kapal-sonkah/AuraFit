import { useEffect, useRef } from 'react';
import ActivityIcon from './ActivityIcon';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // handles both youtube.com/watch?v=ID and youtu.be/ID
    const videoId = u.searchParams.get('v') || u.pathname.slice(1);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function ActivityPopup({ activity, completed, onClose, onDone }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!activity) return undefined;
    const previousFocus = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [activity, onClose]);

  if (!activity) return null;

  const embedUrl = getYouTubeEmbedUrl(activity.youtube_url);

  return (
    <div className="modal-backdrop" onClick={onClose}>

      <div
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="activity-dialog-title" aria-describedby="activity-dialog-description" onClick={(event) => event.stopPropagation()}>
        <div className="modal-card__head">
          <h2 id="activity-dialog-title" className="modal-card__title">{activity.name}</h2>
          <button ref={closeButtonRef} type="button" className="modal-close" onClick={onClose} aria-label="Tutup detail">×</button>
        </div>

        <div className="modal-content">

          {/* ── Media block: YouTube embed > image > checker fallback ── */}
          {embedUrl ? (
              <div className="modal-content__media">
              <iframe
                src={embedUrl}
                title={activity.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                tabIndex="-1"
                className="w-full h-full"
              />
            </div>
          ) : activity.image ? (
            <img
              src={activity.image}
              alt={activity.name}
              className="modal-content__media"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div
              className="modal-content__media activity-card__media--empty"
              role="img"
              aria-label={`Ilustrasi ${activity.name}`}
            >
              <ActivityIcon name={activity.name} />
            </div>
          )}

          <p id="activity-dialog-description" className="modal-content__copy">
            {activity.description}
          </p>
        </div>

        <div className="modal-actions">
          {completed ? (
            <>
              <button type="button" onClick={onClose} className="modal-action">Tutup</button>
              <button type="button" onClick={() => onDone(activity.id, false)} className="modal-action modal-action--danger">Batalkan</button>
            </>
          ) : (
            <>
              <button type="button" onClick={onClose} className="modal-action">Tutup</button>
              <button type="button" onClick={() => onDone(activity.id, true)} className="modal-action modal-action--primary">Tandai selesai</button>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
