// FaceTrack AI — Shifts management page.
// Lists work shifts with start/end times, grace period, overtime threshold, and
// status, plus an Add/Edit modal and delete confirmation. Numeric fields are
// coerced to Numbers before persisting. Every action mutates the mock store
// and is recorded in the audit log.

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
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
import { EMPLOYEE_STATUS } from '../../utils/constants';

const EMPTY_FORM = {
  name: '',
  start: '09:00',
  end: '18:00',
  graceMinutes: '10',
  overtimeAfterMinutes: '30',
  status: 'active',
};

export default function ShiftsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const shifts = useCollection('shifts');

  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // shift being edited, or null for add
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shifts;
    return shifts.filter((s) => s.name.toLowerCase().includes(q));
  }, [shifts, query]);

  /* ---------- modal handlers ---------- */
  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(shift) {
    setEditing(shift);
    setForm({
      name: shift.name || '',
      start: shift.start || '',
      end: shift.end || '',
      graceMinutes: String(shift.graceMinutes ?? ''),
      overtimeAfterMinutes: String(shift.overtimeAfterMinutes ?? ''),
      status: shift.status || 'active',
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
    if (!form.name.trim()) next.name = 'Shift name is required.';
    if (!form.start) next.start = 'Start time is required.';
    if (!form.end) next.end = 'End time is required.';
    if (form.graceMinutes === '' || Number(form.graceMinutes) < 0)
      next.graceMinutes = 'Enter a non-negative number.';
    if (form.overtimeAfterMinutes === '' || Number(form.overtimeAfterMinutes) < 0)
      next.overtimeAfterMinutes = 'Enter a non-negative number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      start: form.start,
      end: form.end,
      graceMinutes: Number(form.graceMinutes),
      overtimeAfterMinutes: Number(form.overtimeAfterMinutes),
      status: form.status,
    };

    if (editing) {
      store.update('shifts', editing.id, payload);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'shiftUpdated',
        target: editing.id,
        description: `Updated shift "${payload.name}" (${payload.start}–${payload.end}).`,
      });
      toast.success('Shift updated.');
    } else {
      const record = store.insert('shifts', { id: store.genId('sh'), ...payload });
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'shiftCreated',
        target: record.id,
        description: `Created shift "${payload.name}" (${payload.start}–${payload.end}).`,
      });
      toast.success('Shift created.');
    }
    closeModal();
  }

  function handleDelete() {
    if (!confirmTarget) return;
    const shift = confirmTarget;
    store.remove('shifts', shift.id);
    store.addAudit({
      actor: user?.name,
      role: user?.role,
      action: 'shiftDeleted',
      target: shift.id,
      description: `Deleted shift "${shift.name}".`,
    });
    toast.success('Shift deleted.');
    setConfirmTarget(null);
  }

  /* ---------- table columns ---------- */
  const columns = [
    {
      key: 'name',
      label: 'Shift',
      render: (row) => <span className="ft-cell-strong">{row.name}</span>,
    },
    {
      key: 'start',
      label: 'Start',
      align: 'center',
      render: (row) => <span className="ft-pill">{row.start}</span>,
    },
    {
      key: 'end',
      label: 'End',
      align: 'center',
      render: (row) => <span className="ft-pill">{row.end}</span>,
    },
    {
      key: 'graceMinutes',
      label: 'Grace',
      align: 'center',
      sortValue: (row) => row.graceMinutes ?? 0,
      render: (row) => <span className="ft-cell-dim">{row.graceMinutes} min</span>,
    },
    {
      key: 'overtimeAfterMinutes',
      label: 'Overtime After',
      align: 'center',
      sortValue: (row) => row.overtimeAfterMinutes ?? 0,
      render: (row) => <span className="ft-cell-dim">{row.overtimeAfterMinutes} min</span>,
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
        title="Shifts"
        subtitle="Define working hours, grace periods, and overtime thresholds."
        actions={
          <button type="button" className="ft-btn ft-btn--primary" onClick={openAdd}>
            <Plus size={16} /> Add Shift
          </button>
        }
      />

      <SectionCard
        title="All Shifts"
        subtitle={`${rows.length} shift${rows.length === 1 ? '' : 's'}`}
        icon={Clock}
      >
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search shifts…" />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'start', dir: 'asc' }}
          emptyMessage="No shifts found. Add one to get started."
        />
      </SectionCard>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Shift' : 'Add Shift'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={handleSave}>
              {editing ? 'Save Changes' : 'Create Shift'}
            </button>
          </>
        }
      >
        <div className="ft-grid-2">
          <TextField
            label="Shift Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Morning Shift"
            error={errors.name}
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
          <TextField
            label="Start Time"
            required
            type="time"
            value={form.start}
            onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
            error={errors.start}
          />
          <TextField
            label="End Time"
            required
            type="time"
            value={form.end}
            onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            error={errors.end}
          />
          <TextField
            label="Grace (minutes)"
            type="number"
            min="0"
            value={form.graceMinutes}
            onChange={(e) => setForm((f) => ({ ...f, graceMinutes: e.target.value }))}
            placeholder="10"
            error={errors.graceMinutes}
          />
          <TextField
            label="Overtime After (minutes)"
            type="number"
            min="0"
            value={form.overtimeAfterMinutes}
            onChange={(e) => setForm((f) => ({ ...f, overtimeAfterMinutes: e.target.value }))}
            placeholder="30"
            error={errors.overtimeAfterMinutes}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete shift?"
        message={
          confirmTarget
            ? `This will permanently remove the "${confirmTarget.name}" shift. Employees assigned to it will need a new shift.`
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
