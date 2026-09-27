import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { safeGet, safeSet } from '../utils/storage.js';
import { useProducts } from './ProductsContext.jsx';
import { useNotifications } from './NotificationContext.jsx';
import { deriveOrderStatus, ORDER_STAGES, ORDER_STAGE_LABEL } from '../utils/orderStatus.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { products } = useProducts();
  const { notify } = useNotifications();

  const [user, setUser] = useState(() => safeGet('pm_user', null));
  const [cart, setCart] = useState(() => safeGet('pm_cart', {}));
  const [orders, setOrders] = useState(() => safeGet('pm_orders', [])); // history, newest first
  const [theme, setTheme] = useState(() => safeGet('pm_theme', null));
  const notifiedStages = useRef(safeGet('pm_notified_stages', {})); // { [orderId]: { READY_FOR_DELIVERY: true, ... } }

  useEffect(() => { safeSet('pm_user', user); }, [user]);
  useEffect(() => { safeSet('pm_cart', cart); }, [cart]);
  useEffect(() => { safeSet('pm_orders', orders); }, [orders]);
  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
    safeSet('pm_theme', theme);
  }, [theme]);

  const setQty = useCallback(
    (id, qty) => {
      const product = products.find((p) => p.id === id);
      const stock = typeof product?.quantity === 'number' ? product.quantity : Infinity;
      const clamped = Math.max(0, Math.min(qty, stock));
      setCart((prev) => {
        const next = { ...prev };
        if (clamped <= 0) delete next[id];
        else next[id] = clamped;
        return next;
      });
    },
    [products]
  );

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        return product ? { ...product, qty } : null;
      })
      .filter(Boolean)
      .filter((item) => item.qty > 0);
  }, [cart, products]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );

  const deliveryFee = cartItems.length ? 800 : 0;

  const signUp = useCallback(({ name, email }) => setUser({ name, email }), []);
  const signIn = useCallback(({ email }) => {
    const existing = safeGet('pm_user', null);
    setUser(existing && existing.email === email ? existing : { name: email.split('@')[0], email });
  }, []);
  const signOut = useCallback(() => setUser(null), []);

  const placeOrder = useCallback(
    (details) => {
      const order = {
        id: 'PM-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        items: cartItems,
        total: cartTotal + deliveryFee,
        deliveryFee,
        placedAt: new Date().toISOString(),
        ...details
      };
      setOrders((prev) => [order, ...prev].slice(0, 25));
      setCart({});
      notify({ type: 'success', title: 'Order placed', message: `Order ${order.id} has been sent to Pitch Mall.` });
      return order;
    },
    [cartItems, cartTotal, deliveryFee, notify]
  );

  const lastOrder = orders[0] || null;

  // Ticks every couple of seconds so any order still in flight has its
  // status re-derived from elapsed time, and fires a one-time notification
  // the moment an order crosses into "ready for delivery".
  const [, forceTick] = useState(0);
  useEffect(() => {
    const active = orders.some((o) => deriveOrderStatus(o) !== ORDER_STAGES.DELIVERED);
    if (!active) return undefined;

    const interval = setInterval(() => {
      orders.forEach((order) => {
        const stage = deriveOrderStatus(order);
        const seen = notifiedStages.current[order.id] || {};
        if ((stage === ORDER_STAGES.READY_FOR_DELIVERY || stage === ORDER_STAGES.DELIVERED) && !seen[stage]) {
          notifiedStages.current[order.id] = { ...seen, [stage]: true };
          safeSet('pm_notified_stages', notifiedStages.current);
          if (stage === ORDER_STAGES.READY_FOR_DELIVERY) {
            notify({
              type: 'success',
              title: 'Ready for delivery',
              message: `Your order ${order.id} is packed and ready for delivery!`
            });
          } else {
            notify({
              type: 'info',
              title: 'Delivered',
              message: `Order ${order.id} has been delivered. Enjoy!`
            });
          }
        }
      });
      forceTick((n) => n + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [orders, notify]);

  const value = {
    user, signUp, signIn, signOut,
    cart, cartItems, cartTotal, deliveryFee, setQty,
    orders, lastOrder, placeOrder,
    orderStatus: deriveOrderStatus,
    orderStatusLabel: ORDER_STAGE_LABEL,
    theme, setTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
