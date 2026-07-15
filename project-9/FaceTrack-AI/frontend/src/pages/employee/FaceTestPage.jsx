// FaceTrack AI — Face Test (webcam + scan diagnostic, frontend-only mode).
// A read-only diagnostic: start the camera and run a simulated face scan to see
// the resulting confidence + outcome. Writes NO attendance and stores nothing —
// purely to verify the camera and the (mock) matching flow before checking in.

import { useState } from 'react';
import { Camera, ScanFace } from 'lucide-react';
import { PageHeader, SectionCard, StatusBadge } from '../../components/ui';
import { useWebcam } from '../../hooks/useWebcam';
import { mockScan } from '../../utils/faceSim';

const CAMERA_MESSAGES = {
  denied: 'Camera access was denied. You can still use "Simulate scan" to run the test.',
  notfound: 'No camera was found on this device. Use "Simulate scan" to continue.',
  unsupported: 'This browser does not support the camera API. Use "Simulate scan".',
  error: 'The camera could not be started. Use "Simulate scan" to continue.',
};

// Map a mockScan() outcome to a label + badge tone.
const OUTCOME = {
  matched: { label: 'Matched', tone: 'success' },
  lowConfidence: { label: 'Low confidence', tone: 'danger' },
  multipleFaces: { label: 'Multiple faces', tone: 'warning' },
};

export default function FaceTestPage() {
  const { videoRef, status, start, stop, active } = useWebcam();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null); // { confidence, reason }

  const cameraBlocked = status === 'denied' || status === 'notfound' || status === 'unsupported';

  function runTest() {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockScan());
      setRunning(false);
    }, 1000);
  }

  const pct = result ? Math.round((result.confidence || 0) * 100) : 0;
  const outcome = result ? OUTCOME[result.reason] || OUTCOME.matched : null;

  return (
    <section className="ft-page">
      <PageHeader
        title="Face Test"
        subtitle="Check your camera and run a diagnostic face scan. Nothing is saved."
      />

      <SectionCard
        title="Camera Diagnostic"
        subtitle="Run a simulated scan to verify the recognition flow."
        icon={ScanFace}
      >
        <div className="ft-scan-layout">
          {/* ---------- left: camera ---------- */}
          <div>
            <div className="ft-camera">
              <video ref={videoRef} autoPlay playsInline muted />
              {active ? <div className="ft-scan-frame" /> : null}
              {!active ? (
                <div className="ft-camera-empty">
                  <Camera size={40} />
                  <div>Camera is off</div>
                  <button type="button" className="ft-btn ft-btn--primary ft-btn--sm" onClick={start}>
                    Start Camera
                  </button>
                </div>
              ) : null}
              {active ? <div className="ft-camera-badge">Live</div> : null}
            </div>

            {cameraBlocked ? (
              <div className="ft-note" style={{ marginTop: 12 }}>
                {CAMERA_MESSAGES[status]}
              </div>
            ) : null}

            <div className="ft-toolbar" style={{ marginTop: 12 }}>
              {active ? (
                <button type="button" className="ft-btn ft-btn--ghost" onClick={stop}>
                  Stop Camera
                </button>
              ) : (
                <button type="button" className="ft-btn ft-btn--subtle" onClick={start}>
                  Start Camera
                </button>
              )}
              {/* Always-available fallback so the test works without a camera. */}
              <button type="button" className="ft-btn ft-btn--subtle" onClick={runTest} disabled={running}>
                Simulate scan
              </button>
            </div>
          </div>

          {/* ---------- right: test runner + result ---------- */}
          <div className="ft-scan-status">
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Camera</span>
              <StatusBadge tone={active ? 'success' : 'muted'} label={active ? 'On' : 'Off'} />
            </div>

            <button
              type="button"
              className="ft-btn ft-btn--primary ft-btn--block"
              onClick={runTest}
              disabled={running}
            >
              <ScanFace size={16} /> {running ? 'Scanning…' : 'Run test scan'}
            </button>

            {result ? (
              <div className="ft-glass" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span className="ft-cell-strong">Result</span>
                  <StatusBadge tone={outcome.tone} label={outcome.label} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="ft-cell-dim">Confidence</span>
                    <span className="ft-cell-strong">{pct}%</span>
                  </div>
                  <div className="ft-progress">
                    <div className="ft-progress-fill" style={{ width: pct + '%' }} />
                  </div>
                </div>
                <div className="ft-note" style={{ marginTop: 12 }}>
                  Diagnostic only — no attendance was recorded.
                </div>
              </div>
            ) : (
              <div className="ft-note">Run a test scan to see the simulated confidence and outcome.</div>
            )}
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
