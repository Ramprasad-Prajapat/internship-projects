// FaceTrack AI — My Leave (employee self-service, frontend-only mode).
// The signed-in employee views their own leave requests and applies for new
// leave via a modal form. Validates the date range; inserts as 'pending'.

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  StatusBadge,
  EmptyState,
  SelectField,
  TextAreaField,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import { REQUEST_STATUS, LEAVE_TYPES } from '../../utils/constants';
import { todayISO, prettyDate } from '../../utils/dateUtils';

const LEAVE_TONE = {
  Casual: 'info',
  Sick: 'warning',
  Annual: 'accent',
  Unpaid: 'muted',
};

const emptyForm = () => ({
  leaveType: LEAVE_TYPES[0],
  startDate: todayISO(),
  endDate: todayISO(),
  reason: '',
});

export default function MyLeavePage() {
  const { user } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const leaveRequests = useCollection('leaveRequests');

  const emp = byId(employees, user?.employeeId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({ reason: '', endDate: '' });

  const rows = useMemo(() => {
    if (!emp) return [];
    return leaveRequests.filter((r) => r.employeeId === emp.id);
  }, [leaveRequests, emp]);

  const setField = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const openModal = () => {
    setForm(emptyForm());
    setErrors({ reason: '', endDate: '' });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setErrors({ reason: '', endDate: '' });
  };

  const submit = () => {
    const reason = form.reason.trim();
    const next = { reason: '', endDate: '' };
    if (!reason) next.reason = 'A reason is required.';
    if (form.endDate < form.startDate) next.endDate = 'End date must be on or after the start date.';

    if (next.reason || next.endDate) {
      setErrors(next);
      return;
    }
    if (!emp) return;

    store.insert('leaveRequests', {
      id: store.genId('lv'),
      employeeId: emp.id,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      reason,
      status: 'pending',
      approvedBy: null,
      createdAt: todayISO(),
    });

    toast.success('Leave request submitted.');
    closeModal();
  };

  const columns = [
    {
      key: 'leaveType',
      label: 'Type',
      sortValue: (row) => row.leaveType,
      render: (row) => (
        <StatusBadge tone={LEAVE_TONE[row.leaveType] || 'info'} label={row.leaveType} />
      ),
    },
    {
      key: 'range',
      label: 'Dates',
      sortValue: (row) => row.startDate,
      render: (row) => (
        <span className="ft-cell-strong">
          {prettyDate(row.startDate)} – {prettyDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      sortable: false,
      render: (row) => <span className="ft-cell-dim">{row.reason || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge map={REQUEST_STATUS} value={row.status} />,
    },
  ];

  const headerActions = (
    <button type="button" className="ft-btn ft-btn--primary" onClick={openModal} disabled={!emp}>
      <Plus size={16} /> Apply for leave
    </button>
  );

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="My Leave" subtitle="Apply for and track your leave requests." />
        <SectionCard title="Leave Requests">
          <EmptyState
            title="No employee profile linked"
            message="Your account is not linked to an employee record yet."
          />
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="ft-page">
      <PageHeader
        title="My Leave"
        subtitle="Apply for and track your leave requests."
        actions={headerActions}
      />

      <SectionCard title="My Requests" subtitle={`${rows.length} request(s)`}>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'range', dir: 'desc' }}
          emptyMessage="You have not applied for any leave yet."
        />
      </SectionCard>

      <Modal
        open={open}
        title="Apply for Leave"
        size="md"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="ft-btn ft-btn--primary" onClick={submit}>
              Submit Request
            </button>
          </>
        }
      >
        <SelectField
          label="Leave Type"
          value={form.leaveType}
          onChange={setField('leaveType')}
          options={LEAVE_TYPES.map((t) => ({ value: t, label: t }))}
        />

        <div className="ft-grid-2">
          <label className="ft-field">
            <span>
              Start Date
              <span style={{ color: 'var(--ft-red)' }}> *</span>
            </span>
            <input type="date" value={form.startDate} onChange={setField('startDate')} />
          </label>

          <label className={`ft-field${errors.endDate ? ' ft-field--error' : ''}`}>
            <span>
              End Date
              <span style={{ color: 'var(--ft-red)' }}> *</span>
            </span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => {
                setForm((s) => ({ ...s, endDate: e.target.value }));
                if (errors.endDate) setErrors((s) => ({ ...s, endDate: '' }));
              }}
            />
            {errors.endDate ? <span className="ft-field-error">{errors.endDate}</span> : null}
          </label>
        </div>

        <TextAreaField
          label="Reason"
          value={form.reason}
          onChange={(e) => {
            setForm((s) => ({ ...s, reason: e.target.value }));
            if (errors.reason) setErrors((s) => ({ ...s, reason: '' }));
          }}
          required
          error={errors.reason}
          placeholder="Briefly describe the reason for your leave..."
        />
      </Modal>
    </section>
  );
}
