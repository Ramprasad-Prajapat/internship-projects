// FaceTrack AI — Branch Admin Home panel (frontend-only mode).
//
// A branchAdmin-only block rendered on the shared /home page (HomePage gates it
// on role === 'branchAdmin', so other roles are unaffected). Shows LIVE
// branch-scoped data from the shared mock store via services/branchAdminService:
// today branch operations summary, branch alerts, pending branch actions, and a
// department-wise quick snapshot. No backend / Firebase / API.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ClipboardList,
  Network,
  CalendarCheck,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { SectionCard, MetricCard, StatusBadge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as bas from '../../services/branchAdminService';

const SEVERITY = { warning: 'Late', danger: 'Review', info: 'Pending', accent: 'Checkout', success: 'OK' };

export default function BranchAdminHomePanel() {
  const { user } = useAuth();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const shifts = useCollection('shifts');
  const correctionRequests = useCollection('correctionRequests');

  const emps = useMemo(() => bas.branchEmployees(employees, user), [employees, user]);
  const branch = useMemo(() => bas.branchInfo(branches, user), [branches, user]);
  const overview = useMemo(
    () => bas.branchOverview(emps, attendance, { correctionRequests, departments, shifts }),
    [emps, attendance, correctionRequests, departments, shifts]
  );
  const deptSummary = useMemo(
    () => bas.departmentSummary(emps, departments, attendance, { correctionRequests, employees }),
    [emps, departments, attendance, correctionRequests, employees]
  );
  const alerts = useMemo(() => bas.branchAlerts(overview, deptSummary), [overview, deptSummary]);

  return (
    <>
      {/* Pending branch actions / live status reminder */}
      <SectionCard
        title="Branch live status"
        subtitle={branch ? `${branch.name} · ${branch.city}` : 'Your branch today'}
        icon={Building2}
        actions={<StatusBadge tone={overview.belowTarget ? 'warning' : 'success'} label={`${overview.attendanceRate}% attendance`} />}
      >
        <div className="ft-note" style={{ marginBottom: 12 }}>
          {overview.late || overview.pendingCorrections || overview.notCheckedOut ? (
            <>
              Today at your branch: <strong>{overview.late}</strong> late, <strong>{overview.pendingCorrections}</strong> pending
              correction{overview.pendingCorrections === 1 ? '' : 's'}, <strong>{overview.notCheckedOut}</strong> not checked out.
            </>
          ) : (
            <>All clear — your branch is on track today.</>
          )}
        </div>
        <div className="ft-toolbar">
          <Link to="/branch-admin/attendance" className="ft-btn ft-btn--primary">Review attendance</Link>
          <Link to="/branch-admin/employees" className="ft-btn ft-btn--subtle">Branch employees</Link>
          <Link to="/branch-admin/dashboard" className="ft-btn ft-btn--ghost">Open branch dashboard</Link>
        </div>
      </SectionCard>

      {/* Today branch operations summary */}
      <div className="ft-section-title-row" style={{ marginTop: 18 }}>
        <h3 className="ft-block-title">Today branch operations</h3>
        <span className="ft-cell-dim">Live from mock store</span>
      </div>
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Branch Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Check-ins" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardList} label="Pending Corrections" value={overview.pendingCorrections} tone="accent" />
        <MetricCard icon={CalendarCheck} label="Branch Attendance" value={`${overview.attendanceRate}%`} tone="primary" />
      </div>

      {/* Alerts + department-wise quick snapshot */}
      <div className="ft-grid-2" style={{ marginTop: 18 }}>
        <SectionCard title="Branch Alerts" subtitle="Things that may need attention" icon={AlertTriangle}>
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
          actions={<Link to="/branch-admin/dashboard" className="ft-btn ft-btn--ghost ft-btn--sm">View all</Link>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deptSummary.length ? (
              deptSummary.map((d) => (
                <div key={d.id} className="ft-scan-row">
                  <span className="ft-scan-row-label">
                    {d.name} <span className="ft-cell-dim">· {d.total} emp</span>
                  </span>
                  <StatusBadge tone={d.needsReview ? 'danger' : d.attendanceRate >= 90 ? 'success' : 'warning'} label={`${d.attendanceRate}%`} />
                </div>
              ))
            ) : (
              <span className="ft-cell-dim">No departments at this branch yet.</span>
            )}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
