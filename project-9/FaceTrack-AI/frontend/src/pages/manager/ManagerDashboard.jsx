// FaceTrack AI — Manager Dashboard (Team Monitoring + Approval).
//
// Frontend-only: every number/list is derived from the SHARED mock store via
// services/managerService (which reuses services/selectors + services/mockStore)
// — no backend, no Firebase, no API, no duplicate mock-data system. Approve /
// reject actions persist to localStorage through the store and write audit logs.
// Reuses the existing UI component library + the existing role-prefixed routes
// (/manager/employees/:id/profile, /manager/attendance) so nothing is a dead end.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ClipboardCheck,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  UserCircle,
  FileBarChart,
  Check,
  X,
  Database,
  AlertTriangle,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterSelect,
  FilterChips,
  MockDataNotice,
  ConnectedNextActions,
} from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { byId, nameOf } from '../../services/selectors';
import * as mgr from '../../services/managerService';
import {
  ATTENDANCE_STATUS,
  REQUEST_STATUS,
  CORRECTION_TYPES,
} from '../../utils/constants';
import { prettyDate, formatMinutes } from '../../utils/dateUtils';

const STATUS_FILTER_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'On Leave' },
  { value: 'notMarked', label: 'Not marked' },
];

const REQUEST_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

const QUEUE_OPTIONS = [
  { value: 'leave', label: 'Leave' },
  { value: 'correction', label: 'Correction' },
  { value: 'overtime', label: 'Overtime' },
];

// Short severity word per alert tone.
const SEVERITY = { warning: 'Late', danger: 'Urgent', info: 'Pending', accent: 'Overtime', success: 'OK' };

const correctionTypeLabel = (v) => CORRECTION_TYPES.find((t) => t.value === v)?.label || v || '—';

const STATE_BADGE = {
  late: { tone: 'warning', label: 'Late' },
  repeatedLate: { tone: 'danger', label: 'Repeated Late' },
  notCheckedIn: { tone: 'muted', label: 'Not Checked-in' },
};

