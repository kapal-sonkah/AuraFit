import { useState } from 'react';
import FoodPopup from './FoodPopup';
import { presentFood } from '../utils/presentation';

function FoodItem({ food, consumed, onClick, onConsume }) {
  return (
    <article className={`food-card ${consumed ? 'food-card--done' : ''}`}>
      <button
        type="button"
        className="food-card__detail"
        onClick={onClick}
        aria-label={`Lihat detail ${food.name}`}
      >
        <span className="food-card__icon" aria-hidden="true">
          <span aria-hidden="true">{food.emoji}</span>
        </span>
        <span className="food-card__body">
          <span className="food-card__name">{food.name}</span>
          <span className="food-card__meta">{food.portion} · {food.kcal} kcal</span>
          <span className={`food-card__status ${consumed ? 'food-card__status--done' : ''}`}>
            {consumed ? 'Sudah dicatat' : 'Belum dicatat'}
          </span>
        </span>
      </button>
      <button
        type="button"
        className={`food-card__action ${consumed ? 'food-card__action--done' : ''}`}
        onClick={() => onConsume(food.id, !consumed)}
        aria-pressed={consumed}
      >
        {consumed ? 'Batalkan catatan' : 'Catat sudah dimakan'}
      </button>
    </article>
  );
}

export default function CaloriesLog({ foods = [], consumedFoodIds, onConsume }) {
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
