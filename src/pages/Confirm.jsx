import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatNaira } from '../utils/format.js';
import { ORDER_STAGE_LABEL } from '../utils/orderStatus.js';

const PAY_LABELS = {
  card: 'Card payment',
  cash: 'Cash on delivery',
  transfer: 'Bank transfer'
};

export default function Confirm() {
  const { lastOrder, orderStatus } = useApp();
  const navigate = useNavigate();
  const [, tick] = useState(0);

  // Re-render every couple of seconds so the status line below updates live
  // as the order moves from "Order placed" through to "Ready for delivery".
  useEffect(() => {
    if (!lastOrder) return undefined;
    const interval = setInterval(() => tick((n) => n + 1), 2000);
    return () => clearInterval(interval);
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <div className="wrap confirm">
        <div className="confirm-badge">📦</div>
        <h1>No recent order found</h1>
        <p className="lede" style={{ margin: '10px auto 0' }}>
          We couldn't find an order to confirm — it may have already been viewed or not yet placed.
        </p>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="wrap confirm">
      <div className="confirm-badge">✅</div>
      <h1>Order confirmed</h1>
      <p className="lede" style={{ margin: '10px auto 0' }}>
        Thanks — your Pitch Mall order is being prepared and is on its way to {lastOrder.address || 'your address'}.
      </p>

      <div className={'status-badge status-large status-' + orderStatus(lastOrder).toLowerCase()} style={{ margin: '18px auto 0' }}>
        {ORDER_STAGE_LABEL[orderStatus(lastOrder)]}
      </div>
      <p className="lede" style={{ margin: '8px auto 0', fontSize: '0.85rem' }}>
        We'll notify you the moment it's ready for delivery.
      </p>

      <div className="order-card">
        <div className="summary-item">
          <span>Order ID</span>
          <span>{lastOrder.id}</span>
        </div>
        <div className="summary-item">
          <span>Delivering to</span>
          <span>
            {lastOrder.address}, {lastOrder.city}
          </span>
        </div>
        <div className="summary-item">
          <span>Contact number</span>
          <span>{lastOrder.phone}</span>
        </div>
        <div className="summary-item">
          <span>Payment method</span>
          <span>{PAY_LABELS[lastOrder.payMethod] || 'Card payment'}</span>
        </div>
        {lastOrder.items.map((item) => (
          <div className="summary-item" key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{formatNaira(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="summary-item">
          <span>Delivery fee</span>
          <span>{formatNaira(lastOrder.deliveryFee)}</span>
        </div>
        <div className="total-line">
          <span>Total paid</span>
          <span>{formatNaira(lastOrder.total)}</span>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Go to dashboard
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Continue shopping
        </button>
      </div>
    </div>
  );
}
