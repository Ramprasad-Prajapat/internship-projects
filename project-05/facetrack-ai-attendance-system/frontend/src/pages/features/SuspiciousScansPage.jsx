// FaceTrack AI — Suspicious Scans log (superAdmin / hr).
// Reactive review queue for flagged face scans: filter by status + reason,
// then mark each pending scan as reviewed or ignored (real store mutations).

import { useState, useMemo } from 'react';
import { ShieldAlert, Check, X, ScanFace, FileBarChart, CalendarCheck } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  StatusBadge,
  MetricCard,
  FilterSelect,
  FilterChips,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId } from '../../services/selectors';
import { REQUEST_STATUS, SCAN_REASON_LABELS, ROLE_BASE } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';

const STATUS_CHIPS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'ignored', label: 'Ignored' },
];

export default function SuspiciousScansPage() {
  const { user } = useAuth();
  const toast = useToast();
  const scans = useCollection('suspiciousScans');
  const employees = useCollection('employees');

  const [status, setStatus] = useState('all');
  const [reason, setReason] = useState('');

  const reasonOptions = useMemo(
    () => Object.entries(SCAN_REASON_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const rows = useMemo(
    () =>
      scans.filter((s) => {
        if (status !== 'all' && s.status !== status) return false;
        if (reason && s.reason !== reason) return false;
        return true;
      }),
    [scans, status, reason],
  );

  const metrics = useMemo(() => {
    const pending = scans.filter((s) => s.status === 'pending').length;
    const reviewed = scans.filter((s) => s.status === 'reviewed').length;
    return { pending, reviewed, total: scans.length };
  }, [scans]);

  function resolve(scan, nextStatus) {
    store.update('suspiciousScans', scan.id, {
      status: nextStatus,
      reviewedBy: user.employeeId,
    });
    const empName = byId(employees, scan.employeeId)?.name || 'Unknown';
    const verb = nextStatus === 'reviewed' ? 'reviewed' : 'ignored';
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'suspiciousScanResolved',
      target: scan.id,
      description: `Marked suspicious scan for ${empName} as ${verb}`,
    });
    toast.success(`Scan ${verb}.`);
  }

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      sortValue: (row) => byId(employees, row.employeeId)?.name || 'Unknown',
      render: (row) => (
        <span className="ft-cell-strong">{byId(employees, row.employeeId)?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (row) => SCAN_REASON_LABELS[row.reason] || row.reason,
    },
    {
      key: 'confidence',
      label: 'Confidence',
      align: 'center',
      sortValue: (row) => row.confidence ?? 0,
      render: (row) => (
        <StatusBadge
          tone={(row.confidence ?? 0) < 0.6 ? 'danger' : 'warning'}
          label={`${Math.round((row.confidence ?? 0) * 100)}%`}
        />
      ),
    },
    {
      key: 'multipleFaces',
      label: 'Multiple Faces',
      align: 'center',
      sortValue: (row) => (row.multipleFaces ? 1 : 0),
      render: (row) => (row.multipleFaces ? 'Yes' : 'No'),
    },
    {
      key: 'when',
      label: 'Date / Time',
      sortValue: (row) => `${row.date} ${row.time || ''}`,
      render: (row) => (
        <div className="ft-id-cell">
          <span className="ft-id-name">{prettyDate(row.date)}</span>
          <span className="ft-id-sub">{row.time || '—'}</span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => <span className="ft-cell-dim">{row.location || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => <StatusBadge map={REQUEST_STATUS} value={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (row) =>
        row.status === 'pending' ? (
          <div className="ft-cell-actions">
            <button
              type="button"
              className="ft-btn ft-btn--success ft-btn--sm"
              onClick={() => resolve(row, 'reviewed')}
            >
              <Check size={14} /> Mark reviewed
            </button>
            <button
              type="button"
              className="ft-btn ft-btn--subtle ft-btn--sm"
              onClick={() => resolve(row, 'ignored')}
            >
              <X size={14} /> Ignore
            </button>
          </div>
        ) : (
          <span className="ft-cell-dim">—</span>
        ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Suspicious Scans"
        subtitle="Review and resolve flagged face-scan attempts."
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={ShieldAlert} label="Pending" value={metrics.pending} tone="danger" />
        <MetricCard icon={Check} label="Reviewed" value={metrics.reviewed} tone="success" />
        <MetricCard icon={ShieldAlert} label="Total Flags" value={metrics.total} tone="primary" />
      </div>

      <SectionCard
        title="Scan Log"
        subtitle="Filter by status or reason to triage alerts."
        icon={ShieldAlert}
      >
        <div className="ft-toolbar">
          <FilterChips value={status} onChange={setStatus} options={STATUS_CHIPS} />
          <div className="ft-toolbar-grow" />
          <FilterSelect
            value={reason}
            onChange={setReason}
            options={reasonOptions}
            allLabel="All reasons"
          />
        </div>

        <DataTable
          rows={rows}
          columns={columns}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'when', dir: 'desc' }}
          emptyMessage="No suspicious scans match these filters."
        />
      </SectionCard>

      <ConnectedNextActions
        actions={[
          user?.role === 'hr' && {
            icon: ScanFace, label: 'Face approvals', hint: 'Approve / reject registrations', to: `${ROLE_BASE[user.role]}/face-approvals`, tone: 'accent',
          },
          { icon: CalendarCheck, label: 'Attendance records', hint: 'Cross-check the day', to: `${ROLE_BASE[user?.role]}/attendance`, tone: 'primary' },
          { icon: FileBarChart, label: 'Reports', hint: 'Suspicious-scan report', to: `${ROLE_BASE[user?.role]}/reports`, tone: 'success' },
        ]}
      />
    </section>
  );
}
