// FaceTrack AI — Reports & Analytics page (superAdmin / branchAdmin / hr / manager).
// Role-scoped, frontend-only reporting over the mock store. Pick a report type,
// filter by date/month + department/branch, then view metrics + one chart + a
// table. Export the active report to CSV / JSON / printable PDF.

import { useState, useMemo } from 'react';
import { FileBarChart, Download, Printer, Clock, Timer, ShieldAlert, Users, CalendarCheck } from 'lucide-react';
import {
  PageHeader, SectionCard, DataTable, MetricCard, FilterSelect, FilterChips,
  StatusBadge, DonutChart, BarChart, ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import { scopeEmployees, scopeAttendance, byId, nameOf } from '../../services/selectors';
import { ROLES, ATTENDANCE_STATUS, REQUEST_STATUS, ROLE_BASE } from '../../utils/constants';
import { todayISO, prettyDate, monthLabel, formatMinutes } from '../../utils/dateUtils';
import { exportToCsv, exportToJson, printReport } from '../../utils/exportUtils';

const REPORT_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'department', label: 'Department' },
  { value: 'late', label: 'Late' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'suspicious', label: 'Suspicious' },
];

const ATT_COLORS = {
  present: 'var(--ft-green)', late: 'var(--ft-yellow)', absent: 'var(--ft-red)', leave: 'var(--ft-accent)',
};

