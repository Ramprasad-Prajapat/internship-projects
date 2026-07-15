// FaceTrack AI — Leave Requests review (HR/manager, frontend-only mode).
// HR sees every request; managers see only their team's (scopeEmployees).
// Approve/Reject updates the store and writes an audit log. Header metrics
// surface pending and approved counts for the current scope.

import { useState, useMemo } from 'react';
import { CalendarDays, Check, X } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  StatusBadge,
  Avatar,
  SearchInput,
  FilterChips,
  MetricCard,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { scopeEmployees, byId, nameOf } from '../../services/selectors';
import { REQUEST_STATUS } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

export default function LeaveRequestsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const leaveRequests = useCollection('leaveRequests');
  const employees = useCollection('employees');

  const [status, setStatus] = useState('pending');
  const [query, setQuery] = useState('');

  // Role scope: only requests whose employee is visible to this user.
  const scopedEmployees = useMemo(
    () => scopeEmployees(employees, user),
    [employees, user]
  );

  const scopedRequests = useMemo(() => {
    const ids = new Set(scopedEmployees.map((e) => e.id));
    return leaveRequests.filter((r) => ids.has(r.employeeId));
  }, [leaveRequests, scopedEmployees]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedRequests.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q) return true;
      return nameOf(employees, r.employeeId).toLowerCase().includes(q);
    });
  }, [scopedRequests, employees, status, query]);

  const pendingCount = useMemo(
    () => scopedRequests.filter((r) => r.status === 'pending').length,
    [scopedRequests]
  );
  const approvedCount = useMemo(
    () => scopedRequests.filter((r) => r.status === 'approved').length,
    [scopedRequests]
  );

  const decide = (request, decision) => {
    const empName = nameOf(employees, request.employeeId);
    store.update('leaveRequests', request.id, {
      status: decision,
      approvedBy: user.employeeId,
    });
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: decision === 'approved' ? 'leaveApproved' : 'leaveRejected',
      target: request.id,
      description: `${decision === 'approved' ? 'Approved' : 'Rejected'} ${
        request.leaveType
      } leave for ${empName} (${request.startDate} – ${request.endDate})`,
    });
    toast.success(decision === 'approved' ? 'Leave approved' : 'Leave rejected');
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

  const renderActions = (row) => {
    if (row.status !== 'pending') {
      return <span className="ft-cell-dim">Reviewed</span>;
    }
    return (
      <div className="ft-cell-actions">
        <button
          type="button"
          className="ft-btn ft-btn--success ft-btn--sm"
          onClick={() => decide(row, 'approved')}
        >
          <Check size={14} /> Approve
        </button>
        <button
          type="button"
          className="ft-btn ft-btn--danger ft-btn--sm"
          onClick={() => decide(row, 'rejected')}
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
      key: 'leaveType',
      label: 'Type',
      sortValue: (row) => row.leaveType,
      render: (row) => <StatusBadge tone="accent" label={row.leaveType} />,
    },
    {
      key: 'dates',
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

  return (
    <section className="ft-page">
      <PageHeader
        title="Leave Requests"
        subtitle="Review and approve time-off requests."
      />

      <div className="ft-kpi-grid">
        <MetricCard
          icon={CalendarDays}
          label="Pending"
          value={pendingCount}
          tone="warning"
        />
        <MetricCard
          icon={CalendarDays}
          label="Approved"
          value={approvedCount}
          tone="success"
        />
      </div>

      <SectionCard title="Requests" icon={CalendarDays}>
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
          initialSort={{ key: 'dates', dir: 'desc' }}
          emptyMessage="No leave requests found."
        />
      </SectionCard>
    </section>
  );
}
