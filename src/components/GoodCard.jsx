import { formatNaira } from '../utils/format.js';
import { categoryEmoji, firstImageUrl } from '../utils/categoryIcon.js';

export default function GoodCard({ good, qty, setQty }) {
  const outOfStock = typeof good.quantity === 'number' && good.quantity <= 0;
  const photo = firstImageUrl(good.images);
  const maxQty = typeof good.quantity === 'number' ? good.quantity : Infinity;

  return (
    <div className={'good-card' + (outOfStock ? ' out-of-stock' : '')}>
      {photo ? (
        <img className="good-photo" src={photo} alt={good.name} loading="lazy" />
      ) : (
        <div className="good-emoji">{categoryEmoji(good.category)}</div>
      )}
      <div>
        <div className="good-name">{good.name}</div>
        <div className="good-unit">{good.description || good.category || ''}</div>
      </div>

      {outOfStock ? (
        <div className="good-bottom">
          <span className="good-price">{formatNaira(good.price)}</span>
          <span className="stock-badge">Not available</span>
        </div>
      ) : (
        <div className="good-bottom">
          <span className="good-price">{formatNaira(good.price)}</span>
          {qty === 0 ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setQty(good.id, 1)}>
              Add
            </button>
          ) : (
            <div className="qty-stepper">
              <button onClick={() => setQty(good.id, qty - 1)} aria-label="Decrease quantity">
                –
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty(good.id, qty + 1)}
                disabled={qty >= maxQty}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
      {!outOfStock && typeof good.quantity === 'number' && good.quantity <= 5 && (
        <div className="low-stock">Only {good.quantity} left</div>
      )}
    </div>
  );
}
