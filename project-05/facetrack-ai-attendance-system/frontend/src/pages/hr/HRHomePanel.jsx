// FaceTrack AI — HR Home panel (frontend-only mode).
//
// An HR-only block rendered on the shared /home page (HomePage gates it on
// role === 'hr', so other roles are unaffected). Shows LIVE org-wide people
// operations from the shared mock store via services/hrService: pending HR
// actions, today people-operations summary, HR alerts and a department-wise
// quick snapshot. No backend / Firebase / API — reuses the same store the rest
// of the app uses.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  ScanFace,
  Network,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react';
import { SectionCard, MetricCard, StatusBadge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as hr from '../../services/hrService';

// Short severity word per alert tone (matches the HR Dashboard).
const SEVERITY = { warning: 'Late', danger: 'Review', info: 'Pending', accent: 'Face', success: 'OK' };

export default function HRHomePanel() {
  const { user } = useAuth();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const suspiciousScans = useCollection('suspiciousScans');

  const scoped = useMemo(() => hr.hrEmployees(employees, user), [employees, user]);
  const overview = useMemo(
    () =>
      hr.hrOverview(scoped, attendance, {
        leaveRequests,
        correctionRequests,
        faceRegistrations,
        suspiciousScans,
        departments,
      }),
    [scoped, attendance, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans, departments]
  );
  const deptSummary = useMemo(
    () => hr.departmentSummary(scoped, departments, attendance, { leaveRequests, correctionRequests }),
    [scoped, departments, attendance, leaveRequests, correctionRequests]
  );
  const alerts = useMemo(() => hr.hrAlerts(overview, deptSummary), [overview, deptSummary]);

  const pending = overview.pendingActions;

  return (
    <>
      {/* Pending HR actions reminder */}
      <SectionCard
        title="Pending HR actions"
        subtitle="Requests waiting on the HR team"
        icon={ClipboardCheck}
        actions={<StatusBadge tone={pending ? 'warning' : 'success'} label={`${pending} pending`} />}
      >
        <div className="ft-note" style={{ marginBottom: 12 }}>
          {pending ? (
            <>
              You have <strong>{pending}</strong> pending action{pending > 1 ? 's' : ''} —
              {' '}{overview.pendingLeaves} leave, {overview.pendingCorrections} correction, {overview.pendingFaceApprovals} face approval.
            </>
          ) : (
            <>All caught up — no pending HR actions right now.</>
          )}
        </div>
        <div className="ft-toolbar">
          <Link to="/hr/leave-requests" className="ft-btn ft-btn--primary">Review leave</Link>
          <Link to="/hr/correction-requests" className="ft-btn ft-btn--subtle">Review corrections</Link>
          <Link to="/hr/face-approvals" className="ft-btn ft-btn--subtle">Face approvals</Link>
          <Link to="/hr/dashboard" className="ft-btn ft-btn--ghost">Open HR dashboard</Link>
        </div>
      </SectionCard>

      {/* Today people operations summary */}
      <div className="ft-section-title-row" style={{ marginTop: 18 }}>
        <h3 className="ft-block-title">Today people operations</h3>
        <span className="ft-cell-dim">Live from mock store</span>
      </div>
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Total Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Check-ins" value={overview.late} tone="warning" />
        <MetricCard icon={CalendarDays} label="Leave Pending" value={overview.pendingLeaves} tone="accent" />
        <MetricCard icon={ScanFace} label="Face Approvals" value={overview.pendingFaceApprovals} tone="primary" />
      </div>

      {/* Alerts + department-wise quick snapshot */}
      <div className="ft-grid-2" style={{ marginTop: 18 }}>
        <SectionCard title="HR Alerts" subtitle="Things that may need attention" icon={AlertTriangle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} className="ft-scan-row">
                <span className="ft-scan-row-label">{a.text}</span>
                <StatusBadge tone={a.tone} label={SEVERITY[a.tone] || 'Info'} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Department snapshot"
          subtitle="Attendance % by department (today)"
          icon={Network}
          actions={<Link to="/hr/dashboard" className="ft-btn ft-btn--ghost ft-btn--sm">View all</Link>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deptSummary.map((d) => (
              <div key={d.id} className="ft-scan-row">
                <span className="ft-scan-row-label">
                  {d.name} <span className="ft-cell-dim">· {d.total} emp</span>
                </span>
                <StatusBadge
                  tone={d.needsReview ? 'danger' : d.attendanceRate >= 90 ? 'success' : 'warning'}
                  label={`${d.attendanceRate}%`}
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
