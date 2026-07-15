// FaceTrack AI — Face Approvals (HR queue).
// Reviews simulated face-registration captures: filter by status, see per-record
// capture cards with employee + confidence, and approve / reject (with a note).
// Frontend-only: all mutations hit the mock store and write an audit entry.

import { useState, useMemo } from 'react';
import { ScanFace, ShieldAlert, Users } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  StatusBadge,
  Avatar,
  EmptyState,
  FilterChips,
  Modal,
  TextAreaField,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { byId, nameOf } from '../../services/selectors';
import { FACE_STATUS, ROLE_BASE } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function FaceApprovalsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const registrations = useCollection('faceRegistrations');
  const employees = useCollection('employees');
  const departments = useCollection('departments');

  const [status, setStatus] = useState('pending');
  const [rejectFor, setRejectFor] = useState(null); // the registration being rejected
  const [rejectNote, setRejectNote] = useState('');

  const counts = useMemo(
    () => ({
      pending: registrations.filter((r) => r.status === 'pending').length,
      approved: registrations.filter((r) => r.status === 'approved').length,
      rejected: registrations.filter((r) => r.status === 'rejected').length,
    }),
    [registrations],
  );

  const visible = useMemo(
    () => (status === 'all' ? registrations : registrations.filter((r) => r.status === status)),
    [registrations, status],
  );

  const deptName = (employeeId) => {
    const emp = byId(employees, employeeId);
    return emp ? byId(departments, emp.departmentId)?.name || '—' : '—';
  };

  function handleApprove(reg) {
    store.update('faceRegistrations', reg.id, {
      status: 'approved',
      reviewedBy: user.employeeId,
      note: 'Approved',
    });
    store.update('employees', reg.employeeId, { faceStatus: 'registered' });
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'faceApproved',
      target: reg.employeeId,
      description: `Approved face registration for ${nameOf(employees, reg.employeeId)}`,
    });
    toast.success(`Approved face registration for ${nameOf(employees, reg.employeeId)}`);
  }

  function openReject(reg) {
    setRejectFor(reg);
    setRejectNote('');
  }

  function closeReject() {
    setRejectFor(null);
    setRejectNote('');
  }

  function confirmReject() {
    if (!rejectFor) return;
    const note = rejectNote.trim() || 'Rejected';
    store.update('faceRegistrations', rejectFor.id, {
      status: 'rejected',
      reviewedBy: user.employeeId,
      note,
    });
    store.update('employees', rejectFor.employeeId, { faceStatus: 'none' });
    store.addAudit({
      actor: user.name,
      role: user.role,
      action: 'faceRejected',
      target: rejectFor.employeeId,
      description: `Rejected face registration for ${nameOf(employees, rejectFor.employeeId)} — ${note}`,
    });
    toast.success(`Rejected face registration for ${nameOf(employees, rejectFor.employeeId)}`);
    closeReject();
  }

  return (
    <section className="ft-page">
      <PageHeader
        title="Face Approvals"
        subtitle="Review and approve employee face-registration captures."
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={ScanFace} label="Pending" value={counts.pending} tone="warning" />
        <MetricCard icon={ScanFace} label="Approved" value={counts.approved} tone="success" />
        <MetricCard icon={ScanFace} label="Rejected" value={counts.rejected} tone="danger" />
      </div>

      <SectionCard
        title="Registration Queue"
        subtitle="Simulated captures awaiting HR review."
        actions={<FilterChips value={status} onChange={setStatus} options={STATUS_OPTIONS} />}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={ScanFace}
            title="No registrations"
            message="There are no face registrations matching this filter."
          />
        ) : (
          <div className="ft-grid-3">
            {visible.map((reg) => {
              const emp = byId(employees, reg.employeeId);
              const name = emp?.name || nameOf(employees, reg.employeeId);
              const pct = Math.round((reg.confidence || 0) * 100);
              return (
                <div className="ft-glass" key={reg.id} style={{ padding: 16 }}>
                  <div
                    className="ft-camera"
                    style={{ aspectRatio: '4/3', position: 'relative', display: 'grid', placeItems: 'center' }}
                  >
                    <Avatar name={name} color={emp?.avatarColor} size="lg" />
                    <ScanFace
                      size={22}
                      style={{ position: 'absolute', top: 10, right: 10, color: 'var(--ft-primary)' }}
                    />
                    <div className="ft-scan-frame" />
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div className="ft-cell-strong">{name}</div>
                      <div className="ft-cell-dim">
                        {emp?.employeeCode || '—'} · {deptName(reg.employeeId)}
                      </div>
                    </div>
                    <StatusBadge map={FACE_STATUS} value={reg.status} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="ft-cell-dim">Confidence</span>
                      <span className="ft-cell-strong">{pct}%</span>
                    </div>
                    <div className="ft-progress">
                      <div className="ft-progress-fill" style={{ width: pct + '%' }} />
                    </div>
                  </div>

                  <div className="ft-cell-dim" style={{ marginTop: 12 }}>
                    Captured {prettyDate(reg.capturedAt)}
                  </div>

                  {reg.note && reg.status !== 'pending' ? (
                    <div className="ft-note" style={{ marginTop: 10 }}>
                      {reg.note}
                    </div>
                  ) : null}

                  {reg.status === 'pending' ? (
                    <div className="ft-cell-actions" style={{ marginTop: 14 }}>
                      <button
                        type="button"
                        className="ft-btn ft-btn--success ft-btn--sm"
                        onClick={() => handleApprove(reg)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="ft-btn ft-btn--danger ft-btn--sm"
                        onClick={() => openReject(reg)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: ShieldAlert, label: 'Suspicious scans', hint: 'Flagged scan log', to: `${ROLE_BASE[user?.role]}/suspicious-scans`, tone: 'danger' },
          { icon: Users, label: 'Employees', hint: 'Manage employee records', to: `${ROLE_BASE[user?.role]}/employees`, tone: 'primary' },
        ]}
      />

      <Modal
        open={Boolean(rejectFor)}
        title="Reject Face Registration"
        size="md"
        onClose={closeReject}
        footer={
          <>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={closeReject}>
              Cancel
            </button>
            <button type="button" className="ft-btn ft-btn--danger" onClick={confirmReject}>
              Reject
            </button>
          </>
        }
      >
        {rejectFor ? (
          <p className="ft-note" style={{ marginBottom: 12 }}>
            Rejecting capture for <strong>{nameOf(employees, rejectFor.employeeId)}</strong>. Their
            face status will be reset to "Not Registered".
          </p>
        ) : null}
        <TextAreaField
          label="Reason / note"
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          placeholder="e.g. Capture too blurry — please retry in better lighting."
        />
      </Modal>
    </section>
  );
}
