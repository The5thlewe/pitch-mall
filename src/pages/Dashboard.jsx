import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatNaira } from '../utils/format.js';
import { categoryEmoji } from '../utils/categoryIcon.js';
import { ORDER_STAGE_LABEL } from '../utils/orderStatus.js';

export default function Dashboard() {
  const { user, cartItems, cartTotal, orders, orderStatus } = useApp();
  const navigate = useNavigate();

  return (
    <div className="wrap dash">
      <div className="dash-hero">
        <div>
          <h1>Welcome, {user?.name || 'there'}.</h1>
          <p>This is your Pitch Mall dashboard — review your basket, track orders, and send them out for delivery.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Continue shopping
        </button>
      </div>

      <div className="dash-grid">
        <div>
          <div className="panel" style={{ marginBottom: 20 }}>
            <h3>Your basket ({cartItems.length})</h3>
            {cartItems.length === 0 ? (
              <div className="empty-state">
                <div className="e-ico">🧺</div>
                Your basket is empty — browse goods to add items.
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <div>
                      <div className="ci-name">
                        {categoryEmoji(item.category)} {item.name}
                      </div>
                      <div className="ci-meta">
                        {item.qty} × {formatNaira(item.price)}
                      </div>
                    </div>
                    <div>{formatNaira(item.qty * item.price)}</div>
                  </div>
                ))}
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>{formatNaira(cartTotal)}</span>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to delivery & payment
                </button>
              </>
            )}
          </div>

          <div className="panel">
            <h3>Order history</h3>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="e-ico">📦</div>
                No orders yet.
              </div>
            ) : (
              orders.map((order) => {
                const stage = orderStatus(order);
                return (
                  <div className="order-row" key={order.id}>
                    <div>
                      <div className="ci-name">{order.id}</div>
                      <div className="ci-meta">
                        {order.items.length} item{order.items.length === 1 ? '' : 's'} · {formatNaira(order.total)}
                      </div>
                    </div>
                    <span className={'status-badge status-' + stage.toLowerCase()}>{ORDER_STAGE_LABEL[stage]}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="panel">
          <h3>Quick links</h3>
          <div className="quick-links">
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              🛍️ Browse all goods
            </button>
            <button
              className="btn btn-ghost"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              🚚 Checkout basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
