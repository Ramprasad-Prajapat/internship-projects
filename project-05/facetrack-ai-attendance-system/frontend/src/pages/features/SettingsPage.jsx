// FaceTrack AI — Settings page (superAdmin / branchAdmin / hr).
// Reads the reactive settings object, keeps a local editable copy, and writes
// it back via store.patchSettings on Save. Also offers a "Reset demo data"
// action that re-seeds the whole mock store. Frontend-only, no backend.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, ScanFace, Building2, Trash2, Check, MapPin, FileBarChart, Users, SlidersHorizontal } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  ConfirmDialog,
  TextField,
  StatusBadge,
  MockDataNotice,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useSettings, useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { useToast } from '../../hooks/useToast';
import { ROLE_BASE, ROLES } from '../../utils/constants';

// Local toggle row — matches the camera/scan-row visual style.
function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <label className="ft-scan-row" style={{ cursor: 'pointer' }}>
      <span className="ft-scan-row-label">
        {label}
        {hint ? <span className="ft-cell-dim" style={{ display: 'block', fontWeight: 400 }}>{hint}</span> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

// Build the local editable form snapshot from the reactive settings object.
function formFromSettings(settings) {
  return {
    orgName: settings.orgName ?? '',
    defaultGraceMinutes: settings.defaultGraceMinutes ?? 0,
    overtimeApprovalAfterMinutes: settings.overtimeApprovalAfterMinutes ?? 0,
    autoAbsentEnabled: Boolean(settings.autoAbsentEnabled),
    checkOutReminderEnabled: Boolean(settings.checkOutReminderEnabled),
    faceConfidenceThreshold: settings.faceConfidenceThreshold ?? 0.7,
    requireConsentBeforeFace: Boolean(settings.requireConsentBeforeFace),
    notifications: {
      lateAlerts: Boolean(settings.notifications?.lateAlerts),
      suspiciousScanAlerts: Boolean(settings.notifications?.suspiciousScanAlerts),
      overtimeApprovals: Boolean(settings.notifications?.overtimeApprovals),
      weeklySummary: Boolean(settings.notifications?.weeklySummary),
    },
  };
}

export default function SettingsPage() {
  const { user, role } = useAuth();
  const toast = useToast();
  const settings = useSettings();
  const branches = useCollection('branches');

  // Local editable copy, seeded from the reactive settings.
  const [form, setForm] = useState(() => formFromSettings(settings));
  // Re-sync the form whenever settings actually change (e.g. after Save or
  // "Reset demo data" re-seeds the store). The settings reference is stable
  // across unrelated store mutations, so this won't clobber in-progress edits.
  useEffect(() => {
    setForm(formFromSettings(settings));
  }, [settings]);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNotif = (key, value) =>
    setForm((f) => ({ ...f, notifications: { ...f.notifications, [key]: value } }));

  const handleSave = () => {
    const patch = {
      orgName: form.orgName.trim() || 'FaceTrack AI',
      defaultGraceMinutes: Number(form.defaultGraceMinutes) || 0,
      overtimeApprovalAfterMinutes: Number(form.overtimeApprovalAfterMinutes) || 0,
      autoAbsentEnabled: form.autoAbsentEnabled,
      checkOutReminderEnabled: form.checkOutReminderEnabled,
      faceConfidenceThreshold: Number(form.faceConfidenceThreshold),
      requireConsentBeforeFace: form.requireConsentBeforeFace,
      notifications: { ...form.notifications },
    };
    store.patchSettings(patch);
    store.addAudit({
      actor: user?.name ?? 'Unknown',
      role,
      action: 'settingsUpdated',
      target: 'settings',
      description: `Updated organisation settings (${patch.orgName}).`,
    });
    toast.success('Settings saved');
  };

  const handleReset = () => {
    store.resetStore();
    setConfirmReset(false);
    toast.warning('Demo data re-seeded');
  };

  const confidencePct = Math.round(Number(form.faceConfidenceThreshold) * 100);

  return (
    <section className="ft-page">
      <PageHeader
        title="Settings"
        subtitle="Attendance rules, face matching, notifications, and organisation details."
        actions={
          <button className="ft-btn ft-btn--primary" type="button" onClick={handleSave}>
            <Check size={16} /> Save changes
          </button>
        }
      />

      <div className="ft-grid-2">
        <SectionCard
          title="Attendance rules"
          subtitle="Defaults applied when marking attendance."
          icon={SettingsIcon}
        >
          <div className="ft-grid-2">
            <TextField
              label="Default grace minutes"
              type="number"
              min="0"
              value={form.defaultGraceMinutes}
              onChange={(e) => set('defaultGraceMinutes', e.target.value)}
              hint="Late only after this many minutes."
            />
            <TextField
              label="Overtime approval after (minutes)"
              type="number"
              min="0"
              value={form.overtimeApprovalAfterMinutes}
              onChange={(e) => set('overtimeApprovalAfterMinutes', e.target.value)}
              hint="Overtime beyond this needs approval."
            />
          </div>
          <ToggleRow
            label="Auto-mark absent"
            hint="No check-in by shift end is recorded as absent."
            checked={form.autoAbsentEnabled}
            onChange={(v) => set('autoAbsentEnabled', v)}
          />
          <ToggleRow
            label="Check-out reminder"
            hint="Remind employees who forgot to check out."
            checked={form.checkOutReminderEnabled}
            onChange={(v) => set('checkOutReminderEnabled', v)}
          />
        </SectionCard>

        <SectionCard
          title="Face & privacy"
          subtitle="Matching threshold and consent."
          icon={ScanFace}
        >
          <div className="ft-field">
            <span>
              Face confidence threshold
              <span style={{ color: 'var(--ft-primary)', marginLeft: 8, fontWeight: 600 }}>
                {confidencePct}%
              </span>
            </span>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={form.faceConfidenceThreshold}
              onChange={(e) => set('faceConfidenceThreshold', e.target.value)}
            />
            <span className="ft-field-hint">
              Scans below {confidencePct}% are flagged as suspicious.
            </span>
          </div>
          <ToggleRow
            label="Require consent before face capture"
            hint="Employees must accept the privacy policy first."
            checked={form.requireConsentBeforeFace}
            onChange={(v) => set('requireConsentBeforeFace', v)}
          />
        </SectionCard>

        <SectionCard
          title="Notifications"
          subtitle="What the system alerts you about."
          icon={Bell}
        >
          <ToggleRow
            label="Late arrival alerts"
            checked={form.notifications.lateAlerts}
            onChange={(v) => setNotif('lateAlerts', v)}
          />
          <ToggleRow
            label="Suspicious scan alerts"
            checked={form.notifications.suspiciousScanAlerts}
            onChange={(v) => setNotif('suspiciousScanAlerts', v)}
          />
          <ToggleRow
            label="Overtime approval requests"
            checked={form.notifications.overtimeApprovals}
            onChange={(v) => setNotif('overtimeApprovals', v)}
          />
          <ToggleRow
            label="Weekly summary"
            checked={form.notifications.weeklySummary}
            onChange={(v) => setNotif('weeklySummary', v)}
          />
        </SectionCard>

        <SectionCard
          title="Organisation"
          subtitle="Branding shown across the dashboard."
          icon={Building2}
        >
          <TextField
            label="Organisation name"
            value={form.orgName}
            onChange={(e) => set('orgName', e.target.value)}
            placeholder="FaceTrack AI"
          />
          <p className="ft-note" style={{ marginTop: 16 }}>
            Reset demo data restores all branches, employees, attendance, and
            settings to their original seeded values. This cannot be undone.
          </p>
          <button
            className="ft-btn ft-btn--danger"
            type="button"
            onClick={() => setConfirmReset(true)}
            style={{ marginTop: 12 }}
          >
            <Trash2 size={16} /> Reset demo data
          </button>
        </SectionCard>
      </div>

      <SectionCard
        title="Geofence & location verification"
        subtitle="Per-branch attendance radius (mock)"
        icon={MapPin}
      >
        <p className="ft-section-sub" style={{ marginBottom: 12 }}>
          Branch radius verification helps HR confirm that attendance is marked from an approved
          office location. Each Rajasthan branch carries its own allowed radius.
        </p>
        <div className="ft-scan-status">
          {branches.map((b) => (
            <div className="ft-scan-row" key={b.id}>
              <span className="ft-scan-row-label">
                <MapPin size={15} /> {b.name} · {b.city}
              </span>
              <StatusBadge tone="primary" label={`${Number(b.radiusMeters) || 0} m`} plain />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <MockDataNotice title="Future upgrade">
            Real GPS, geofencing, map integration and Firebase-backed branch settings can be connected
            later. In this demo, per-branch radius is managed on the Branches page.
          </MockDataNotice>
        </div>
      </SectionCard>

      {role === ROLES.SUPER_ADMIN && (
        <SectionCard
          title="Website Feature Controls"
          subtitle="Enable / disable, show / hide and set role access for website features."
          icon={SlidersHorizontal}
        >
          <p className="ft-section-sub" style={{ marginBottom: 12 }}>
            The Feature Control Center lets Super Admin turn website features and modules on or off per
            role (frontend mock — saved to <code>localStorage</code>). Protected system features cannot be disabled.
          </p>
          <Link to={`${ROLE_BASE[role]}/feature-control`} className="ft-btn ft-btn--primary">
            <SlidersHorizontal size={16} /> Open Feature Control Center
          </Link>
        </SectionCard>
      )}

      <ConnectedNextActions
        actions={[
          role === ROLES.SUPER_ADMIN && {
            icon: Building2, label: 'Manage branches', hint: 'Edit office radius & coordinates', to: `${ROLE_BASE[role]}/branches`, tone: 'primary',
          },
          { icon: FileBarChart, label: 'Reports', hint: 'Attendance analytics', to: `${ROLE_BASE[role]}/reports`, tone: 'accent' },
          { icon: Users, label: 'Employees', hint: 'Manage employee records', to: `${ROLE_BASE[role]}/employees`, tone: 'success' },
        ]}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="This re-seeds every collection (employees, attendance, requests, settings) back to the original demo values. All local changes will be lost."
        confirmLabel="Reset everything"
        tone="danger"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </section>
  );
}
