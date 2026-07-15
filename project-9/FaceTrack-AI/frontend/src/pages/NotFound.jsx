// FaceTrack AI — 404 Not Found.
// Role-aware so it is never a dead end: signed-in users get a dashboard
// shortcut, signed-out users get Login. Landing is always available.

import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, dashboardPathForRole } from '../utils/constants';

export default function NotFound() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="ft-auth">
      <div className="ft-glass ft-auth-card">
        <h1 className="ft-404">404</h1>
        <p className="ft-auth-tagline">This page does not exist or has moved.</p>
        <div className="ft-landing-actions" style={{ marginTop: 6 }}>
          <Link to={ROUTES.LANDING} className="ft-btn ft-btn--ghost">
            <Home size={16} /> Home
          </Link>
          {isAuthenticated ? (
            <Link to={dashboardPathForRole(role)} className="ft-btn ft-btn--primary">
              <LayoutDashboard size={16} /> My Dashboard
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN} className="ft-btn ft-btn--primary">
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
