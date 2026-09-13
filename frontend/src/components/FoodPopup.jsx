export default function FoodPopup({ food, consumed, onClose, onConsume }) {
  if (!food) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      
      {/* backdrop - Fades in */}
      <div className="absolute inset-0" aria-hidden="true" />

      {/* Card - Scales and slides up slightly */}
      <div className="modal-card modal-card--food" onClick={(event) => event.stopPropagation()}>

        <div className="modal-card__head">
          <h2 className="modal-card__title">Detail makanan</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Tutup detail">×</button>
        </div>

        <div className="food-detail flex items-center gap-4 mt-5">
          {/* Emoji icon */}
          <div className="food-card__icon w-16 h-16 text-4xl">
            <span aria-hidden="true">{food.emoji}</span>
          </div>

          {/* Info makanan */}
          <div className="food-card__body">
            <p className="food-card__name">{food.name}</p>
            <p className="food-card__meta">{food.portion} · {food.kcal} kcal</p>
            {consumed ? (
              <p className="food-card__status food-card__status--done">Sudah dicatat hari ini</p>
            ) : null}
          </div>

          {/* Tombol centang */}
        </div>

        {/* Tombol aksi memakai teks, bukan hanya ikon centang. Ikon sendirian
            tidak menjelaskan apakah artinya memilih, menandai sudah dimakan,
            atau menutup detail. */}
        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-action"
          >
            Tutup
          </button>

          {consumed ? (
            <button
              onClick={() => onConsume(food.id, false)}
              className="modal-action modal-action--danger"
            >
              Batalkan catatan
            </button>
          ) : (
            <button
              onClick={() => onConsume(food.id, true)}
              className="modal-action modal-action--primary"
            >
              Catat sudah dimakan
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
