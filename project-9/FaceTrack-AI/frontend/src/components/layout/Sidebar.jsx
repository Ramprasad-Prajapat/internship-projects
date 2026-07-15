// FaceTrack AI — Sidebar (overhaul). Brand + icon-based role navigation.
// Collapses to an off-canvas drawer on mobile (controlled by Layout).

import { NavLink, Link } from 'react-router-dom';
import { ScanFace, X, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFeatures } from '../../hooks/useFeatures';
import * as fc from '../../services/featureControlService';
import { NAV_ITEMS, ROLE_LABELS, ROUTES } from '../../utils/constants';

// Last path segment of a nav `to` (e.g. '/hr/attendance' -> 'attendance').
const segOf = (to) => to.split('/').filter(Boolean).pop();

export default function Sidebar({ open = false, onClose }) {
  const { role } = useAuth();
  const features = useFeatures();
  // Hide nav items whose feature was disabled/hidden (or whose role access was
  // removed) by Super Admin in the Feature Control Center. Uncontrolled and
  // protected items always remain.
  const items = (NAV_ITEMS[role] ?? []).filter((item) => fc.isNavVisible(features, segOf(item.to), role));

  return (
    <aside className={`ft-sidebar${open ? ' ft-sidebar--open' : ''}`}>
      <div className="ft-sidebar-top">
        <div className="ft-brand">
          <ScanFace size={24} className="ft-brand-icon" />
          <span className="ft-brand-text">FaceTrack AI</span>
        </div>
        <button className="ft-icon-btn ft-sidebar-close" type="button" onClick={onClose} title="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="ft-sidebar-role">{ROLE_LABELS[role] ?? 'Guest'}</div>

      <nav className="ft-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to.endsWith('/dashboard')}
              className={({ isActive }) => `ft-nav-item${isActive ? ' ft-nav-item--active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {Icon ? <Icon size={17} /> : null}
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Leave the dashboard for the public landing page (stays logged in). */}
      <Link to={ROUTES.LANDING} className="ft-nav-item ft-nav-item--public" onClick={onClose}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <Globe size={17} /> Public Site
        </span>
      </Link>

      <div className="ft-sidebar-foot">FaceTrack AI · demo</div>
    </aside>
  );
}
