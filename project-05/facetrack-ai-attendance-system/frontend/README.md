# FaceTrack AI — Frontend (React + Vite)

The only runtime code for FaceTrack AI. The app runs **frontend-only in mock mode**:
all auth and data are mock (seeded into a reactive `localStorage` store), so it boots
with **no backend, no Firebase runtime, no API calls, and no `.env`**.

> This is a short package-level readme. For the full picture see the root
> [`README.md`](../README.md) (overview, demo accounts, current status & roadmap),
> [`CHANGELOG.md`](../CHANGELOG.md) (history), and
> [`docs/PROJECT_DOCUMENTATION.md`](../docs/PROJECT_DOCUMENTATION.md) (full spec).

## Scripts

```bash
npm install      # install dependencies (one time)
npm run dev      # start the Vite dev server (HMR) — start once, leave running
npm run build    # production build — must stay green after code changes
npm run preview  # preview the production build
```

No environment variables are required — the app boots straight into mock mode.

## Auth / data (mock mode)

- Login is **mock email/password** via `src/services/mockAuthService.js` (sessions in
  `localStorage`). Five demo accounts share the password `demo123` — see the root
  [`README.md`](../README.md#demo-login-accounts).
- App data flows through the reactive `src/services/mockStore.js` (localStorage-backed,
  seeded from `src/data/`) → `src/services/selectors.js` → `src/hooks/useStore.js`.
- Real **Firebase** (`src/services/firebase.js`, `src/services/authService.js`) is kept as
  a **paused placeholder** and is **not imported at runtime**. When a real backend is added
  later, the mock services are swapped for real ones behind the same function shapes — no
  page rewrites needed.

## Source layout (high level)

```
src/
  components/   # common, layout, dashboard, cards, charts, ui.js (shared kit)
  context/      # AuthContext (mock auth state + role)
  hooks/        # useAuth, useStore, useFeatures, useToast, useWebcam, ...
  pages/        # public/, auth/, employee/, hr/, manager/, branchAdmin/, superAdmin/, features/, home/
  routes/       # AppRoutes (config-driven), ProtectedRoute, RoleBasedRoute
  services/     # mockStore, selectors, mockAuthService, role services, featureControlService
  data/         # mock seed data (branches, employees, departments, shifts, users, ...)
  utils/        # constants, dateUtils, attendanceUtils, exportUtils, faceSim, helpers
  styles/       # theme.css + components.css (dark glassmorphism design tokens)
```

Roles: `superAdmin`, `branchAdmin`, `hr`, `manager`, `employee`.
