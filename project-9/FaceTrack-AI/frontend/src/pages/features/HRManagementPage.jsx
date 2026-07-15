// FaceTrack AI — HR Management (Super Admin, read-only overview).
// An org-wide snapshot of HR operations: the HR team roster plus pending HR
// workload (face approvals, corrections, leave, suspicious scans). Read-only —
// no CRUD here; the dedicated feature pages own the actions.

import { useMemo } from 'react';
import { Briefcase, ScanFace, ClipboardList, CalendarDays, ShieldAlert } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  Avatar,
} from '../../components/ui';
import { useCollection } from '../../hooks/useStore';
import { byId } from '../../services/selectors';
import { FACE_STATUS, EMPLOYEE_STATUS } from '../../utils/constants';

export default function HRManagementPage() {
  const employees = useCollection('employees');
  const departments = useCollection('departments');
  const branches = useCollection('branches');
  const faceRegistrations = useCollection('faceRegistrations');
  const correctionRequests = useCollection('correctionRequests');
  const leaveRequests = useCollection('leaveRequests');
  const suspiciousScans = useCollection('suspiciousScans');

  // Departments that represent HR (by name), then the staff inside them.
  const hrDeptIds = useMemo(
    () => departments.filter((d) => /hr|human/i.test(d.name)).map((d) => d.id),
    [departments]
  );
  const hrTeam = useMemo(
    () =>
      employees.filter(
        (e) => hrDeptIds.includes(e.departmentId) || /\bhr\b|human resource/i.test(e.designation || '')
      ),
    [employees, hrDeptIds]
  );

  const pending = useMemo(
    () => ({
      faceApprovals: faceRegistrations.filter((f) => f.status === 'pending').length,
      corrections: correctionRequests.filter((c) => c.status === 'pending').length,
      leave: leaveRequests.filter((l) => l.status === 'pending').length,
      suspicious: suspiciousScans.filter((s) => s.status === 'pending').length,
    }),
    [faceRegistrations, correctionRequests, leaveRequests, suspiciousScans]
  );

  const columns = [
    {
      key: 'name',
      label: 'HR Staff',
      render: (e) => (
        <div className="ft-id-cell">
          <Avatar name={e.name} color={e.avatarColor} size="sm" />
          <div>
            <div className="ft-id-name">{e.name}</div>
            <div className="ft-id-sub">{e.employeeCode}</div>
          </div>
        </div>
      ),
      sortValue: (e) => e.name,
    },
    { key: 'designation', label: 'Designation' },
    { key: 'branch', label: 'Branch', render: (e) => byId(branches, e.branchId)?.name || '—' },
    {
      key: 'faceStatus',
      label: 'Face',
      render: (e) => <StatusBadge map={FACE_STATUS} value={e.faceStatus} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (e) => <StatusBadge map={EMPLOYEE_STATUS} value={e.status} />,
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="HR Management"
        subtitle="Org-wide HR operations overview (read-only)."
        actions={<StatusBadge tone="info" label={`${hrTeam.length} HR staff`} />}
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={Briefcase} label="HR Team" value={hrTeam.length} tone="primary" />
        <MetricCard icon={ScanFace} label="Pending Face Approvals" value={pending.faceApprovals} tone="info" />
        <MetricCard icon={ClipboardList} label="Pending Corrections" value={pending.corrections} tone="warning" />
        <MetricCard icon={CalendarDays} label="Pending Leave" value={pending.leave} tone="accent" />
        <MetricCard icon={ShieldAlert} label="Suspicious Scans" value={pending.suspicious} tone="danger" />
      </div>

      <SectionCard title="HR Team" subtitle="Staff in HR departments across all branches" icon={Briefcase}>
        <DataTable
          columns={columns}
          rows={hrTeam}
          rowKey="id"
          emptyIcon={Briefcase}
          emptyMessage="No HR staff found in the mock data."
          initialSort={{ key: 'name', dir: 'asc' }}
        />
      </SectionCard>

      <div className="ft-note">
        <strong>Read-only overview.</strong> Approvals, corrections and leave are actioned by HR on their
        dedicated pages. All numbers come from mock data in <code>src/data/</code>.
      </div>
    </section>
  );
}
