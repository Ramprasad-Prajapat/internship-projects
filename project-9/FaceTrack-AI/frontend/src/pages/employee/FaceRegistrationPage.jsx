// FaceTrack AI — Face Registration (employee self-service).
// Lets an employee capture a (simulated) face sample and submit it for HR
// approval. Frontend-only: no biometric data leaves the browser — mockRegistrationCapture
// stands in for real matching. Enforces the consent gate from settings, shows
// the current face status, and writes a pending faceRegistrations record on submit.

import { useState, useMemo, useEffect } from 'react';
import { Camera, ScanFace, Check } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  StatusBadge,
  EmptyState,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection, useSettings } from '../../hooks/useStore';
import { useWebcam } from '../../hooks/useWebcam';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import { mockRegistrationCapture } from '../../utils/faceSim';
import { FACE_STATUS } from '../../utils/constants';
import { todayISO, prettyDate } from '../../utils/dateUtils';

// Human-readable hints for the webcam status states.
const CAMERA_HINTS = {
  denied: 'Camera permission was denied. Use “Simulate capture” instead.',
  notfound: 'No camera found. Use “Simulate capture” instead.',
  unsupported: 'This browser does not support camera access. Use “Simulate capture”.',
  error: 'Could not start the camera. Use “Simulate capture” instead.',
};

