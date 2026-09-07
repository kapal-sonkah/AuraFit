const CHECKER = {
  backgroundImage: 'repeating-linear-gradient(45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,#ccc 0,#ccc 1px,transparent 0,transparent 50%)',
  backgroundSize: '20px 20px',
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white/70 backdrop-blur-lg rounded-2xl p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 animate-[popupEnter_300ms_cubic-bezier(0.34,1.56,0.64,1)]">

        <h2 className="text-2xl sm:text-3xl font-black text-black">{activity.name}</h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">

          {/* ── Media block: YouTube embed > image > checker fallback ── */}
          {embedUrl ? (
            <div className="w-full sm:w-96 shrink-0 rounded-xl overflow-hidden aspect-video">
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
              className="w-full sm:w-96 h-48 sm:h-64 rounded-xl object-cover shrink-0 border border-black"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div
              className="w-full sm:w-96 h-48 sm:h-64 rounded-xl border border-black shrink-0"
              style={CHECKER}
              role="img"
              aria-label="Activity image placeholder"
            />
          )}

          <p className="text-black font-semibold text-base leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="flex justify-end">
          {completed ? (
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => onDone(activity.id)}
              className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
            >
              Done
            </button>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupEnter { 
          from { opacity: 0; transform: scale(0.96) translateY(8px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </div>
  );
}