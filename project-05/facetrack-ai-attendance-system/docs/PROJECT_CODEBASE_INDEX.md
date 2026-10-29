# FaceTrack-AI — Project Codebase Index

> Auto-generated technical map of the codebase for fast onboarding in future
> sessions. Frontend-only mock mode (no backend/Firebase/API at runtime).
> Companion to `CLAUDE.md` (rules), `README.md` (overview + current status), and
> `CHANGELOG.md` (history). Last regenerated: 2026-06-23.

---

## 1. Project Structure

```
FaceTrack-AI/                       (git repo root)
├── CLAUDE.md                       Permanent AI workflow rules (read first)
├── README.md                       Overview, run steps, demo accounts, current status & roadmap
├── CHANGELOG.md                    Dated history of real changes
├── backend/                        PLACEHOLDER ONLY — no runtime server code
│   └── README.md, .gitkeep
├── database/                       SCHEMA/PLANNING ONLY — not runtime
│   ├── DATABASE_SCHEMA.md, FIREBASE_COLLECTIONS.md, RULES.md
│   └── SAMPLE_DATA.json, README.md
├── scripts/                        Helper PowerShell scripts (build watcher, git status/diff)
├── docs/
│   ├── PROJECT_DOCUMENTATION.md    Full specification / single source of truth (large)
│   ├── PROJECT_CODEBASE_INDEX.md   (this file)
│   └── LOCAL_GIT_WORKFLOW.md       Local-only Git workflow + rollback/checkpoint rules
└── frontend/                       THE ONLY RUNTIME APP — build here
    ├── index.html
    ├── vite.config.js              React plugin, dev port 5173
    ├── package.json                deps + scripts (dev/build/preview)
    ├── .env.example                NOT required at runtime (mock mode)
    ├── dist/                       build output (generated)
    ├── public/                     static assets, public/models (face-api placeholder)
    └── src/
        ├── main.jsx                React entry; mounts providers + router
        ├── App.jsx                 renders <AppRoutes/>
        ├── routes/                 AppRoutes, ProtectedRoute, RoleBasedRoute
        ├── pages/                  public, auth, home, + per-role + features
        ├── components/             layout, common, cards, charts, tables, filters, forms, dashboard, landing
        │   └── ui.js               BARREL — import shared UI from here
        ├── context/                AuthContext, ToastContext
        ├── hooks/                  useStore, useAuth, useToast, useFeatures, useRole, useLocation, useWebcam
        ├── services/               mock* stores + per-domain services + selectors + (paused) firebase/authService
        ├── data/                   static seed datasets + seed.js + index.js barrel
        ├── utils/                  constants, helpers, date/attendance/export utils, faceSim
        └── styles/                 theme.css (tokens) + components.css
```

Empty/placeholder dirs: `frontend/src/database`, `frontend/src/features`,
`frontend/src/layouts`, `frontend/public/models`, `frontend/src/assets`.

---

## 2. Tech Stack

**Frontend (the only runtime app):**
- React 18.3 + JSX (no TypeScript) — plain JS, ESM (`"type": "module"`).
- Vite 5 (`@vitejs/plugin-react`) — dev server + production build (Rollup).
- react-router-dom 6 — routing.
- lucide-react — icons.
- firebase 10 — INSTALLED but **NOT imported at runtime** (kept for the future
  backend swap; `services/firebase.js` is a paused placeholder).
- No state library (uses React `useSyncExternalStore` over a custom store).
- No CSS framework — hand-written CSS with design tokens.
- No test runner, no ESLint config, no tsconfig present.

**Backend / Database:** none at runtime. `backend/` and `database/` are
documentation/planning placeholders only. Firebase/Firestore is the *planned*
future backend (see `database/*.md`), connected later by swapping the mock
services for real ones with the same function shapes.

---

## 3. Main Routes / Pages

Routing is config-driven in `src/routes/AppRoutes.jsx`. Role URL prefixes come
from `ROLE_BASE` in `utils/constants.js`:
`superAdmin → /super-admin`, `branchAdmin → /branch-admin`, `hr → /hr`,
`manager → /manager`, `employee → /employee`.

**Public (no auth):** `/` (LandingPage), `/login`, `/register`,
`/privacy-policy`, `/consent`.

**Authenticated shared:** `/home` (role-aware home inside dashboard chrome),
`/<role>/dashboard` (one dashboard component per role).

**Feature pages** — a `FEATURES` table maps `segment → component → allowed roles`;
each route is wrapped in `ProtectedRoute → RoleBasedRoute → Layout → FeatureGate`.
Key segments: `employees`, `branches`, `departments`, `shifts`, `attendance`,
`live-monitor`, `face-approvals`, `correction-requests`, `leave-requests`,
`suspicious-scans`, `audit-logs`, `reports`, `settings`, `profile`,
`employees/:employeeId/profile`, `hr-management`, `feature-control`,
`team-members`.

