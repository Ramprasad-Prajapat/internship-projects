// FaceTrack AI — Consent page (public).
// Uses the shared public navbar/footer. Consent is enforced before face
// registration inside the app (employee Face Registration page).

import { Link } from 'react-router-dom';
import { ScanFace, MapPin, FileCheck2, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { ROUTES } from '../../utils/constants';

const TERMS = [
  { icon: ScanFace, text: 'I allow FaceTrack AI to capture and process my facial data for attendance verification only.' },
  { icon: MapPin, text: 'I allow my device location to be checked against my assigned branch radius at check-in.' },
  { icon: FileCheck2, text: 'I understand scans and location alerts are logged for audit and security purposes.' },
  { icon: ShieldCheck, text: 'I understand I can withdraw consent at any time, subject to organizational attendance policy.' },
];

export default function ConsentPage() {
  return (
    <div className="ft-land">
      <PublicNavbar />

      <section className="ft-land-section ft-doc-section">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Biometric consent</span>
          <h1 className="ft-land-section-title">Consent Policy</h1>
          <p className="ft-land-section-sub">
            Please review what you are agreeing to before registering your face. Consent is required
            inside the app before any capture.
          </p>
        </div>

        <div className="ft-doc-card ft-glass">
          <ul className="ft-consent-list">
            {TERMS.map(({ icon: Icon, text }, i) => (
              <li key={i} className="ft-consent-item">
                <span className="ft-role-icon"><Icon size={18} /></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="ft-note" style={{ marginTop: 0 }}>
            <strong>Demo note:</strong> this is a frontend demo — no biometric data is actually stored.
          </div>
          <div className="ft-hero-actions">
            <Link to={ROUTES.REGISTER} className="ft-btn ft-btn--primary">I Agree — Get Started</Link>
            <Link to={ROUTES.PRIVACY} className="ft-btn ft-btn--ghost">Read privacy policy</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
