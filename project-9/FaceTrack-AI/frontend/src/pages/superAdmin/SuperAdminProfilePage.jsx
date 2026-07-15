// FaceTrack AI — Super Admin Profile (Super Admin Identity + Global Control Center).
//
// Frontend-only: the Super Admin is an org-level login with NO employee record
// (employeeId is null), so identity comes from the session user + the role
// profile (data/mockUsers) with clean fallbacks, and the global snapshot comes
// from services/superAdminService (shared store — no duplicate data). Edit
// Profile persists name/phone to a small localStorage override (there is no
// employee row to write). No backend, Firebase, API, real GPS, or biometrics.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil,
  UserCircle,
  Mail,
  Phone,
  User,
  Briefcase,
  ShieldCheck,
  Building2,
  Network,
  Users,
  FileBarChart,
  ScrollText,
  Settings as SettingsIcon,
  LayoutDashboard,
  KeyRound,
  Database,
  Globe,
} from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  Modal,
  StatusBadge,
  Avatar,
  TextField,
  MockDataNotice,
} from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import * as sa from '../../services/superAdminService';
import { ROLE_LABELS } from '../../utils/constants';
import { nowHHMM } from '../../utils/dateUtils';
import { getUserProfile } from '../../data/mockUsers';

const PROFILE_KEY = 'ft_superadmin_profile';

const FALLBACK = {
  name: 'Arjun Sharma',
  email: 'superadmin@demo.com',
  phone: '+91 98300 11000',
  designation: 'Platform Administrator',
  avatarColor: '#00d4ff',
};

const PERMISSIONS = [
  { label: 'Full System Control', tone: 'primary' },
  { label: 'Branch Management', tone: 'success' },
  { label: 'Role & Access Control', tone: 'accent' },
  { label: 'Global Reports', tone: 'info' },
  { label: 'Audit Access', tone: 'warning' },
  { label: 'System Settings', tone: 'primary' },
];

function readProfileOverride() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function MetaItem({ label, children }) {
  return (
    <div className="ft-meta-item" style={{ marginBottom: 12 }}>
      <span className="ft-meta-key" style={{ fontSize: '0.8rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span className="ft-meta-val" style={{ display: 'block', marginTop: 2, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ft-text-dim)' }}>{label}</span>
      {children}
    </div>
  );
}

