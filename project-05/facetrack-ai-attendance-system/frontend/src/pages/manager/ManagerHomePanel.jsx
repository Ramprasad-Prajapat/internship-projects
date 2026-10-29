// FaceTrack AI — Manager Home panel (frontend-only mode).
//
// A manager-only block rendered on the shared /home page (HomePage gates it on
// role === 'manager', so other roles are unaffected). Shows LIVE team data from
// the shared mock store via services/managerService: a pending-approval
// reminder, team live-status cards, manager alerts, and today's team activity.
// No backend / Firebase / API — reuses the same store the rest of the app uses.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, ClipboardCheck, CalendarCheck, AlertTriangle } from 'lucide-react';
import { SectionCard, MetricCard, StatusBadge } from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as mgr from '../../services/managerService';

// Short severity word per alert tone (matches the Manager Dashboard).
const SEVERITY = { warning: 'Late', danger: 'Urgent', info: 'Pending', accent: 'Overtime', success: 'OK' };

export default function ManagerHomePanel() {
  const { user } = useAuth();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const shifts = useCollection('shifts');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');

  const team = useMemo(() => mgr.managerTeam(employees, user), [employees, user]);
  const overview = useMemo(
    () => mgr.teamOverview(team, attendance, { leaveRequests, correctionRequests }),
    [team, attendance, leaveRequests, correctionRequests]
  );
  const lateMissing = useMemo(() => mgr.lateOrMissing(team, attendance, shifts), [team, attendance, shifts]);
  const alerts = useMemo(() => mgr.teamAlerts(overview, lateMissing), [overview, lateMissing]);
  const activity = useMemo(
    () => mgr.teamActivity(team, { employees, attendance, leaveRequests, correctionRequests, faceRegistrations }, 6),
    [team, employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );

  const pending = overview.pendingApprovals;

  return (
    <>
      {/* Pending approval reminder */}
      <SectionCard
        title="Pending approvals"
        subtitle="Team requests waiting on you"
        icon={ClipboardCheck}
        actions={<StatusBadge tone={pending ? 'warning' : 'success'} label={`${pending} pending`} />}
      >
        <div className="ft-note" style={{ marginBottom: 12 }}>
          {pending ? (
            <>
              You have <strong>{pending}</strong> pending request{pending > 1 ? 's' : ''} —
              {' '}{overview.pendingLeaves} leave, {overview.pendingCorrections} correction, {overview.pendingOvertime} overtime.
            </>
          ) : (
            <>All caught up — no pending approvals for your team right now.</>
          )}
        </div>
        <div className="ft-toolbar">
          <Link to="/manager/leave-requests" className="ft-btn ft-btn--primary">Review approvals</Link>
          <Link to="/manager/dashboard" className="ft-btn ft-btn--subtle">Open team dashboard</Link>
        </div>
      </SectionCard>

      {/* Team live status summary */}
      <div className="ft-section-title-row" style={{ marginTop: 18 }}>
        <h3 className="ft-block-title">Team live status</h3>
        <span className="ft-cell-dim">Live from mock store</span>
      </div>
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Team Size" value={overview.teamSize} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Today" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardCheck} label="Pending Approvals" value={pending} tone="accent" />
        <MetricCard icon={CalendarCheck} label="Team Attendance" value={`${overview.attendanceRate}%`} tone="primary" />
      </div>

      {/* Alerts + today team activity */}
      <div className="ft-grid-2" style={{ marginTop: 18 }}>
        <SectionCard title="Manager Alerts" subtitle="Things that may need attention" icon={AlertTriangle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a) => (
              <div key={`${a.tone}-${a.text}`} className="ft-scan-row">
                <span className="ft-scan-row-label">{a.text}</span>
                <StatusBadge tone={a.tone} label={SEVERITY[a.tone] || 'Info'} />
              </div>
            ))}
          </div>
        </SectionCard>

        <RecentActivity items={activity} title="Today's team activity" />
      </div>
    </>
  );
}
