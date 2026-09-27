import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatNaira } from '../utils/format.js';

const PAY_OPTIONS = [
  { value: 'card', icon: '💳', title: 'Pay by card', sub: 'Charged securely on delivery confirmation' },
  { value: 'cash', icon: '💵', title: 'Cash on delivery', sub: 'Pay the rider when your order arrives' },
  { value: 'transfer', icon: '🏦', title: 'Bank transfer', sub: 'Transfer details sent after you place the order' }
];

export default function Checkout() {
  const { cartItems, cartTotal, deliveryFee, placeOrder } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ address: '', city: 'Port Harcourt', phone: '', payMethod: 'card' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Guard: don't let someone land on checkout with nothing in the basket.
  if (cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  function validate() {
    const next = {};
    if (!form.address.trim()) next.address = 'Enter a delivery address.';
    if (!form.phone.trim()) next.phone = 'Enter a phone number for the rider.';
    else if (!/^[0-9+\s]{7,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    // Small delay simulates a payment/processing step and — combined with
    // disabling the button — prevents a double click from creating two orders.
    setTimeout(() => {
      placeOrder(form);
      navigate('/confirm');
    }, 450);
  }

  return (
    <div className="wrap checkout">
      <div className="section-head">
        <h2>Delivery & payment</h2>
      </div>

      <div className="checkout-grid">
        <form className="panel" onSubmit={handleSubmit} noValidate>
          <h3>Delivery details</h3>

          <div className="field">
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              rows={3}
              value={form.address}
              className={errors.address ? 'err' : ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House number, street, area"
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              className={errors.phone ? 'err' : ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="080X XXX XXXX"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <h3 style={{ marginTop: 22 }}>Payment method</h3>
          <div className="pay-options">
            {PAY_OPTIONS.map((opt) => (
              <label key={opt.value} className={'pay-option' + (form.payMethod === opt.value ? ' selected' : '')}>
                <input
                  type="radio"
                  name="pay"
                  value={opt.value}
                  checked={form.payMethod === opt.value}
                  onChange={() => setForm({ ...form, payMethod: opt.value })}
                />
                <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                <span>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{opt.title}</div>
                  <div style={{ color: 'var(--text-soft)', fontSize: '0.78rem' }}>{opt.sub}</div>
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 22 }} disabled={submitting}>
            {submitting ? 'Placing order…' : 'Confirm order & pay'}
          </button>
        </form>

        <div className="panel">
          <h3>Order summary</h3>
          {cartItems.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatNaira(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="summary-item">
            <span>Delivery fee</span>
            <span>{formatNaira(deliveryFee)}</span>
          </div>
          <div className="total-line">
            <span>Total</span>
            <span>{formatNaira(cartTotal + deliveryFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
