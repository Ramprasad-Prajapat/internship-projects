// FaceTrack AI — LocationStatusPanel.
// Rich, reusable branch-location panel: assigned branch + city/address +
// allowed radius + inside/outside badge + distance ("18 m of 150 m"). Used on
// the employee Mark-Attendance flow and the Branches network detail.
//
// Keeps the existing internal field names (name / city / address / code /
// radiusMeters) so it plugs straight into the mock branch records.

import { MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import MockDataNotice from './MockDataNotice';

export default function LocationStatusPanel({
  branch,
  inside = null, // true | false | null (not checked yet)
  distance = null, // metres from the branch, when known
  simulated = false, // location was mock/simulated (geolocation unavailable)
  showNotice = true,
}) {
  if (!branch) {
    return (
      <div className="ft-loc-panel">
        <div className="ft-loc-head">
          <span className="ft-loc-ico">
            <MapPin size={18} />
          </span>
          <div className="ft-loc-headtext">
            <div className="ft-loc-branch">No branch assigned</div>
            <div className="ft-loc-addr">Contact HR to link a branch.</div>
          </div>
        </div>
      </div>
    );
  }

  const radius = Number(branch.radiusMeters) || 0;
  const badge =
    inside === true ? (
      <StatusBadge tone="success" label="Inside radius" />
    ) : inside === false ? (
      <StatusBadge tone="danger" label="Outside radius" />
    ) : (
      <StatusBadge tone="muted" label="Not checked" />
    );

  const distanceText =
    distance != null ? `${Math.round(distance)} m of ${radius} m` : `Radius ${radius} m`;

  return (
    <div className="ft-loc-panel">
      <div className="ft-loc-head">
        <span className="ft-loc-ico">
          <MapPin size={18} />
        </span>
        <div className="ft-loc-headtext">
          <div className="ft-loc-branch">{branch.name}</div>
          <div className="ft-loc-addr">
            {branch.city || '—'}
            {branch.state ? `, ${branch.state}` : ''}
          </div>
        </div>
        {badge}
      </div>

      <div className="ft-meta-grid" style={{ marginTop: 12 }}>
        <div className="ft-meta-item">
          <span className="ft-meta-key">Branch code</span>
          <span className="ft-meta-val">{branch.code || '—'}</span>
        </div>
        <div className="ft-meta-item">
          <span className="ft-meta-key">Address</span>
          <span className="ft-meta-val">{branch.address || '—'}</span>
        </div>
        <div className="ft-meta-item">
          <span className="ft-meta-key">Allowed radius</span>
          <span className="ft-meta-val">{radius} m</span>
        </div>
        <div className="ft-meta-item">
          <span className="ft-meta-key">Distance</span>
          <span className="ft-meta-val">{distanceText}</span>
        </div>
      </div>

      {simulated && showNotice ? (
        <MockDataNotice variant="inline">
          Demo office location used for mock radius verification. Replace with exact office GPS
          coordinates during real deployment.
        </MockDataNotice>
      ) : null}
    </div>
  );
}