export default function FaceRegistrationPage() {
  const { user } = useAuth();
  const toast = useToast();
  const settings = useSettings();
  const employees = useCollection('employees');
  const faceRegistrations = useCollection('faceRegistrations');
  const { videoRef, status, start, stop, active } = useWebcam();

  const emp = useMemo(() => byId(employees, user?.employeeId), [employees, user]);

  const [consent, setConsent] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [confidence, setConfidence] = useState(null); // 0..1 once a capture exists

  // Stop the webcam when leaving the page.
  useEffect(() => () => stop(), [stop]);

  // The most recent registration this employee submitted (newest first in store).
  const lastRegistration = useMemo(
    () => (emp ? faceRegistrations.find((r) => r.employeeId === emp.id) || null : null),
    [faceRegistrations, emp],
  );

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="Face Registration" subtitle="Register your face for attendance." />
        <SectionCard title="Face Registration">
          <EmptyState
            icon={ScanFace}
            title="No employee profile"
            message="Your account is not linked to an employee record yet."
          />
        </SectionCard>
      </section>
    );
  }

  const consentRequired = Boolean(settings?.requireConsentBeforeFace);
  const consentOk = !consentRequired || consent;
  const alreadyOnFile = emp.faceStatus === 'pending' || emp.faceStatus === 'registered';
  const pct = confidence != null ? Math.round(confidence * 100) : 0;

  function handleCapture() {
    if (!consentOk || capturing) return;
    setCapturing(true);
    setConfidence(null);
    // Simulate the ~900ms it takes to grab + match a frame.
    setTimeout(() => {
      const { confidence: c } = mockRegistrationCapture();
      setConfidence(c);
      setCapturing(false);
      toast.success(`Face captured — ${Math.round(c * 100)}% match. Review and submit below.`);
    }, 900);
  }

  function handleSubmit() {
    if (confidence == null) return;
    store.insert('faceRegistrations', {
      id: store.genId('fr'),
      employeeId: emp.id,
      status: 'pending',
      confidence,
      capturedAt: todayISO(),
      reviewedBy: null,
      note: '',
    });
    store.update('employees', emp.id, { faceStatus: 'pending' });
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'faceRegistrationSubmitted',
      target: emp.id,
      description: `${emp.name} submitted a face registration for approval (${Math.round(confidence * 100)}%)`,
    });
    toast.success('Submitted for HR approval');
    // Reset the local capture state so the flow can be repeated cleanly.
    setConfidence(null);
    stop();
  }

  const cameraHint = CAMERA_HINTS[status];

  return (
    <section className="ft-page">
      <PageHeader
        title="Face Registration"
        subtitle="Capture your face sample and submit it for HR approval."
        actions={<StatusBadge map={FACE_STATUS} value={emp.faceStatus} />}
      />

      {alreadyOnFile ? (
        <div className="ft-note">
          Your face status is currently{' '}
          <strong>{emp.faceStatus === 'pending' ? 'Pending review' : 'Registered'}</strong>.
          {lastRegistration ? ` Last submitted ${prettyDate(lastRegistration.capturedAt)}.` : ''} You
          can re-register below if you need to replace your sample.
        </div>
      ) : null}

      <SectionCard
        title="Register Your Face"
        subtitle="No biometric data is stored — this is a simulated capture."
        icon={ScanFace}
      >
        {consentRequired ? (
          <label
            className="ft-glass"
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: 14,
              marginBottom: 16,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              <span className="ft-cell-strong">
                I consent to my face data being used only for attendance.
              </span>
              <span className="ft-cell-dim" style={{ display: 'block', marginTop: 4 }}>
                Review the full terms on the Consent page before you continue. Capture stays
                disabled until you check this box.
              </span>
            </span>
          </label>
        ) : null}

        <div className="ft-scan-layout">
          <div>
            <div className="ft-camera">
              <video ref={videoRef} muted playsInline autoPlay />
              {!active ? (
                <div className="ft-camera-empty">
                  <Camera size={28} />
                  <p>Camera is off. Start it or simulate a capture below.</p>
                </div>
              ) : null}
              {active ? <div className="ft-scan-frame" /> : null}
              {active ? <div className="ft-camera-badge">LIVE</div> : null}
            </div>

            <div className="ft-toolbar" style={{ marginTop: 12 }}>
              {!active ? (
                <button
                  type="button"
                  className="ft-btn ft-btn--ghost"
                  onClick={start}
                  disabled={status === 'starting'}
                >
                  <Camera size={16} />
                  {status === 'starting' ? 'Starting…' : 'Start camera'}
                </button>
              ) : (
                <button type="button" className="ft-btn ft-btn--ghost" onClick={stop}>
                  Stop camera
                </button>
              )}
              <button
                type="button"
                className="ft-btn ft-btn--primary"
                onClick={handleCapture}
                disabled={!consentOk || capturing}
              >
                <ScanFace size={16} />
                {capturing ? 'Capturing…' : active ? 'Capture' : 'Simulate capture'}
              </button>
            </div>

            {cameraHint ? (
              <div className="ft-note" style={{ marginTop: 10 }}>
                {cameraHint}
              </div>
            ) : null}
            {!consentOk ? (
              <div className="ft-note" style={{ marginTop: 10 }}>
                You must give consent above before capturing your face.
              </div>
            ) : null}

            {capturing ? (
              <div className="ft-note" style={{ marginTop: 12 }}>Analyzing frame…</div>
            ) : null}

            {/* Result + submit live right under the capture button so the action
                always has visible, local feedback. */}
            {confidence != null ? (
              <div className="ft-glass" style={{ marginTop: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="ft-cell-strong">Capture confidence</span>
                  <span className="ft-cell-strong">{pct}%</span>
                </div>
                <div className="ft-progress">
                  <div className="ft-progress-fill" style={{ width: pct + '%' }} />
                </div>
                <button
                  type="button"
                  className="ft-btn ft-btn--success ft-btn--block"
                  style={{ marginTop: 12 }}
                  onClick={handleSubmit}
                >
                  <Check size={16} /> Submit for approval
                </button>
              </div>
            ) : null}
          </div>

          <div className="ft-scan-status">
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Current status</span>
              <StatusBadge map={FACE_STATUS} value={emp.faceStatus} />
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Camera</span>
              <StatusBadge tone={active ? 'success' : 'muted'} label={active ? 'On' : 'Off'} />
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Last sample</span>
              <span className="ft-cell-dim">
                {lastRegistration ? prettyDate(lastRegistration.capturedAt) : 'None'}
              </span>
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Latest capture</span>
              {confidence != null ? (
                <StatusBadge tone="success" label={`${pct}%`} />
              ) : (
                <span className="ft-cell-dim">—</span>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
