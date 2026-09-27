import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function toggle() {
    setOpen((o) => {
      if (!o) markAllRead();
      return !o;
    });
  }

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="icon-btn" aria-label="Notifications" onClick={toggle}>
        🔔
        {unreadCount > 0 && <span className="cart-count">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-head">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button className="link-btn" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications yet.</div>
          ) : (
            <div className="notif-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={'notif-item notif-' + n.type + (n.read ? '' : ' unread')}
                  onClick={() => markRead(n.id)}
                >
                  <div className="notif-title">{n.title}</div>
                  {n.message && <div className="notif-message">{n.message}</div>}
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
