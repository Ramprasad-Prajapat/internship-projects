// FaceTrack AI — DashboardShell (overhaul).
// Role-aware dashboard: live KPI metrics, charts and recent activity derived
// from the mock store. Employees get a self-service view; manager/HR/admin get
// a team/org overview with pending action items.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Timer,
  ShieldAlert,
  ScanFace,
  ClipboardList,
  CalendarCheck,
  Camera,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../common/PageHeader';
import SectionCard from '../common/SectionCard';
import MetricCard from '../cards/MetricCard';
import StatusBadge from '../common/StatusBadge';
import DonutChart from '../charts/DonutChart';
import TrendChart from '../charts/TrendChart';
import BarChart from '../charts/BarChart';
import RecentActivity from './RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { ROLES, ROLE_BASE, ATTENDANCE_STATUS } from '../../utils/constants';
import {
  scopeEmployees,
  scopeAttendance,
  dashboardMetrics,
  presentAbsentSeries,
  attendanceTrend,
  departmentBreakdown,
  employeeMonthSummary,
  byId,
  nameOf,
} from '../../services/selectors';
import { todayISO, monthLabel } from '../../utils/dateUtils';

export default function DashboardShell({ title, subtitle }) {
  const { user, role } = useAuth();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const suspiciousScans = useCollection('suspiciousScans');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');

  const scopedEmployees = useMemo(() => scopeEmployees(employees, user), [employees, user]);
  const scopedAtt = useMemo(() => scopeAttendance(attendance, scopedEmployees), [attendance, scopedEmployees]);

  const metrics = useMemo(
    () =>
      dashboardMetrics({
        employees: scopedEmployees,
        attendance: scopedAtt,
        suspiciousScans,
        correctionRequests,
        faceRegistrations,
      }),
    [scopedEmployees, scopedAtt, suspiciousScans, correctionRequests, faceRegistrations]
  );

  const donut = useMemo(() => presentAbsentSeries(scopedAtt), [scopedAtt]);
  const trend = useMemo(() => attendanceTrend(scopedAtt, 7), [scopedAtt]);
  const deptBars = useMemo(() => departmentBreakdown(scopedEmployees, departments), [scopedEmployees, departments]);
  const selfSummary = useMemo(
    () => employeeMonthSummary(attendance, user?.employeeId),
    [attendance, user?.employeeId]
  );

  const recent = useMemo(() => {
    const today = todayISO();
    return scopedAtt
      .filter((a) => a.date === today && a.checkIn)
      .sort((a, b) => String(b.checkIn).localeCompare(String(a.checkIn)))
      .slice(0, 6)
      .map((a) => ({
        text: `${nameOf(employees, a.employeeId)} ${a.status === 'late' ? 'checked in late' : 'checked in'}`,
        time: a.checkIn,
        color: a.status === 'late' ? 'var(--ft-yellow)' : 'var(--ft-green)',
      }));
  }, [scopedAtt, employees]);

  const base = ROLE_BASE[role];

  /* ---------------- employee view ---------------- */
  if (role === ROLES.EMPLOYEE) {
    const selfAtt = attendance
      .filter((a) => a.employeeId === user?.employeeId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
    return (
      <section className="ft-page">
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={
            <Link to={`${base}/mark-attendance`} className="ft-btn ft-btn--primary">
              <Camera size={16} /> Mark Attendance
            </Link>
          }
        />
        <div className="ft-kpi-grid">
          <MetricCard icon={CalendarCheck} label="Status Today" value={selfSummary.statusToday} tone={selfSummary.tone} />
          <MetricCard icon={Clock} label="Check-in" value={selfSummary.checkIn} tone="primary" />
          <MetricCard icon={UserCheck} label="Present (Month)" value={selfSummary.presentDays} tone="success" />
          <MetricCard icon={Clock} label="Late (Month)" value={selfSummary.lateDays} tone="warning" />
          <MetricCard icon={Timer} label="Overtime (hrs)" value={selfSummary.overtimeHours} tone="accent" />
          <MetricCard icon={UserX} label="Absent (Month)" value={selfSummary.absentDays} tone="danger" />
        </div>

        <div className="ft-grid-2">
          <SectionCard title="Recent attendance" subtitle={monthLabel()}>
            {selfAtt.length ? (
              <ul className="ft-activity-list">
                {selfAtt.map((a) => (
                  <li key={a.id} className="ft-activity-item">
                    <StatusBadge map={ATTENDANCE_STATUS} value={a.status} />
                    <span className="ft-activity-text" style={{ marginLeft: 8 }}>
                      {a.date}
                    </span>
                    <span className="ft-activity-time">
                      {a.checkIn || '—'} – {a.checkOut || '—'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ft-cell-dim">No records yet this month.</p>
            )}
          </SectionCard>
          <SectionCard title="This month" subtitle="Summary">
            <div className="ft-meta-grid">
              <Meta k="Present days" v={selfSummary.presentDays} />
              <Meta k="Late days" v={selfSummary.lateDays} />
              <Meta k="Absent days" v={selfSummary.absentDays} />
              <Meta k="Leave days" v={selfSummary.leaveDays} />
              <Meta k="Overtime" v={`${selfSummary.overtimeHours}h`} />
              <Meta k="Today" v={selfSummary.statusToday} />
            </div>
            <div className="ft-note" style={{ marginTop: 14 }}>
              <strong>Frontend-only demo.</strong> All numbers come from mock data in <code>src/data/</code>.
            </div>
          </SectionCard>
        </div>
      </section>
    );
  }

  /* ---------------- manager / HR / admin / super view ---------------- */
  const actionItems = [
    { show: metrics.pendingFaceApprovals > 0, icon: ScanFace, label: 'Pending face approvals', value: metrics.pendingFaceApprovals, to: `${base}/face-approvals`, tone: 'info' },
    { show: metrics.pendingCorrections > 0, icon: ClipboardList, label: 'Correction requests', value: metrics.pendingCorrections, to: `${base}/correction-requests`, tone: 'warning' },
    { show: metrics.suspiciousAlerts > 0, icon: ShieldAlert, label: 'Suspicious scans', value: metrics.suspiciousAlerts, to: `${base}/suspicious-scans`, tone: 'danger' },
  ].filter((a) => a.show);

  return (
    <section className="ft-page">
      <PageHeader title={title} subtitle={subtitle} />

      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Total Employees" value={metrics.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={metrics.present} tone="success" delta={{ dir: 'up', text: `${metrics.attendanceRate}% attendance` }} />
        <MetricCard icon={UserX} label="Absent" value={metrics.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late" value={metrics.late} tone="warning" />
        <MetricCard icon={Timer} label="Overtime" value={metrics.overtime} tone="accent" />
        <MetricCard icon={ShieldAlert} label="Alerts" value={metrics.suspiciousAlerts} tone="danger" />
      </div>

      {actionItems.length ? (
        <SectionCard title="Action items" subtitle="Pending things that need your attention">
          <div className="ft-grid-3">
            {actionItems.map((a) => (
              <Link key={a.label} to={a.to} className="ft-scan-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="ft-scan-row-label">
                  <a.icon size={17} /> {a.label}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <StatusBadge tone={a.tone} label={a.value} plain />
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <div className="ft-grid-2">
        <SectionCard title="Today's attendance" subtitle="Status distribution">
          <DonutChart data={donut} centerLabel="Marked" />
        </SectionCard>
        <SectionCard title="Attendance trend" subtitle="Last 7 days">
          <TrendChart
            labels={trend.map((t) => t.label)}
            series={[
              { name: 'Present', color: 'var(--ft-green)', values: trend.map((t) => t.present) },
              { name: 'Absent', color: 'var(--ft-red)', values: trend.map((t) => t.absent) },
            ]}
          />
        </SectionCard>
      </div>

      <div className="ft-grid-2">
        <SectionCard title="Headcount by department">
          <BarChart data={deptBars.map((d) => ({ ...d, color: 'var(--ft-primary)' }))} />
        </SectionCard>
        <RecentActivity items={recent} title="Recent check-ins" />
      </div>
    </section>
  );
}

function Meta({ k, v }) {
  return (
    <div className="ft-meta-item">
      <span className="ft-meta-key">{k}</span>
      <span className="ft-meta-val">{v}</span>
    </div>
  );
}
