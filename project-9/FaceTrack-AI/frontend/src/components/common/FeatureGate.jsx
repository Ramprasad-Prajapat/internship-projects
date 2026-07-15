// FaceTrack AI — Feature gate (frontend-only mode).
//
// Wraps a role-scoped feature route. If the Super Admin has disabled the feature
// (or removed this role from its access list) in the Feature Control Center, it
// renders a friendly "disabled in demo mode" message instead of the page —
// without removing the route or crashing. Protected/uncontrolled features always
// render their children.

import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useFeatures } from '../../hooks/useFeatures';
import * as fc from '../../services/featureControlService';
import { ROLE_BASE } from '../../utils/constants';

export default function FeatureGate({ featureKey, role, children }) {
  const features = useFeatures();
  if (fc.isFeatureEnabledForRole(features, featureKey, role)) return children;

  const feat = fc.featureBySeg(features, featureKey);
  return (
    <section className="ft-page">
      <div
        className="ft-glass"
        style={{ padding: 40, textAlign: 'center', maxWidth: 540, margin: '48px auto' }}
      >
        <Lock size={34} style={{ color: 'var(--ft-text-dim)' }} />
        <h2 className="ft-cell-strong" style={{ marginTop: 14, fontSize: '1.25rem' }}>
          {feat?.name || 'This feature'} is currently unavailable
        </h2>
        <p className="ft-note" style={{ marginTop: 8 }}>
          This feature is currently disabled by Super Admin in demo mode.
        </p>
        <Link to={`${ROLE_BASE[role]}/dashboard`} className="ft-btn ft-btn--primary" style={{ marginTop: 16 }}>
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
