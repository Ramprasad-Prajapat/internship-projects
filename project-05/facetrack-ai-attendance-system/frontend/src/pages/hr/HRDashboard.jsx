// FaceTrack AI — HR Dashboard (People Operations + Attendance Control Center).
//
// Frontend-only: every number/list is derived from the SHARED mock store via
// services/hrService (which reuses services/selectors + services/mockStore) —
// no backend, no Firebase, no API, no duplicate mock-data system. HR scope is
// ORG-WIDE + DEPARTMENT-level (deliberately different from the team-level
// Manager dashboard). Inline leave approve/reject persists to localStorage
// through the store and writes an audit log; corrections + face approvals link
// to their dedicated review pages (which keep their richer flows). Reuses the
// existing UI component library + the existing role-prefixed HR routes so
// nothing is a dead end.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  ClipboardList,
  ScanFace,
  Network,
  FileBarChart,
  CalendarCheck,
  Check,
  X,
  Database,
  AlertTriangle,
  Plus,
  ClipboardCheck,
  ArrowRight,
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
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { byId, nameOf } from '../../services/selectors';
import * as hr from '../../services/hrService';
import { REQUEST_STATUS } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';

// Short severity word per alert tone.
const SEVERITY = { warning: 'Late', danger: 'Review', info: 'Pending', accent: 'Face', success: 'OK' };

const DEPT_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'review', label: 'Needs review' },
];

