import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatNaira } from '../utils/format.js';
import { useApp } from '../context/AppContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import GoodCard from '../components/GoodCard.jsx';

export default function Home() {
  const { cart, setQty, cartItems } = useApp();
  const { products, loading, offline, error, reload } = useProducts();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('All');

  const published = useMemo(() => products.filter((p) => p.published !== false), [products]);
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(published.map((p) => p.category).filter(Boolean)))],
    [published]
  );
  const filtered = activeCat === 'All' ? published : published.filter((p) => p.category === activeCat);
  const featured = published.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="wrap hero">
        <div>
          <div className="hero-eyebrow">PITCH MALL · ENUGU</div>
          <h1>Everyday goods, brought to your door.</h1>
          <p className="lede">
            Fresh produce, pantry staples and household essentials, picked and delivered the same day from Pitch Mall.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('goods-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse goods
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
              Go to dashboard
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <b>{loading ? '…' : published.length}</b>
              <span>goods in stock</span>
            </div>
            <div className="hero-stat">
              <b>45 min</b>
              <span>average delivery</span>
            </div>
            <div className="hero-stat">
              <b>₦800</b>
              <span>flat delivery fee</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <span className="tag">{offline ? 'Saved catalog' : 'Today at Pitch Mall'}</span>
          {featured.length === 0 && <div className="hero-panel-row muted">Check back soon for featured picks.</div>}
          {featured.map((p) => (
            <div className="hero-panel-row" key={p.id}>
              <span>{p.name}</span>
              <span className="muted">{formatNaira(p.price)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap goods" id="goods-section">
        {offline && (
          <div className="banner banner-warning">
            {error || 'Live inventory is unavailable right now — showing a saved catalog.'}{' '}
            <button className="link-btn" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        <div className="section-head">
          <h2>Available goods</h2>
          {cartItems.length > 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>
              Go to basket ({cartItems.length})
            </button>
          )}
        </div>

        <div className="chip-row">
          {categories.map((c) => (
            <button
              key={c}
              className={'chip' + (activeCat === c ? ' active' : '')}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="goods-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="good-card skeleton" key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="e-ico">🗃️</div>
            No goods in this category right now.
          </div>
        ) : (
          <div className="goods-grid">
            {filtered.map((p) => (
              <GoodCard key={p.id} good={p} qty={cart[p.id] || 0} setQty={setQty} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