**Employee self-service:** `mark-attendance` (Face Check-In), `face-test`,
`face-registration`, `my-attendance`, `corrections`, `leave`, `monthly-summary`.

Sidebar menus per role live in `NAV_ITEMS` (constants.js); `SECONDARY_NAV` lists
reachable-but-not-in-menu segments. Unknown routes → `pages/NotFound.jsx`.

---

## 4. Auth / Login Flow

- **Mock only.** `context/AuthContext.jsx` wraps `services/mockAuthService.js`.
  No Firebase Auth, no API, no `.env` needed.
- Session persists in `localStorage` key `ft_session_user` (password stripped).
- `login({email,password})` validates against `MOCK_USERS` (`data/users.js`) plus
  any locally-registered users (`ft_registered_users`). `register()` adds a local
  user (forced role **Employee** on the public form). `devLogin(role)` / the
  login-page "Demo access" dropdown auto-fill demo creds.
- `getCurrentUser()` reconciles a demo session's display name with `MOCK_USERS`
  (display-only) so renamed demo people show without re-login.
- Guards: `routes/ProtectedRoute.jsx` (must be authed) → `routes/RoleBasedRoute.jsx`
  (role must match) → `components/layout/Layout.jsx` (sidebar+navbar chrome).
- **Demo accounts** (password `demo123`): `superadmin@demo.com`,
  `branchadmin@demo.com`, `hr@demo.com`, `manager@demo.com`, `employee@demo.com`.
- Login/register redirect to `/home`; logout clears the session → `/login`.

---

## 5. Attendance Flow

- **Employee face check-in:** `pages/employee/MarkAttendancePage.jsx`
  (sidebar "Face Check-In"). Flow: Face Scan → Location → Mark → Done via
  `WorkflowStepper`.
  - Face match is **simulated** (`utils/faceSim.js` `mockScan()`); camera via
    `hooks/useWebcam.js`. A "Simulate scan" button always works without a camera.
  - Location uses `navigator.geolocation` + `utils/attendanceUtils.checkRadius`
    against the branch geofence; if unavailable/denied it **simulates "inside"**
    so the demo always proceeds. No real GPS storage.
  - Each successful scan **auto-toggles**: odd → Sign In, even → Sign Out; a scan
    after sign-out starts a new repeatable session.
  - Writes a private **`attendanceSessions`** collection (today's session log,
    read only by this page) AND keeps the shared daily **`attendance`** row in
    first-in / last-out shape (so HR/Manager/Admin/My-Attendance/Reports are
    unaffected). Late/overtime/total-hours via `utils/attendanceUtils`.
  - Failure branches flag a `suspiciousScans` entry and/or raise a
    `correctionRequests` entry.
- **Employee history:** `pages/employee/MyAttendancePage.jsx`,
  `MonthlySummaryPage.jsx`, `MyCorrectionsPage.jsx`, `MyLeavePage.jsx`.
- **Admin/HR/Manager views:** `pages/features/AttendancePage.jsx` (working hours,
  face confidence, manual edit with required reason validation, mark-verified),
  plus role dashboards/services aggregate the same `attendance` collection.
- Seeded attendance is generated by `data/seed.js` `generateAttendance()`.

---

## 6. Mock / localStorage Data Flow

- **Store:** `services/mockStore.js` — a tiny reactive, localStorage-backed CRUD
  store standing in for Firestore. Persists under key **`ft_store_v5`** with
  **`SEED_VERSION = 5`** (bump BOTH when seed data shape changes so cached
  browsers re-seed). Seeds from `src/data/` via `data/index.js` barrel +
  `data/seed.js`.
  - API: `getAll(key)`, `getById(key,id)`, `insert`, `update`, `remove`,
    `replaceAll`, `patchSettings`, `resetStore`, `genId(prefix)`,
    `addAudit({...})`, `subscribe`, `getState`. Supports **arbitrary collection
    keys** (e.g. `attendanceSessions`) with no schema change.
- **Reading reactively:** `hooks/useStore.js` — `useCollection(key)` and
  `useSettings()` via `useSyncExternalStore` (slice-stable, minimal re-renders).
- **Deriving data:** `services/selectors.js` (pure: `scopeEmployees`,
  `scopeAttendance`, dashboard/report aggregates, `byId`) + per-role services
  (`hrService`, `managerService`, `branchAdminService`, `superAdminService`,
  `reportService`, `notificationService`, etc.) — all read the shared store, no
  duplicate data systems.
- **Auth/session:** separate localStorage keys `ft_session_user`,
  `ft_registered_users`.
