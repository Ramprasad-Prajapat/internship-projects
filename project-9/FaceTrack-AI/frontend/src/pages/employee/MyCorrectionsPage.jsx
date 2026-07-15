// FaceTrack AI — My Corrections (employee self-service, frontend-only mode).
// The signed-in employee views their own attendance-correction requests and
// submits new ones via a modal form. New requests are inserted as 'pending'.

import { useState, useMemo } from 'react';
import { Plus, Camera, CalendarCheck, CalendarDays } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  StatusBadge,
  EmptyState,
  SelectField,
  TextAreaField,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import { REQUEST_STATUS, CORRECTION_TYPES } from '../../utils/constants';
import { todayISO, prettyDate } from '../../utils/dateUtils';

const typeLabel = (value) =>
  CORRECTION_TYPES.find((t) => t.value === value)?.label || value || '—';

const emptyForm = () => ({
  date: todayISO(),
  type: CORRECTION_TYPES[0].value,
  reason: '',
  requestedCheckIn: '',
  requestedCheckOut: '',
});

export default function MyCorrectionsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const correctionRequests = useCollection('correctionRequests');

  const emp = byId(employees, user?.employeeId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [reasonError, setReasonError] = useState('');

  const rows = useMemo(() => {
    if (!emp) return [];
    return correctionRequests.filter((r) => r.employeeId === emp.id);
  }, [correctionRequests, emp]);

  const setField = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const openModal = () => {
    setForm(emptyForm());
    setReasonError('');
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setReasonError('');
  };

  const submit = () => {
    const reason = form.reason.trim();
    if (!reason) {
      setReasonError('A reason is required.');
      return;
    }
    if (!emp) return;

    store.insert('correctionRequests', {
      id: store.genId('cr'),
      employeeId: emp.id,
      date: form.date,
      type: form.type,
      reason,
      requestedCheckIn: form.requestedCheckIn || null,
      requestedCheckOut: form.requestedCheckOut || null,
      status: 'pending',
      hrRemark: '',
      createdAt: todayISO(),
    });

    toast.success('Correction request submitted.');
    closeModal();
  };

  const renderRequestedTimes = (row) => {
    const ci = row.requestedCheckIn || '—';
    const co = row.requestedCheckOut || '—';
    return (
      <span className="ft-cell-dim">
        In {ci} · Out {co}
      </span>
    );
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortValue: (row) => row.date,
      render: (row) => prettyDate(row.date),
    },
    {
      key: 'type',
      label: 'Type',
      sortValue: (row) => typeLabel(row.type),
      render: (row) => typeLabel(row.type),
    },
    {
      key: 'reason',
      label: 'Reason',
      sortable: false,
      render: (row) => <span className="ft-cell-dim">{row.reason || '—'}</span>,
    },
    {
      key: 'requested',
      label: 'Requested Times',
      sortable: false,
      render: renderRequestedTimes,
    },
    {
      key: 'hrRemark',
      label: 'HR Remark',
      sortable: false,
      render: (row) => <span className="ft-cell-dim">{row.hrRemark || '—'}</span>,
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
      <Plus size={16} /> New correction request
    </button>
  );

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="My Corrections" subtitle="Request fixes to your attendance records." />
        <SectionCard title="Correction Requests">
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
        title="My Corrections"
        subtitle="Request fixes to your attendance records."
        actions={headerActions}
      />

      <SectionCard title="My Requests" subtitle={`${rows.length} request(s)`}>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'date', dir: 'desc' }}
          emptyMessage="You have not submitted any correction requests."
        />
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: CalendarCheck, label: 'My attendance', hint: 'Review your records first', to: '/employee/my-attendance', tone: 'primary' },
          { icon: Camera, label: 'Mark attendance', hint: 'Face + location check-in/out', to: '/employee/mark-attendance', tone: 'success' },
          { icon: CalendarDays, label: 'Request leave', hint: 'Apply for time off', to: '/employee/leave', tone: 'accent' },
        ]}
      />

      <Modal
        open={open}
        title="New Correction Request"
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
        <div className="ft-grid-2">
          <label className="ft-field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={setField('date')} />
          </label>

          <SelectField
            label="Type"
            value={form.type}
            onChange={setField('type')}
            options={CORRECTION_TYPES}
          />
        </div>

        <TextAreaField
          label="Reason"
          value={form.reason}
          onChange={(e) => {
            setForm((s) => ({ ...s, reason: e.target.value }));
            if (reasonError) setReasonError('');
          }}
          required
          error={reasonError}
          placeholder="Explain what went wrong with this record..."
        />

        <div className="ft-grid-2">
          <label className="ft-field">
            <span>Requested Check-In</span>
            <input
              type="time"
              value={form.requestedCheckIn}
              onChange={setField('requestedCheckIn')}
            />
          </label>

          <label className="ft-field">
            <span>Requested Check-Out</span>
            <input
              type="time"
              value={form.requestedCheckOut}
              onChange={setField('requestedCheckOut')}
            />
          </label>
        </div>
      </Modal>
    </section>
  );
}
