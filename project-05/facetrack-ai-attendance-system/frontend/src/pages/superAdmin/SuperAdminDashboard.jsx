// FaceTrack AI — Super Admin Dashboard (Global Control + Branch Monitoring + Role Management Center).
//
// Frontend-only: every number/list is derived from the SHARED mock store via
// services/superAdminService (which reuses services/selectors + the store) — no
// backend, no Firebase, no API, no duplicate mock-data system. Scope is GLOBAL /
// all-branches (deliberately different from HR org-wide, Branch Admin branch, and
// Manager team dashboards). "Mark reviewed" (alerts) + role status toggles persist
// to localStorage; everything else reads reactively. Reuses the existing UI
// component library + existing role-prefixed routes so nothing is a dead end.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Network,
  Users,
  Briefcase,
  UsersRound,
  UserCog,
  UserCheck,
  Clock,
  ClipboardList,
  Activity,
  CalendarCheck,
  FileBarChart,
  ScrollText,
  ShieldCheck,
  Settings as SettingsIcon,
  Database,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MapPin,
  SlidersHorizontal,
  UserPlus,
  Pencil,
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
  Modal,
  TextField,
  SelectField,
} from '../../components/ui';
import * as store from '../../services/mockStore';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as sa from '../../services/superAdminService';
import { useFeatures } from '../../hooks/useFeatures';
import * as fc from '../../services/featureControlService';
import { ROLE_LABELS, EMPLOYEE_STATUS } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';
import { getUserProfile } from '../../data/mockUsers';

const SEVERITY = { danger: 'Critical', warning: 'Warning', info: 'Info', accent: 'Review', success: 'OK' };

const ALERT_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'danger', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
  { value: 'accent', label: 'Review' },
];

const REVIEWED_KEY = 'ft_sa_reviewed_alerts';
const ROLE_STATUS_KEY = 'ft_sa_role_status';

