// FaceTrack AI — Departments management page.
// Lists departments (scoped to the viewer's branch for branchAdmin) with the
// branch name, manager name, and live employee count, plus an Add/Edit modal
// and delete confirmation. Every action mutates the mock store and is audited.

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Network } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  ConfirmDialog,
  StatusBadge,
  SearchInput,
  TextField,
  SelectField,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId, nameOf } from '../../services/selectors';
import { ROLES, EMPLOYEE_STATUS } from '../../utils/constants';

const EMPTY_FORM = { name: '', branchId: '', managerId: '', status: 'active' };

export default function DepartmentsPage() {
  const { user, role } = useAuth();
  const toast = useToast();

  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const employees = useCollection('employees');

  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // department being edited, or null for add
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);

  // Branch scoping: branchAdmin only sees/manages its own branch.
  const isBranchScoped = role === ROLES.BRANCH_ADMIN && user?.branchId;

  const scopedDepartments = useMemo(
    () => (isBranchScoped ? departments.filter((d) => d.branchId === user.branchId) : departments),
    [departments, isBranchScoped, user]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return scopedDepartments;
    return scopedDepartments.filter((d) => {
      const branchName = byId(branches, d.branchId)?.name || '';
      const managerName = nameOf(employees, d.managerId);
      return (
        d.name.toLowerCase().includes(q) ||
        branchName.toLowerCase().includes(q) ||
        managerName.toLowerCase().includes(q)
      );
    });
  }, [scopedDepartments, query, branches, employees]);

  const branchOptions = useMemo(
    () =>
      (isBranchScoped ? branches.filter((b) => b.id === user.branchId) : branches).map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [branches, isBranchScoped, user]
  );

  // Managers selectable for the chosen branch (falls back to all when no branch yet).
  const managerOptions = useMemo(() => {
    const pool = form.branchId ? employees.filter((e) => e.branchId === form.branchId) : employees;
    return pool.map((e) => ({ value: e.id, label: e.name }));
  }, [employees, form.branchId]);

  const countFor = (departmentId) => employees.filter((e) => e.departmentId === departmentId).length;

  /* ---------- modal handlers ---------- */
  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, branchId: isBranchScoped ? user.branchId : '' });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(dept) {
    setEditing(dept);
    setForm({
      name: dept.name || '',
      branchId: dept.branchId || '',
      managerId: dept.managerId || '',
      status: dept.status || 'active',
    });
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Department name is required.';
    if (!form.branchId) next.branchId = 'Please select a branch.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      branchId: form.branchId,
      managerId: form.managerId || null,
      status: form.status,
    };

    if (editing) {
      store.update('departments', editing.id, payload);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'departmentUpdated',
        target: editing.id,
        description: `Updated department "${payload.name}".`,
      });
      toast.success('Department updated.');
    } else {
      const record = store.insert('departments', { id: store.genId('dp'), ...payload });
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'departmentCreated',
        target: record.id,
        description: `Created department "${payload.name}".`,
      });
      toast.success('Department created.');
    }
    closeModal();
  }

  function handleDelete() {
    if (!confirmTarget) return;
    const dept = confirmTarget;
    store.remove('departments', dept.id);
    store.addAudit({
      actor: user?.name,
      role: user?.role,
      action: 'departmentDeleted',
      target: dept.id,
      description: `Deleted department "${dept.name}".`,
    });
    toast.success('Department deleted.');
    setConfirmTarget(null);
  }

  /* ---------- table columns ---------- */
  const columns = [
    {
      key: 'name',
      label: 'Department',
      render: (row) => <span className="ft-cell-strong">{row.name}</span>,
    },
    {
      key: 'branch',
      label: 'Branch',
      sortValue: (row) => byId(branches, row.branchId)?.name || '',
      render: (row) => byId(branches, row.branchId)?.name || '—',
    },
    {
      key: 'manager',
      label: 'Manager',
      sortValue: (row) => nameOf(employees, row.managerId),
      render: (row) => <span className="ft-cell-dim">{nameOf(employees, row.managerId)}</span>,
    },
    {
      key: 'employees',
      label: 'Employees',
      align: 'center',
      sortValue: (row) => countFor(row.id),
      render: (row) => <span className="ft-pill">{countFor(row.id)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => <StatusBadge map={EMPLOYEE_STATUS} value={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="ft-cell-actions">
          <button
            type="button"
            className="ft-icon-btn"
            aria-label={`Edit ${row.name}`}
            onClick={() => openEdit(row)}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="ft-icon-btn"
            aria-label={`Delete ${row.name}`}
            onClick={() => setConfirmTarget(row)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Departments"
        subtitle="Organize teams, assign managers, and track headcount per department."
        actions={
          <button type="button" className="ft-btn ft-btn--primary" onClick={openAdd}>
            <Plus size={16} /> Add Department
          </button>
        }
      />

      <SectionCard
        title="All Departments"
        subtitle={`${rows.length} department${rows.length === 1 ? '' : 's'}`}
        icon={Network}
      >
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search departments, branches, or managers…"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyMessage="No departments found. Add one to get started."
        />
      </SectionCard>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Department' : 'Add Department'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={handleSave}>
              {editing ? 'Save Changes' : 'Create Department'}
            </button>
          </>
        }
      >
        <div className="ft-grid-2">
          <TextField
            label="Department Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Engineering"
            error={errors.name}
          />
          <SelectField
            label="Branch"
            required
            value={form.branchId}
            onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value, managerId: '' }))}
            options={branchOptions}
            placeholder="Select branch"
            error={errors.branchId}
          />
          <SelectField
            label="Manager (optional)"
            value={form.managerId}
            onChange={(e) => setForm((f) => ({ ...f, managerId: e.target.value }))}
            options={managerOptions}
            placeholder="No manager assigned"
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete department?"
        message={
          confirmTarget
            ? `This will permanently remove "${confirmTarget.name}". Employees keep their records but lose this department assignment.`
            : ''
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </section>
  );
}
