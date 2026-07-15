// FaceTrack AI — ProfileDropdown (Phase 1).
// Avatar + name/role, with a menu containing logout. Closes on outside click.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS, ROUTES } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

export default function ProfileDropdown() {
  const { profile, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const name = profile?.name || user?.email || 'User';
  const email = profile?.email || user?.email || '';

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Clears the mock session, then returns to the public landing page.
      navigate(ROUTES.LANDING, { replace: true });
    }
  };

  return (
    <div className="ft-profile" ref={ref}>
      <button className="ft-profile-trigger" type="button" onClick={() => setOpen((o) => !o)}>
        <span className="ft-avatar">{getInitials(name) || 'U'}</span>
        <span className="ft-user-meta">
          <span className="ft-user-name">{name}</span>
          <span className="ft-user-role">{ROLE_LABELS[role] ?? ''}</span>
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="ft-profile-menu ft-glass">
          <div className="ft-profile-head">
            <div className="ft-user-name">{name}</div>
            <div className="ft-user-role">{email}</div>
          </div>
          <button className="ft-menu-item" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