- **Feature flags:** `services/featureControlService.js` — separate reactive
  store, key **`ft_feature_flags_v1`** (42-entry catalog;
  status/visibility/allowedRoles/isProtected); read via `hooks/useFeatures.js`;
  enforced by `components/common/FeatureGate.jsx` + Sidebar filtering. Protected
  features (login/logout/dashboards/settings/feature-control) can never be
  disabled.
- **Other persisted keys:** per-role decision overrides such as
  `ft_sa_reviewed_alerts`, `ft_sa_role_status`, `ft_superadmin_profile`, plus
  some `sessionStorage` last-login values.
- **Paused (NOT imported at runtime):** `services/firebase.js`,
  `services/authService.js`, and the other Firebase-era domain service
  placeholders. Mutating actions also write `auditLogs` via `store.addAudit`.

---

## 7. Important Files (quick map)

| Concern | File |
| --- | --- |
| App entry / providers | `frontend/src/main.jsx` |
| Routing config | `frontend/src/routes/AppRoutes.jsx` |
| Route guards | `frontend/src/routes/{ProtectedRoute,RoleBasedRoute}.jsx` |
| Roles / nav / status maps | `frontend/src/utils/constants.js` |
| Reactive data store | `frontend/src/services/mockStore.js` |
| Store hooks | `frontend/src/hooks/useStore.js` |
| Derived/scoped data | `frontend/src/services/selectors.js` |
| Mock auth | `frontend/src/services/mockAuthService.js` + `context/AuthContext.jsx` |
| Feature flags | `frontend/src/services/featureControlService.js` + `hooks/useFeatures.js` + `components/common/FeatureGate.jsx` |
| Shared UI barrel | `frontend/src/components/ui.js` |
| Layout chrome | `frontend/src/components/layout/{Layout,Sidebar,Navbar}.jsx` |
| Theme tokens / CSS | `frontend/src/styles/{theme.css,components.css}` |
| Face check-in | `frontend/src/pages/employee/MarkAttendancePage.jsx` |
| Face sim / webcam | `frontend/src/utils/faceSim.js` + `hooks/useWebcam.js` |
| Seed datasets | `frontend/src/data/*` (barrel `index.js`, generators `seed.js`) |

---

## 8. Build / Run Commands

All commands run **inside `frontend/`**:

```bash
cd frontend
npm install        # only if node_modules missing / deps changed (ask first)
npm run dev        # Vite dev server on http://localhost:5173 (HMR) — start ONCE
npm run build      # production build into dist/  (REQUIRED after code changes)
npm run preview    # serve the built dist/ locally
```

- Start `npm run dev` **once**; rely on Vite HMR. Restart only if
  `package.json`/`vite.config.js` change, a dep is installed, or HMR breaks.
- App runs with **no `.env`**.

---

## 9. Test / Check Commands

- **No automated test suite or linter is configured** (no Jest/Vitest, no ESLint
  config, no tsconfig). The de-facto verification gate is the production build:

```bash
cd frontend && npm run build
```

  It must finish with **exit 0** and `✓ built`. Baseline (2026-06-23): 1632
  modules, JS ~577 kB / gzip ~143 kB, CSS ~49.6 kB / gzip ~9.3 kB. The
  ">500 kB chunk" message is **advisory only**, not an error.
- Manual QA: log in per demo account and exercise the role's sidebar pages
  (Phase 7 testing). See the **Current status** section in `README.md` and the
  QA fix-pass entries in `CHANGELOG.md`.

---

## 10. Things NOT To Break

- **Frontend-only mock mode.** Do NOT add a real backend, Firebase runtime
  imports, API calls, or require `.env` — unless the task explicitly asks.
- **No new npm packages** without explicit approval (charts/CSV/PDF are
  dependency-free; PDF = print view).
- **Login + the 5 demo accounts** and the mock/localStorage session.
- **Dark glassmorphism theme** — do NOT reintroduce the reverted light theme;
  edit only the dark `:root` tokens in `theme.css` / `components.css`. Don't edit
  the shared `.ft-land-grid` rule (use scoped modifiers).
- **Sidebar / navbar / header chrome** and the public navbar scroll behavior.
- **Store keys & seed version** — bump `ft_store_v5` / `SEED_VERSION` together
  when changing seed shape; keep branch field names `name/lat/lng/radiusMeters`.
- **Routing contract** — role-prefixed URLs, the `FEATURES` table, and
  `FeatureGate` wrapping; keep every `to` link resolving to a real route.
- **Shared daily `attendance` row shape** (first-in / last-out) so HR/Manager/
  Admin/Reports stay consistent.
- Don't delete docs or tracking files; update the right one after changes.
- Always run `cd frontend && npm run build` after frontend code changes and fix
  errors before reporting done.
