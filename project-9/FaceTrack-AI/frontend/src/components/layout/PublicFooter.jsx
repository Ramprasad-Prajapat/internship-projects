// FaceTrack AI — Reusable public footer (frontend-only).
// Shared across the public pages (Landing / Privacy / Consent).

import { Link } from 'react-router-dom';
import { ScanFace } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export default function PublicFooter() {
  return (
    <footer className="ft-land-footer">
      <div className="ft-land-footer-inner">
        <Link to={ROUTES.LANDING} className="ft-brand">
          <ScanFace size={20} className="ft-brand-icon" />
          <span className="ft-brand-text">FaceTrack AI</span>
        </Link>
        <nav className="ft-land-footer-links">
          <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
          <Link to={ROUTES.CONSENT}>Consent</Link>
          <Link to={ROUTES.LOGIN}>Login</Link>
          <Link to={ROUTES.REGISTER}>Get Started</Link>
          <span className="ft-land-footer-badge">Frontend Demo Mode</span>
        </nav>
      </div>
      <div className="ft-land-footer-note">
        © FaceTrack AI — frontend demo. All data is mock; no backend, database or biometric data is stored.
      </div>
    </footer>
  );
}
