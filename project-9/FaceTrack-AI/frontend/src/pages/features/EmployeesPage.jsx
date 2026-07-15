// FaceTrack AI — Employee management (superAdmin / branchAdmin / hr).
// Role-scoped list of employees with search + filters, KPI cards, and a
// create/edit modal that writes through the mock store. Each mutation emits a
// toast and an audit-log entry. Frontend-only / mock mode.

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Check, X, UserCircle, CalendarCheck } from 'lucide-react';

import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  ConfirmDialog,
  StatusBadge,
  Avatar,
  MetricCard,
  SearchInput,
  FilterSelect,
  TextField,
  SelectField,
} from '../../components/ui';

import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import * as store from '../../services/mockStore';

import { scopeEmployees, byId } from '../../services/selectors';
import { ROLES, FACE_STATUS, EMPLOYEE_STATUS, ATTENDANCE_STATUS, ROLE_BASE } from '../../utils/constants';
import { todayISO } from '../../utils/dateUtils';

const AVATAR_PALETTE = [
  '#22d3ee', // cyan
  '#34d399', // green
  '#f59e0b', // amber
  '#a78bfa', // purple
  '#f472b6', // pink
  '#60a5fa', // blue
  '#f87171', // red
];

const pickColor = () => AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  designation: '',
  branchId: '',
  departmentId: '',
  shiftId: '',
  status: 'active',
};

