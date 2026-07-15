// FaceTrack AI — Mark Attendance (employee self-service, frontend-only mode).
// Drives the camera + (mock) face match + location radius flow, then AUTO-marks
// a Sign-In or Sign-Out based on the employee's current state today. No
// biometrics, no backend: the face match is simulated (faceSim) and location
// falls back to a "simulated inside" result when geolocation is unavailable so
// the demo always works.
//
// Toggle / repeat sessions: each successful scan flips the state — odd scan
// signs in, even scan signs out, and a scan after a sign-out starts a new
// session. Every scan is appended to a private `attendanceSessions` collection
// (today's session log) which is stored in the same localStorage-backed
// mockStore but is NOT read by HR/Manager/Admin/Reports — so the shared daily
// attendance row (first check-in / last check-out) keeps its existing shape and
// those pages are unaffected.

import { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  ScanFace,
  MapPin,
  CheckCircle2,
  Check,
  Clock,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  StatusBadge,
  Avatar,
  WorkflowStepper,
  MockDataNotice,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { useWebcam } from '../../hooks/useWebcam';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import { mockScan } from '../../utils/faceSim';
import { todayISO, nowHHMM, formatMinutes } from '../../utils/dateUtils';
import {
  classifyCheckIn,
  computeOvertimeMinutes,
  computeTotalHours,
  checkRadius,
} from '../../utils/attendanceUtils';

// Friendly copy for the camera status returned by useWebcam.
const CAMERA_MESSAGES = {
  denied: 'Camera access was denied. You can still use "Simulate scan" to try the flow.',
  notfound: 'No camera was found on this device. Use "Simulate scan" to continue.',
  unsupported: 'This browser does not support the camera API. Use "Simulate scan".',
  error: 'The camera could not be started. Use "Simulate scan" to continue.',
};

// Epoch ms for an "HH:MM" time on today's date (used to time the running clock
// and to back-fill the session log from a seeded daily row).
function tsAtHHMM(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
}

// Total worked minutes from an ascending session list: sum every in→out pair,
// plus the live running stretch if the last entry is still an open sign-in.
function workedMinutesFromSessions(sessionsAsc, nowMs) {
  let total = 0;
  let openIn = null;
  for (const s of sessionsAsc) {
    if (s.type === 'in') {
      openIn = s.ts;
    } else if (openIn != null) {
      total += Math.max(0, s.ts - openIn);
      openIn = null;
    }
  }
  if (openIn != null) total += Math.max(0, nowMs - openIn);
  return Math.round(total / 60000);
}

export default function MarkAttendancePage() {
  const { user } = useAuth();
  const toast = useToast();
  const employees = useCollection('employees');
  const branches = useCollection('branches');
  const attendance = useCollection('attendance');
  const shifts = useCollection('shifts');
  const sessions = useCollection('attendanceSessions');
  const { videoRef, status, start, stop, active } = useWebcam();

  const emp = byId(employees, user?.employeeId);
  const branch = byId(branches, emp?.branchId);
  const shift = byId(shifts, emp?.shiftId);

  // Flow state machine + last scan result.
  const [step, setStep] = useState('idle');
  const [result, setResult] = useState({ confidence: null, distance: null });
  // True when the location reading was simulated (geolocation unavailable/denied).
  const [locationSimulated, setLocationSimulated] = useState(false);
  // Ticks the running working-time clock while signed in.
  const [nowTick, setNowTick] = useState(() => Date.now());

  const cameraBlocked = status === 'denied' || status === 'notfound' || status === 'unsupported';

  // Today's shared attendance row for this employee (if any) — unchanged shape.
  const todayRow = emp ? attendance.find((a) => a.employeeId === emp.id && a.date === todayISO()) : null;

  // Today's session log (ascending), the source of truth for the toggle.
  const todaySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.employeeId === emp?.id && s.date === todayISO())
        .sort((a, b) => a.ts - b.ts),
    [sessions, emp?.id],
  );
  const lastSession = todaySessions.length ? todaySessions[todaySessions.length - 1] : null;

  // Signed in = last session is an open "in"; fall back to the seeded daily row
  // (check-in but no check-out) before any scan has happened today.
  const signedIn = lastSession ? lastSession.type === 'in' : !!(todayRow?.checkIn && !todayRow?.checkOut);
  const action = signedIn ? 'checkOut' : 'checkIn';
  const hasActivity = todaySessions.length > 0 || !!todayRow?.checkIn;

  // One-time back-fill: if the seeded daily row already has a check-in/out but
  // the session log is empty, seed the log from it so the demo timeline is
  // continuous (and the toggle starts from the right state).
  useEffect(() => {
    if (!emp) return;
    const existing = store
      .getAll('attendanceSessions')
      .filter((s) => s.employeeId === emp.id && s.date === todayISO());
    if (existing.length) return;
    const row = store.getAll('attendance').find((a) => a.employeeId === emp.id && a.date === todayISO());
    if (!row || !row.checkIn) return;
    store.insert('attendanceSessions', {
      id: store.genId('as'),
      employeeId: emp.id,
      date: todayISO(),
      type: 'in',
      time: row.checkIn,
      ts: tsAtHHMM(row.checkIn),
      by: 'face',
    });
    if (row.checkOut) {
      let outTs = tsAtHHMM(row.checkOut);
      if (outTs <= tsAtHHMM(row.checkIn)) outTs += 86400000; // overnight guard
      store.insert('attendanceSessions', {
        id: store.genId('as'),
        employeeId: emp.id,
        date: todayISO(),
        type: 'out',
        time: row.checkOut,
        ts: outTs,
        by: 'face',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emp?.id]);

  // Live running clock — only ticks while signed in.
  useEffect(() => {
    if (!signedIn) return undefined;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [signedIn]);

  function resetFlow() {
    setStep('idle');
    setResult({ confidence: null, distance: null });
    setLocationSimulated(false);
  }

  // Record a flagged scan for HR review (low confidence / multiple faces).
  function flagScan(reason, confidence, multipleFaces) {
    store.insert('suspiciousScans', {
      id: store.genId('ss'),
      employeeId: emp.id,
      reason,
      confidence,
      multipleFaces,
      time: nowHHMM(),
      date: todayISO(),
      location: branch?.name || '',
      status: 'pending',
      reviewedBy: null,
    });
  }

  // Step 1 — face scan (camera or simulated).
  function startScan() {
    if (!emp) return;
    setStep('scanning');
    setResult({ confidence: null, distance: null });
    setTimeout(() => {
      const r = mockScan();
      if (r.reason === 'lowConfidence') {
        setResult((prev) => ({ ...prev, confidence: r.confidence }));
        flagScan('lowConfidence', r.confidence, false);
        setStep('lowconf');
        return;
      }
      if (r.multipleFaces) {
        setResult((prev) => ({ ...prev, confidence: r.confidence }));
        flagScan('multipleFaces', r.confidence, true);
        setStep('multiface');
        return;
      }
      setResult((prev) => ({ ...prev, confidence: r.confidence }));
      runLocation(r.confidence);
    }, 1300);
  }

  // Step 2 — location radius check (geolocation or simulated inside), then mark.
  function runLocation(confidence) {
    setStep('locating');
    const finish = (inside, distance) => {
      setResult({ confidence, distance });
      if (!inside) {
        setStep('outside');
      } else {
        markAttendance(confidence, distance);
      }
    };

    if (!navigator.geolocation || !branch) {
      setLocationSimulated(true);
      finish(true, Math.floor(Math.random() * 30) + 5);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationSimulated(false);
        const { inside, distance } = checkRadius(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          branch,
        );
        finish(inside, distance);
      },
      () => {
        // Permission denied / unavailable: simulate inside so the demo proceeds.
        setLocationSimulated(true);
        finish(true, Math.floor(Math.random() * 30) + 5);
      },
      { timeout: 4000 },
    );
  }

  // Step 3 — auto-mark Sign-In or Sign-Out based on the current state.
  function markAttendance(confidence, distance) {
    if (!emp) return;
    const t = nowHHMM();
    const ts = Date.now();
    const willSignIn = !signedIn;
    const location = { status: 'insideRadius', distanceMeters: distance ?? 0 };

    // 1) Append to today's private session log (does not affect other pages).
    store.insert('attendanceSessions', {
      id: store.genId('as'),
      employeeId: emp.id,
      date: todayISO(),
      type: willSignIn ? 'in' : 'out',
      time: t,
      ts,
      by: 'face',
    });

    // 2) Keep the shared daily attendance row in sync (first in / last out).
    if (willSignIn) {
      const { status: st, lateMinutes } = classifyCheckIn(t, shift);
      if (todayRow) {
        store.update('attendance', todayRow.id, {
          checkIn: todayRow.checkIn || t, // preserve the first check-in of the day
          checkOut: null, // re-opened: working again
          status: todayRow.checkIn ? todayRow.status : st,
          lateMinutes: todayRow.checkIn ? todayRow.lateMinutes : lateMinutes,
          confidence,
          location,
          markedBy: 'face',
        });
      } else {
        store.insert('attendance', {
          id: store.genId('att'),
          employeeId: emp.id,
          branchId: emp.branchId,
          departmentId: emp.departmentId,
          shiftId: emp.shiftId,
          date: todayISO(),
          checkIn: t,
          checkOut: null,
          status: st,
          lateMinutes,
          overtimeMinutes: 0,
          totalHours: 0,
          confidence,
          location,
          markedBy: 'face',
          manualEditReason: null,
        });
      }
      toast.success('Signed in at ' + t);
    } else if (todayRow) {
      const firstIn = todayRow.checkIn || t;
      store.update('attendance', todayRow.id, {
        checkOut: t, // last check-out of the day
        overtimeMinutes: computeOvertimeMinutes(t, shift),
        totalHours: computeTotalHours(firstIn, t),
      });
      toast.success('Signed out at ' + t);
    }

    setResult({ confidence, distance });
    setNowTick(Date.now());
    setStep('done');
  }

  // Send a correction request when a scan or location check fails.
  function sendCorrection(type) {
    if (!emp) return;
    store.insert('correctionRequests', {
      id: store.genId('cr'),
      employeeId: emp.id,
      date: todayISO(),
      type,
      reason:
        type === 'locationIssue'
          ? 'Outside branch radius during face scan — requesting manual review.'
          : 'Face scan could not be completed reliably — requesting manual review.',
      requestedCheckIn: null,
      requestedCheckOut: null,
      status: 'pending',
      hrRemark: '',
      createdAt: todayISO(),
    });
    toast.info('Correction request sent to HR.');
    resetFlow();
  }

  // ---------- derived display values ----------
  const confidencePct = result.confidence != null ? Math.round(result.confidence * 100) + '%' : '—';
  const faceMatched = result.confidence != null && step !== 'lowconf' && step !== 'multiface';
  const locInside = step === 'outside' ? false : step === 'done' ? true : null;

  const firstInTime = todaySessions.find((s) => s.type === 'in')?.time || todayRow?.checkIn || null;
  const lastOutTime = [...todaySessions].reverse().find((s) => s.type === 'out')?.time || (!signedIn ? todayRow?.checkOut : null) || null;
  const workedMin = workedMinutesFromSessions(todaySessions, nowTick);
  const workingText = signedIn
    ? `${formatMinutes(workedMin)} · Running`
    : hasActivity
      ? formatMinutes(workedMin) || (todayRow?.totalHours ? `${todayRow.totalHours}h` : '0m')
      : '—';

  // Workflow stepper: Face Scan → Location → Mark → Done.
  const stepIndex = ['scanning', 'lowconf', 'multiface'].includes(step)
    ? 0
    : ['locating', 'outside'].includes(step)
      ? 1
      : step === 'done'
        ? 3
        : 0;
  const stepError = step === 'lowconf' || step === 'multiface' || step === 'outside';
  const FLOW_STEPS = [
    { key: 'scan', label: 'Face Scan', icon: ScanFace },
    { key: 'loc', label: 'Location', icon: MapPin },
    { key: 'mark', label: 'Mark', icon: CheckCircle2 },
    { key: 'done', label: 'Done', icon: Check },
  ];

  const suggestionText = (() => {
    if (!emp) return 'No linked employee profile.';
    switch (step) {
      case 'idle':
        return signedIn
          ? 'You are signed in. Scan your face to sign out.'
          : 'Scan your face to sign in.';
      case 'scanning':
        return 'Scanning face…';
      case 'lowconf':
        return 'Low confidence — please re-scan in better lighting.';
      case 'multiface':
        return 'Multiple faces detected — make sure only you are in frame.';
      case 'locating':
        return 'Checking your location…';
      case 'outside':
        return 'You appear to be outside the branch radius.';
      case 'done':
        return signedIn
          ? 'Signed in — your working time is now running.'
          : 'Signed out — working time recorded. Scan again to start a new session.';
      default:
        return '—';
    }
  })();

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="Mark Attendance" subtitle="Face + location check-in." />
        <SectionCard title="Mark Attendance">
          <div className="ft-note">
            Your account is not linked to an employee profile, so attendance cannot be marked.
            Please contact HR.
          </div>
        </SectionCard>
      </section>
    );
  }

  const scanBusy = step === 'scanning' || step === 'locating';
  const scanLabel = signedIn ? 'Start Scan / Sign Out' : 'Start Scan / Sign In';

  return (
    <section className="ft-page">
      <PageHeader
        title="Mark Attendance"
        subtitle="Verify your face and location, then sign in or out."
        actions={<MockDataNotice variant="badge" title="Mock location mode" icon={MapPin} />}
      />

      <SectionCard
        title="Face + Location Check-In"
        subtitle={`${emp.name} · ${branch?.name || 'No branch'} · ${shift?.name || 'No shift'}`}
        icon={Camera}
      >
        <div style={{ marginBottom: 16 }}>
          <WorkflowStepper steps={FLOW_STEPS} activeIndex={stepIndex} error={stepError} />
        </div>
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
              <button
                type="button"
                className="ft-btn ft-btn--primary"
                onClick={startScan}
                disabled={scanBusy}
              >
                <ScanFace size={16} /> {scanLabel}
              </button>
              {/* Always-available fallback so the demo works without a camera. */}
              <button
                type="button"
                className="ft-btn ft-btn--subtle"
                onClick={startScan}
                disabled={scanBusy}
              >
                Simulate scan
              </button>
            </div>
          </div>

          {/* ---------- right: status ---------- */}
          <div className="ft-scan-status">
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Camera</span>
              <StatusBadge tone={active ? 'success' : 'muted'} label={active ? 'On' : 'Off'} />
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Face match</span>
              <StatusBadge
                tone={step === 'lowconf' || step === 'multiface' ? 'danger' : faceMatched ? 'success' : 'muted'}
                label={faceMatched ? `Matched · ${confidencePct}` : step === 'scanning' ? 'Scanning…' : 'Pending'}
              />
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Location</span>
              <StatusBadge
                tone={locInside === false ? 'danger' : locInside ? 'success' : 'muted'}
                label={locInside === false ? 'Outside' : locInside ? (locationSimulated ? 'Checked (mock)' : 'Checked') : 'Not checked'}
              />
            </div>
            <div className="ft-scan-row">
              <span className="ft-scan-row-label">Current status</span>
              <StatusBadge
                tone={signedIn ? 'success' : hasActivity ? 'muted' : 'muted'}
                label={signedIn ? 'Signed In' : hasActivity ? 'Signed Out' : 'Not signed in'}
              />
            </div>

            <div className="ft-meta-grid" style={{ marginTop: 4 }}>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Check-in</span>
                <span className="ft-meta-val">{firstInTime || '—'}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Check-out</span>
                <span className="ft-meta-val">{signedIn ? 'Pending' : lastOutTime || '—'}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Working time</span>
                <span className="ft-meta-val">{workingText}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Last scan</span>
                <span className="ft-meta-val">{lastSession?.time || '—'}</span>
              </div>
            </div>

            <div className="ft-note" style={{ marginTop: 4 }}>
              {suggestionText}
            </div>

            {/* Contextual actions for the failure branches. */}
            {step === 'lowconf' || step === 'multiface' ? (
              <div className="ft-toolbar">
                <button type="button" className="ft-btn ft-btn--primary" onClick={startScan}>
                  Re-scan
                </button>
                <button
                  type="button"
                  className="ft-btn ft-btn--ghost"
                  onClick={() => sendCorrection('faceScanFailed')}
                >
                  Send correction request
                </button>
              </div>
            ) : null}

            {step === 'outside' ? (
              <div className="ft-toolbar">
                <button type="button" className="ft-btn ft-btn--subtle" onClick={startScan}>
                  Try again
                </button>
                <button
                  type="button"
                  className="ft-btn ft-btn--ghost"
                  onClick={() => sendCorrection('locationIssue')}
                >
                  Send request
                </button>
              </div>
            ) : null}

            {step !== 'idle' ? (
              <button type="button" className="ft-btn ft-btn--ghost ft-btn--sm" onClick={resetFlow}>
                Reset
              </button>
            ) : null}

            <div className="ft-scan-row" style={{ marginTop: 8 }}>
              <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
              <span className="ft-cell-dim">{emp.employeeCode}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ---------- today's session log ---------- */}
      <SectionCard
        title="Today's sessions"
        subtitle="Each face scan signs you in or out — repeat sessions are allowed in demo mode."
        icon={Clock}
      >
        {todaySessions.length ? (
          <div className="ft-meta-grid">
            {todaySessions.map((s) => (
              <div key={s.id} className="ft-scan-row">
                <span className="ft-scan-row-label">{s.time}</span>
                <StatusBadge
                  tone={s.type === 'in' ? 'success' : 'muted'}
                  label={s.type === 'in' ? 'Signed in by face scan' : 'Signed out by face scan'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="ft-note">No sign-in yet today. Start the camera and scan to sign in.</div>
        )}
      </SectionCard>

      {step === 'done' ? (
        <ConnectedNextActions
          title="What's next?"
          actions={[
            { icon: CalendarCheck, label: 'View my attendance', hint: 'See your updated record', to: '/employee/my-attendance', tone: 'primary' },
            { icon: LayoutDashboard, label: 'Back to dashboard', hint: 'Your overview', to: '/employee/dashboard', tone: 'success' },
            { icon: ClipboardList, label: 'Raise a correction', hint: 'Something look wrong?', to: '/employee/corrections', tone: 'warning' },
          ]}
        />
      ) : (
        <ConnectedNextActions
          title="Related"
          subtitle="Other attendance tools"
          actions={[
            { icon: ScanFace, label: 'Face test sandbox', hint: 'Try the scanner only', to: '/employee/face-test', tone: 'accent' },
            { icon: CalendarCheck, label: 'My attendance', hint: 'Your history', to: '/employee/my-attendance', tone: 'primary' },
          ]}
        />
      )}
    </section>
  );
}
