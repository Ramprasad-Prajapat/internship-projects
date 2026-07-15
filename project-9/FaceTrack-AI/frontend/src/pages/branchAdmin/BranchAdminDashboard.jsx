// FaceTrack AI — Branch Admin Dashboard (Branch Operations + Attendance Control Center).
//
// Frontend-only: every number/list is derived from the SHARED mock store via
// services/branchAdminService (which reuses services/selectors + the store) —
// no backend, no Firebase, no API, no duplicate mock-data system. Scope is
// BRANCH-level (deliberately different from the org-wide HR and team-level
// Manager dashboards). Reuses the existing UI component library + the existing
// role-prefixed branch routes so nothing is a dead end. Branch CRUD stays on the
// existing Employees / Departments / Shifts / Attendance pages.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ClipboardList,
  Network,
  CalendarCheck,
  FileBarChart,
  MapPin,
  Database,
  AlertTriangle,
  UserCircle,
  Settings as SettingsIcon,
  Timer,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterChips,
  MockDataNotice,
  ConnectedNextActions,
} from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { byId } from '../../services/selectors';
import * as bas from '../../services/branchAdminService';

// Short severity word per alert tone.
const SEVERITY = { warning: 'Late', danger: 'Review', info: 'Pending', accent: 'Checkout', success: 'OK' };

const DEPT_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'review', label: 'Needs review' },
];

