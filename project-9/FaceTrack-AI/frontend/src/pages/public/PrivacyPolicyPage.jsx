// FaceTrack AI — Privacy Policy page (public).
// Uses the shared public navbar/footer. Frontend-only demo copy — no biometric
// data is actually stored.

import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Trash2 } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { ROUTES } from '../../utils/constants';

const POINTS = [
  { icon: Lock, title: 'On-device matching', text: 'Face matching runs client-side. In this demo, no biometric template ever leaves the browser or is persisted.' },
  { icon: Eye, title: 'Purpose-limited', text: 'Facial and location data are used solely to verify attendance — never for tracking, profiling or marketing.' },
  { icon: ShieldCheck, title: 'Transparent logging', text: 'Every scan, location check and suspicious event is logged so employees and HR can audit what happened.' },
  { icon: Trash2, title: 'Withdraw any time', text: 'Employees can withdraw consent and request removal of their face registration, subject to attendance policy.' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="ft-land">
      <PublicNavbar />

      <section className="ft-land-section ft-doc-section">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Legal</span>
          <h1 className="ft-land-section-title">Privacy Policy</h1>
          <p className="ft-land-section-sub">
            How FaceTrack AI handles facial templates and location data. This is a frontend demo —
            copy is illustrative and no real data is collected.
          </p>
        </div>

        <div className="ft-doc-card ft-glass">
          <p>
            FaceTrack AI processes facial templates and location data solely to verify employee
            attendance. Biometric processing happens on-device, and in this demo nothing is stored or
            shared with third parties.
          </p>
          <div className="ft-doc-points">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="ft-doc-point">
                <span className="ft-land-card-icon"><Icon size={18} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ft-hero-actions">
            <Link to={ROUTES.CONSENT} className="ft-btn ft-btn--primary">Review consent policy</Link>
            <Link to={ROUTES.LANDING} className="ft-btn ft-btn--ghost">Back to home</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
