// FaceTrack AI — Logged-in Home page (frontend-only mode).
// Route: /home. A role-aware landing screen for authenticated users with a
// welcome card, quick actions, at-a-glance analytics and recent activity — all
// from frontend mock data. "Go to My Dashboard" routes to the role dashboard;
// "Logout" clears the mock session and returns to the public landing page (/).
// Rendered inside the
// dashboard Layout (Sidebar + Navbar), so it works for every role.

import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  UsersRound,
  Briefcase,
  FileBarChart,
  CalendarCheck,
  CalendarDays,
  Clock,
  ClipboardList,
  ClipboardCheck,
  Camera,
  UserCheck,
  Timer,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Globe,
} from 'lucide-react';
import { PageHeader, SectionCard, MetricCard, Avatar } from '../../components/ui';
import RecentActivity from '../../components/dashboard/RecentActivity';
import ManagerHomePanel from '../manager/ManagerHomePanel';
import HRHomePanel from '../hr/HRHomePanel';
import BranchAdminHomePanel from '../branchAdmin/BranchAdminHomePanel';
import SuperAdminHomePanel from '../superAdmin/SuperAdminHomePanel';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import { scopeEmployees, scopeAttendance, dashboardMetrics, employeeMonthSummary } from '../../services/selectors';
import { ROLE_LABELS, ROUTES, dashboardPathForRole } from '../../utils/constants';
import { getRoleMeta } from '../../data/mockRoles';
import { getUserProfile } from '../../data/mockUsers';
import { getActivities } from '../../data/mockActivities';

// String icon keys (from mock data) -> lucide components.
const ICONS = {
  branches: Building2,
  employees: Users,
  hr: Briefcase,
  reports: FileBarChart,
  attendance: CalendarCheck,
  shifts: Clock,
  leave: CalendarDays,
  corrections: ClipboardList,
  team: UsersRound,
  approvals: ClipboardCheck,
  checkin: Camera,
  present: UserCheck,
  late: Clock,
  branch: Building2,
  overtime: Timer,
};

const TONE_COLORS = {
  primary: 'var(--ft-primary)',
  success: 'var(--ft-green)',
  warning: 'var(--ft-yellow)',
  danger: 'var(--ft-red)',
  accent: 'var(--ft-accent)',
  muted: 'var(--ft-text-dim)',
};

