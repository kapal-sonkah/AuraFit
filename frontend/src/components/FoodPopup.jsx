export default function FoodPopup({ food, consumed, onClose, onConsume }) {
  if (!food) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      
      {/* backdrop - Fades in */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose} 
        style={{
          animation: 'foodFadeIn 200ms ease-out forwards'
        }}
      />

      {/* Card - Scales and slides up slightly */}
      <div 
        className="relative z-10 w-full max-w-sm bg-white/70 rounded-xl p-5 backdrop-blur-lg box-shadow-lg"
        style={{
          animation: 'foodPopupEnter 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >

        <div className="flex items-center gap-4">
          {/* Emoji icon */}
          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-4xl shrink-0 select-none">
            <span aria-hidden="true">{food.emoji}</span>
          </div>

          {/* Info makanan */}
          <div className="flex-1">
            <p className="text-black font-bold text-base leading-tight">{food.name}</p>
            <p className="text-gray-600 text-sm mt-1">{food.portion}</p>
            <p className="text-gray-600 text-sm">{food.kcal} kcal</p>
            {consumed ? (
              <p className="text-green-800 text-sm font-semibold mt-1">Sudah dicatat hari ini</p>
            ) : null}
          </div>

          {/* Tombol centang */}
        </div>

        {/* Tombol aksi memakai teks, bukan hanya ikon centang. Ikon sendirian
            tidak menjelaskan apakah artinya memilih, menandai sudah dimakan,
            atau menutup detail. */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-black font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>

          {consumed ? (
            <button
              onClick={() => onConsume(food.id, false)}
              className="px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-semibold cursor-pointer transition-colors"
            >
              Batalkan catatan
            </button>
          ) : (
            <button
              onClick={() => onConsume(food.id, true)}
              className="px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold cursor-pointer transition-colors"
            >
              Catat sudah dimakan
            </button>
          )}
        </div>

      </div>

      {/* Scoped Keyframes */}
      <style>{`
        @keyframes foodFadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes foodPopupEnter { 
          from { opacity: 0; transform: scale(0.95) translateY(12px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </div>
  );
}