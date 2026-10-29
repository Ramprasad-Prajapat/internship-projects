// FaceTrack AI — Landing page (public, frontend-only).
// A modern marketing page: animated hero with a glowing AI face-scan visual,
// feature grid, how-it-works steps, role-based access, a mock analytics preview,
// the face-scan workflow, and a privacy/consent highlight. All copy + numbers
// are static mock content — no backend, no data calls.

import { Link } from 'react-router-dom';
import {
  ScanFace,
  MapPin,
  ShieldCheck,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Camera,
  CheckCircle2,
  Building2,
  UserCog,
  Briefcase,
  UserCheck,
  User,
  Lock,
  FileCheck2,
  FileBarChart,
  Zap,
  Database,
  Wallet,
  MessageSquare,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { IndustryProblemCards } from '../../components/ui';
import { ROUTES } from '../../utils/constants';

// Demo Rajasthan office network shown on the public landing page (static copy).
const RAJASTHAN_OFFICES = [
  { city: 'Jaipur', name: 'Jaipur HQ', code: 'JAI' },
  { city: 'Jodhpur', name: 'Jodhpur Branch', code: 'JOD' },
  { city: 'Udaipur', name: 'Udaipur Office', code: 'UDR' },
  { city: 'Kota', name: 'Kota Office', code: 'KOT' },
  { city: 'Bikaner', name: 'Bikaner Branch', code: 'BKN' },
  { city: 'Ajmer', name: 'Ajmer Office', code: 'AJM' },
];

// Backend/AI features intentionally shown as future work (clearly labelled).
const ROADMAP = [
  { icon: Database, title: 'Firebase backend', text: 'Swap the mock store for real Firebase Auth + Firestore using the same data shapes.' },
  { icon: ScanFace, title: 'Liveness detection', text: 'face-api.js matching with anti-spoofing / liveness checks (Phase 2).' },
  { icon: MapPin, title: 'Map integration', text: 'Live branch maps and real reverse-geocoded check-in locations.' },
  { icon: Wallet, title: 'Payroll export', text: 'Push attendance, late and overtime straight into payroll systems.' },
  { icon: MessageSquare, title: 'WhatsApp / SMS alerts', text: 'Send late, overtime and approval notifications to employees and HR.' },
];

const HERO_STATS = [
  { value: '99.2%', label: 'Match accuracy' },
  { value: '< 2s', label: 'Check-in time' },
  { value: '5', label: 'Role scopes' },
  { value: '0', label: 'Proxy entries' },
];

const FEATURES = [
  { icon: ScanFace, title: 'Face Recognition', text: 'Client-side face matching marks attendance instantly — no proxies, no buddy punching.' },
  { icon: MapPin, title: 'Location Verified Check-In', text: 'Geo-fenced check-in within each branch radius before any attendance is accepted.' },
  { icon: ShieldCheck, title: 'Role-Based Access', text: 'Scoped dashboards for Super Admin, Branch Admin, HR, Manager and Employee.' },
  { icon: Clock, title: 'Smart Attendance Logic', text: 'Automatic late, overtime and absent calculation with correction workflows.' },
  { icon: BarChart3, title: 'Live Analytics', text: 'Real-time dashboards, trends and KPIs that update as people check in.' },
  { icon: Lock, title: 'Privacy & Consent', text: 'Consent-first capture, on-device matching and full scan/location audit logs.' },
  { icon: Users, title: 'Multi-Branch HR', text: 'Manage branches, departments, shifts and the full employee lifecycle.' },
  { icon: FileBarChart, title: 'Reports & Export', text: 'Six report types with CSV / JSON / print export for payroll and audits.' },
];

const STEPS = [
  { icon: FileCheck2, title: 'Give consent', text: 'Employees accept the biometric consent policy before any face data is captured.' },
  { icon: Camera, title: 'Scan your face', text: 'A quick webcam scan verifies identity — fully client-side, nothing is stored.' },
  { icon: MapPin, title: 'Verify location', text: 'Geo-fencing confirms the check-in happens inside the assigned branch radius.' },
  { icon: CheckCircle2, title: 'Attendance marked', text: 'Late / overtime is computed automatically and pushed to live dashboards.' },
];

const ROLES_INFO = [
  { icon: UserCog, title: 'Super Admin', text: 'Global control across branches, roles, audit logs and org settings.' },
  { icon: Building2, title: 'Branch Admin', text: 'Branch-scoped employees, departments, shifts, attendance and reports.' },
  { icon: Briefcase, title: 'HR', text: 'Approvals, attendance edits, corrections and suspicious-scan review.' },
  { icon: UserCheck, title: 'Manager', text: 'Team attendance, member roster, approvals and team reports.' },
  { icon: User, title: 'Employee', text: 'Face check-in/out, history, corrections and leave requests.' },
];

const PREVIEW_KPIS = [
  { label: 'Total Employees', value: '248', tone: 'primary' },
  { label: 'Present Today', value: '214', tone: 'success' },
  { label: 'Late Check-ins', value: '12', tone: 'warning' },
  { label: 'Pending Corrections', value: '7', tone: 'accent' },
  { label: 'Branch Attendance', value: '92%', tone: 'primary' },
];

// Static bars for the mock analytics preview (Mon–Sat).
const PREVIEW_BARS = [62, 78, 70, 88, 95, 54];

const FLOW = [
  { icon: FileCheck2, label: 'Consent' },
  { icon: Camera, label: 'Capture' },
  { icon: Sparkles, label: 'AI Match' },
  { icon: MapPin, label: 'Location' },
  { icon: ShieldCheck, label: 'Verified' },
];

export default function LandingPage() {
  return (
    <div className="ft-land">
      <PublicNavbar />

      {/* ---------------- Hero ---------------- */}
      <section className="ft-land-hero">
        <div className="ft-land-aurora" aria-hidden="true">
          <span className="ft-aurora-blob ft-aurora-1" />
          <span className="ft-aurora-blob ft-aurora-2" />
          <span className="ft-aurora-blob ft-aurora-3" />
          <span className="ft-aurora-grid" />
        </div>

        <div className="ft-hero-grid">
          <div className="ft-hero-copy">
            <span className="ft-land-badge">
              <Sparkles size={14} /> Smart Employee Attendance Management
            </span>
            <h1 className="ft-hero-title">
              Attendance, <span className="ft-grad">reimagined</span> with AI face recognition
            </h1>
            <p className="ft-hero-sub">
              FaceTrack AI verifies identity with on-device face recognition and location checks to
              automate attendance, eliminate proxy entries, and give HR real-time workforce analytics —
              across every branch.
            </p>
            <div className="ft-hero-actions">
              <Link to={ROUTES.LOGIN} className="ft-btn ft-btn--primary ft-btn--lg">
                Try Demo <ArrowRight size={16} />
              </Link>
              <Link to={ROUTES.LOGIN} className="ft-btn ft-btn--ghost ft-btn--lg">
                Login
              </Link>
              <Link to={ROUTES.PRIVACY} className="ft-btn ft-btn--ghost ft-btn--lg">
                <Lock size={16} /> Privacy &amp; Consent
              </Link>
            </div>
            <p className="ft-hero-note">
              <Zap size={13} /> Demo mode — explore every role with one click. No signup, no setup.
            </p>

            <div className="ft-hero-stats">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="ft-hero-stat">
                  <span className="ft-hero-stat-value">{s.value}</span>
                  <span className="ft-hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* glowing AI scan visual */}
          <div className="ft-hero-visual" aria-hidden="true">
            <div className="ft-scan-card ft-glass">
              <div className="ft-scan-card-top">
                <span className="ft-scan-card-dot" />
                <span className="ft-scan-card-dot" />
                <span className="ft-scan-card-dot" />
                <span className="ft-scan-card-live">● LIVE SCAN</span>
              </div>
              <div className="ft-scan-stage">
                <div className="ft-scan-face">
                  <ScanFace size={92} />
                </div>
                <span className="ft-scan-ring" />
                <span className="ft-scan-ring ft-scan-ring--2" />
                <span className="ft-scan-sweep" />
                <span className="ft-scan-corner ft-scan-corner--tl" />
                <span className="ft-scan-corner ft-scan-corner--tr" />
                <span className="ft-scan-corner ft-scan-corner--bl" />
                <span className="ft-scan-corner ft-scan-corner--br" />
              </div>
              <div className="ft-scan-card-foot">
                <span><CheckCircle2 size={14} /> Identity matched</span>
                <span className="ft-scan-card-pct">98%</span>
              </div>
            </div>
            <div className="ft-scan-chip ft-scan-chip--a ft-glass">
              <MapPin size={14} /> Inside branch radius
            </div>
            <div className="ft-scan-chip ft-scan-chip--b ft-glass">
              <Clock size={14} /> On time · 09:02
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Industry problems ---------------- */}
      <section className="ft-land-section" id="problems">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">The problem</span>
          <h2 className="ft-land-section-title">Attendance is still broken at most companies</h2>
          <p className="ft-land-section-sub">
            Manual registers, shared cards and unverified check-ins cost HR time and payroll accuracy.
            FaceTrack AI is built to target each of these.
          </p>
        </div>
        <IndustryProblemCards />
      </section>

      {/* ---------------- Features (the solution) ---------------- */}
      <section className="ft-land-section" id="features">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">The solution</span>
          <h2 className="ft-land-section-title">Everything you need to run attendance</h2>
          <p className="ft-land-section-sub">
            A complete, role-aware attendance platform — from biometric check-in to multi-branch HR analytics.
          </p>
        </div>
        <div className="ft-land-grid ft-feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="ft-land-card ft-glass">
              <span className="ft-land-card-icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="ft-land-section" id="how-it-works">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Workflow</span>
          <h2 className="ft-land-section-title">How it works</h2>
          <p className="ft-land-section-sub">Four steps from consent to a verified, analytics-ready attendance record.</p>
        </div>
        <div className="ft-steps">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <article key={title} className="ft-step ft-glass">
              <span className="ft-step-num">{i + 1}</span>
              <span className="ft-step-icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Role-based access ---------------- */}
      <section className="ft-land-section" id="roles">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Access control</span>
          <h2 className="ft-land-section-title">Built for every role</h2>
          <p className="ft-land-section-sub">
            Each role gets a scoped dashboard and navigation — people only see what they need.
          </p>
        </div>
        <div className="ft-roles-grid">
          {ROLES_INFO.map(({ icon: Icon, title, text }) => (
            <article key={title} className="ft-role-card ft-glass">
              <span className="ft-role-icon"><Icon size={20} /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Rajasthan office network ---------------- */}
      <section className="ft-land-section" id="rajasthan">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Office network</span>
          <h2 className="ft-land-section-title">Built for multi-branch teams in Rajasthan</h2>
          <p className="ft-land-section-sub">
            A demo office network across six Rajasthan cities — each with a 150 m geofence for
            location-verified attendance.
          </p>
        </div>
        <div className="ft-map-placeholder">
          <MapPin size={30} className="ft-map-pin" />
          <div className="ft-block-title">Rajasthan office map</div>
          <p className="ft-map-caption">
            Map integration is planned for a future version. Coordinates are demo values used for mock
            radius verification.
          </p>
          <div className="ft-map-chips">
            {RAJASTHAN_OFFICES.map((o) => (
              <span key={o.code} className="ft-pill">
                <MapPin size={12} /> {o.city}
              </span>
            ))}
          </div>
        </div>
        {/* Auto-scrolling branch carousel. The single RAJASTHAN_OFFICES list
            is rendered twice (the second copy is aria-hidden) so the CSS track
            loops seamlessly via translateX(-50%). Faster than the roadmap
            marquee; movement pauses on hover / focus inside the section and is
            disabled under prefers-reduced-motion. One horizontal row, no wrap. */}
        <div className="ft-branch-marquee" style={{ marginTop: 18 }}>
          <div className="ft-branch-track">
            {[0, 1].map((copy) =>
              RAJASTHAN_OFFICES.map((o) => (
                <article
                  key={`${copy}-${o.code}`}
                  className="ft-land-card ft-glass ft-branch-card"
                  data-clone={copy === 1 ? 'true' : undefined}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                >
                  <span className="ft-land-card-icon"><Building2 size={22} /></span>
                  <h3>{o.name}</h3>
                  <p>{o.city}, Rajasthan · {o.code} · 150 m geofence</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Demo analytics preview ---------------- */}
      <section className="ft-land-section" id="analytics">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Live dashboards</span>
          <h2 className="ft-land-section-title">Real-time analytics preview</h2>
          <p className="ft-land-section-sub">A glimpse of the live KPIs, trends and breakdowns HR sees every day.</p>
        </div>
        <div className="ft-preview ft-glass">
          <div className="ft-preview-kpis">
            {PREVIEW_KPIS.map((k) => (
              <div key={k.label} className={`ft-preview-kpi ft-preview-kpi--${k.tone}`}>
                <span className="ft-preview-kpi-value">{k.value}</span>
                <span className="ft-preview-kpi-label">{k.label}</span>
              </div>
            ))}
          </div>
          <div className="ft-preview-charts">
            <div className="ft-preview-panel">
              <span className="ft-preview-panel-title">Attendance · this week</span>
              <div className="ft-preview-bars">
                {PREVIEW_BARS.map((h, i) => (
                  <span key={i} className="ft-preview-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="ft-preview-bar-labels">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
            <div className="ft-preview-panel ft-preview-panel--donut">
              <span className="ft-preview-panel-title">Status split</span>
              <div className="ft-preview-donut">
                <span className="ft-preview-donut-center">85%<small>present</small></span>
              </div>
              <div className="ft-preview-legend">
                <span><i className="ft-dot ft-dot--green" /> Present</span>
                <span><i className="ft-dot ft-dot--yellow" /> Late</span>
                <span><i className="ft-dot ft-dot--red" /> Absent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Face scan workflow preview ---------------- */}
      <section className="ft-land-section" id="face-scan">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">Face check-in</span>
          <h2 className="ft-land-section-title">The face-scan workflow</h2>
          <p className="ft-land-section-sub">Secure, consent-first and verified end-to-end — in seconds.</p>
        </div>
        <div className="ft-flow">
          {FLOW.map(({ icon: Icon, label }, i) => (
            <div key={label} className="ft-flow-item">
              <div className="ft-flow-step ft-glass">
                <span className="ft-flow-icon"><Icon size={30} /></span>
                <span className="ft-flow-label">{label}</span>
              </div>
              {i < FLOW.length - 1 ? <ArrowRight size={18} className="ft-flow-arrow" /> : null}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Future upgrade / roadmap ---------------- */}
      <section className="ft-land-section" id="roadmap">
        <div className="ft-land-section-head">
          <span className="ft-land-section-kicker">What&apos;s next</span>
          <h2 className="ft-land-section-title">Backend-ready by design</h2>
          <p className="ft-land-section-sub">
            This is a frontend demo on mock data. Each capability below is built to connect to real
            services later without reworking the UI.
          </p>
        </div>
        {/* Auto-scrolling marquee. The single ROADMAP list is rendered twice
            (the second copy is aria-hidden) so the CSS track can loop
            seamlessly via translateX(-50%). Movement pauses on hover / focus
            inside the section and is disabled under prefers-reduced-motion. */}
        <div className="ft-roadmap-marquee">
          <div className="ft-roadmap-track">
            {[0, 1].map((copy) =>
              ROADMAP.map(({ icon: Icon, title, text }) => (
                <article
                  key={`${copy}-${title}`}
                  className="ft-land-card ft-glass ft-roadmap-card"
                  data-clone={copy === 1 ? 'true' : undefined}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                >
                  <span className="ft-land-card-icon"><Icon size={22} /></span>
                  <h3>
                    {title} <span className="ft-soon">Soon</span>
                  </h3>
                  <p>{text}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Privacy / consent highlight ---------------- */}
      <section className="ft-land-section" id="privacy">
        <div className="ft-privacy-banner ft-glass">
          <span className="ft-privacy-icon"><ShieldCheck size={30} /></span>
          <div className="ft-privacy-copy">
            <h2>Privacy &amp; consent, by design</h2>
            <p>
              Face matching runs on-device and <strong>no biometric data is stored</strong> in this demo.
              Employees must accept a clear consent policy before any capture, and every scan and location
              alert is logged for transparency.
            </p>
            <div className="ft-privacy-actions">
              <Link to={ROUTES.PRIVACY} className="ft-btn ft-btn--ghost">Read privacy policy</Link>
              <Link to={ROUTES.CONSENT} className="ft-btn ft-btn--primary">View consent policy</Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
