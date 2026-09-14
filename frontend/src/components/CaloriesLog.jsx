import { useState } from 'react';
import FoodPopup from './FoodPopup';

function FoodItem({ food, consumed, onClick }) {
  return (
    // Sama seperti kartu aktivitas, elemen article tidak menerima fokus papan
    // ketik. Diganti button agar dapat dibuka tanpa tetikus.
    <button
      type="button"
      className={`food-card ${consumed ? 'food-card--done' : ''}`}
      onClick={onClick}
      aria-pressed={consumed}
    >
      <div className="food-card__icon" aria-hidden="true">
        <span aria-hidden="true">{food.emoji}</span>
      </div>
      <div className="food-card__body">
        <p className="food-card__name">{food.name}</p>
        <p className="food-card__meta">{food.portion} · {food.kcal} kcal</p>
        {consumed ? (
          <span className="food-card__status food-card__status--done">Sudah dicatat</span>
        ) : (
          <span className="food-card__status">Belum dicatat</span>
        )}
      </div>
    </button>
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
          <p className="dashboard-section__count">{foods.length} rekomendasi</p>
        </div>
        <ul className="dashboard-list dashboard-list--foods" role="list">
          {foods.map((item) => (
            <li key={item.id}>
              <FoodItem 
                food={item} 
                onClick={() => setSelected(item)} 
                consumed={consumedFoodIds.has(item.id)}  
              />
            </li>
          ))}
        </ul>
      </section>

      <FoodPopup 
        food={selected} 
        consumed={selected ? consumedFoodIds.has(selected.id) : false}
        onClose={() => setSelected(null)} 
        onConsume={(id, dikonsumsi) => { onConsume(id, dikonsumsi); setSelected(null); }}
      />
    </>
  );
}
