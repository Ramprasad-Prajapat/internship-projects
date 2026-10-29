// FaceTrack AI — Super Admin Home panel (frontend-only mode).
//
// A superAdmin-only block rendered on the shared /home page (HomePage gates it on
// role === 'superAdmin', so other roles are unaffected). Shows LIVE global data
// from the shared mock store via services/superAdminService: global platform
// summary, system alerts, pending global actions, a branch performance snapshot,
// and data-quality warnings. No backend / Firebase / API.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Network,
  Users,
  UserCheck,
  Clock,
  ClipboardList,
  Activity,
  AlertTriangle,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { SectionCard, MetricCard, StatusBadge } from '../../components/ui';
import { useCollection } from '../../hooks/useStore';
import * as sa from '../../services/superAdminService';

const SEVERITY = { danger: 'Critical', warning: 'Warning', info: 'Info', accent: 'Review', success: 'OK' };

export default function SuperAdminHomePanel() {
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const suspiciousScans = useCollection('suspiciousScans');

  const overview = useMemo(
    () => sa.globalOverview(employees, attendance, { branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans }),
    [employees, attendance, branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans]
  );
  const branchPerf = useMemo(() => sa.branchPerformance(employees, branches, attendance, { correctionRequests }), [employees, branches, attendance, correctionRequests]);
  const dataQuality = useMemo(() => sa.dataQuality(employees, branches, departments, shifts, { faceRegistrations }), [employees, branches, departments, shifts, faceRegistrations]);
  const health = useMemo(() => sa.platformHealth(overview, dataQuality, branchPerf), [overview, dataQuality, branchPerf]);
  const alerts = useMemo(() => sa.systemAlerts(overview, branchPerf, dataQuality), [overview, branchPerf, dataQuality]);

  const warnings = useMemo(() => dataQuality.filter((c) => c.count > 0), [dataQuality]);

  return (
    <>
      {/* Pending global actions / platform reminder */}
      <SectionCard
        title="Global platform status"
        subtitle="All branches at a glance"
        icon={ShieldCheck}
        actions={<StatusBadge tone={health >= 90 ? 'success' : health >= 75 ? 'warning' : 'danger'} label={`Health ${health}%`} />}
      >
        <div className="ft-note" style={{ marginBottom: 12 }}>
          {overview.pendingRequests || overview.late ? (
            <>
              Across {overview.totalBranches} branches: <strong>{overview.pendingRequests}</strong> pending request{overview.pendingRequests === 1 ? '' : 's'},
              {' '}<strong>{overview.late}</strong> late today, <strong>{overview.suspiciousAlerts}</strong> suspicious scan{overview.suspiciousAlerts === 1 ? '' : 's'}.
            </>
          ) : (
            <>All clear — the platform is healthy with no pending global actions.</>
          )}
        </div>
        <div className="ft-toolbar">
          <Link to="/super-admin/dashboard" className="ft-btn ft-btn--primary">Open control center</Link>
          <Link to="/super-admin/reports" className="ft-btn ft-btn--subtle">Global reports</Link>
          <Link to="/super-admin/audit-logs" className="ft-btn ft-btn--subtle">Audit logs</Link>
        </div>
      </SectionCard>

      {/* Global platform summary */}
      <div className="ft-section-title-row" style={{ marginTop: 18 }}>
        <h3 className="ft-block-title">Global platform summary</h3>
        <span className="ft-cell-dim">Live from mock store</span>
      </div>
      <div className="ft-kpi-grid">
        <MetricCard icon={Building2} label="Total Branches" value={overview.totalBranches} tone="primary" />
        <MetricCard icon={Network} label="Departments" value={overview.totalDepartments} tone="accent" />
        <MetricCard icon={Users} label="Total Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" />
        <MetricCard icon={Clock} label="Late Today" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardList} label="Pending Requests" value={overview.pendingRequests} tone="accent" />
      </div>

      {/* System alerts + branch performance snapshot */}
      <div className="ft-grid-2" style={{ marginTop: 18 }}>
        <SectionCard title="System Alerts" subtitle="Platform-wide" icon={AlertTriangle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.slice(0, 6).map((a) => (
              <div key={a.id} className="ft-scan-row">
                <span className="ft-scan-row-label">{a.title}</span>
                <StatusBadge tone={a.severity} label={SEVERITY[a.severity] || 'Info'} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Branch performance"
          subtitle="Attendance % by branch (today)"
          icon={MapPin}
          actions={<Link to="/super-admin/dashboard" className="ft-btn ft-btn--ghost ft-btn--sm">View all</Link>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {branchPerf.map((b) => (
              <div key={b.id} className="ft-scan-row">
                <span className="ft-scan-row-label">
                  {b.name} <span className="ft-cell-dim">· {b.city}</span>
                </span>
                <StatusBadge tone={b.needsReview ? 'danger' : b.attendanceRate >= 95 ? 'success' : 'warning'} label={`${b.attendanceRate}%`} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Data quality warnings */}
      <div style={{ marginTop: 18 }}>
        <SectionCard title="Data quality warnings" subtitle="Missing setup / integrity checks" icon={Activity}>
          {warnings.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {warnings.map((c) => (
                <StatusBadge key={c.key} tone={c.tone} label={`${c.label}: ${c.count}`} />
              ))}
            </div>
          ) : (
            <span className="ft-cell-dim">No data-quality issues — everything looks set up correctly.</span>
          )}
        </SectionCard>
      </div>
    </>
  );
}