const to12h = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':');
  const hh = parseInt(h, 10);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${hh % 12 || 12}:${m} ${ampm}`;
};

export default function SuperAdminProfilePage() {
  const { user, role } = useAuth();
  const toast = useToast();
  const roleProfile = getUserProfile('superAdmin');

  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const branches = useCollection('branches');
  const departments = useCollection('departments');
  const shifts = useCollection('shifts');
  const leaveRequests = useCollection('leaveRequests');
  const correctionRequests = useCollection('correctionRequests');
  const faceRegistrations = useCollection('faceRegistrations');
  const suspiciousScans = useCollection('suspiciousScans');
  const auditLogs = useCollection('auditLogs');

  // Identity: localStorage override → session user → fallback.
  const [override, setOverride] = useState(() => readProfileOverride());
  const name = override.name || user?.name || FALLBACK.name;
  const phone = override.phone || FALLBACK.phone;
  const email = user?.email || FALLBACK.email;
  const adminId = user?.uid || 'u-super';
  const designation = roleProfile?.jobTitle || FALLBACK.designation;
  const scope = roleProfile?.scope || 'All Rajasthan branches';
  const avatarColor = user?.avatarColor || FALLBACK.avatarColor;

  const overview = useMemo(
    () => sa.globalOverview(employees, attendance, { branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans }),
    [employees, attendance, branches, departments, shifts, leaveRequests, correctionRequests, faceRegistrations, suspiciousScans]
  );
  const activity = useMemo(() => sa.superAdminActivityOwn(auditLogs, user), [auditLogs, user]);

  // Last login — mock local session, remembered for the browser session.
  const [lastLogin] = useState(() => {
    try {
      const k = 'ft_superadmin_last_login';
      let v = sessionStorage.getItem(k);
      if (!v) {
        v = `Today ${to12h(nowHHMM())}`;
        sessionStorage.setItem(k, v);
      }
      return v;
    } catch {
      return `Today ${to12h(nowHHMM())}`;
    }
  });

  // --- edit profile (persists to a localStorage override) ---
  const [editOpen, setEditOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const openEdit = () => {
    setFormName(name ?? '');
    setFormPhone(phone ?? '');
    setEditOpen(true);
  };

  const saveEdit = () => {
    const trimmed = formName.trim();
    if (!trimmed) {
      toast.error('Name is required');
      return;
    }
    const next = { name: trimmed, phone: formPhone.trim() };
    setOverride(next);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch { /* storage unavailable */ }
    store.addAudit({
      actor: trimmed,
      role,
      action: 'profileUpdated',
      target: adminId,
      description: `Updated super admin profile (${trimmed}).`,
    });
    toast.success('Profile updated');
    setEditOpen(false);
  };

  const QUICK_ACTIONS = [
    { label: 'Branches', to: '/super-admin/branches', icon: Building2 },
    { label: 'All Employees', to: '/super-admin/employees', icon: Users },
    { label: 'HR Management', to: '/super-admin/hr-management', icon: Briefcase },
    { label: 'Audit Logs', to: '/super-admin/audit-logs', icon: ScrollText },
    { label: 'Global Reports', to: '/super-admin/reports', icon: FileBarChart },
    { label: 'System Settings', to: '/super-admin/settings', icon: SettingsIcon },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Super Admin Profile"
        subtitle="Super Admin Identity + Global Control Center"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MockDataNotice variant="badge" title="Mock mode" icon={Database} />
            <button className="ft-btn ft-btn--primary" type="button" onClick={openEdit}>
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        }
      />

      {/* 1. Header Card */}
      <div style={{ marginTop: 24 }}>
        <SectionCard>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ft-id-cell" style={{ gap: 16, alignItems: 'center' }}>
              <Avatar name={name} color={avatarColor} size="lg" />
              <div>
                <h2 className="ft-cell-strong" style={{ fontSize: '1.4rem', margin: 0 }}>{name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: 'var(--ft-text-dim)', fontSize: '0.9rem' }}>{designation} · {scope}</span>
                  <StatusBadge tone="success" label="Active" />
                </div>
              </div>
            </div>
            <div style={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--ft-text-dim)' }}>Profile Completion</span>
                <span className="ft-cell-strong" style={{ color: 'var(--ft-primary)', fontWeight: 600 }}>95%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, var(--ft-primary) 0%, var(--ft-accent) 100%)', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--ft-card-border)', margin: '20px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <HeaderItem icon={UserCircle} label="Admin ID" value={adminId} />
            <HeaderItem icon={Mail} label="Email" value={email} />
            <HeaderItem icon={Phone} label="Phone" value={phone} />
            <HeaderItem icon={User} label="Role" value={ROLE_LABELS[role] || 'Super Admin'} />
            <HeaderItem icon={Briefcase} label="Designation" value={designation} />
            <HeaderItem icon={Globe} label="Access Level" value="Global" />
          </div>
        </SectionCard>
      </div>

      {/* 2. Quick Actions Row */}
      <div style={{ marginTop: 20 }}>
        <SectionCard title="Quick Actions" icon={LayoutDashboard}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.to} className="ft-btn ft-btn--subtle">
                  <Icon size={16} /> {a.label}
                </Link>
              );
            })}
            <button type="button" className="ft-btn ft-btn--ghost" onClick={openEdit}>
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Card grid */}
      <div className="ft-grid-3" style={{ gap: 24, marginTop: 24 }}>
        {/* 3. System Permissions */}
        <SectionCard title="System Permissions" subtitle="What you control" icon={ShieldCheck}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {PERMISSIONS.map((p) => (
              <StatusBadge key={p.label} tone={p.tone} label={p.label} />
            ))}
          </div>
          <p className="ft-note" style={{ marginTop: 16 }}>
            Super Admin scope: full global control across all branches, departments, employees, roles,
            reports, audit logs and system settings.
          </p>
        </SectionCard>

        {/* 4. Managed Branches */}
        <SectionCard title="Managed Branches" subtitle={`${branches.length} branches`} icon={Building2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {branches.map((b) => (
              <Row key={b.id} label={b.name}>
                <StatusBadge tone={b.status === 'active' ? 'success' : 'muted'} label={b.city} />
              </Row>
            ))}
          </div>
        </SectionCard>

        {/* 5. Global Snapshot */}
        <SectionCard title="Global Snapshot" subtitle="Platform totals (today)" icon={Network}>
          <div className="ft-meta-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetaItem label="Branches">{overview.totalBranches}</MetaItem>
            <MetaItem label="Departments">{overview.totalDepartments}</MetaItem>
            <MetaItem label="Employees">{overview.totalEmployees}</MetaItem>
            <MetaItem label="Attendance">{overview.attendanceRate}%</MetaItem>
            <MetaItem label="Present Today">{overview.present}</MetaItem>
            <MetaItem label="Late Today">{overview.late}</MetaItem>
            <MetaItem label="Pending Requests">{overview.pendingRequests}</MetaItem>
            <MetaItem label="Suspicious">{overview.suspiciousAlerts}</MetaItem>
          </div>
        </SectionCard>

        {/* 6. Security / Login Info */}
        <SectionCard title="Security / Login Info" subtitle="Session details" icon={KeyRound}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <Row label="Last Login"><span style={{ fontWeight: 600 }}>{lastLogin}</span></Row>
            <Row label="Security Status"><StatusBadge tone="success" label="Secure" /></Row>
            <Row label="Account Status"><StatusBadge tone="success" label="Active" /></Row>
            <Row label="Role Access"><StatusBadge tone="primary" label={ROLE_LABELS[role] || 'Super Admin'} /></Row>
            <Row label="Session Type"><span style={{ fontWeight: 600 }}>Mock Local Session</span></Row>
            <Row label="Mock Mode"><StatusBadge tone="info" label="Active" /></Row>
          </div>
        </SectionCard>
      </div>

      {/* 7. Global Activity Timeline */}
      <div style={{ marginTop: 24 }}>
        <RecentActivity items={activity} title="Global Activity Timeline" />
      </div>

      <div className="ft-note" style={{ marginTop: 16 }}>
        <strong>Frontend-only mock mode.</strong> Super admin identity is a local session; global data comes
        from the shared mock store (<code>src/data/</code> → <code>localStorage</code>). No backend / Firebase / API.
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        title="Edit Super Admin Profile"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <button className="ft-btn ft-btn--ghost" type="button" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="ft-btn ft-btn--primary" type="button" onClick={saveEdit}>Save</button>
          </>
        }
      >
        <TextField label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Full name" />
        <TextField label="Phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+91 98300 00000" />
      </Modal>
    </section>
  );
}

function HeaderItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon size={18} style={{ color: 'var(--ft-primary)' }} />
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--ft-text-dim)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
