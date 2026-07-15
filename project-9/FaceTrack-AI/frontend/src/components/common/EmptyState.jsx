// FaceTrack AI — EmptyState. Friendly placeholder for empty lists/tables.

import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="ft-empty">
      <span className="ft-empty-ico">
        <Icon size={24} />
      </span>
      <strong>{title}</strong>
      {message ? <p style={{ margin: 0, maxWidth: 360 }}>{message}</p> : null}
      {action}
    </div>
  );
}