const BRANCH_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const profile = getUserProfile('superAdmin');

  // Shared store collections (reactive) — same data the rest of the app uses.
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const suspiciousScans = useCollection('suspiciousScans');
  const auditLogs = useCollection('auditLogs');

  // --- derived global data (all via the super-admin service) ---
  const overview = useMemo(
    () => sa.globalOverview(employees, attendance, { branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans }),
    [employees, attendance, branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans]
  );
  const branchPerf = useMemo(
    () => sa.branchPerformance(employees, branches, attendance, { correctionRequests }),
    [employees, branches, attendance, correctionRequests]
  );
  const dataQuality = useMemo(
    () => sa.dataQuality(employees, branches, departments, shifts, { faceRegistrations }),
    [employees, branches, departments, shifts, faceRegistrations]
  );
  const health = useMemo(() => sa.platformHealth(overview, dataQuality, branchPerf), [overview, dataQuality, branchPerf]);
  const roleAccess = useMemo(() => sa.roleAccessSummary(overview), [overview]);
  const alerts = useMemo(() => sa.systemAlerts(overview, branchPerf, dataQuality), [overview, branchPerf, dataQuality]);
  const activity = useMemo(() => sa.globalActivity(auditLogs), [auditLogs]);

  // Feature Control summary (reactive — updates as Super Admin toggles features).
  const features = useFeatures();
  const featureSummary = useMemo(() => fc.summary(features), [features]);

  /* ---------------- system alerts: mark reviewed (localStorage) ---------------- */
  const [reviewed, setReviewed] = useState(() => readJson(REVIEWED_KEY, []));
  const [alertFilter, setAlertFilter] = useState('');

  const markReviewed = (id) => {
    const next = Array.from(new Set([...reviewed, id]));
    setReviewed(next);
    try {
      localStorage.setItem(REVIEWED_KEY, JSON.stringify(next));
    } catch { /* storage unavailable */ }
    toast.success('Alert marked as reviewed');
  };

  const visibleAlerts = useMemo(
    () => alerts.filter((a) => (!alertFilter || a.severity === alertFilter)),
    [alerts, alertFilter]
  );

  /* ---------------- role & access: status toggle (localStorage) ---------------- */
  const [roleStatus, setRoleStatus] = useState(() => readJson(ROLE_STATUS_KEY, {}));

  const toggleRole = (role) => {
    const current = roleStatus[role] || 'active';
    const next = { ...roleStatus, [role]: current === 'active' ? 'inactive' : 'active' };
    setRoleStatus(next);
    try {
      localStorage.setItem(ROLE_STATUS_KEY, JSON.stringify(next));
    } catch { /* storage unavailable */ }
    toast.success(`${ROLE_LABELS[role] || role} access ${next[role] === 'active' ? 'activated' : 'deactivated'} (mock)`);
  };

  /* ---------------- branch performance (search + filter) ---------------- */
  const [branchQuery, setBranchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const filteredBranches = useMemo(() => {
    const q = branchQuery.trim().toLowerCase();
    return branchPerf.filter((b) => {
      if (branchFilter === 'review' && !b.needsReview) return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q) || (b.city || '').toLowerCase().includes(q) || (b.admin || '').toLowerCase().includes(q);
    });
  }, [branchPerf, branchQuery, branchFilter]);

  /* ---------------- Super Admin branch control actions (mock) ---------------- */
  // modal: 'assignPeople' | 'assignAdmin' | 'editBranch' | 'manageEmployees' | 'viewBranch' | null
  const [modal, setModal] = useState(null);
  const [assignForm, setAssignForm] = useState({ branchId: '', employeeId: '' });
  const [adminForm, setAdminForm] = useState({ branchId: '', userId: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', city: '', radiusMeters: '', status: 'active' });
  const [manageBranchId, setManageBranchId] = useState('');
  const [viewBranch, setViewBranch] = useState(null);
  const [formError, setFormError] = useState('');

  const branchOptions = useMemo(() => branches.map((b) => ({ value: b.id, label: b.name })), [branches]);
  const employeeOptions = useMemo(
    () =>
      employees
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => ({ value: e.id, label: `${e.name} - ${e.designation || e.employeeCode || e.id}` })),
    [employees]
  );

  const manageBranch = branches.find((b) => b.id === manageBranchId) || null;
  const manageList = useMemo(() => employees.filter((e) => e.branchId === manageBranchId), [employees, manageBranchId]);

  const audit = (action, target, description) =>
    store.addAudit({ actor: user?.name, role: user?.role, action, target, description });

  const closeModal = () => { setModal(null); setFormError(''); };

  const openAssignPeople = (branchId = '') => { setAssignForm({ branchId, employeeId: '' }); setFormError(''); setModal('assignPeople'); };
  const openAssignAdmin = (branchId = '') => { setAdminForm({ branchId, userId: '' }); setFormError(''); setModal('assignAdmin'); };
  const openEditBranch = (branchId = '') => {
    const b = branches.find((x) => x.id === branchId) || branches[0];
    if (!b) return;
    setEditForm({ id: b.id, name: b.name || '', city: b.city || '', radiusMeters: b.radiusMeters == null ? '' : String(b.radiusMeters), status: b.status || 'active' });
    setFormError('');
    setModal('editBranch');
  };
  const openManageEmployees = (branchId = '') => { setManageBranchId(branchId || (branches[0]?.id ?? '')); setModal('manageEmployees'); };
  const openViewBranch = (row) => { setViewBranch(row); setModal('viewBranch'); };

  const saveAssignPeople = () => {
    if (!assignForm.branchId || !assignForm.employeeId) { setFormError('Select both a branch and an employee.'); return; }
    const emp = employees.find((e) => e.id === assignForm.employeeId);
    const br = branches.find((b) => b.id === assignForm.branchId);
    store.update('employees', assignForm.employeeId, { branchId: assignForm.branchId });
    audit('employeeAssigned', assignForm.employeeId, `Assigned ${emp?.name || 'employee'} to ${br?.name || 'branch'}.`);
    toast.success('Employee assigned to branch successfully.');
    closeModal();
  };
  const saveAssignAdmin = () => {
    if (!adminForm.branchId || !adminForm.userId) { setFormError('Select both a branch and a person.'); return; }
    const person = employees.find((e) => e.id === adminForm.userId);
    const br = branches.find((b) => b.id === adminForm.branchId);
    store.update('branches', adminForm.branchId, { branchAdminId: adminForm.userId });
    audit('branchAdminAssigned', adminForm.branchId, `Assigned ${person?.name || 'user'} as branch admin of ${br?.name || 'branch'}.`);
    toast.success('Branch admin assigned successfully in demo mode.');
    closeModal();
  };
  const saveEditBranch = () => {
    if (!editForm.name.trim() || !editForm.city.trim()) { setFormError('Branch name and city are required.'); return; }
    if (editForm.radiusMeters !== '' && Number.isNaN(Number(editForm.radiusMeters))) { setFormError('Radius must be a number.'); return; }
    store.update('branches', editForm.id, {
      name: editForm.name.trim(),
      city: editForm.city.trim(),
      radiusMeters: editForm.radiusMeters === '' ? 0 : Number(editForm.radiusMeters),
      status: editForm.status,
    });
    audit('branchUpdated', editForm.id, `Updated branch details for ${editForm.name.trim()}.`);
    toast.success('Branch details updated in demo mode.');
    closeModal();
  };

  const manageColumns = [
    { key: 'name', label: 'Employee', render: (e) => <span className="ft-cell-strong">{e.name}</span> },
    { key: 'designation', label: 'Designation', sortValue: (e) => e.designation || '', render: (e) => <span className="ft-cell-dim">{e.designation || '—'}</span> },
    { key: 'employeeCode', label: 'Code', sortValue: (e) => e.employeeCode || e.id, render: (e) => <span className="ft-cell-dim">{e.employeeCode || e.id}</span> },
    { key: 'status', label: 'Status', align: 'center', sortValue: (e) => e.status, render: (e) => <StatusBadge map={EMPLOYEE_STATUS} value={e.status} /> },
  ];

  const branchColumns = [
    { key: 'name', label: 'Branch', sortValue: (b) => b.name, render: (b) => <span className="ft-cell-strong">{b.name}</span> },
    { key: 'city', label: 'City', sortValue: (b) => b.city, render: (b) => <span className="ft-cell-dim">{b.city}</span> },
    { key: 'admin', label: 'Branch Admin', sortable: false, render: (b) => (b.adminAssigned ? b.admin : <StatusBadge tone="warning" label="Unassigned" />) },
    { key: 'total', label: 'Employees', align: 'right', sortValue: (b) => b.total, render: (b) => b.total },
    { key: 'present', label: 'Present', align: 'right', sortValue: (b) => b.present, render: (b) => b.present },
    { key: 'absent', label: 'Absent', align: 'right', sortValue: (b) => b.absent, render: (b) => b.absent },
    { key: 'late', label: 'Late', align: 'right', sortValue: (b) => b.late, render: (b) => b.late },
    { key: 'correctionsPending', label: 'Corrections', align: 'right', sortValue: (b) => b.correctionsPending, render: (b) => b.correctionsPending },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      align: 'center',
      sortValue: (b) => b.attendanceRate,
      render: (b) => <StatusBadge tone={b.needsReview ? 'danger' : b.attendanceRate >= 95 ? 'success' : 'warning'} label={`${b.attendanceRate}%`} />,
    },
    { key: 'status', label: 'Status', align: 'center', sortable: false, render: (b) => <StatusBadge tone={b.status === 'active' ? 'success' : 'muted'} label={b.status === 'active' ? 'Active' : 'Inactive'} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (b) => (
        <div className="ft-cell-actions">
          <button type="button" className="ft-icon-btn" title="View Branch" aria-label={`View branch ${b.name}`} onClick={() => openViewBranch(b)}><Building2 size={16} /></button>
          <button type="button" className="ft-icon-btn" title="View People" aria-label={`View people in ${b.name}`} onClick={() => openManageEmployees(b.id)}><Users size={16} /></button>
          <Link to="/super-admin/attendance" className="ft-icon-btn" title="View Attendance" aria-label="View attendance"><CalendarCheck size={16} /></Link>
          <Link to="/super-admin/reports" className="ft-icon-btn" title="View Reports" aria-label="View reports"><FileBarChart size={16} /></Link>
        </div>
      ),
    },
  ];

  const roleColumns = [
    { key: 'name', label: 'Role', sortable: false, render: (r) => <span className="ft-cell-strong">{r.name}</span> },
    { key: 'users', label: 'Users', align: 'right', sortable: false, render: (r) => r.users },
    { key: 'access', label: 'Access Level', sortable: false, render: (r) => <StatusBadge tone="info" label={r.access} /> },
    { key: 'permissions', label: 'Permissions', sortable: false, render: (r) => <span className="ft-cell-dim">{r.permissions}</span> },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortable: false,
      render: (r) => {
        const st = roleStatus[r.role] || 'active';
        return <StatusBadge tone={st === 'active' ? 'success' : 'muted'} label={st === 'active' ? 'Active' : 'Inactive'} />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (r) => (
        <div className="ft-cell-actions">
          <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => toast.success(`${r.name} — ${r.permissions}`)}>
            <Eye size={14} /> Permissions
          </button>
          <button type="button" className="ft-btn ft-btn--ghost ft-btn--sm" onClick={() => toggleRole(r.role)} disabled={r.role === 'superAdmin'}>
            {(roleStatus[r.role] || 'active') === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="Global Control + Branch Monitoring + Role Management Center"
        actions={<MockDataNotice variant="badge" title="Mock mode" icon={Database} />}
      />

      {/* Welcome / identity */}
      <SectionCard>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
            <Avatar name={user?.name || 'Super Admin'} color={user?.avatarColor} size="lg" />
            <div>
              <h2 className="ft-cell-strong" style={{ fontSize: '1.3rem', margin: 0 }}>Welcome back, {user?.name || 'Super Admin'}</h2>
              <div style={{ color: 'var(--ft-text-dim)', fontSize: '0.92rem', marginTop: 4 }}>
                {profile?.jobTitle || 'Platform Administrator'} · {profile?.scope || 'All Rajasthan branches'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branches</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{overview.totalBranches}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Health</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ft-primary)' }}>{health}%</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Global KPI cards */}
      <div className="ft-kpi-grid">
        <MetricCard icon={Building2} label="Total Branches" value={overview.totalBranches} tone="primary" />
        <MetricCard icon={Network} label="Departments" value={overview.totalDepartments} tone="accent" />
        <MetricCard icon={Users} label="Total Employees" value={overview.totalEmployees} tone="primary" />
        <MetricCard icon={Briefcase} label="Active HR" value={overview.activeHR} tone="success" />
        <MetricCard icon={UsersRound} label="Active Managers" value={overview.activeManagers} tone="accent" />
        <MetricCard icon={UserCog} label="Active Branch Admins" value={overview.activeBranchAdmins} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={overview.present} tone="success" />
        <MetricCard icon={Clock} label="Late Today" value={overview.late} tone="warning" />
        <MetricCard icon={ClipboardList} label="Pending Requests" value={overview.pendingRequests} tone="warning" />
        <MetricCard icon={Activity} label="Platform Health" value={`${health}%`} tone="primary" />
      </div>

      {/* Feature Control Summary */}
      <SectionCard
        title="Feature Control Summary"
        subtitle="Website features managed from the control center"
        icon={SlidersHorizontal}
        actions={<Link to="/super-admin/feature-control" className="ft-btn ft-btn--subtle ft-btn--sm"><SlidersHorizontal size={14} /> Open Feature Control</Link>}
      >
        <div className="ft-meta-grid">
          <div className="ft-meta-item"><span className="ft-meta-key">Total Features</span><span className="ft-meta-val">{featureSummary.total}</span></div>
          <div className="ft-meta-item"><span className="ft-meta-key">Enabled</span><span className="ft-meta-val" style={{ color: 'var(--ft-green)' }}>{featureSummary.enabled}</span></div>
          <div className="ft-meta-item"><span className="ft-meta-key">Disabled</span><span className="ft-meta-val" style={{ color: 'var(--ft-red)' }}>{featureSummary.disabled}</span></div>
          <div className="ft-meta-item"><span className="ft-meta-key">Protected</span><span className="ft-meta-val">{featureSummary.protected}</span></div>
          <div className="ft-meta-item"><span className="ft-meta-key">Last Updated</span><span className="ft-meta-val">{featureSummary.lastUpdated ? prettyDate(featureSummary.lastUpdated) : '—'}</span></div>
        </div>
      </SectionCard>

      {/* System Alerts Center */}
      <SectionCard
        title="System Alerts Center"
        subtitle="Global platform alerts — review and clear"
        icon={AlertTriangle}
        actions={<FilterChips value={alertFilter} onChange={setAlertFilter} options={ALERT_FILTER_OPTIONS} />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleAlerts.map((a) => {
            const isReviewed = reviewed.includes(a.id);
            return (
              <div key={a.id} className="ft-scan-row" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="ft-scan-row-label">{a.title}</span>
                  <span className="ft-cell-dim" style={{ fontSize: '0.8rem' }}>{a.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusBadge tone={a.severity} label={SEVERITY[a.severity] || 'Info'} />
                  {a.id === 'allClear' ? null : isReviewed ? (
                    <StatusBadge tone="success" label="Reviewed" />
                  ) : (
                    <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => markReviewed(a.id)}>
                      <CheckCircle2 size={14} /> Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {visibleAlerts.length === 0 ? <span className="ft-cell-dim">No alerts match this severity.</span> : null}
        </div>
      </SectionCard>

      {/* Branch Performance Comparison / Branch Network */}
      <SectionCard
        title="Branch Performance & Network"
        subtitle="All branches compared (today)"
        icon={MapPin}
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <StatusBadge tone="success" label={`${overview.activeBranches} active`} />
            {overview.inactiveBranches ? <StatusBadge tone="muted" label={`${overview.inactiveBranches} inactive`} /> : null}
          </div>
        }
      >
        {/* Super Admin branch control actions (frontend-only mock) */}
        <div className="ft-toolbar" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          <button type="button" className="ft-btn ft-btn--primary ft-btn--sm" onClick={() => openAssignPeople()}>
            <UserPlus size={14} /> Assign People
          </button>
          <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => openAssignAdmin()}>
            <UserCog size={14} /> Assign Branch Admin
          </button>
          <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => openEditBranch()}>
            <Pencil size={14} /> Edit Branch
          </button>
          <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => openManageEmployees()}>
            <UsersRound size={14} /> Manage Employees
          </button>
        </div>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={branchQuery} onChange={setBranchQuery} placeholder="Search branch, city or admin..." />
          </div>
          <FilterChips value={branchFilter} onChange={setBranchFilter} options={[{ value: '', label: 'All' }, { value: 'review', label: 'Needs review' }]} />
        </div>
        <DataTable
          columns={branchColumns}
          rows={filteredBranches}
          rowKey="id"
          initialSort={{ key: 'attendanceRate', dir: 'asc' }}
          emptyIcon={Building2}
          emptyMessage="No branches match these filters."
        />
      </SectionCard>

      {/* Role & Access Control */}
      <SectionCard title="Role & Access Control" subtitle="Platform roles, access levels & user counts (mock)" icon={ShieldCheck}>
        <DataTable
          columns={roleColumns}
          rows={roleAccess}
          rowKey="role"
          initialSort={{ key: 'users', dir: 'desc' }}
          emptyMessage="No roles."
        />
        <p className="ft-note" style={{ marginTop: 12 }}>
          Frontend-only mock — "Activate/Deactivate" and permission views are display state (saved to
          <code> localStorage</code>); there is no real permission engine.
        </p>
      </SectionCard>

      {/* Data Quality Checker + Global Activity */}
      <div className="ft-grid-2">
        <SectionCard title="Data Quality Checker" subtitle="Missing-setup & integrity checks" icon={ShieldCheck}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dataQuality.map((c) => (
              <div key={c.key} className="ft-scan-row">
                <span className="ft-scan-row-label">{c.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="ft-cell-strong">{c.count}</span>
                  <StatusBadge tone={c.tone} label={c.statusLabel} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <RecentActivity items={activity} title="Global Activity Timeline" />
      </div>

      {/* Global Quick Actions — valid super-admin routes only */}
      <ConnectedNextActions
        title="Global Quick Actions"
        actions={[
          { icon: Building2, label: 'Branches', hint: 'Add / manage branches', to: '/super-admin/branches', tone: 'primary' },
          { icon: Network, label: 'Departments', hint: 'Add / manage departments', to: '/super-admin/departments', tone: 'accent' },
          { icon: Users, label: 'All employees', hint: 'Global employee records', to: '/super-admin/employees', tone: 'primary' },
          { icon: Briefcase, label: 'HR management', hint: 'HR oversight', to: '/super-admin/hr-management', tone: 'success' },
          { icon: ScrollText, label: 'Audit logs', hint: 'Activity trail', to: '/super-admin/audit-logs', tone: 'warning' },
          { icon: FileBarChart, label: 'Global reports', hint: 'Export & analytics', to: '/super-admin/reports', tone: 'primary' },
          { icon: SettingsIcon, label: 'System settings', hint: 'Radius, grace, rules', to: '/super-admin/settings', tone: 'accent' },
        ]}
      />

      <div className="ft-note">
        <strong>Frontend-only mock mode.</strong> All global data comes from the shared mock store
        (<code>src/data/</code> seeded into <code>localStorage</code>). Reviewed-alert + role-status toggles persist locally; no backend / Firebase / API.
      </div>

      {/* ---------------- Assign People ---------------- */}
      <Modal
        open={modal === 'assignPeople'}
        title="Assign People to Branch"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>Cancel</button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={saveAssignPeople}>Assign</button>
          </>
        }
      >
        <p className="ft-note">Move an employee to a branch. Saved to the local mock store (demo mode).</p>
        <SelectField
          label="Branch" required placeholder="Select branch..." options={branchOptions}
          value={assignForm.branchId}
          onChange={(e) => setAssignForm((f) => ({ ...f, branchId: e.target.value }))}
        />
        <SelectField
          label="Employee" required placeholder="Select employee..." options={employeeOptions}
          value={assignForm.employeeId}
          onChange={(e) => setAssignForm((f) => ({ ...f, employeeId: e.target.value }))}
        />
        {formError ? <p className="ft-field-error">{formError}</p> : null}
      </Modal>

      {/* ---------------- Assign Branch Admin ---------------- */}
      <Modal
        open={modal === 'assignAdmin'}
        title="Assign Branch Admin"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>Cancel</button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={saveAssignAdmin}>Assign Admin</button>
          </>
        }
      >
        <p className="ft-note">Assign a person as the branch administrator. An "Unassigned" branch becomes assigned (demo mode).</p>
        <SelectField
          label="Branch" required placeholder="Select branch..." options={branchOptions}
          value={adminForm.branchId}
          onChange={(e) => setAdminForm((f) => ({ ...f, branchId: e.target.value }))}
        />
        <SelectField
          label="Branch Admin" required placeholder="Select person..." options={employeeOptions}
          value={adminForm.userId}
          onChange={(e) => setAdminForm((f) => ({ ...f, userId: e.target.value }))}
        />
        {formError ? <p className="ft-field-error">{formError}</p> : null}
      </Modal>

      {/* ---------------- Edit Branch ---------------- */}
      <Modal
        open={modal === 'editBranch'}
        title="Edit Branch"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>Cancel</button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={saveEditBranch}>Save Changes</button>
          </>
        }
      >
        <SelectField
          label="Branch" options={branchOptions} value={editForm.id}
          onChange={(e) => openEditBranch(e.target.value)}
        />
        <div className="ft-grid-2">
          <TextField label="Branch Name" required value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jaipur HQ" />
          <TextField label="City" required value={editForm.city} onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))} placeholder="Jaipur" />
        </div>
        <div className="ft-grid-2">
          <TextField label="Allowed Radius (m)" type="number" value={editForm.radiusMeters} onChange={(e) => setEditForm((f) => ({ ...f, radiusMeters: e.target.value }))} placeholder="150" />
          <SelectField label="Status" options={BRANCH_STATUS_OPTIONS} value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} />
        </div>
        {formError ? <p className="ft-field-error">{formError}</p> : null}
      </Modal>

      {/* ---------------- Manage Employees ---------------- */}
      <Modal
        open={modal === 'manageEmployees'}
        title="Manage Branch Employees"
        size="lg"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>Close</button>
            <Link to="/super-admin/employees" className="ft-btn ft-btn--primary" onClick={closeModal}>Open Employees Page</Link>
          </>
        }
      >
        <SelectField label="Branch" options={branchOptions} value={manageBranchId} onChange={(e) => setManageBranchId(e.target.value)} />
        <p className="ft-note">{manageList.length} employee(s) in {manageBranch?.name || 'this branch'} (mock data).</p>
        <DataTable
          columns={manageColumns}
          rows={manageList}
          rowKey="id"
          pageSize={6}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyIcon={Users}
          emptyMessage="No employees in this branch yet. Use Assign People to add some."
        />
      </Modal>

      {/* ---------------- View Branch ---------------- */}
      <Modal
        open={modal === 'viewBranch'}
        title={viewBranch ? `Branch — ${viewBranch.name}` : 'Branch'}
        onClose={closeModal}
        footer={<button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>Close</button>}
      >
        {viewBranch ? (
          <>
            <div className="ft-meta-grid">
              <div className="ft-meta-item"><span className="ft-meta-key">City</span><span className="ft-meta-val">{viewBranch.city || '—'}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Branch Admin</span><span className="ft-meta-val">{viewBranch.adminAssigned ? viewBranch.admin : 'Unassigned'}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Employees</span><span className="ft-meta-val">{viewBranch.total}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Present today</span><span className="ft-meta-val">{viewBranch.present}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Absent</span><span className="ft-meta-val">{viewBranch.absent}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Late</span><span className="ft-meta-val">{viewBranch.late}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Pending corrections</span><span className="ft-meta-val">{viewBranch.correctionsPending}</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Attendance</span><span className="ft-meta-val">{viewBranch.attendanceRate}%</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Radius</span><span className="ft-meta-val">{viewBranch.radiusMeters ?? '—'} m</span></div>
              <div className="ft-meta-item"><span className="ft-meta-key">Status</span><span className="ft-meta-val">{viewBranch.status === 'active' ? 'Active' : 'Inactive'}</span></div>
            </div>
            <div className="ft-toolbar" style={{ marginTop: 14, flexWrap: 'wrap' }}>
              <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => { const id = viewBranch.id; closeModal(); openManageEmployees(id); }}><Users size={14} /> View People</button>
              <Link to="/super-admin/attendance" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={closeModal}><CalendarCheck size={14} /> View Attendance</Link>
              <Link to="/super-admin/reports" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={closeModal}><FileBarChart size={14} /> View Reports</Link>
              <button type="button" className="ft-btn ft-btn--subtle ft-btn--sm" onClick={() => { const id = viewBranch.id; closeModal(); openEditBranch(id); }}><Pencil size={14} /> Edit Branch</button>
            </div>
          </>
        ) : null}
      </Modal>
    </section>
  );
}
