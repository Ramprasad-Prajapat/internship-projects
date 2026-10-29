// FaceTrack AI — My Attendance (employee self-service, frontend-only mode).
// Shows the signed-in employee's own attendance history with a month picker and
// status chips, plus a CSV export. Read-only — no mutations here.

import { useState, useMemo } from 'react';
import { Download, Camera, ClipboardList, CalendarDays } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  StatusBadge,
  FilterChips,
  EmptyState,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { byId } from '../../services/selectors';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { todayISO, prettyDate, formatMinutes } from '../../utils/dateUtils';
import { exportToCsv } from '../../utils/exportUtils';

// All / per-status filter chips.
const STATUS_CHIPS = [
  { value: '', label: 'All' },
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'On Leave' },
];

const currentMonth = () => todayISO().slice(0, 7); // "YYYY-MM"

export default function MyAttendancePage() {
  const { user } = useAuth();
  const toast = useToast();

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const shifts = useCollection('shifts');

  const emp = byId(employees, user?.employeeId);

  const [month, setMonth] = useState(currentMonth());
  const [status, setStatus] = useState('');

  // Own attendance, filtered by selected month + status.
  const rows = useMemo(() => {
    if (!emp) return [];
    return attendance.filter((a) => {
      if (a.employeeId !== emp.id) return false;
      if (month && !a.date.startsWith(month)) return false;
      if (status && a.status !== status) return false;
      return true;
    });
  }, [attendance, emp, month, status]);

  const locationBadge = (loc) => {
    if (!loc) return <span className="ft-cell-dim">—</span>;
    if (loc.status === 'insideRadius') return <StatusBadge tone="success" label="Inside" />;
    return <StatusBadge tone="danger" label="Outside" />;
  };

  const columns = useMemo(
    () => [
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
        key: 'location',
        label: 'Location',
        align: 'center',
        sortable: false,
        render: (r) => locationBadge(r.location),
      },
    ],
    [shifts]
  );

  const exportColumns = useMemo(
    () => [
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
    [shifts]
  );

  const handleExportCsv = () => {
    if (!rows.length) {
      toast.success('Nothing to export for this period.');
      return;
    }
    exportToCsv(`my-attendance-${month || 'all'}`, rows, exportColumns);
    toast.success('Exported your attendance to CSV.');
  };

  const headerActions = (
    <button type="button" className="ft-btn ft-btn--subtle" onClick={handleExportCsv}>
      <Download size={16} /> Export CSV
    </button>
  );

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="My Attendance" subtitle="Your personal attendance history." />
        <SectionCard title="Attendance">
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
        title="My Attendance"
        subtitle="Your personal attendance history."
        actions={headerActions}
      />

      <SectionCard title="History" subtitle={`${rows.length} record(s)`}>
        <div className="ft-toolbar">
          <input
            type="month"
            className="ft-glass"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Filter by month"
            style={{ padding: '8px 12px', borderRadius: 10, color: 'var(--ft-text-dim)' }}
          />
          <button
            type="button"
            className="ft-btn ft-btn--ghost ft-btn--sm"
            onClick={() => setMonth('')}
          >
            All months
          </button>

          <div className="ft-toolbar-grow" />

          <FilterChips value={status} onChange={setStatus} options={STATUS_CHIPS} />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'date', dir: 'desc' }}
          emptyMessage="No attendance records for the selected filters."
        />
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: Camera, label: 'Mark attendance', hint: 'Face + location check-in/out', to: '/employee/mark-attendance', tone: 'primary' },
          { icon: ClipboardList, label: 'Raise a correction', hint: 'Fix a wrong or missed record', to: '/employee/corrections', tone: 'warning' },
          { icon: CalendarDays, label: 'Monthly summary', hint: 'Your month at a glance', to: '/employee/monthly-summary', tone: 'accent' },
        ]}
      />
    </section>
  );
}
