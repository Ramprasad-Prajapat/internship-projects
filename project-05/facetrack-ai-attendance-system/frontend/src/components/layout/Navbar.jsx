// FaceTrack AI — Top navbar (overhaul).
// Mobile menu toggle + page title + notifications dropdown + profile dropdown.

import { Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';

export default function Navbar({ onToggleSidebar, title = 'Dashboard' }) {
  return (
    <header className="ft-navbar">
      <div className="ft-navbar-left">
        <button className="ft-icon-btn ft-navbar-burger" type="button" onClick={onToggleSidebar} title="Menu">
          <Menu size={18} />
        </button>
        <span className="ft-navbar-title">{title}</span>
      </div>

      <div className="ft-navbar-actions">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
}