export default function HomePage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const meta = getRoleMeta(role);
  const profile = getUserProfile(role);
  const activities = getActivities(role).map((a) => ({ ...a, color: TONE_COLORS[a.tone] }));
  const name = user?.name || user?.email || 'User';

  // "At a glance" cards — derived from the LIVE reactive store (role-scoped),
  // so they match the role dashboards instead of contradicting them with the
  // old static demo figures (e.g. 248 employees vs the seeded ~14).
  const employees = useCollection('employees');
  const attendance = useCollection('attendance');
  const correctionRequests = useCollection('correctionRequests');
  const leaveRequests = useCollection('leaveRequests');

  const cards = useMemo(() => {
    if (role === 'employee') {
      const s = employeeMonthSummary(attendance, user?.employeeId);
      const pendingRequests =
        leaveRequests.filter((l) => l.employeeId === user?.employeeId && l.status === 'pending').length +
        correctionRequests.filter((c) => c.employeeId === user?.employeeId && c.status === 'pending').length;
      return [
        { key: 'statusToday', label: 'Status Today', value: s.statusToday, tone: s.tone, icon: 'present' },
        { key: 'presentMonth', label: 'Present (Month)', value: s.presentDays, tone: 'primary', icon: 'attendance' },
        { key: 'lateMonth', label: 'Late (Month)', value: s.lateDays, tone: 'warning', icon: 'late' },
        { key: 'overtime', label: 'Overtime (hrs)', value: s.overtimeHours, tone: 'accent', icon: 'overtime' },
        { key: 'pendingRequests', label: 'Pending Requests', value: pendingRequests, tone: 'danger', icon: 'corrections' },
      ];
    }

    const scopedEmployees = scopeEmployees(employees, user);
    const scopedAttendance = scopeAttendance(attendance, scopedEmployees);
    const empIds = new Set(scopedEmployees.map((e) => e.id));
    const scopedCorrections = correctionRequests.filter((c) => empIds.has(c.employeeId));
    const m = dashboardMetrics({
      employees: scopedEmployees,
      attendance: scopedAttendance,
      correctionRequests: scopedCorrections,
    });
    const isManager = role === 'manager';
    return [
      { key: 'totalEmployees', label: isManager ? 'Team Size' : 'Total Employees', value: m.totalEmployees, tone: 'primary', icon: isManager ? 'team' : 'employees' },
      { key: 'presentToday', label: 'Present Today', value: m.present, tone: 'success', icon: 'present' },
      { key: 'lateCheckins', label: 'Late Check-ins', value: m.late, tone: 'warning', icon: 'late' },
      { key: 'pendingCorrections', label: 'Pending Corrections', value: m.pendingCorrections, tone: 'accent', icon: 'corrections' },
      { key: 'attendanceRate', label: isManager ? 'Team Attendance' : 'Attendance Rate', value: `${m.attendanceRate}%`, tone: 'primary', icon: 'branch' },
    ];
  }, [role, user, employees, attendance, correctionRequests, leaveRequests]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate(ROUTES.LANDING, { replace: true });
    }
  };

  return (
    <section className="ft-page">
      <PageHeader
        title="Home"
        subtitle="Your personalized FaceTrack AI workspace."
        actions={
          <div className="ft-home-head-actions">
            <Link to={dashboardPathForRole(role)} className="ft-btn ft-btn--primary">
              <LayoutDashboard size={16} /> Go to My Dashboard
            </Link>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        }
      />

      {/* Welcome banner */}
      <div className="ft-home-welcome ft-glass">
        <div className="ft-home-welcome-main">
          <Avatar name={name} color={user?.avatarColor} size="lg" />
          <div>
            <h2 className="ft-home-welcome-title">
              Welcome back, <span className="ft-grad">{name}</span>
            </h2>
            <p className="ft-home-welcome-sub">
              <span className="ft-badge ft-badge--info">{ROLE_LABELS[role] || 'User'}</span>
              {profile ? <span className="ft-home-welcome-meta">{profile.jobTitle} · {profile.scope}</span> : null}
            </p>
            <p className="ft-home-welcome-tagline">{meta.tagline}</p>
          </div>
        </div>
        <Link to={ROUTES.LANDING} className="ft-home-public-link">
          <Globe size={15} /> View public site
        </Link>
      </div>

      {/* Manager-only: live team status, alerts, today activity, pending approvals */}
      {role === 'manager' ? <ManagerHomePanel /> : null}

      {/* HR-only: pending HR actions, today people operations, alerts, dept snapshot */}
      {role === 'hr' ? <HRHomePanel /> : null}

      {/* Branch Admin-only: branch live status, today branch ops, alerts, dept snapshot */}
      {role === 'branchAdmin' ? <BranchAdminHomePanel /> : null}

      {/* Super Admin-only: global summary, system alerts, branch performance, data quality */}
      {role === 'superAdmin' ? <SuperAdminHomePanel /> : null}

      {/* Quick actions */}
      <SectionCard title="Quick actions" subtitle="Jump straight into your most-used tools">
        <div className="ft-home-actions">
          {meta.quickActions.map((qa) => {
            const Icon = ICONS[qa.icon] || LayoutDashboard;
            return (
              <Link key={qa.to} to={qa.to} className={`ft-home-action ft-home-action--${qa.tone}`}>
                <span className="ft-home-action-icon"><Icon size={20} /></span>
                <span className="ft-home-action-label">{qa.label}</span>
                <ArrowRight size={16} className="ft-home-action-arrow" />
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Analytics + activity */}
      <div className="ft-section-title-row">
        <h3 className="ft-block-title">At a glance</h3>
        <span className="ft-cell-dim">Live · mock store data</span>
      </div>
      <div className="ft-kpi-grid">
        {cards.map((c) => (
          <MetricCard key={c.key} icon={ICONS[c.icon]} label={c.label} value={c.value} tone={c.tone} />
        ))}
      </div>

      <div className="ft-grid-2" style={{ marginTop: 18 }}>
        <RecentActivity items={activities} title="Recent activity" />
        <SectionCard title="Your workspace" subtitle="Frontend-only demo mode">
          <div className="ft-meta-grid">
            <Meta k="Role" v={ROLE_LABELS[role] || '—'} />
            <Meta k="Title" v={profile?.jobTitle || '—'} />
            <Meta k="Scope" v={profile?.scope || '—'} />
            <Meta k="Location" v={profile?.location || '—'} />
            <Meta k="Email" v={user?.email || '—'} />
            <Meta k="Mode" v="Mock / no backend" />
          </div>
          <div className="ft-note" style={{ marginTop: 14 }}>
            <strong>Frontend-only demo.</strong> All numbers come from mock data in <code>src/data/</code> —
            no backend, no database.
          </div>
        </SectionCard>
      </div>
    </section>
  );
}

function Meta({ k, v }) {
  return (
    <div className="ft-meta-item">
      <span className="ft-meta-key">{k}</span>
      <span className="ft-meta-val">{v}</span>
    </div>
  );
}
