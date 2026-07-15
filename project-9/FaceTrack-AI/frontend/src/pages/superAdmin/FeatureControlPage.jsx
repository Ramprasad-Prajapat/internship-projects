// FaceTrack AI — Feature Control Center (Super Admin, frontend-only mode).
//
// A "Website Feature Control Center": Super Admin enables/disables, shows/hides,
// and edits role access for every controllable website feature. All changes are
// mock — persisted to localStorage via services/featureControlService and logged
// to the mock audit trail; they update the UI immediately and survive refresh.
// Protected system features (login, dashboards, settings, this page) cannot be
// disabled/hidden. No backend / Firebase / API.

import { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Users,
  RotateCcw,
  Lock,
  Database,
  Layers,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  MetricCard,
  DataTable,
  StatusBadge,
  Modal,
  ConfirmDialog,
  SearchInput,
  FilterSelect,
  FilterChips,
  MockDataNotice,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useFeatures } from '../../hooks/useFeatures';
import * as fc from '../../services/featureControlService';
import { ROLE_LABELS } from '../../utils/constants';
import { prettyDate } from '../../utils/dateUtils';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

const PROTECTED_MSG = 'This is a protected system feature and cannot be disabled in demo mode.';

export default function FeatureControlPage() {
  const { user } = useAuth();
  const toast = useToast();
  const features = useFeatures();

  const sum = useMemo(() => fc.summary(features), [features]);

  const moduleOptions = useMemo(() => {
    const unique = [...new Set(features.map((x) => x.module))];
    return unique.map((m) => ({ value: m, label: m }));
  }, [features]);

  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return features.filter((feat) => {
      if (moduleFilter && feat.module !== moduleFilter) return false;
      if (statusFilter && feat.status !== statusFilter) return false;
      if (!q) return true;
      return feat.name.toLowerCase().includes(q) || feat.module.toLowerCase().includes(q) || feat.key.includes(q);
    });
  }, [features, query, moduleFilter, statusFilter]);

  /* ---------------- actions ---------------- */
  const toggleStatus = (feat) => {
    const next = feat.status === 'enabled' ? 'disabled' : 'enabled';
    const res = fc.setStatus(feat.key, next, user);
    if (res.protectedBlocked) {
      toast.warning(PROTECTED_MSG);
      return;
    }
    toast.success(`${feat.name} ${next === 'enabled' ? 'enabled' : 'disabled'}`);
  };

  const toggleVisibility = (feat) => {
    const next = feat.visibility === 'shown' ? 'hidden' : 'shown';
    const res = fc.setVisibility(feat.key, next, user);
    if (res.protectedBlocked) {
      toast.warning('This is a protected system feature and cannot be hidden in demo mode.');
      return;
    }
    toast.success(`${feat.name} ${next === 'hidden' ? 'hidden' : 'shown'}`);
  };

  const resetOne = (feat) => {
    fc.resetFeature(feat.key, user);
    toast.success(`${feat.name} reset to default`);
  };

  /* ---------------- role access modal ---------------- */
  const [roleModal, setRoleModal] = useState(null);
  const [roleSel, setRoleSel] = useState([]);

  const openRoles = (feat) => {
    if (feat.isProtected) {
      toast.warning(PROTECTED_MSG);
      return;
    }
    if (feat.allowedRoles.includes('public')) {
      toast.warning('Public features are visible to all visitors — no role access to edit.');
      return;
    }
    setRoleSel(feat.allowedRoles);
    setRoleModal(feat);
  };
  const toggleRoleSel = (r) => setRoleSel((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  const saveRoles = () => {
    if (roleSel.length === 0) {
      toast.warning('At least one role must have access to this feature.');
      return;
    }
    const res = fc.setAllowedRoles(roleModal.key, roleSel, user);
    if (res.emptyRoles) {
      toast.warning('At least one role must have access to this feature.');
      return;
    }
    toast.success(`Role access updated for ${roleModal.name}`);
    setRoleModal(null);
  };

  /* ---------------- reset all ---------------- */
  const [confirmReset, setConfirmReset] = useState(false);
  const doResetAll = () => {
    fc.resetAll(user);
    setConfirmReset(false);
    toast.warning('All feature controls reset to default');
  };

  const roleBadges = (feat) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {feat.allowedRoles.includes('public')
        ? <StatusBadge tone="info" label="Public" />
        : feat.allowedRoles.map((r) => <StatusBadge key={r} tone="info" label={ROLE_LABELS[r] || r} />)}
    </div>
  );

  const columns = [
    {
      key: 'name',
      label: 'Feature',
      sortValue: (feat) => feat.name,
      render: (feat) => (
        <div className="ft-id-cell">
          <div>
            <div className="ft-id-name">
              {feat.name} {feat.isProtected ? <Lock size={12} style={{ verticalAlign: 'middle', color: 'var(--ft-text-dim)' }} /> : null}
            </div>
            <div className="ft-id-sub">{feat.key}</div>
          </div>
        </div>
      ),
    },
    { key: 'module', label: 'Module', sortValue: (feat) => feat.module, render: (feat) => <StatusBadge tone="muted" label={feat.module} /> },
    { key: 'roles', label: 'Visible For Roles', sortable: false, render: roleBadges },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortValue: (feat) => feat.status,
      render: (feat) => (
        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <StatusBadge tone={feat.status === 'enabled' ? 'success' : 'danger'} label={feat.status === 'enabled' ? 'Enabled' : 'Disabled'} />
          {feat.visibility === 'hidden' ? <StatusBadge tone="muted" label="Hidden" /> : null}
        </div>
      ),
    },
    { key: 'lastUpdated', label: 'Last Updated', align: 'center', sortValue: (feat) => feat.lastUpdated || '', render: (feat) => <span className="ft-cell-dim">{feat.lastUpdated ? prettyDate(feat.lastUpdated) : '—'}</span> },
    {
      key: 'control',
      label: 'Control',
      align: 'right',
      sortable: false,
      render: (feat) => (
        <div className="ft-cell-actions">
          <button
            type="button"
            className="ft-icon-btn"
            title={feat.status === 'enabled' ? 'Disable' : 'Enable'}
            aria-label={feat.status === 'enabled' ? `Disable ${feat.name}` : `Enable ${feat.name}`}
            onClick={() => toggleStatus(feat)}
            style={feat.isProtected ? { opacity: 0.5 } : undefined}
          >
            {feat.status === 'enabled' ? <ToggleRight size={18} style={{ color: 'var(--ft-green)' }} /> : <ToggleLeft size={18} style={{ color: 'var(--ft-text-dim)' }} />}
          </button>
          <button
            type="button"
            className="ft-icon-btn"
            title={feat.visibility === 'shown' ? 'Hide' : 'Show'}
            aria-label={feat.visibility === 'shown' ? `Hide ${feat.name}` : `Show ${feat.name}`}
            onClick={() => toggleVisibility(feat)}
            style={feat.isProtected ? { opacity: 0.5 } : undefined}
          >
            {feat.visibility === 'shown' ? <Eye size={16} /> : <EyeOff size={16} style={{ color: 'var(--ft-text-dim)' }} />}
          </button>
          <button
            type="button"
            className="ft-icon-btn"
            title="Role access"
            aria-label={`Edit role access for ${feat.name}`}
            onClick={() => openRoles(feat)}
            style={feat.isProtected || feat.allowedRoles.includes('public') ? { opacity: 0.5 } : undefined}
          >
            <Users size={16} />
          </button>
          <button type="button" className="ft-icon-btn" title="Reset to default" aria-label={`Reset ${feat.name}`} onClick={() => resetOne(feat)}>
            <RotateCcw size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Feature Control Center"
        subtitle="Enable / disable, show / hide and set role access for website features (mock)."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MockDataNotice variant="badge" title="Mock mode" icon={Database} />
            <button className="ft-btn ft-btn--ghost" type="button" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={16} /> Reset all
            </button>
          </div>
        }
      />

      {/* Summary */}
      <div className="ft-kpi-grid">
        <MetricCard icon={Layers} label="Total Features" value={sum.total} tone="primary" />
        <MetricCard icon={CheckCircle2} label="Enabled" value={sum.enabled} tone="success" />
        <MetricCard icon={XCircle} label="Disabled" value={sum.disabled} tone="danger" />
        <MetricCard icon={ShieldCheck} label="Protected" value={sum.protected} tone="accent" />
      </div>

      <SectionCard
        title="Website Features"
        subtitle={`${rows.length} shown · changes save to localStorage & the audit log`}
        icon={SlidersHorizontal}
      >
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search feature, module or key..." />
          </div>
          <FilterSelect value={moduleFilter} onChange={setModuleFilter} options={moduleOptions} allLabel="All modules" />
          <FilterChips value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="key"
          pageSize={12}
          initialSort={{ key: 'module', dir: 'asc' }}
          emptyIcon={SlidersHorizontal}
          emptyMessage="No features match these filters."
        />
        <p className="ft-note" style={{ marginTop: 12 }}>
          <Lock size={12} style={{ verticalAlign: 'middle' }} /> Protected system features (login, dashboards,
          settings, this page) cannot be disabled or hidden. Disabling a feature shows a friendly
          "disabled in demo mode" message on its page and hides it from the sidebar.
        </p>
      </SectionCard>

      {/* Role access modal */}
      <Modal
        open={!!roleModal}
        title={roleModal ? `Role Access — ${roleModal.name}` : 'Role Access'}
        onClose={() => setRoleModal(null)}
        footer={
          <>
            <button className="ft-btn ft-btn--ghost" type="button" onClick={() => setRoleModal(null)}>Cancel</button>
            <button
              className="ft-btn ft-btn--primary"
              type="button"
              onClick={saveRoles}
              disabled={roleSel.length === 0}
              title={roleSel.length === 0 ? 'Select at least one role first' : undefined}
            >
              Save
            </button>
          </>
        }
      >
        <p className="ft-note" style={{ marginBottom: 12 }}>
          Choose which roles can access this feature. Removing a role hides it from that role's sidebar
          and shows the disabled message on its route (mock, saved to localStorage).
        </p>
        {roleSel.length === 0 ? (
          <p className="ft-note" style={{ marginBottom: 12, color: 'var(--ft-yellow)' }}>
            At least one role must have access to this feature.
          </p>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fc.ALL_ROLES.map((r) => (
            <label key={r} className="ft-scan-row" style={{ cursor: 'pointer' }}>
              <span className="ft-scan-row-label">{ROLE_LABELS[r] || r}</span>
              <input type="checkbox" checked={roleSel.includes(r)} onChange={() => toggleRoleSel(r)} />
            </label>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all feature controls?"
        message="This restores every feature to its default status, visibility and role access. Protected features are unaffected."
        confirmLabel="Reset all"
        tone="danger"
        onConfirm={doResetAll}
        onCancel={() => setConfirmReset(false)}
      />
    </section>
  );
}
