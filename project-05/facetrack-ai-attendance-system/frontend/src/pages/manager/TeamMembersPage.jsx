// FaceTrack AI — Team Members (Manager, read-only roster).
// Shows the people reporting to the logged-in manager (scoped via selectors),
// with today's attendance + location + face status. Reads the SHARED mock store
// (same employees/attendance data as the rest of the app). Search + department/
// status filters are frontend-only view state. Read-only — no CRUD here.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, UserCheck, ScanFace, ClipboardCheck, CalendarCheck, FileBarChart, UserCircle } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterSelect,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { scopeEmployees, byId } from '../../services/selectors';
import { FACE_STATUS, EMPLOYEE_STATUS, ATTENDANCE_STATUS } from '../../utils/constants';
import { todayISO } from '../../utils/dateUtils';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'On Leave' },
  { value: 'notMarked', label: 'Not marked' },
];

export default function TeamMembersPage() {
  const { user } = useAuth();
  const employees = useCollection('employees');
  const departments = useCollection('departments');
  const attendance = useCollection('attendance');

  const today = todayISO();

  // Manager scope = direct reports (+ self minus self), per shared selector.
  const team = useMemo(
    () => scopeEmployees(employees, user).filter((e) => e.id !== user?.employeeId),
    [employees, user]
  );

  const todayRowOf = (empId) => attendance.find((a) => a.employeeId === empId && a.date === today) || null;
  const statusToday = (empId) => todayRowOf(empId)?.status || null;
  const locationToday = (empId) => todayRowOf(empId)?.location?.status || null;

  // --- filters (frontend-only view state) ---
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const deptOptions = useMemo(() => {
    const ids = new Set(team.map((e) => e.departmentId));
    return departments.filter((d) => ids.has(d.id)).map((d) => ({ value: d.id, label: d.name }));
  }, [departments, team]);

  const filteredTeam = useMemo(() => {
    const q = query.trim().toLowerCase();
    return team.filter((e) => {
      if (deptFilter && e.departmentId !== deptFilter) return false;
      if (statusFilter) {
        const s = statusToday(e.id);
        if (statusFilter === 'notMarked' ? !!s : s !== statusFilter) return false;
      }
      if (!q) return true;
      return e.name.toLowerCase().includes(q) || (e.employeeCode || '').toLowerCase().includes(q);
    });
  }, [team, query, deptFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const presentToday = useMemo(
    () => team.filter((e) => ['present', 'late'].includes(statusToday(e.id))).length,
    [team, attendance] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const registeredFaces = useMemo(() => team.filter((e) => e.faceStatus === 'registered').length, [team]);

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (e) => (
        <div className="ft-id-cell">
          <Avatar name={e.name} color={e.avatarColor} size="sm" />
          <div>
            <div className="ft-id-name">{e.name}</div>
            <div className="ft-id-sub">{e.designation}</div>
          </div>
        </div>
      ),
      sortValue: (e) => e.name,
    },
    { key: 'employeeCode', label: 'Employee ID', render: (e) => <span className="ft-cell-dim">{e.employeeCode || e.id}</span> },
    { key: 'department', label: 'Department', sortable: false, render: (e) => byId(departments, e.departmentId)?.name || '—' },
    {
      key: 'today',
      label: 'Today',
      render: (e) => {
        const s = statusToday(e.id);
        return s ? <StatusBadge map={ATTENDANCE_STATUS} value={s} /> : <span className="ft-cell-dim">Not marked</span>;
      },
      sortValue: (e) => statusToday(e.id) || 'zzz',
    },
    { key: 'faceStatus', label: 'Face', render: (e) => <StatusBadge map={FACE_STATUS} value={e.faceStatus} /> },
    {
      key: 'location',
      label: 'Location',
      align: 'center',
      sortable: false,
      render: (e) => {
        const s = locationToday(e.id);
        if (!s) return <span className="ft-cell-dim">—</span>;
        return s === 'insideRadius' ? <StatusBadge tone="success" label="Inside" /> : <StatusBadge tone="danger" label="Outside" />;
      },
    },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge map={EMPLOYEE_STATUS} value={e.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (e) => (
        <div className="ft-cell-actions">
          <Link
            to={`/manager/employees/${e.id}/profile`}
            className="ft-icon-btn"
            title="View Employee Profile"
            aria-label={`View Profile of ${e.name}`}
          >
            <UserCircle size={16} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Team Members"
        subtitle="Your direct reports and their attendance at a glance."
        actions={<StatusBadge tone="info" label={`${team.length} members`} />}
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={UsersRound} label="Team Size" value={team.length} tone="primary" />
        <MetricCard icon={UserCheck} label="Present Today" value={presentToday} tone="success" />
        <MetricCard icon={ScanFace} label="Faces Registered" value={registeredFaces} tone="accent" />
      </div>

      <SectionCard title="Roster" subtitle="People reporting to you" icon={UsersRound}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by name or employee ID..." />
          </div>
          <FilterSelect value={deptFilter} onChange={setDeptFilter} options={deptOptions} allLabel="All departments" />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} allLabel="All statuses" />
        </div>
        <DataTable
          columns={columns}
          rows={filteredTeam}
          emptyIcon={UsersRound}
          emptyMessage="No team members match these filters."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>

      <ConnectedNextActions
        title="Manage your team"
        actions={[
          { icon: ClipboardCheck, label: 'Approvals', hint: 'Leave & correction requests', to: '/manager/leave-requests', tone: 'primary' },
          { icon: CalendarCheck, label: 'Team attendance', hint: "Today's check-ins", to: '/manager/attendance', tone: 'success' },
          { icon: FileBarChart, label: 'Reports', hint: 'Export team insights', to: '/manager/reports', tone: 'accent' },
        ]}
      />

      <div className="ft-note">
        <strong>Read-only roster.</strong> All data comes from the shared mock store (<code>src/data/</code> → <code>localStorage</code>).
      </div>
    </section>
  );
}
