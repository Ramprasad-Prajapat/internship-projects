// FaceTrack AI — Monthly Summary (employee self-service).
// A read-only view of the signed-in employee's own attendance for the current
// month: headline metrics, a status-distribution donut, an hours-per-day bar
// chart for the most recent days, and a table of every daily record.
// Frontend-only: data comes straight from the reactive store.

import { useMemo } from 'react';
import { Users } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  EmptyState,
  DonutChart,
  BarChart,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { byId } from '../../services/selectors';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { todayISO, monthLabel, prettyDate, formatMinutes } from '../../utils/dateUtils';

export default function MonthlySummaryPage() {
  const { user } = useAuth();
  const attendance = useCollection('attendance');
  const employees = useCollection('employees');

  const emp = useMemo(() => byId(employees, user?.employeeId), [employees, user]);
  const month = todayISO().slice(0, 7);

  // This employee's records for the current month, newest date first.
  const rows = useMemo(() => {
    if (!emp) return [];
    return attendance
      .filter((a) => a.employeeId === emp.id && a.date.startsWith(month))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, emp, month]);

  const metrics = useMemo(() => {
    const present = rows.filter((a) => a.status === 'present').length;
    const late = rows.filter((a) => a.status === 'late').length;
    const absent = rows.filter((a) => a.status === 'absent').length;
    const leave = rows.filter((a) => a.status === 'leave').length;
    const overtimeMins = rows.reduce((s, a) => s + (a.overtimeMinutes || 0), 0);
    // Working days = everything that isn't a leave day.
    const workingDays = present + late + absent;
    return {
      present,
      late,
      absent,
      leave,
      overtimeHours: Math.round(overtimeMins / 60),
      attendancePct: workingDays ? Math.round(((present + late) / workingDays) * 100) : 0,
    };
  }, [rows]);

  const donutData = useMemo(
    () => [
      { label: 'Present', value: metrics.present, color: 'var(--ft-green)' },
      { label: 'Late', value: metrics.late, color: 'var(--ft-yellow)' },
      { label: 'Absent', value: metrics.absent, color: 'var(--ft-red)' },
      { label: 'Leave', value: metrics.leave, color: 'var(--ft-accent)' },
    ],
    [metrics],
  );

  // Hours worked across the most recent ~7 days, oldest-to-newest for the bars.
  const barData = useMemo(
    () =>
      rows
        .slice(0, 7)
        .slice()
        .reverse()
        .map((a) => ({
          label: prettyDate(a.date).slice(0, 6), // "19 Jun"
          value: Math.round((a.totalHours || 0) * 10) / 10,
          color: 'var(--ft-primary)',
        })),
    [rows],
  );

  const columns = useMemo(
    () => [
      {
        key: 'date',
        label: 'Date',
        sortValue: (row) => row.date,
        render: (row) => <span className="ft-cell-strong">{prettyDate(row.date)}</span>,
      },
      {
        key: 'checkIn',
        label: 'Check-in',
        align: 'center',
        render: (row) => row.checkIn || '—',
      },
      {
        key: 'checkOut',
        label: 'Check-out',
        align: 'center',
        render: (row) => row.checkOut || '—',
      },
      {
        key: 'status',
        label: 'Status',
        align: 'center',
        render: (row) => <StatusBadge map={ATTENDANCE_STATUS} value={row.status} />,
      },
      {
        key: 'lateMinutes',
        label: 'Late',
        align: 'right',
        sortValue: (row) => row.lateMinutes || 0,
        render: (row) =>
          row.lateMinutes ? (
            <span style={{ color: 'var(--ft-yellow)' }}>{formatMinutes(row.lateMinutes)}</span>
          ) : (
            <span className="ft-cell-dim">—</span>
          ),
      },
      {
        key: 'overtimeMinutes',
        label: 'Overtime',
        align: 'right',
        sortValue: (row) => row.overtimeMinutes || 0,
        render: (row) =>
          row.overtimeMinutes ? (
            <span style={{ color: 'var(--ft-accent)' }}>{formatMinutes(row.overtimeMinutes)}</span>
          ) : (
            <span className="ft-cell-dim">—</span>
          ),
      },
    ],
    [],
  );

  if (!emp) {
    return (
      <section className="ft-page">
        <PageHeader title="Monthly Summary" subtitle="Your attendance this month." />
        <SectionCard title="Monthly Summary">
          <EmptyState
            icon={Users}
            title="No employee profile"
            message="Your account is not linked to an employee record yet."
          />
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="ft-page">
      <PageHeader title="Monthly Summary" subtitle={`Your attendance for ${monthLabel()}.`} />

      <div className="ft-kpi-grid">
        <MetricCard icon={Users} label="Present Days" value={metrics.present} tone="success" />
        <MetricCard icon={Users} label="Late Days" value={metrics.late} tone="warning" />
        <MetricCard icon={Users} label="Absent Days" value={metrics.absent} tone="danger" />
        <MetricCard icon={Users} label="Leave Days" value={metrics.leave} tone="accent" />
        <MetricCard
          icon={Users}
          label="Overtime (hrs)"
          value={metrics.overtimeHours}
          tone="info"
        />
        <MetricCard
          icon={Users}
          label="Attendance %"
          value={`${metrics.attendancePct}%`}
          tone="primary"
        />
      </div>

      <div className="ft-grid-2">
        <SectionCard title="Status Distribution" subtitle={monthLabel()}>
          {rows.length === 0 ? (
            <EmptyState icon={Users} title="No records" message="No attendance this month yet." />
          ) : (
            <DonutChart data={donutData} />
          )}
        </SectionCard>

        <SectionCard title="Hours Worked" subtitle="Most recent days">
          {barData.length === 0 ? (
            <EmptyState icon={Users} title="No records" message="No attendance this month yet." />
          ) : (
            <BarChart data={barData} />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Daily Records" subtitle={monthLabel()}>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'date', dir: 'desc' }}
          emptyMessage="No attendance records for this month."
        />
      </SectionCard>
    </section>
  );
}
