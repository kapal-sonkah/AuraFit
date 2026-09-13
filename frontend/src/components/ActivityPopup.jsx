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
  if (!activity) return null;

  const embedUrl = getYouTubeEmbedUrl(activity.youtube_url);

  return (
    <div className="modal-backdrop" onClick={onClose}>

      <div
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-card__head">
          <h2 className="modal-card__title">{activity.name}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Tutup detail">×</button>
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
              className="modal-content__media"
              role="img"
              aria-label="Placeholder gambar aktivitas"
            />
          )}

          <p className="modal-content__copy">
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
