// FaceTrack AI — RecentActivity. Generic timeline list.
// items: [{ text, time, color? }].

import EmptyState from '../common/EmptyState';
import { Activity } from 'lucide-react';

export default function RecentActivity({ items = [], title = 'Recent Activity' }) {
  return (
    <div className="ft-glass ft-activity">
      <div className="ft-activity-title">{title}</div>
      {items.length ? (
        <ul className="ft-activity-list">
          {items.map((it, i) => (
            <li key={i} className="ft-activity-item">
              <span
                className="ft-activity-dot"
                style={it.color ? { background: it.color, boxShadow: `0 0 8px ${it.color}88` } : undefined}
              />
              <span className="ft-activity-text">{it.text}</span>
              <span className="ft-activity-time">{it.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Activity} title="No recent activity" message="Attendance events will appear here." />
      )}
    </div>
  );
}
