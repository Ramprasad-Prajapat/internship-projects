// FaceTrack AI — Audit Logs (superAdmin, read-only).
// Searchable, filterable, exportable trail of every recorded store action.

import { useState, useMemo } from 'react';
import { ScrollText, Download } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  StatusBadge,
  SearchInput,
  FilterSelect,
} from '../../components/ui';
import { useCollection } from '../../hooks/useStore';
import { useToast } from '../../hooks/useToast';
import { ROLE_LABELS } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';
import { exportToCsv } from '../../utils/exportUtils';

export default function AuditLogsPage() {
  const logs = useCollection('auditLogs');
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [action, setAction] = useState('');

  const actionOptions = useMemo(() => {
    const unique = [...new Set(logs.map((l) => l.action).filter(Boolean))].sort();
    return unique.map((a) => ({ value: a, label: a }));
  }, [logs]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      if (action && l.action !== action) return false;
      if (!q) return true;
      return (
        (l.actor || '').toLowerCase().includes(q) ||
        (l.action || '').toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      );
    });
  }, [logs, query, action]);

  const columns = [
    {
      key: 'time',
      label: 'Time',
      sortValue: (row) => row.time || '',
      render: (row) => <span className="ft-cell-dim">{prettyDate(row.time)}</span>,
    },
    {
      key: 'actor',
      label: 'Actor',
      render: (row) => <span className="ft-cell-strong">{row.actor || '—'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      align: 'center',
      render: (row) => <StatusBadge tone="muted" label={ROLE_LABELS[row.role] || row.role || '—'} />,
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => <span className="ft-pill">{row.action}</span>,
    },
    {
      key: 'target',
      label: 'Target',
      render: (row) => <span className="ft-cell-dim">{row.target || '—'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => row.description || '—',
    },
  ];

  function handleExport() {
    if (!rows.length) {
      toast.warning('Nothing to export for the current filters.');
      return;
    }
    exportToCsv('audit-logs', rows, columns);
    toast.success('Exported audit logs to CSV.');
  }

  return (
    <section className="ft-page">
      <PageHeader
        title="Audit Logs"
        subtitle="A read-only trail of every administrative action."
        actions={
          <button
            type="button"
            className="ft-btn ft-btn--primary"
            onClick={handleExport}
            disabled={!rows.length}
          >
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <SectionCard
        title="Activity Trail"
        subtitle="Search by actor, action, or description."
        icon={ScrollText}
      >
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search logs..." />
          </div>
          <FilterSelect
            value={action}
            onChange={setAction}
            options={actionOptions}
            allLabel="All actions"
          />
        </div>

        <DataTable
          rows={rows}
          columns={columns}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'time', dir: 'desc' }}
          emptyMessage="No audit entries match your search."
        />
      </SectionCard>
    </section>
  );
}
