import { useState } from 'react';
import FoodPopup from './FoodPopup';
import ManualItemEditor from './ManualItemEditor';
import { foodMeta, presentFood } from '../utils/presentation';

function FoodItem({ food, consumed, onClick, onConsume, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <article className="food-card">
        <ManualItemEditor
          item={food}
          type="food"
          onCancel={() => setEditing(false)}
          onSave={async (id, fields) => {
            const pesan = await onEdit(id, fields);
            if (!pesan) setEditing(false);
            return pesan;
          }}
        />
      </article>
    );
  }

  return (
    <article className={`food-card ${consumed ? 'food-card--done' : ''}`}>
      <button
        type="button"
        className="food-card__detail"
        onClick={onClick}
        aria-label={`Lihat detail ${food.name}`}
      >
        <span className="food-card__head">
          <span className="food-card__name">{food.name}</span>
          <span className={`food-card__status ${consumed ? 'food-card__status--done' : ''}`}>
            {consumed ? <><span aria-hidden="true">✓ </span>Sudah dicatat</> : 'Belum dicatat'}
          </span>
        </span>
        {food.image ? (
          <img
            src={food.image}
            alt=""
            loading="lazy"
            className="food-card__media"
            onError={(event) => {
              event.currentTarget.hidden = true;
              if (event.currentTarget.nextElementSibling) event.currentTarget.nextElementSibling.hidden = false;
            }}
          />
        ) : null}
        <span className="food-card__media food-card__media--empty" hidden={Boolean(food.image)} aria-hidden="true">
          {food.emoji}
        </span>
        <span className="food-card__meta">{foodMeta(food)}</span>
      </button>
      <button
        type="button"
        className={`food-card__action ${consumed ? 'food-card__action--done' : ''}`}
        onClick={() => onConsume(food.id, !consumed)}
        aria-pressed={consumed}
      >
        {consumed ? 'Batalkan catatan' : 'Catat sudah dimakan'}
      </button>
      {food.source_ref == null && onDelete && onEdit ? (
        <div className="plan-item-manage">
          <button type="button" className="plan-item-edit" onClick={() => setEditing(true)}>Ubah</button>
          <button type="button" className="plan-item-delete" onClick={() => onDelete(food.id, food.name)}>Hapus</button>
        </div>
      ) : null}
    </article>
  );
}

export default function CaloriesLog({ foods = [], consumedFoodIds, onConsume, onDelete, onEdit }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section id="makanan-hari-ini" aria-label="Makanan hari ini" className="dashboard-section">
        <div className="dashboard-section__head">
          <div>
            <p className="section-kicker">Asupan hari ini</p>
            <h2 className="dashboard-section__title">Makanan Hari Ini</h2>
          </div>
          <p className="dashboard-section__count">{foods.length} rekomendasi makanan</p>
        </div>
        <ul className="dashboard-list dashboard-list--foods" role="list">
          {foods.map((item) => {
            const food = presentFood(item);
            return (
            <li key={item.id}>
              <FoodItem 
                food={food}
                onClick={() => setSelected(item)} 
                onConsume={onConsume}
                onDelete={onDelete}
                onEdit={onEdit}
                consumed={consumedFoodIds.has(item.id)}
              />
            </li>
            );
          })}
        </ul>
      </section>

      <FoodPopup 
        food={selected ? presentFood(selected) : null}
        consumed={selected ? consumedFoodIds.has(selected.id) : false}
        onClose={() => setSelected(null)} 
        onConsume={(id, dikonsumsi) => { onConsume(id, dikonsumsi); setSelected(null); }}
      />
    </>
  );
}
