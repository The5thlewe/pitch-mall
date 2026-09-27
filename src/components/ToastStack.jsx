import { useNotifications } from '../context/NotificationContext.jsx';

const ICONS = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '⛔' };

export default function ToastStack() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={'toast toast-' + toast.type}>
          <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
