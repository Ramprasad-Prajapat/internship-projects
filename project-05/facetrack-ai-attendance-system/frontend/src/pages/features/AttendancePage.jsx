// FaceTrack AI — Attendance records page (frontend-only mode).
// Role-scoped attendance table with date/department/branch/status/name filters,
// CSV + print export, and manual record editing for hr/superAdmin/branchAdmin.

import { useState, useMemo } from 'react';
import { Pencil, Download, Printer, FileBarChart, ShieldAlert, ScanFace, CheckCircle2 } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterSelect,
  TextField,
  TextAreaField,
  SelectField,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { useToast } from '../../hooks/useToast';
import { scopeEmployees, scopeAttendance, byId, nameOf } from '../../services/selectors';
import { ATTENDANCE_STATUS, ROLE_BASE } from '../../utils/constants';
import { todayISO, prettyDate, formatMinutes } from '../../utils/dateUtils';
import { classifyCheckIn, computeOvertimeMinutes, computeTotalHours } from '../../utils/attendanceUtils';
import { exportToCsv, printReport } from '../../utils/exportUtils';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'On Leave' },
];

const EMPTY_EDIT = { id: null, checkIn: '', checkOut: '', status: 'present', reason: '' };

// 24-hour HH:MM (00:00–23:59). Empty string means "no time" (cleared) and is
// validated separately depending on the chosen status.
const HHMM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const isValidHHMM = (t) => HHMM_RE.test((t || '').trim());