export default function ManagerDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  // Shared store collections (reactive) — same data the rest of the app uses.
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const shifts = useCollection('shifts');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');

  // --- derived team data (all via the manager service) ---
  const team = useMemo(() => mgr.managerTeam(employees, user), [employees, user]);
  const overview = useMemo(
    () => mgr.teamOverview(team, attendance, { leaveRequests, correctionRequests }),
    [team, attendance, leaveRequests, correctionRequests]
  );
  const todayRows = useMemo(() => mgr.teamTodayRows(team, attendance), [team, attendance]);
  const lateMissing = useMemo(() => mgr.lateOrMissing(team, attendance, shifts), [team, attendance, shifts]);
  const monthly = useMemo(
    () => mgr.teamMonthlySnapshot(team, attendance, { leaveRequests, correctionRequests }),
    [team, attendance, leaveRequests, correctionRequests]
  );
  const activity = useMemo(
    () => mgr.teamActivity(team, { employees, attendance, leaveRequests, correctionRequests, faceRegistrations }),
    [team, employees, attendance, leaveRequests, correctionRequests, faceRegistrations]
  );
  const alerts = useMemo(() => mgr.teamAlerts(overview, lateMissing), [overview, lateMissing]);

  // Manager's own identity for the welcome card.
  const me = byId(employees, user?.employeeId);
  const myDept = byId(departments, me?.departmentId)?.name || '—';
  const myBranch = byId(branches, me?.branchId)?.name || '—';

  /* ---------------- today team attendance (search + filter) ---------------- */
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredToday = useMemo(() => {
    const q = query.trim().toLowerCase();
    return todayRows.filter(({ emp, row }) => {
      if (statusFilter) {
        if (statusFilter === 'notMarked' ? !!row : row?.status !== statusFilter) return false;
      }
      if (!q) return true;
      return emp.name.toLowerCase().includes(q) || (emp.employeeCode || '').toLowerCase().includes(q);
    });
  }, [todayRows, query, statusFilter]);

  const employeeCell = (emp) => (
    <div className="ft-id-cell">
      <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
      <div>
        <div className="ft-id-name">{emp.name}</div>
        <div className="ft-id-sub">{emp.employeeCode || emp.id}</div>
      </div>
    </div>
  );

  const todayColumns = [
    { key: 'employee', label: 'Employee', sortValue: (x) => x.emp.name, render: (x) => employeeCell(x.emp) },
    { key: 'id', label: 'Employee ID', render: (x) => <span className="ft-cell-dim">{x.emp.employeeCode || x.emp.id}</span> },
    { key: 'checkIn', label: 'Check-in', align: 'center', render: (x) => x.row?.checkIn || '—' },
    { key: 'checkOut', label: 'Check-out', align: 'center', render: (x) => x.row?.checkOut || '—' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortValue: (x) => x.row?.status || 'zzz',
      render: (x) => (x.row ? <StatusBadge map={ATTENDANCE_STATUS} value={x.row.status} /> : <span className="ft-cell-dim">Not marked</span>),
    },
    { key: 'late', label: 'Late', align: 'right', sortValue: (x) => x.row?.lateMinutes || 0, render: (x) => formatMinutes(x.row?.lateMinutes) },
    { key: 'hours', label: 'Hours', align: 'right', sortValue: (x) => x.row?.totalHours || 0, render: (x) => (x.row?.totalHours ? `${x.row.totalHours}h` : '—') },
    {
      key: 'confidence',
      label: 'Face',
      align: 'center',
      sortValue: (x) => x.row?.confidence || 0,
      render: (x) => (x.row?.confidence != null ? `${Math.round(x.row.confidence * 100)}%` : '—'),
    },
    {
      key: 'location',
      label: 'Location',
      align: 'center',
      sortable: false,
      render: (x) => {
        const loc = x.row?.location;
        if (!loc) return <span className="ft-cell-dim">—</span>;
        return loc.status === 'insideRadius' ? <StatusBadge tone="success" label="Inside" /> : <StatusBadge tone="danger" label="Outside" />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (x) => (
        <div className="ft-cell-actions">
          <Link to={`/manager/employees/${x.emp.id}/profile`} className="ft-icon-btn" title="View Profile" aria-label={`View profile of ${x.emp.name}`}>
            <UserCircle size={16} />
          </Link>
          <Link to="/manager/attendance" className="ft-icon-btn" title="View Attendance" aria-label="View team attendance">
            <CalendarCheck size={16} />
          </Link>
        </div>
      ),
    },
  ];

  /* ---------------- late / not-checked-in ---------------- */
  const lateColumns = [
    { key: 'employee', label: 'Employee', sortValue: (x) => x.emp.name, render: (x) => employeeCell(x.emp) },
    { key: 'shift', label: 'Shift', sortable: false, render: (x) => (x.shift ? `${x.shift.start} – ${x.shift.end}` : '—') },
    { key: 'checkIn', label: 'Check-in', align: 'center', render: (x) => x.row?.checkIn || '—' },
    { key: 'late', label: 'Late', align: 'right', sortValue: (x) => x.row?.lateMinutes || 0, render: (x) => formatMinutes(x.row?.lateMinutes) },
    { key: 'monthlyLate', label: 'Late (month)', align: 'right', sortValue: (x) => x.monthlyLate, render: (x) => x.monthlyLate },
    {
      key: 'state',
      label: 'Flag',
      align: 'right',
      sortable: false,
      render: (x) => <StatusBadge tone={STATE_BADGE[x.state]?.tone} label={STATE_BADGE[x.state]?.label} />,
    },
  ];

  /* ---------------- approvals ---------------- */
  const [queue, setQueue] = useState('leave');
  const [reqStatus, setReqStatus] = useState('pending');

  const teamIds = useMemo(() => new Set(team.map((e) => e.id)), [team]);

  const leaveRows = useMemo(
    () => leaveRequests.filter((r) => teamIds.has(r.employeeId) && (!reqStatus || r.status === reqStatus)),
    [leaveRequests, teamIds, reqStatus]
  );
  const correctionRows = useMemo(
    () => correctionRequests.filter((r) => teamIds.has(r.employeeId) && (!reqStatus || r.status === reqStatus)),
    [correctionRequests, teamIds, reqStatus]
  );
  // Overtime now mirrors the leave/correction queues: filterable by status so a
  // decided overtime stays visible (with a "Reviewed" state) instead of vanishing.
  const overtimeRows = useMemo(() => mgr.teamOvertimeRows(team, attendance, reqStatus), [team, attendance, reqStatus]);

  const decideLeave = (req, decision) => {
    mgr.decideLeave(req, decision, user);
    toast.success(decision === 'approved' ? 'Leave approved' : 'Leave rejected');
  };
  const decideCorrection = (req, decision) => {
    mgr.decideCorrection(req, decision, user);
    toast.success(decision === 'approved' ? 'Correction approved' : 'Correction rejected');
  };
  const decideOvertime = (row, decision) => {
    mgr.decideOvertime(row, decision, user, employees);
    toast.success(decision === 'approved' ? 'Overtime approved' : 'Overtime rejected');
  };

  const approveRejectCell = (onDecide, row) =>
    row.status && row.status !== 'pending' ? (
      <span className="ft-cell-dim">Reviewed</span>
    ) : (
      <div className="ft-cell-actions">
        <button type="button" className="ft-btn ft-btn--success ft-btn--sm" onClick={() => onDecide(row, 'approved')}>
          <Check size={14} /> Approve
        </button>
        <button type="button" className="ft-btn ft-btn--danger ft-btn--sm" onClick={() => onDecide(row, 'rejected')}>
          <X size={14} /> Reject
        </button>
      </div>
    );

  const leaveColumns = [
    { key: 'employee', label: 'Employee', sortValue: (r) => nameOf(employees, r.employeeId), render: (r) => employeeCell(byId(employees, r.employeeId) || { name: 'Unknown', id: r.employeeId }) },
    { key: 'leaveType', label: 'Type', render: (r) => <StatusBadge tone="accent" label={r.leaveType} /> },
    { key: 'dates', label: 'Dates', sortValue: (r) => r.startDate, render: (r) => <span className="ft-cell-strong">{prettyDate(r.startDate)} – {prettyDate(r.endDate)}</span> },
    { key: 'reason', label: 'Reason', sortable: false, render: (r) => <span className="ft-cell-dim">{r.reason || '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge map={REQUEST_STATUS} value={r.status} /> },
    { key: 'actions', label: 'Actions', align: 'right', sortable: false, render: (r) => approveRejectCell(decideLeave, r) },
  ];

  const correctionColumns = [
    { key: 'employee', label: 'Employee', sortValue: (r) => nameOf(employees, r.employeeId), render: (r) => employeeCell(byId(employees, r.employeeId) || { name: 'Unknown', id: r.employeeId }) },
    { key: 'date', label: 'Date', sortValue: (r) => r.date, render: (r) => prettyDate(r.date) },
    { key: 'type', label: 'Type', sortValue: (r) => correctionTypeLabel(r.type), render: (r) => correctionTypeLabel(r.type) },
    { key: 'reason', label: 'Reason', sortable: false, render: (r) => <span className="ft-cell-dim">{r.reason || '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge map={REQUEST_STATUS} value={r.status} /> },
    { key: 'actions', label: 'Actions', align: 'right', sortable: false, render: (r) => approveRejectCell(decideCorrection, r) },
  ];

  const overtimeColumns = [
    { key: 'employee', label: 'Employee', sortValue: (r) => nameOf(employees, r.employeeId), render: (r) => employeeCell(byId(employees, r.employeeId) || { name: 'Unknown', id: r.employeeId }) },
    { key: 'date', label: 'Date', sortValue: (r) => r.date, render: (r) => prettyDate(r.date) },
    { key: 'overtime', label: 'Overtime', align: 'right', sortValue: (r) => r.overtimeMinutes || 0, render: (r) => formatMinutes(r.overtimeMinutes) },
    { key: 'reason', label: 'Reason', sortable: false, render: () => <span className="ft-cell-dim">Overtime logged beyond shift end</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (r) => (
        <StatusBadge map={REQUEST_STATUS} value={r.overtimeApproved == null ? 'pending' : r.overtimeApproved ? 'approved' : 'rejected'} />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (r) =>
        r.overtimeApproved != null ? (
          <span className="ft-cell-dim">Reviewed</span>
        ) : (
          <div className="ft-cell-actions">
            <button type="button" className="ft-btn ft-btn--success ft-btn--sm" onClick={() => decideOvertime(r, 'approved')}>
              <Check size={14} /> Approve
            </button>
            <button type="button" className="ft-btn ft-btn--danger ft-btn--sm" onClick={() => decideOvertime(r, 'rejected')}>
              <X size={14} /> Reject
            </button>
          </div>
        ),
    },
  ];

  const queueConfig = {
    leave: { columns: leaveColumns, rows: leaveRows, empty: 'No leave requests for your team.', sort: { key: 'dates', dir: 'desc' } },
    correction: { columns: correctionColumns, rows: correctionRows, empty: 'No correction requests for your team.', sort: { key: 'date', dir: 'desc' } },
    overtime: { columns: overtimeColumns, rows: overtimeRows, empty: 'No overtime records for this filter.', sort: { key: 'date', dir: 'desc' } },
  }[queue];

  return (
    <section className="ft-page">
      <PageHeader
        title="Manager Dashboard"
        subtitle="Team monitoring and approvals."
        actions={<MockDataNotice variant="badge" title="Mock mode" icon={Database} />}
      />

      {/* Welcome / identity */}
      <SectionCard>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
            <Avatar name={user?.name || 'Manager'} color={user?.avatarColor} size="lg" />
            <div>
              <h2 className="ft-cell-strong" style={{ fontSize: '1.3rem', margin: 0 }}>Welcome back, {user?.name || 'Manager'}</h2>
              <div style={{ color: 'var(--ft-text-dim)', fontSize: '0.92rem', marginTop: 4 }}>
                {me?.designation || 'Engineering Manager'} · {myDept} Team · {myBranch}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Size</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{overview.teamSize}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Attendance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ft-primary)' }}>{overview.attendanceRate}%</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Overview cards */}
      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Team Size" value={overview.teamSize} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" delta={{ dir: 'up', text: `${overview.attendanceRate}% attendance` }} />
        <MetricCard icon={UserX} label="Absent Today" value={overview.absent} tone="danger" />
        <MetricCard icon={Clock} label="Late Check-ins" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardCheck} label="Pending Approvals" value={overview.pendingApprovals} tone="accent" />
        <MetricCard icon={CalendarCheck} label="Team Attendance" value={`${overview.attendanceRate}%`} tone="primary" />
      </div>

      {/* Today team attendance */}
      <SectionCard title="Today Team Attendance" subtitle="Live team check-in status (mock data)" icon={CalendarCheck}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by name or employee ID..." />
          </div>
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTER_OPTIONS} allLabel="All statuses" />
        </div>
        <DataTable
          columns={todayColumns}
          rows={filteredToday}
          rowKey={(x) => x.emp.id}
          initialSort={{ key: 'employee', dir: 'asc' }}
          emptyIcon={Users}
          emptyMessage="No team members match these filters."
        />
      </SectionCard>

      {/* Late / not checked-in + Alerts */}
      <div className="ft-grid-2">
        <SectionCard title="Late / Not Checked-in" subtitle="Needs a nudge today" icon={Clock}>
          <DataTable
            columns={lateColumns}
            rows={lateMissing}
            rowKey={(x) => x.emp.id}
            emptyIcon={UserCheck}
            emptyMessage="Everyone on the team is on time. 🎉"
          />
        </SectionCard>

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
      </div>

      {/* Monthly snapshot + Activity timeline */}
      <div className="ft-grid-2">
        <SectionCard title="Team Monthly Snapshot" subtitle="Current month, your team" icon={FileBarChart}>
          <div className="ft-meta-grid">
            <Meta k="Average Attendance" v={`${monthly.avgAttendance}%`} />
            <Meta k="Total Late Marks" v={monthly.lateMarks} />
            <Meta k="Total Absents" v={monthly.absents} />
            <Meta k="Total Leaves" v={monthly.leaves} />
            <Meta k="Overtime Hours" v={`${monthly.overtimeHours}h`} />
            <Meta k="Pending Requests" v={monthly.pendingRequests} />
          </div>
        </SectionCard>

        <RecentActivity items={activity} title="Recent team activity" />
      </div>

      {/* Approvals */}
      <SectionCard
        title="Approvals"
        subtitle="Leave, correction and overtime — approve or reject (saved to mock store)"
        icon={ClipboardCheck}
        actions={
          <StatusBadge tone={overview.pendingApprovals ? 'warning' : 'success'} label={`${overview.pendingApprovals} pending`} />
        }
      >
        <div className="ft-toolbar">
          <FilterChips
            value={queue}
            onChange={setQueue}
            options={QUEUE_OPTIONS.map((o) => ({
              ...o,
              label:
                o.value === 'leave'
                  ? `Leave (${overview.pendingLeaves})`
                  : o.value === 'correction'
                    ? `Correction (${overview.pendingCorrections})`
                    : `Overtime (${overview.pendingOvertime})`,
            }))}
          />
          <FilterChips value={reqStatus} onChange={setReqStatus} options={REQUEST_STATUS_OPTIONS} />
        </div>
        <DataTable
          columns={queueConfig.columns}
          rows={queueConfig.rows}
          rowKey="id"
          pageSize={8}
          initialSort={queueConfig.sort}
          emptyIcon={ClipboardList}
          emptyMessage={queueConfig.empty}
        />
      </SectionCard>

      <ConnectedNextActions
        title="Manage your team"
        actions={[
          { icon: CalendarDays, label: 'Team attendance', hint: 'Full records & export', to: '/manager/attendance', tone: 'primary' },
          { icon: Users, label: 'Team members', hint: 'Roster & profiles', to: '/manager/team-members', tone: 'success' },
          { icon: ClipboardCheck, label: 'Approvals', hint: 'Leave & corrections page', to: '/manager/leave-requests', tone: 'accent' },
          { icon: FileBarChart, label: 'Reports', hint: 'Team insights & export', to: '/manager/reports', tone: 'primary' },
        ]}
      />

      <div className="ft-note">
        <strong>Frontend-only mock mode.</strong> All team data comes from the shared mock store
        (<code>src/data/</code> seeded into <code>localStorage</code>). Approvals persist locally; no backend / Firebase / API.
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
