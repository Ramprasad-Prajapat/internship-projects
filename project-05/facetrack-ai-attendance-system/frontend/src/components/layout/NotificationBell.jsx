// FaceTrack AI — NotificationBell. Navbar dropdown over the live notifications
// collection, with unread count and mark-all-read.

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import EmptyState from '../common/EmptyState';

const TONE = {
  info: 'var(--ft-info)',
  success: 'var(--ft-green)',
  warning: 'var(--ft-yellow)',
  danger: 'var(--ft-red)',
};

export default function NotificationBell() {
  const notifications = useCollection('notifications');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAll = () => notifications.forEach((n) => !n.read && store.update('notifications', n.id, { read: true }));

  return (
    <div className="ft-notif" ref={ref}>
      <button
        className="ft-icon-btn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        style={{ position: 'relative' }}
      >
        <Bell size={18} />
        {unread > 0 && <span className="ft-notif-dot">{unread}</span>}
      </button>

      {open && (
        <div className="ft-glass ft-notif-menu">
          <div className="ft-notif-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button className="ft-btn ft-btn--subtle ft-btn--sm" type="button" onClick={markAll}>
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
          <div className="ft-notif-list">
            {notifications.length ? (
              notifications.slice(0, 10).map((n) => (
                <div key={n.id} className={`ft-notif-item${n.read ? '' : ' ft-notif-item--unread'}`}>
                  <span className="ft-notif-bar" style={{ background: TONE[n.type] || 'var(--ft-primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="ft-notif-title">{n.title}</div>
                    <div className="ft-notif-text">{n.text}</div>
                  </div>
                  <span className="ft-notif-time">{n.time}</span>
                </div>
              ))
            ) : (
              <EmptyState icon={Bell} title="No notifications" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
