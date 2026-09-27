import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { safeGet, safeSet } from '../utils/storage.js';

const NotificationContext = createContext(null);
const TOAST_LIFETIME_MS = 6000;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => safeGet('pm_notifications', []));
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  useEffect(() => { safeSet('pm_notifications', notifications); }, [notifications]);

  useEffect(() => {
    // Clear any pending toast timers on unmount so they don't fire after
    // the provider is gone.
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  // type: 'success' | 'info' | 'warning' | 'error'
  const notify = useCallback(
    ({ type = 'info', title, message }) => {
      const id = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      const entry = { id, type, title, message, createdAt: new Date().toISOString(), read: false };

      setNotifications((prev) => [entry, ...prev].slice(0, 50));
      setToasts((prev) => [...prev, entry]);
      timers.current[id] = setTimeout(() => dismissToast(id), TOAST_LIFETIME_MS);

      return id;
    },
    [dismissToast]
  );

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, toasts, notify, dismissToast, markRead, markAllRead, clearAll, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