export default function EmployeesPage() {
  const { user, role } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const attendance = useCollection('attendance');

  const isBranchAdmin = role === ROLES.BRANCH_ADMIN;

  // Today's attendance row per employee — powers the live "Today" status column.
  const todayByEmp = useMemo(() => {
    const today = todayISO();
    const map = new Map();
    for (const a of attendance) if (a.date === today) map.set(a.employeeId, a);
    return map;
  }, [attendance]);

  const scoped = useMemo(() => scopeEmployees(employees, user), [employees, user]);

  /* ---------- toolbar state ---------- */
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b.id, label: b.name })),
    [branches],
  );
  const deptOptions = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.name })),
    [departments],
  );
  const shiftOptions = useMemo(
    () => shifts.map((s) => ({ value: s.id, label: s.name })),
    [shifts],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((e) => {
      if (q) {
        const hay = `${e.name} ${e.email} ${e.employeeCode} ${e.designation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (!isBranchAdmin && branchFilter && e.branchId !== branchFilter) return false;
      if (deptFilter && e.departmentId !== deptFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      return true;
    });
  }, [scoped, query, branchFilter, deptFilter, statusFilter, isBranchAdmin]);

  /* ---------- KPI metrics ---------- */
  const metrics = useMemo(
    () => ({
      total: scoped.length,
      active: scoped.filter((e) => e.status === 'active').length,
      faceRegistered: scoped.filter((e) => e.faceStatus === 'registered').length,
    }),
    [scoped],
  );

  /* ---------- modal / form state ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      // changing branch clears a department that no longer belongs to it
      if (key === 'branchId') return { ...f, branchId: value, departmentId: '' };
      return { ...f, [key]: value };
    });
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  // Departments available for the branch currently chosen in the form.
  const formDeptOptions = useMemo(() => {
    if (!form.branchId) return [];
    return departments
      .filter((d) => d.branchId === form.branchId)
      .map((d) => ({ value: d.id, label: d.name }));
  }, [departments, form.branchId]);

  const openAdd = () => {
    const base = { ...EMPTY_FORM };
    // branchAdmin only manages its own branch — preselect & lock it
    if (isBranchAdmin && user?.branchId) base.branchId = user.branchId;
    setForm(base);
    setErrors({});
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      designation: emp.designation || '',
      branchId: emp.branchId || '',
      departmentId: emp.departmentId || '',
      shiftId: emp.shiftId || '',
      status: emp.status || 'active',
    });
    setErrors({});
    setEditingId(emp.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.branchId) next.branchId = 'Branch is required';
    if (!form.departmentId) next.departmentId = 'Department is required';
    if (!form.shiftId) next.shiftId = 'Shift is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      designation: form.designation.trim(),
      branchId: form.branchId,
      departmentId: form.departmentId,
      shiftId: form.shiftId,
      status: form.status,
    };

    if (editingId) {
      store.update('employees', editingId, payload);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'employeeUpdated',
        target: editingId,
        description: `Updated employee ${payload.name}`,
      });
      toast.success(`${payload.name} updated`);
    } else {
      const id = store.genId('emp');
      const record = {
        id,
        employeeCode: 'NEW-' + Math.floor(1000 + Math.random() * 9000),
        faceStatus: 'none',
        joiningDate: todayISO(),
        avatarColor: pickColor(),
        managerId: null,
        ...payload,
      };
      store.insert('employees', record);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'employeeCreated',
        target: id,
        description: `Added employee ${payload.name}`,
      });
      toast.success(`${payload.name} added`);
    }
    closeModal();
  };

  /* ---------- activate / deactivate ---------- */
  const toggleStatus = (emp) => {
    const nextStatus = emp.status === 'active' ? 'inactive' : 'active';
    store.update('employees', emp.id, { status: nextStatus });
    store.addAudit({
      actor: user?.name,
      role: user?.role,
      action: nextStatus === 'active' ? 'employeeActivated' : 'employeeDeactivated',
      target: emp.id,
      description: `${nextStatus === 'active' ? 'Activated' : 'Deactivated'} ${emp.name}`,
    });
    toast.success(`${emp.name} ${nextStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  /* ---------- delete ---------- */
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const emp = pendingDelete;
    // Soft delete: archive + deactivate instead of hard-removing the record.
    // Hard removal orphaned the employee's attendance / leave / correction / face
    // rows, which then rendered as "Unknown" everywhere they were referenced.
    // Keeping the record (status inactive, archived flag) preserves historical
    // reports while taking the person off the active roster. Frontend-only mock.
    store.update('employees', emp.id, { status: 'inactive', archived: true });
    store.addAudit({
      actor: user?.name,
      role: user?.role,
      action: 'employeeArchived',
      target: emp.id,
      description: `Archived employee ${emp.name} (record kept for historical attendance/leave/correction data)`,
    });
    toast.success(`${emp.name} archived — record kept so past attendance stays readable`);
    setPendingDelete(null);
  };

  /* ---------- table columns ---------- */
  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Employee',
        sortValue: (row) => row.name,
        render: (row) => (
          <div className="ft-id-cell">
            <Avatar name={row.name} color={row.avatarColor} size="md" />
            <div>
              <div className="ft-id-name">{row.name}</div>
              <div className="ft-id-sub">{row.employeeCode}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'designation',
        label: 'Designation',
        render: (row) => <span className="ft-cell-dim">{row.designation || '—'}</span>,
      },
      {
        key: 'departmentId',
        label: 'Department',
        sortValue: (row) => byId(departments, row.departmentId)?.name || '',
        render: (row) => byId(departments, row.departmentId)?.name || '—',
      },
      {
        key: 'branchId',
        label: 'Branch',
        sortValue: (row) => byId(branches, row.branchId)?.name || '',
        render: (row) => byId(branches, row.branchId)?.name || '—',
      },
      {
        key: 'shiftId',
        label: 'Shift',
        sortValue: (row) => byId(shifts, row.shiftId)?.name || '',
        render: (row) => byId(shifts, row.shiftId)?.name || '—',
      },
      {
        key: 'faceStatus',
        label: 'Face',
        align: 'center',
        render: (row) => <StatusBadge map={FACE_STATUS} value={row.faceStatus} />,
      },
      {
        key: 'status',
        label: 'Status',
        align: 'center',
        render: (row) => <StatusBadge map={EMPLOYEE_STATUS} value={row.status} />,
      },
      {
        key: 'today',
        label: 'Today',
        align: 'center',
        sortable: false,
        render: (row) => {
          const r = todayByEmp.get(row.id);
          return r ? <StatusBadge map={ATTENDANCE_STATUS} value={r.status} /> : <span className="ft-cell-dim">Not marked</span>;
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="ft-cell-actions">
            <Link
              to={`${ROLE_BASE[role]}/employees/${row.id}/profile`}
              className="ft-icon-btn"
              title={role === 'superAdmin' ? 'View Full Profile' : 'View Profile'}
              aria-label={role === 'superAdmin' ? `View Full Profile of ${row.name}` : `View Profile of ${row.name}`}
            >
              <UserCircle size={16} />
            </Link>
            <Link
              to={`${ROLE_BASE[role]}/attendance`}
              className="ft-icon-btn"
              title="View Attendance"
              aria-label={`View attendance records (${row.name})`}
            >
              <CalendarCheck size={16} />
            </Link>
            <button
              type="button"
              className="ft-icon-btn"
              title="Edit"
              aria-label={`Edit ${row.name}`}
              onClick={() => openEdit(row)}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              className="ft-icon-btn"
              title={row.status === 'active' ? 'Deactivate' : 'Activate'}
              aria-label={row.status === 'active' ? `Deactivate ${row.name}` : `Activate ${row.name}`}
              onClick={() => toggleStatus(row)}
            >
              {row.status === 'active' ? <X size={16} /> : <Check size={16} />}
            </button>
            <button
              type="button"
              className="ft-icon-btn"
              title="Archive (soft delete)"
              aria-label={`Archive ${row.name}`}
              onClick={() => setPendingDelete(row)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departments, branches, shifts, todayByEmp],
  );

  return (
    <section className="ft-page">
      <PageHeader
        title="Employees"
        subtitle="Manage employee records, departments, shifts and access."
        actions={
          <button type="button" className="ft-btn ft-btn--primary" onClick={openAdd}>
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Total Employees" value={metrics.total} tone="primary" />
        <MetricCard icon={Check} label="Active" value={metrics.active} tone="success" />
        <MetricCard
          icon={Users}
          label="Face Registered"
          value={metrics.faceRegistered}
          tone="accent"
        />
      </div>

      <SectionCard title="All Employees" subtitle={`${rows.length} shown`} icon={Users}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name, email, code or designation…"
            />
          </div>
          {!isBranchAdmin && (
            <FilterSelect
              value={branchFilter}
              onChange={setBranchFilter}
              options={branchOptions}
              allLabel="All branches"
            />
          )}
          <FilterSelect
            value={deptFilter}
            onChange={setDeptFilter}
            options={deptOptions}
            allLabel="All departments"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            allLabel="All statuses"
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyMessage="No employees match your filters."
        />
      </SectionCard>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Employee' : 'Add Employee'}
        size="lg"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Add Employee'}
            </button>
          </>
        }
      >
        <div className="ft-grid-2">
          <TextField
            label="Full Name"
            value={form.name}
            onChange={setField('name')}
            required
            placeholder="Jane Doe"
            error={errors.name}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={setField('email')}
            required
            placeholder="jane@company.com"
            error={errors.email}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={setField('phone')}
            placeholder="+1 555 0100"
          />
          <TextField
            label="Designation"
            value={form.designation}
            onChange={setField('designation')}
            placeholder="Software Engineer"
          />
          <SelectField
            label="Branch"
            value={form.branchId}
            onChange={setField('branchId')}
            options={branchOptions}
            placeholder="Select branch"
            required
            error={errors.branchId}
            disabled={isBranchAdmin}
          />
          <SelectField
            label="Department"
            value={form.departmentId}
            onChange={setField('departmentId')}
            options={formDeptOptions}
            placeholder={form.branchId ? 'Select department' : 'Select a branch first'}
            required
            error={errors.departmentId}
          />
          <SelectField
            label="Shift"
            value={form.shiftId}
            onChange={setField('shiftId')}
            options={shiftOptions}
            placeholder="Select shift"
            required
            error={errors.shiftId}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={setField('status')}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Archive Employee"
        message={
          pendingDelete
            ? `Archive ${pendingDelete.name}? They'll be set inactive and removed from active rosters, but their record and attendance/leave/correction history are kept so reports stay accurate. (Mock mode — no permanent delete.)`
            : ''
        }
        confirmLabel="Archive"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