export default function HRDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  // Shared store collections (reactive) — same data the rest of the app uses.
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const suspiciousScans = useCollection('suspiciousScans');

  // --- derived org/department data (all via the HR service) ---
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
  const activity = useMemo(
    () => hr.hrActivity({ employees, attendance, leaveRequests, correctionRequests, faceRegistrations }),
    [employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );

  // HR's own identity for the welcome card.
  const me = byId(employees, user?.employeeId);
  const myDept = byId(departments, me?.departmentId)?.name || 'Human Resources';
  const myBranch = byId(branches, me?.branchId)?.name || '—';

  /* ---------------- department snapshot (search + filter) ---------------- */
  const [deptQuery, setDeptQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const filteredDepts = useMemo(() => {
    const q = deptQuery.trim().toLowerCase();
    return deptSummary.filter((d) => {
      if (deptFilter === 'review' && !d.needsReview) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q);
    });
  }, [deptSummary, deptQuery, deptFilter]);

  const deptColumns = [
    { key: 'name', label: 'Department', sortValue: (d) => d.name, render: (d) => <span className="ft-cell-strong">{d.name}</span> },
    { key: 'total', label: 'Employees', align: 'right', sortValue: (d) => d.total, render: (d) => d.total },
    { key: 'present', label: 'Present', align: 'right', sortValue: (d) => d.present, render: (d) => d.present },
    { key: 'absent', label: 'Absent', align: 'right', sortValue: (d) => d.absent, render: (d) => d.absent },
    { key: 'late', label: 'Late', align: 'right', sortValue: (d) => d.late, render: (d) => d.late },
    { key: 'leaveRequests', label: 'Leave', align: 'right', sortValue: (d) => d.leaveRequests, render: (d) => d.leaveRequests },
    { key: 'correctionsPending', label: 'Corrections', align: 'right', sortValue: (d) => d.correctionsPending, render: (d) => d.correctionsPending },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      align: 'center',
      sortValue: (d) => d.attendanceRate,
      render: (d) => (
        <StatusBadge tone={d.needsReview ? 'danger' : d.attendanceRate >= 90 ? 'success' : 'warning'} label={`${d.attendanceRate}%`} />
      ),
    },
    {
      key: 'flag',
      label: 'Flag',
      align: 'right',
      sortable: false,
      render: (d) => (d.needsReview ? <StatusBadge tone="danger" label="Review" /> : <StatusBadge tone="success" label="OK" />),
    },
  ];

  /* ---------------- pending leave approvals (inline approve/reject) ---------------- */
  const [leaveQuery, setLeaveQuery] = useState('');
  const [reqStatus, setReqStatus] = useState('pending');

  const leaveRows = useMemo(() => {
    const q = leaveQuery.trim().toLowerCase();
    return leaveRequests.filter((r) => {
      if (reqStatus && r.status !== reqStatus) return false;
      if (!q) return true;
      return nameOf(employees, r.employeeId).toLowerCase().includes(q);
    });
  }, [leaveRequests, employees, reqStatus, leaveQuery]);

  const decideLeave = (req, decision) => {
    hr.decideLeave(req, decision, user, employees);
    toast.success(decision === 'approved' ? 'Leave approved' : 'Leave rejected');
  };

  const employeeCell = (emp) => (
    <div className="ft-id-cell">
      <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
      <div>
        <div className="ft-id-name">{emp.name}</div>
        <div className="ft-id-sub">{emp.employeeCode || emp.id}</div>
      </div>
    </div>
  );

  const leaveColumns = [
    { key: 'employee', label: 'Employee', sortValue: (r) => nameOf(employees, r.employeeId), render: (r) => employeeCell(byId(employees, r.employeeId) || { name: 'Unknown', id: r.employeeId }) },
    { key: 'leaveType', label: 'Type', render: (r) => <StatusBadge tone="accent" label={r.leaveType} /> },
    { key: 'dates', label: 'Dates', sortValue: (r) => r.startDate, render: (r) => <span className="ft-cell-strong">{prettyDate(r.startDate)} – {prettyDate(r.endDate)}</span> },
    { key: 'reason', label: 'Reason', sortable: false, render: (r) => <span className="ft-cell-dim">{r.reason || '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge map={REQUEST_STATUS} value={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (r) =>
        r.status !== 'pending' ? (
          <span className="ft-cell-dim">Reviewed</span>
        ) : (
          <div className="ft-cell-actions">
            <button type="button" className="ft-btn ft-btn--success ft-btn--sm" onClick={() => decideLeave(r, 'approved')}>
              <Check size={14} /> Approve
            </button>
            <button type="button" className="ft-btn ft-btn--danger ft-btn--sm" onClick={() => decideLeave(r, 'rejected')}>
              <X size={14} /> Reject
            </button>
          </div>
        ),
    },
  ];

  const REQUEST_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: '', label: 'All' },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="HR Dashboard"
        subtitle="People Operations + Attendance Control Center"
        actions={<MockDataNotice variant="badge" title="Mock mode" icon={Database} />}
      />

      {/* Welcome / identity */}
      <SectionCard>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
            <Avatar name={user?.name || 'HR'} color={user?.avatarColor} size="lg" />
            <div>
              <h2 className="ft-cell-strong" style={{ fontSize: '1.3rem', margin: 0 }}>Welcome back, {user?.name || 'HR'}</h2>
              <div style={{ color: 'var(--ft-text-dim)', fontSize: '0.92rem', marginTop: 4 }}>
                {me?.designation || 'HR Manager'} · Org-wide HR · {myDept} · {myBranch}
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

      {/* HR-focused KPI cards */}
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Total Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" delta={{ dir: 'up', text: `${overview.attendanceRate}% attendance` }} />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Check-ins" value={overview.late} tone="warning" />
        <MetricCard icon={CalendarDays} label="Leave Requests" value={overview.pendingLeaves} tone="accent" />
        <MetricCard icon={ClipboardList} label="Pending Corrections" value={overview.pendingCorrections} tone="warning" />
        <MetricCard icon={ScanFace} label="Face Approvals" value={overview.pendingFaceApprovals} tone="primary" />
        <MetricCard icon={Network} label="Departments" value={overview.departmentsActive} tone="accent" />
      </div>

      {/* Department Attendance Snapshot */}
      <SectionCard title="Department Operations" subtitle="Department-wise attendance & pending requests (today)" icon={Network}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={deptQuery} onChange={setDeptQuery} placeholder="Search department..." />
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

      {/* Alerts + HR activity timeline */}
      <div className="ft-grid-2">
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

        <RecentActivity items={activity} title="HR Activity Timeline" />
      </div>

      {/* Pending Action Queue */}
      <SectionCard
        title="Pending Action Queue"
        subtitle="Leave approvals — approve or reject inline (saved to mock store)"
        icon={ClipboardCheck}
        actions={<StatusBadge tone={overview.pendingActions ? 'warning' : 'success'} label={`${overview.pendingActions} pending`} />}
      >
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={leaveQuery} onChange={setLeaveQuery} placeholder="Search by employee name..." />
          </div>
          <FilterChips value={reqStatus} onChange={setReqStatus} options={REQUEST_STATUS_OPTIONS} />
        </div>
        <DataTable
          columns={leaveColumns}
          rows={leaveRows}
          rowKey="id"
          pageSize={6}
          initialSort={{ key: 'dates', dir: 'desc' }}
          emptyIcon={CalendarDays}
          emptyMessage="No leave requests for this filter."
        />
        <div className="ft-toolbar" style={{ marginTop: 14 }}>
          <Link to="/hr/correction-requests" className="ft-btn ft-btn--subtle">
            <ClipboardList size={16} /> Review corrections ({overview.pendingCorrections}) <ArrowRight size={14} />
          </Link>
          <Link to="/hr/face-approvals" className="ft-btn ft-btn--subtle">
            <ScanFace size={16} /> Face approvals ({overview.pendingFaceApprovals}) <ArrowRight size={14} />
          </Link>
        </div>
      </SectionCard>

      {/* Quick actions */}
      <ConnectedNextActions
        title="HR Quick Actions"
        actions={[
          { icon: Plus, label: 'Add / View employees', hint: 'People records', to: '/hr/employees', tone: 'primary' },
          { icon: CalendarCheck, label: 'Review attendance', hint: 'Org-wide records', to: '/hr/attendance', tone: 'success' },
          { icon: CalendarDays, label: 'Approve leave', hint: 'Leave requests', to: '/hr/leave-requests', tone: 'accent' },
          { icon: ClipboardList, label: 'Review corrections', hint: 'Attendance fixes', to: '/hr/correction-requests', tone: 'warning' },
          { icon: ScanFace, label: 'Face approvals', hint: 'Registration queue', to: '/hr/face-approvals', tone: 'primary' },
          { icon: Network, label: 'Departments', hint: 'Department operations', to: '/hr/departments', tone: 'accent' },
          { icon: FileBarChart, label: 'Generate reports', hint: 'Export & analytics', to: '/hr/reports', tone: 'primary' },
        ]}
      />

      <div className="ft-note">
        <strong>Frontend-only mock mode.</strong> All people-operations data comes from the shared mock store
        (<code>src/data/</code> seeded into <code>localStorage</code>). Approvals persist locally; no backend / Firebase / API.
      </div>
    </section>
  );
}
