// FaceTrack AI — MockDataNotice.
// A single, reusable "frontend-only demo / mock data" notice. Replaces the
// hand-duplicated disclaimers scattered across pages and also doubles as the
// "future backend" / "simulated location" note. Three variants:
//   banner (default) — a glass info card with icon + title + body
//   inline           — a compact one-line note (for tight spaces like panels)
//   badge            — a tiny chip ("Mock mode") for headers/toolbars
//
// No backend, no data calls — purely presentational.

import { Database } from 'lucide-react';

export default function MockDataNotice({
  title = 'Frontend demo mode',
  children,
  variant = 'banner',
  icon: Icon = Database,
}) {
  const body =
    children ||
    'This demo runs on local mock data — no backend, no Firebase, nothing leaves your browser. Real services can be connected later using the same data shapes.';

  if (variant === 'badge') {
    return (
      <span className="ft-mode-badge" title="Frontend-only mock mode">
        <Icon size={12} /> {title}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <p className="ft-mocknotice-inline">
        <Icon size={13} /> {body}
      </p>
    );
  }

  return (
    <div className="ft-mocknotice ft-glass">
      <span className="ft-mocknotice-ico">
        <Icon size={16} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}