const to12h = (t) => {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hh = parseInt(h, 10);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${hh % 12 || 12}:${m} ${ampm}`;
};

export default function BranchAdminDashboard() {
  const { user } = useAuth();

  // Shared store collections (reactive) — same data the rest of the app uses.
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const shifts = useCollection('shifts');
  const correctionRequests = useCollection('correctionRequests');
  const leaveRequests = useCollection('leaveRequests');
  const faceRegistrations = useCollection('faceRegistrations');

  // --- derived branch data (all via the branch-admin service) ---
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
  const shiftRows = useMemo(() => bas.shiftSummary(emps, shifts, attendance), [emps, shifts, attendance]);
  const alerts = useMemo(() => bas.branchAlerts(overview, deptSummary), [overview, deptSummary]);
  const activity = useMemo(
    () => bas.branchActivity(emps, { employees, attendance, leaveRequests, correctionRequests, faceRegistrations }),
    [emps, employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );

  // Branch Admin's own identity for the welcome card.
  const me = byId(employees, user?.employeeId);
  const branchName = branch?.name || 'Branch';
  const branchCity = branch?.city || '—';

  /* ---------------- department summary (search + filter) ---------------- */
  const [deptQuery, setDeptQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const filteredDepts = useMemo(() => {
    const q = deptQuery.trim().toLowerCase();
    return deptSummary.filter((d) => {
      if (deptFilter === 'review' && !d.needsReview) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || (d.head || '').toLowerCase().includes(q);
    });
  }, [deptSummary, deptQuery, deptFilter]);

  const deptActions = (
    <div className="ft-cell-actions">
      <Link to="/branch-admin/employees" className="ft-icon-btn" title="View Employees" aria-label="View branch employees">
        <Users size={16} />
      </Link>
      <Link to="/branch-admin/attendance" className="ft-icon-btn" title="View Attendance" aria-label="View branch attendance">
        <CalendarCheck size={16} />
      </Link>
    </div>
  );

  const deptColumns = [
    { key: 'name', label: 'Department', sortValue: (d) => d.name, render: (d) => <span className="ft-cell-strong">{d.name}</span> },
    { key: 'head', label: 'Head', sortable: false, render: (d) => <span className="ft-cell-dim">{d.head}</span> },
    { key: 'total', label: 'Employees', align: 'right', sortValue: (d) => d.total, render: (d) => d.total },
    { key: 'present', label: 'Present', align: 'right', sortValue: (d) => d.present, render: (d) => d.present },
    { key: 'absent', label: 'Absent', align: 'right', sortValue: (d) => d.absent, render: (d) => d.absent },
    { key: 'late', label: 'Late', align: 'right', sortValue: (d) => d.late, render: (d) => d.late },
    { key: 'correctionsPending', label: 'Corrections', align: 'right', sortValue: (d) => d.correctionsPending, render: (d) => d.correctionsPending },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      align: 'center',
      sortValue: (d) => d.attendanceRate,
      render: (d) => <StatusBadge tone={d.needsReview ? 'danger' : d.attendanceRate >= 90 ? 'success' : 'warning'} label={`${d.attendanceRate}%`} />,
    },
    { key: 'actions', label: 'Actions', align: 'right', sortable: false, render: () => deptActions },
  ];

  const shiftColumns = [
    { key: 'name', label: 'Shift', sortValue: (s) => s.name, render: (s) => <span className="ft-cell-strong">{s.name}</span> },
    { key: 'timing', label: 'Timing', sortable: false, render: (s) => `${to12h(s.start)} – ${to12h(s.end)}` },
    { key: 'grace', label: 'Grace', align: 'right', sortable: false, render: (s) => `${s.graceMinutes}m` },
    { key: 'assigned', label: 'Assigned', align: 'right', sortValue: (s) => s.assigned, render: (s) => s.assigned },
    { key: 'lateToday', label: 'Late Today', align: 'right', sortValue: (s) => s.lateToday, render: (s) => s.lateToday },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      align: 'center',
      sortValue: (s) => s.attendanceRate,
      render: (s) => <StatusBadge tone={s.attendanceRate >= 90 ? 'success' : s.attendanceRate >= 80 ? 'warning' : 'danger'} label={`${s.attendanceRate}%`} />,
    },
    { key: 'status', label: 'Status', align: 'center', sortable: false, render: (s) => <StatusBadge tone={s.status === 'active' ? 'success' : 'muted'} label={s.status === 'active' ? 'Active' : 'Inactive'} /> },
    { key: 'actions', label: 'Actions', align: 'right', sortable: false, render: () => deptActions },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Branch Admin Dashboard"
        subtitle="Branch Operations + Attendance Control Center"
        actions={<MockDataNotice variant="badge" title="Mock mode" icon={Database} />}
      />

      {/* Welcome / identity */}
      <SectionCard>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
            <Avatar name={user?.name || 'Branch Admin'} color={user?.avatarColor} size="lg" />
            <div>
              <h2 className="ft-cell-strong" style={{ fontSize: '1.3rem', margin: 0 }}>Welcome back, {user?.name || 'Branch Admin'}</h2>
              <div style={{ color: 'var(--ft-text-dim)', fontSize: '0.92rem', marginTop: 4 }}>
                {me?.designation || 'Branch Administrator'} · {branchName} · {branchCity}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employees</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{overview.totalEmployees}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ft-primary)' }}>{overview.attendanceRate}%</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Branch-focused KPI cards */}
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Branch Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" delta={{ dir: 'up', text: `${overview.attendanceRate}% attendance` }} />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Check-ins" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardList} label="Pending Corrections" value={overview.pendingCorrections} tone="warning" />
        <MetricCard icon={Network} label="Departments" value={overview.departmentsActive} tone="accent" />
        <MetricCard icon={Timer} label="Active Shifts" value={overview.shiftsActive} tone="primary" />
        <MetricCard icon={CalendarCheck} label="Branch Attendance" value={`${overview.attendanceRate}%`} tone="accent" />
      </div>

      {/* Branch location / radius status + Branch alerts */}
      <div className="ft-grid-2">
        <SectionCard title="Branch Location & Radius" subtitle="Mock geofence status (no real GPS)" icon={MapPin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            <Row label="Branch"><span style={{ fontWeight: 600 }}>{branchName}</span></Row>
            <Row label="Branch ID"><span style={{ fontWeight: 600 }}>{branch?.id || '—'}</span></Row>
            <Row label="City"><span style={{ fontWeight: 600 }}>{branchCity}</span></Row>
            <Row label="Address"><span className="ft-cell-dim">{branch?.address || '—'}</span></Row>
            <Row label="Allowed Radius"><span style={{ fontWeight: 600 }}>{branch?.radiusMeters ? `${branch.radiusMeters}m` : '150m'}</span></Row>
            <Row label="Location Rule"><StatusBadge tone="success" label="Active" /></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
          <div className="ft-toolbar" style={{ marginTop: 14 }}>
            <Link to="/branch-admin/settings" className="ft-btn ft-btn--subtle">
              <SettingsIcon size={16} /> Manage radius in Settings
            </Link>
          </div>
        </SectionCard>

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
      </div>

      {/* Department-wise branch summary */}
      <SectionCard title="Department Summary" subtitle="Department-wise branch attendance (today)" icon={Network}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={deptQuery} onChange={setDeptQuery} placeholder="Search department or head..." />
          </div>
          <FilterChips value={deptFilter} onChange={setDeptFilter} options={DEPT_FILTER_OPTIONS} />
        </div>
        <DataTable
          columns={deptColumns}
          rows={filteredDepts}
          rowKey="id"
          initialSort={{ key: 'attendanceRate', dir: 'asc' }}
          emptyIcon={Network}
          emptyMessage="No departments match these filters."
        />
      </SectionCard>

      {/* Shift-wise branch summary */}
      <SectionCard title="Shift Summary" subtitle="Branch shifts, assignment & attendance (today)" icon={Timer}>
        <DataTable
          columns={shiftColumns}
          rows={shiftRows}
          rowKey="id"
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyIcon={Timer}
          emptyMessage="No shifts in use at this branch."
        />
      </SectionCard>

      {/* Branch attendance snapshot + activity timeline */}
      <div className="ft-grid-2">
        <SectionCard title="Branch Attendance Snapshot" subtitle="Today, this branch" icon={CalendarCheck}>
          <div className="ft-meta-grid">
            <Meta k="Present" v={overview.present} />
            <Meta k="On Time" v={overview.onTime} />
            <Meta k="Late" v={overview.late} />
            <Meta k="Absent" v={overview.absent} />
            <Meta k="On Leave" v={overview.onLeave} />
            <Meta k="Not Checked-in" v={overview.notMarked} />
            <Meta k="Not Checked-out" v={overview.notCheckedOut} />
            <Meta k="Attendance %" v={`${overview.attendanceRate}%`} />
          </div>
        </SectionCard>

        <RecentActivity items={activity} title="Branch Activity Timeline" />
      </div>

      {/* Quick actions — valid branch routes only */}
      <ConnectedNextActions
        title="Branch Quick Actions"
        actions={[
          { icon: Users, label: 'Branch employees', hint: 'Roster & profiles', to: '/branch-admin/employees', tone: 'primary' },
          { icon: CalendarCheck, label: 'Review attendance', hint: 'Branch records', to: '/branch-admin/attendance', tone: 'success' },
          { icon: Network, label: 'Manage departments', hint: 'Branch departments', to: '/branch-admin/departments', tone: 'accent' },
          { icon: Timer, label: 'Manage shifts', hint: 'Branch shifts', to: '/branch-admin/shifts', tone: 'warning' },
          { icon: FileBarChart, label: 'Branch reports', hint: 'Export & analytics', to: '/branch-admin/reports', tone: 'primary' },
          { icon: UserCircle, label: 'Branch profile', hint: 'Identity & authority', to: '/branch-admin/profile', tone: 'accent' },
        ]}
      />

      <div className="ft-note">
        <strong>Frontend-only mock mode.</strong> All branch data comes from the shared mock store
        (<code>src/data/</code> seeded into <code>localStorage</code>). No backend / Firebase / API / real GPS.
      </div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>{label}</span>
      {children}
    </div>
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