export default function ReportsPage() {
  const { user, role } = useAuth();
  const toast = useToast();
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const suspiciousScans = useCollection('suspiciousScans');

  const scopedEmployees = useMemo(() => scopeEmployees(employees, user), [employees, user]);
  const scopedAtt = useMemo(() => scopeAttendance(attendance, scopedEmployees), [attendance, scopedEmployees]);
  const empIds = useMemo(() => new Set(scopedEmployees.map((e) => e.id)), [scopedEmployees]);
  const scopedScans = useMemo(
    () => suspiciousScans.filter((s) => s.employeeId == null || empIds.has(s.employeeId)),
    [suspiciousScans, empIds]
  );

  const [type, setType] = useState('daily');
  const [date, setDate] = useState(todayISO());
  const [month, setMonth] = useState(todayISO().slice(0, 7));
  const [deptId, setDeptId] = useState('');
  const [branchId, setBranchId] = useState('');

  const showBranch = role === ROLES.SUPER_ADMIN || role === ROLES.HR;
  const useMonth = type === 'monthly';
  const showDateFilter = type === 'daily' || type === 'late' || type === 'overtime' || type === 'department' || type === 'suspicious';

  const deptOptions = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.name })),
    [departments]
  );
  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b.id, label: b.name })),
    [branches]
  );

  // Employees matching the dept/branch filters (used to scope attendance rows).
  const filteredEmpIds = useMemo(() => {
    const ids = new Set(
      scopedEmployees
        .filter((e) => (!deptId || e.departmentId === deptId) && (!branchId || e.branchId === branchId))
        .map((e) => e.id)
    );
    return ids;
  }, [scopedEmployees, deptId, branchId]);

  const empName = (id) => nameOf(employees, id);
  const deptName = (id) => byId(departments, id)?.name || '—';
  const branchName = (id) => byId(branches, id)?.name || '—';
  const shiftName = (id) => byId(shifts, id)?.name || '—';

  // Build the active report: { columns, rows, metrics, chart }.
  const report = useMemo(() => {
    const inScope = (a) => filteredEmpIds.has(a.employeeId);

    if (type === 'monthly') {
      const monthRows = scopedAtt.filter((a) => a.date.startsWith(month) && inScope(a));
      const rows = [...filteredEmpIds].map((id) => {
        const recs = monthRows.filter((a) => a.employeeId === id);
        const present = recs.filter((a) => a.status === 'present').length;
        const late = recs.filter((a) => a.status === 'late').length;
        const absent = recs.filter((a) => a.status === 'absent').length;
        const leave = recs.filter((a) => a.status === 'leave').length;
        const otMin = recs.reduce((s, a) => s + (a.overtimeMinutes || 0), 0);
        const emp = byId(employees, id);
        return {
          id, name: empName(id), department: deptName(emp?.departmentId),
          present, late, absent, leave, overtimeHrs: Math.round((otMin / 60) * 10) / 10,
        };
      }).filter((r) => r.name !== '—');
      const agg = rows.reduce((m, r) => {
        m.present += r.present; m.late += r.late; m.absent += r.absent; m.leave += r.leave; m.ot += r.overtimeHrs;
        return m;
      }, { present: 0, late: 0, absent: 0, leave: 0, ot: 0 });
      return {
        columns: [
          { key: 'name', label: 'Employee' }, { key: 'department', label: 'Department' },
          { key: 'present', label: 'Present', align: 'right' }, { key: 'late', label: 'Late', align: 'right' },
          { key: 'absent', label: 'Absent', align: 'right' }, { key: 'leave', label: 'Leave', align: 'right' },
          { key: 'overtimeHrs', label: 'Overtime (hrs)', align: 'right' },
        ],
        rows,
        metrics: [
          { icon: Users, label: 'Employees', value: rows.length, tone: 'primary' },
          { icon: FileBarChart, label: 'Present Days', value: agg.present, tone: 'success' },
          { icon: Clock, label: 'Late Days', value: agg.late, tone: 'warning' },
          { icon: Timer, label: 'Overtime (hrs)', value: Math.round(agg.ot * 10) / 10, tone: 'accent' },
        ],
        chartKind: 'donut',
        chart: [
          { label: 'Present', value: agg.present, color: ATT_COLORS.present },
          { label: 'Late', value: agg.late, color: ATT_COLORS.late },
          { label: 'Absent', value: agg.absent, color: ATT_COLORS.absent },
          { label: 'Leave', value: agg.leave, color: ATT_COLORS.leave },
        ],
      };
    }

    if (type === 'department') {
      const todays = scopedAtt.filter((a) => a.date === date && inScope(a));
      const deptList = departments.filter((d) => !branchId || d.branchId === branchId).filter((d) => !deptId || d.id === deptId);
      const rows = deptList.map((d) => {
        const recs = todays.filter((a) => a.departmentId === d.id);
        const present = recs.filter((a) => a.status === 'present' || a.status === 'late').length;
        const absent = recs.filter((a) => a.status === 'absent').length;
        const leave = recs.filter((a) => a.status === 'leave').length;
        return { id: d.id, name: d.name, present, absent, leave };
      });
      const totalPresent = rows.reduce((s, r) => s + r.present, 0);
      const totalAbsent = rows.reduce((s, r) => s + r.absent, 0);
      return {
        columns: [
          { key: 'name', label: 'Department' },
          { key: 'present', label: 'Present', align: 'right' },
          { key: 'absent', label: 'Absent', align: 'right' },
          { key: 'leave', label: 'On Leave', align: 'right' },
        ],
        rows,
        metrics: [
          { icon: Users, label: 'Departments', value: rows.length, tone: 'primary' },
          { icon: FileBarChart, label: 'Present', value: totalPresent, tone: 'success' },
          { icon: ShieldAlert, label: 'Absent', value: totalAbsent, tone: 'danger' },
        ],
        chartKind: 'bar',
        chart: rows.map((r) => ({ label: r.name, value: r.present, color: 'var(--ft-primary)' })),
      };
    }

    if (type === 'late') {
      const recs = scopedAtt.filter((a) => a.date === date && a.status === 'late' && inScope(a));
      const rows = recs.map((a) => ({
        id: a.id, name: empName(a.employeeId), department: deptName(a.departmentId),
        checkIn: a.checkIn || '—', lateMinutes: a.lateMinutes || 0, lateText: formatMinutes(a.lateMinutes || 0),
      }));
      const totalLate = rows.reduce((s, r) => s + r.lateMinutes, 0);
      return {
        columns: [
          { key: 'name', label: 'Employee' }, { key: 'department', label: 'Department' },
          { key: 'checkIn', label: 'Check-In', align: 'center' },
          { key: 'lateText', label: 'Late By', align: 'right' },
        ],
        rows,
        metrics: [
          { icon: Clock, label: 'Late Arrivals', value: rows.length, tone: 'warning' },
          { icon: Timer, label: 'Total Late', value: formatMinutes(totalLate), tone: 'danger' },
          { icon: FileBarChart, label: 'Avg Late', value: rows.length ? formatMinutes(Math.round(totalLate / rows.length)) : '0m', tone: 'accent' },
        ],
        chartKind: 'none',
      };
    }

    if (type === 'overtime') {
      const recs = scopedAtt.filter((a) => a.date === date && (a.overtimeMinutes || 0) > 0 && inScope(a));
      const rows = recs.map((a) => ({
        id: a.id, name: empName(a.employeeId), department: deptName(a.departmentId),
        checkOut: a.checkOut || '—', overtimeMinutes: a.overtimeMinutes || 0, overtimeText: formatMinutes(a.overtimeMinutes || 0),
      }));
      const totalOt = rows.reduce((s, r) => s + r.overtimeMinutes, 0);
      return {
        columns: [
          { key: 'name', label: 'Employee' }, { key: 'department', label: 'Department' },
          { key: 'checkOut', label: 'Check-Out', align: 'center' },
          { key: 'overtimeText', label: 'Overtime', align: 'right' },
        ],
        rows,
        metrics: [
          { icon: Timer, label: 'Overtime Records', value: rows.length, tone: 'accent' },
          { icon: FileBarChart, label: 'Total Overtime', value: formatMinutes(totalOt), tone: 'success' },
          { icon: Clock, label: 'Avg Overtime', value: rows.length ? formatMinutes(Math.round(totalOt / rows.length)) : '0m', tone: 'primary' },
        ],
        chartKind: 'none',
      };
    }

    if (type === 'suspicious') {
      const recs = scopedScans
        .filter((s) => s.date === date)
        .filter((s) => !deptId || (s.employeeId && byId(employees, s.employeeId)?.departmentId === deptId))
        .filter((s) => !branchId || (s.employeeId && byId(employees, s.employeeId)?.branchId === branchId));
      const rows = recs.map((s) => ({
        id: s.id, name: s.employeeId ? empName(s.employeeId) : 'Unknown',
        reason: s.reason, confidence: Math.round((s.confidence || 0) * 100),
        confidenceText: `${Math.round((s.confidence || 0) * 100)}%`,
        time: s.time || '—', status: s.status, statusLabel: REQUEST_STATUS[s.status]?.label || s.status,
      }));
      const pending = rows.filter((r) => r.status === 'pending').length;
      return {
        columns: [
          { key: 'name', label: 'Employee' }, { key: 'reason', label: 'Reason' },
          { key: 'confidenceText', label: 'Confidence', align: 'right' },
          { key: 'time', label: 'Time', align: 'center' }, { key: 'statusLabel', label: 'Status', align: 'center' },
        ],
        rows,
        metrics: [
          { icon: ShieldAlert, label: 'Flagged Scans', value: rows.length, tone: 'danger' },
          { icon: Clock, label: 'Pending Review', value: pending, tone: 'warning' },
        ],
        chartKind: 'none',
      };
    }

    // default: daily — today (or chosen date) by employee.
    const todays = scopedAtt.filter((a) => a.date === date && inScope(a));
    const rows = todays.map((a) => ({
      id: a.id, name: empName(a.employeeId), department: deptName(a.departmentId),
      shift: shiftName(a.shiftId), checkIn: a.checkIn || '—', checkOut: a.checkOut || '—',
      status: a.status, statusLabel: ATTENDANCE_STATUS[a.status]?.label || a.status,
    }));
    const count = (st) => todays.filter((a) => a.status === st).length;
    return {
      columns: [
        { key: 'name', label: 'Employee' }, { key: 'department', label: 'Department' },
        { key: 'shift', label: 'Shift' },
        { key: 'checkIn', label: 'Check-In', align: 'center' }, { key: 'checkOut', label: 'Check-Out', align: 'center' },
        { key: 'statusLabel', label: 'Status', align: 'center' },
      ],
      rows,
      metrics: [
        { icon: FileBarChart, label: 'Present', value: count('present'), tone: 'success' },
        { icon: Clock, label: 'Late', value: count('late'), tone: 'warning' },
        { icon: ShieldAlert, label: 'Absent', value: count('absent'), tone: 'danger' },
        { icon: Users, label: 'On Leave', value: count('leave'), tone: 'accent' },
      ],
      chartKind: 'donut',
      chart: [
        { label: 'Present', value: count('present'), color: ATT_COLORS.present },
        { label: 'Late', value: count('late'), color: ATT_COLORS.late },
        { label: 'Absent', value: count('absent'), color: ATT_COLORS.absent },
        { label: 'Leave', value: count('leave'), color: ATT_COLORS.leave },
      ],
    };
  }, [type, date, month, scopedAtt, scopedScans, filteredEmpIds, departments, employees, branchId, deptId]);

  const reportLabel = REPORT_OPTIONS.find((o) => o.value === type)?.label || 'Report';
  const periodLabel = useMonth ? monthLabel(month + '-01') : prettyDate(date);
  const fileBase = `facetrack-${type}-report-${useMonth ? month : date}`;

  const handleCsv = () => {
    exportToCsv(fileBase, report.rows, report.columns);
    toast.success(`Exported ${report.rows.length} rows to CSV.`);
  };
  const handleJson = () => {
    exportToJson(fileBase, {
      report: reportLabel, period: periodLabel, generatedAt: new Date().toISOString(),
      metrics: report.metrics.map((m) => ({ label: m.label, value: m.value })), rows: report.rows,
    });
    toast.success(`Exported ${report.rows.length} rows to JSON.`);
  };
  const handlePrint = () => {
    printReport({
      title: `FaceTrack AI — ${reportLabel} Report`,
      subtitle: `Period: ${periodLabel} · ${report.rows.length} records`,
      columns: report.columns, rows: report.rows,
    });
    toast.info('Opening printable report — allow pop-ups if nothing appears.');
  };

  const actions = (
    <>
      <button type="button" className="ft-btn ft-btn--subtle" onClick={handleCsv} disabled={!report.rows.length}>
        <Download size={16} /> CSV
      </button>
      <button type="button" className="ft-btn ft-btn--subtle" onClick={handleJson} disabled={!report.rows.length}>
        <Download size={16} /> JSON
      </button>
      <button type="button" className="ft-btn ft-btn--primary" onClick={handlePrint} disabled={!report.rows.length}>
        <Printer size={16} /> Print PDF
      </button>
    </>
  );

  // Render-only column overrides for status badges (kept out of export columns).
  const tableColumns = report.columns.map((c) => {
    if (c.key === 'statusLabel' && (type === 'daily')) {
      return { ...c, render: (r) => <StatusBadge map={ATTENDANCE_STATUS} value={r.status} /> };
    }
    if (c.key === 'statusLabel' && type === 'suspicious') {
      return { ...c, render: (r) => <StatusBadge map={REQUEST_STATUS} value={r.status} /> };
    }
    return c;
  });

  return (
    <section className="ft-page">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Scoped attendance insights — pick a report, filter, then export."
        actions={actions}
      />

      <SectionCard title="Report Builder" icon={FileBarChart}>
        <div className="ft-toolbar">
          <FilterChips value={type} onChange={setType} options={REPORT_OPTIONS} />
        </div>
        <div className="ft-toolbar">
          {useMonth ? (
            <input
              type="month" className="ft-select" value={month} aria-label="Month"
              onChange={(e) => setMonth(e.target.value)}
            />
          ) : showDateFilter ? (
            <input
              type="date" className="ft-select" value={date} aria-label="Date"
              onChange={(e) => setDate(e.target.value)}
            />
          ) : null}
          <FilterSelect value={deptId} onChange={setDeptId} options={deptOptions} allLabel="All departments" />
          {showBranch ? (
            <FilterSelect value={branchId} onChange={setBranchId} options={branchOptions} allLabel="All branches" />
          ) : null}
        </div>
      </SectionCard>

      <div className="ft-kpi-grid">
        {report.metrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} label={m.label} value={m.value} tone={m.tone} />
        ))}
      </div>

      {report.chartKind === 'donut' && (
        <SectionCard title="Status Distribution" subtitle={periodLabel} icon={FileBarChart}>
          <DonutChart data={report.chart} centerLabel="Records" />
        </SectionCard>
      )}
      {report.chartKind === 'bar' && (
        <SectionCard title="Present by Department" subtitle={periodLabel} icon={FileBarChart}>
          <BarChart data={report.chart} />
        </SectionCard>
      )}

      <SectionCard title={`${reportLabel} Report`} subtitle={`${periodLabel} · ${report.rows.length} records`} icon={FileBarChart}>
        <DataTable
          columns={tableColumns}
          rows={report.rows}
          rowKey="id"
          pageSize={10}
          emptyMessage="No records match the selected filters."
        />
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: CalendarCheck, label: 'View attendance records', hint: 'The raw rows behind these reports', to: `${ROLE_BASE[role]}/attendance`, tone: 'primary' },
          (role === ROLES.HR || role === ROLES.SUPER_ADMIN) && {
            icon: ShieldAlert, label: 'Suspicious scans', hint: 'Investigate flagged scans', to: `${ROLE_BASE[role]}/suspicious-scans`, tone: 'danger',
          },
        ]}
      />
    </section>
  );
}
