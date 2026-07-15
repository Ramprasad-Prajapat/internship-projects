// FaceTrack AI — Correction Requests review (HR/admin, frontend-only mode).
// HR reviews employee attendance-correction requests, approves/rejects with an
// optional remark, and (on approve) patches the matching attendance row so the
// corrected check-in/out reflows late/overtime/total-hours via attendance math.

import { useState, useMemo } from 'react';
import { ClipboardList, Check, X } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterChips,
  TextAreaField,
  MetricCard,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId, nameOf } from '../../services/selectors';
import { REQUEST_STATUS, CORRECTION_TYPES } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';
import {
  classifyCheckIn,
  computeOvertimeMinutes,
  computeTotalHours,
} from '../../utils/attendanceUtils';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

const typeLabel = (value) =>
  CORRECTION_TYPES.find((t) => t.value === value)?.label || value || '—';

export default function CorrectionRequestsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const correctionRequests = useCollection('correctionRequests');
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const shifts = useCollection('shifts');

  const [status, setStatus] = useState('pending');
  const [query, setQuery] = useState('');

  // The request being reviewed + the action chosen ('approve' | 'reject').
  const [review, setReview] = useState(null); // { request, action }
  const [remark, setRemark] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return correctionRequests.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q) return true;
      return nameOf(employees, r.employeeId).toLowerCase().includes(q);
    });
  }, [correctionRequests, employees, status, query]);

  const pendingCount = useMemo(
    () => correctionRequests.filter((r) => r.status === 'pending').length,
    [correctionRequests]
  );

  const openReview = (request, action) => {
    setReview({ request, action });
    setRemark('');
  };

  const closeReview = () => {
    setReview(null);
    setRemark('');
  };

  // On approve, if the correction carries a requested time for a time-based
  // type, find the employee's attendance row for that date and reflow it.
  // Returns a result so the caller can avoid a fake "approved" with no change:
  //   { applied: true }                      → an attendance row was updated
  //   { applied: false, reason: 'notApplicable' } → nothing to patch (non-time
  //        correction, or no requested times) — approving is still valid
  //   { applied: false, reason: 'noRow' }    → a time correction with requested
  //        times but NO matching attendance row to update
  function applyAttendanceCorrection(request) {
    const timeTypes = ['missedCheckIn', 'missedCheckOut', 'wrongTime'];
    if (!timeTypes.includes(request.type)) return { applied: false, reason: 'notApplicable' };
    if (!request.requestedCheckIn && !request.requestedCheckOut) return { applied: false, reason: 'notApplicable' };

    const row = attendance.find(
      (a) => a.employeeId === request.employeeId && a.date === request.date
    );
    if (!row) return { applied: false, reason: 'noRow' };

    const shift = byId(shifts, row.shiftId);
    const nextCheckIn = request.requestedCheckIn ?? row.checkIn;
    const nextCheckOut = request.requestedCheckOut ?? row.checkOut;

    const patch = {
      checkIn: nextCheckIn,
      checkOut: nextCheckOut,
      markedBy: 'correction',
      manualEditReason: request.reason || 'Correction approved',
    };

    // Recompute late + status only when we have a (new) check-in.
    if (nextCheckIn) {
      const classified = classifyCheckIn(nextCheckIn, shift);
      patch.lateMinutes = classified.lateMinutes;
      patch.status = classified.status;
    }
    patch.overtimeMinutes = computeOvertimeMinutes(nextCheckOut, shift);
    patch.totalHours = computeTotalHours(nextCheckIn, nextCheckOut);

    store.update('attendance', row.id, patch);
    return { applied: true };
  }

  const confirmReview = () => {
    if (!review) return;
    const { request, action } = review;
    const hrRemark = remark.trim();
    const empName = nameOf(employees, request.employeeId);

    if (action === 'approve') {
      // Try to apply the correction FIRST. If it's a time correction with no
      // matching attendance row, block the approval and warn instead of showing
      // a fake "approved" that changed nothing.
      const result = applyAttendanceCorrection(request);
      if (result.reason === 'noRow') {
        toast.warning(
          `No matching attendance record found for ${empName} on ${prettyDate(request.date)} — correction not applied.`
        );
        return; // leave the request pending; modal stays open so HR can decide
      }

      store.update('correctionRequests', request.id, {
        status: 'approved',
        hrRemark,
        reviewedBy: user.employeeId,
      });
      store.addAudit({
        actor: user.name,
        role: user.role,
        action: 'correctionApproved',
        target: request.id,
        description: `Approved ${typeLabel(request.type)} correction for ${empName} (${request.date})`,
      });
      toast.success(result.applied ? 'Correction approved — attendance updated' : 'Correction approved');
    } else {
      store.update('correctionRequests', request.id, {
        status: 'rejected',
        hrRemark,
        reviewedBy: user.employeeId,
      });
      store.addAudit({
        actor: user.name,
        role: user.role,
        action: 'correctionRejected',
        target: request.id,
        description: `Rejected ${typeLabel(request.type)} correction for ${empName} (${request.date})`,
      });
      toast.success('Correction rejected');
    }
    closeReview();
  };

  const renderEmployee = (row) => {
    const emp = byId(employees, row.employeeId);
    return (
      <div className="ft-id-cell">
        <Avatar name={emp?.name || 'Unknown'} color={emp?.avatarColor} size="sm" />
        <div>
          <div className="ft-id-name">{emp?.name || 'Unknown'}</div>
          <div className="ft-id-sub">{emp?.employeeCode || '—'}</div>
        </div>
      </div>
    );
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

  const renderActions = (row) => {
    if (row.status !== 'pending') {
      return <span className="ft-cell-dim">Reviewed</span>;
    }
    return (
      <div className="ft-cell-actions">
        <button
          type="button"
          className="ft-btn ft-btn--success ft-btn--sm"
          onClick={() => openReview(row, 'approve')}
        >
          <Check size={14} /> Approve
        </button>
        <button
          type="button"
          className="ft-btn ft-btn--danger ft-btn--sm"
          onClick={() => openReview(row, 'reject')}
        >
          <X size={14} /> Reject
        </button>
      </div>
    );
  };

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      sortValue: (row) => nameOf(employees, row.employeeId),
      render: renderEmployee,
    },
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
      key: 'status',
      label: 'Status',
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge map={REQUEST_STATUS} value={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: renderActions,
    },
  ];

  const reviewName = review ? nameOf(employees, review.request.employeeId) : '';

  return (
    <section className="ft-page">
      <PageHeader
        title="Correction Requests"
        subtitle="Review and resolve employee attendance corrections."
      />

      <div className="ft-kpi-grid">
        <MetricCard
          icon={ClipboardList}
          label="Pending Corrections"
          value={pendingCount}
          tone="warning"
        />
        <MetricCard
          icon={ClipboardList}
          label="Total Requests"
          value={correctionRequests.length}
          tone="primary"
        />
      </div>

      <SectionCard title="Requests" icon={ClipboardList}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by employee name..."
            />
          </div>
          <FilterChips value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'date', dir: 'desc' }}
          emptyMessage="No correction requests found."
        />
      </SectionCard>

      <Modal
        open={!!review}
        title={review?.action === 'approve' ? 'Approve Correction' : 'Reject Correction'}
        onClose={closeReview}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--subtle" onClick={closeReview}>
              Cancel
            </button>
            <button
              type="button"
              className={`ft-btn ${
                review?.action === 'approve' ? 'ft-btn--success' : 'ft-btn--danger'
              }`}
              onClick={confirmReview}
            >
              {review?.action === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </>
        }
      >
        {review ? (
          <>
            <div className="ft-meta-grid">
              <div className="ft-meta-item">
                <span className="ft-meta-key">Employee</span>
                <span className="ft-meta-val">{reviewName}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Date</span>
                <span className="ft-meta-val">{prettyDate(review.request.date)}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Type</span>
                <span className="ft-meta-val">{typeLabel(review.request.type)}</span>
              </div>
              <div className="ft-meta-item">
                <span className="ft-meta-key">Requested</span>
                <span className="ft-meta-val">
                  In {review.request.requestedCheckIn || '—'} · Out{' '}
                  {review.request.requestedCheckOut || '—'}
                </span>
              </div>
            </div>
            <p className="ft-note">{review.request.reason || 'No reason provided.'}</p>
            <TextAreaField
              label="HR Remark (optional)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add a note for the employee..."
            />
          </>
        ) : null}
      </Modal>
    </section>
  );
}