export default function AttendancePage() {
  const { user, role } = useAuth();
  const toast = useToast();

  const attendance = useCollection('attendance');
  const employees = useCollection('employees');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');

  const canEdit = role === 'hr' || role === 'superAdmin' || role === 'branchAdmin';

  const scopedEmployees = useMemo(() => scopeEmployees(employees, user), [employees, user]);
  const scopedRows = useMemo(() => scopeAttendance(attendance, scopedEmployees), [attendance, scopedEmployees]);

  // ---- filter state ----
  const [date, setDate] = useState(todayISO());
  const [departmentId, setDepartmentId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  // ---- filter option lists (scoped) ----
  const deptOptions = useMemo(() => {
    const ids = new Set(scopedEmployees.map((e) => e.departmentId));
    return departments
      .filter((d) => ids.has(d.id))
      .map((d) => ({ value: d.id, label: d.name }));
  }, [departments, scopedEmployees]);

  const branchOptions = useMemo(() => {
    const ids = new Set(scopedEmployees.map((e) => e.branchId));
    return branches
      .filter((b) => ids.has(b.id))
      .map((b) => ({ value: b.id, label: b.name }));
  }, [branches, scopedEmployees]);

  // ---- apply filters ----
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedRows.filter((r) => {
      if (date && r.date !== date) return false;
      const emp = byId(scopedEmployees, r.employeeId);
      if (departmentId && r.departmentId !== departmentId) return false;
      if (branchId && r.branchId !== branchId) return false;
      if (status && r.status !== status) return false;
      if (q && !(emp?.name || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [scopedRows, scopedEmployees, date, departmentId, branchId, status, query]);

  // ---- edit modal ----
  const [edit, setEdit] = useState(EMPTY_EDIT);
  const [editOpen, setEditOpen] = useState(false);
  const [reasonError, setReasonError] = useState('');
  const [timeErrors, setTimeErrors] = useState({ checkIn: '', checkOut: '' });

  function openEdit(row) {
    setEdit({
      id: row.id,
      checkIn: row.checkIn || '',
      checkOut: row.checkOut || '',
      status: row.status || 'present',
      reason: '',
    });
    setReasonError('');
    setTimeErrors({ checkIn: '', checkOut: '' });
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEdit(EMPTY_EDIT);
    setReasonError('');
    setTimeErrors({ checkIn: '', checkOut: '' });
  }

  function saveEdit() {
    // ---- validate the manual times before touching the store ----
    // Any provided time must be a real 24-hour HH:MM; an empty time means
    // "cleared". A present/late record must have a valid check-in (otherwise the
    // attendance math would classify it absent / produce NaN late/overtime).
    const checkIn = edit.checkIn.trim();
    const checkOut = edit.checkOut.trim();
    const nextTimeErrors = { checkIn: '', checkOut: '' };

    if (checkIn && !isValidHHMM(checkIn)) {
      nextTimeErrors.checkIn = 'Enter a valid 24-hour time, e.g. 09:30.';
    } else if (!checkIn && (edit.status === 'present' || edit.status === 'late')) {
      nextTimeErrors.checkIn = 'Check-in time is required for a present/late record.';
    }
    if (checkOut && !isValidHHMM(checkOut)) {
      nextTimeErrors.checkOut = 'Enter a valid 24-hour time, e.g. 18:00.';
    }

    const reason = edit.reason.trim();
    const reasonMissing = !reason;
    if (reasonMissing) setReasonError('A reason is required for a manual edit.');

    if (nextTimeErrors.checkIn || nextTimeErrors.checkOut) {
      setTimeErrors(nextTimeErrors);
      return;
    }
    if (reasonMissing) return;

    const row = byId(attendance, edit.id);
    if (!row) {
      closeEdit();
      return;
    }
    const shift = byId(shifts, row.shiftId);
    const newCheckIn = checkIn || null;
    const newCheckOut = checkOut || null;
    const lateMinutes = classifyCheckIn(newCheckIn, shift).lateMinutes;
    const overtimeMinutes = computeOvertimeMinutes(newCheckOut, shift);
    const totalHours = computeTotalHours(newCheckIn, newCheckOut);

    store.update('attendance', edit.id, {
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      status: edit.status,
      lateMinutes,
      overtimeMinutes,
      totalHours,
      manualEditReason: reason,
      markedBy: 'manual',
    });

    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'attendanceEdited',
      target: edit.id,
      description: `Edited attendance for ${nameOf(employees, row.employeeId)} on ${row.date}: ${reason}`,
    });

    toast.success('Attendance record updated.');
    closeEdit();
  }

  // ---- mark verified (HR/admin mock action) ----
  function markVerified(row) {
    store.update('attendance', row.id, { verified: true });
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'attendanceVerified',
      target: row.id,
      description: `Marked attendance verified for ${nameOf(employees, row.employeeId)} on ${row.date}`,
    });
    toast.success('Attendance record marked as verified.');
  }

  // ---- location badge ----
  function locationBadge(loc) {
    if (!loc) return <span className="ft-cell-dim">—</span>;
    if (loc.status === 'insideRadius') return <StatusBadge tone="success" label="Inside" />;
    return <StatusBadge tone="danger" label="Outside" />;
  }

  // ---- table columns ----
  const columns = useMemo(() => {
    const cols = [
      {
        key: 'employee',
        label: 'Employee',
        sortValue: (r) => byId(scopedEmployees, r.employeeId)?.name || '',
        render: (r) => {
          const emp = byId(scopedEmployees, r.employeeId);
          return (
            <div className="ft-id-cell">
              <Avatar name={emp?.name || '—'} color={emp?.avatarColor} size="sm" />
              <div>
                <div className="ft-id-name">{emp?.name || '—'}</div>
                <div className="ft-id-sub">{emp?.employeeCode || '—'}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: 'date',
        label: 'Date',
        sortValue: (r) => r.date,
        render: (r) => prettyDate(r.date),
      },
      {
        key: 'shift',
        label: 'Shift',
        sortable: false,
        render: (r) => byId(shifts, r.shiftId)?.name || '—',
      },
      {
        key: 'checkIn',
        label: 'Check In',
        align: 'center',
        render: (r) => r.checkIn || '—',
      },
      {
        key: 'checkOut',
        label: 'Check Out',
        align: 'center',
        render: (r) => r.checkOut || '—',
      },
      {
        key: 'status',
        label: 'Status',
        align: 'center',
        render: (r) => <StatusBadge map={ATTENDANCE_STATUS} value={r.status} />,
      },
      {
        key: 'lateMinutes',
        label: 'Late',
        align: 'right',
        sortValue: (r) => r.lateMinutes || 0,
        render: (r) => formatMinutes(r.lateMinutes),
      },
      {
        key: 'overtimeMinutes',
        label: 'Overtime',
        align: 'right',
        sortValue: (r) => r.overtimeMinutes || 0,
        render: (r) => formatMinutes(r.overtimeMinutes),
      },
      {
        key: 'totalHours',
        label: 'Hours',
        align: 'right',
        sortValue: (r) => r.totalHours || 0,
        render: (r) => (r.totalHours ? `${r.totalHours}h` : '—'),
      },
      {
        key: 'confidence',
        label: 'Face',
        align: 'center',
        sortValue: (r) => r.confidence || 0,
        render: (r) => (r.confidence != null ? `${Math.round(r.confidence * 100)}%` : '—'),
      },
      {
        key: 'location',
        label: 'Location',
        align: 'center',
        sortable: false,
        render: (r) => locationBadge(r.location),
      },
    ];

    if (canEdit) {
      cols.push({
        key: 'actions',
        label: 'Actions',
        align: 'right',
        sortable: false,
        render: (r) => (
          <div className="ft-cell-actions">
            {r.verified ? (
              <span className="ft-icon-btn" title="Verified" style={{ color: 'var(--ft-green)' }}>
                <CheckCircle2 size={16} />
              </span>
            ) : (
              <button
                type="button"
                className="ft-icon-btn"
                title="Mark as Verified"
                aria-label="Mark attendance as verified"
                onClick={() => markVerified(r)}
              >
                <CheckCircle2 size={16} />
              </button>
            )}
            <button
              type="button"
              className="ft-icon-btn"
              title="Manual review / edit"
              aria-label="Manual review or edit record"
              onClick={() => openEdit(r)}
            >
              <Pencil size={16} />
            </button>
          </div>
        ),
      });
    }
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedEmployees, shifts, canEdit]);

  // ---- export ----
  const exportColumns = useMemo(
    () => [
      { key: 'name', label: 'Employee', format: (_v, r) => nameOf(employees, r.employeeId) },
      { key: 'employeeCode', label: 'Code', format: (_v, r) => byId(employees, r.employeeId)?.employeeCode || '' },
      { key: 'date', label: 'Date', format: (v) => prettyDate(v) },
      { key: 'shiftId', label: 'Shift', format: (v) => byId(shifts, v)?.name || '' },
      { key: 'checkIn', label: 'Check In', format: (v) => v || '—' },
      { key: 'checkOut', label: 'Check Out', format: (v) => v || '—' },
      { key: 'status', label: 'Status', format: (v) => ATTENDANCE_STATUS[v]?.label || v },
      { key: 'lateMinutes', label: 'Late', format: (v) => formatMinutes(v) },
      { key: 'overtimeMinutes', label: 'Overtime', format: (v) => formatMinutes(v) },
      {
        key: 'location',
        label: 'Location',
        format: (v) => (v ? (v.status === 'insideRadius' ? 'Inside' : 'Outside') : '—'),
      },
    ],
    [employees, shifts]
  );

  const exportSubtitle = date ? `Date: ${prettyDate(date)} · ${rows.length} record(s)` : `All dates · ${rows.length} record(s)`;

  function handleExportCsv() {
    if (!rows.length) {
      toast.warning('Nothing to export for the current filters.');
      return;
    }
    exportToCsv('attendance', rows, exportColumns);
    toast.success('Exported attendance to CSV.');
  }

  function handlePrint() {
    printReport({
      title: 'Attendance Report',
      subtitle: exportSubtitle,
      columns: exportColumns,
      rows,
    });
  }

  const headerActions = (
    <>
      <button type="button" className="ft-btn ft-btn--subtle" onClick={handleExportCsv}>
        <Download size={16} /> Export CSV
      </button>
      <button type="button" className="ft-btn ft-btn--ghost" onClick={handlePrint}>
        <Printer size={16} /> Print
      </button>
    </>
  );

  return (
    <section className="ft-page">
      <PageHeader
        title="Attendance Records"
        subtitle="Review and manage daily attendance across your scope."
        actions={headerActions}
      />

      <SectionCard title="Records" subtitle={`${rows.length} record(s)`}>
        <div className="ft-toolbar">
          <input
            type="date"
            className="ft-glass"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Filter by date"
            style={{ padding: '8px 12px', borderRadius: 10, color: 'var(--ft-text-dim)' }}
          />
          <button type="button" className="ft-btn ft-btn--ghost ft-btn--sm" onClick={() => setDate('')}>
            Clear date
          </button>

          <FilterSelect
            value={departmentId}
            onChange={setDepartmentId}
            options={deptOptions}
            allLabel="All departments"
          />

          {role !== 'branchAdmin' && (
            <FilterSelect
              value={branchId}
              onChange={setBranchId}
              options={branchOptions}
              allLabel="All branches"
            />
          )}

          <FilterSelect
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            allLabel="All statuses"
          />

          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search employee name..." />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={12}
          initialSort={{ key: 'date', dir: 'desc' }}
          emptyMessage="No attendance records match these filters."
        />
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: FileBarChart, label: 'Open reports', hint: 'Export & analytics', to: `${ROLE_BASE[role]}/reports`, tone: 'primary' },
          (role === 'hr' || role === 'superAdmin') && {
            icon: ShieldAlert, label: 'Suspicious scans', hint: 'Review flagged scans', to: `${ROLE_BASE[role]}/suspicious-scans`, tone: 'danger',
          },
          role === 'hr' && {
            icon: ScanFace, label: 'Face approvals', hint: 'Approve registrations', to: `${ROLE_BASE[role]}/face-approvals`, tone: 'accent',
          },
        ]}
      />

      {canEdit && (
        <Modal
          open={editOpen}
          title="Edit Attendance Record"
          size="md"
          onClose={closeEdit}
          footer={
            <>
              <button type="button" className="ft-btn ft-btn--ghost" onClick={closeEdit}>
                Cancel
              </button>
              <button type="button" className="ft-btn ft-btn--primary" onClick={saveEdit}>
                Save Changes
              </button>
            </>
          }
        >
          <div className="ft-grid-2">
            <TextField
              label="Check In (HH:MM)"
              value={edit.checkIn}
              onChange={(e) => {
                setEdit((s) => ({ ...s, checkIn: e.target.value }));
                if (timeErrors.checkIn) setTimeErrors((t) => ({ ...t, checkIn: '' }));
              }}
              placeholder="09:00"
              error={timeErrors.checkIn}
            />
            <TextField
              label="Check Out (HH:MM)"
              value={edit.checkOut}
              onChange={(e) => {
                setEdit((s) => ({ ...s, checkOut: e.target.value }));
                if (timeErrors.checkOut) setTimeErrors((t) => ({ ...t, checkOut: '' }));
              }}
              placeholder="18:00"
              error={timeErrors.checkOut}
            />
          </div>

          <SelectField
            label="Status"
            value={edit.status}
            onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}
            options={STATUS_OPTIONS}
          />

          <TextAreaField
            label="Reason for manual edit"
            value={edit.reason}
            onChange={(e) => {
              setEdit((s) => ({ ...s, reason: e.target.value }));
              if (reasonError) setReasonError('');
            }}
            required
            error={reasonError}
            placeholder="Explain why this record is being changed..."
          />
        </Modal>
      )}
    </section>
  );
}
