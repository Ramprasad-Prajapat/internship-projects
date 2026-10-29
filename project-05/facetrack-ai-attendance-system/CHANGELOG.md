# Changelog

## [2026-07-17] — Fix demo-role dropdown visibility, Employee Face Check-In Navigation, & Autofill Issue
* Fixed select option contrast/readability issue on LoginPage for dark mode.
* Added `demo-role-select` class to the select element in [LoginPage.jsx](file:///r:/Inernship/WebDevelopment/Project/facetrack-ai/frontend/src/pages/auth/LoginPage.jsx).
* Defined CSS rules for `.demo-role-select` in [theme.css](file:///r:/Inernship/WebDevelopment/Project/facetrack-ai/frontend/src/styles/theme.css) with appropriate background, colors, and `color-scheme: dark`.
* Fixed Employee "Face Check-In" page loading/navigation issue by resolving an infinite re-render loop. Seseeded `attendanceSessions: []` in `buildSeed` and returned a referentially-stable `EMPTY_ARRAY` from `getAll` in [mockStore.js](file:///r:/Inernship/WebDevelopment/Project/facetrack-ai/frontend/src/services/mockStore.js) for unseeded collections.
* Resolved browser-autofill override issue on [LoginPage.jsx](file:///r:/Inernship/WebDevelopment/Project/facetrack-ai/frontend/src/pages/auth/LoginPage.jsx) by adding `autoComplete="off"` to the form, unique `id` and `name` attributes to input fields, and updating inputs to use `autoComplete="username"` / `autoComplete="current-password"` and `spellCheck={false}`.

## [2026-06-23] — Verified Local Run + Current-Status Doc Update (Docs-Only)
Documentation-only — no app/source change, no build run, no commit/push.

* Verified the local app run via `scripts/auto-run.ps1` (Vite on `http://localhost:5173`).
* Verified employee login (`employee@demo.com` → `/home`, mock session created), the redesigned Employee Dashboard + Face Check-In UI, and the mock attendance `localStorage` flow (`attendanceSessions` 2 → 3; Face Match Matched ~90%, Location Checked-mock).
* Confirmed test-server cleanup + port 5173 freed; the user's manually-run server is reused, not killed.
* Recorded a **Current Project Status** section in `docs/PROJECT_DOCUMENTATION.md`.

## [2026-06-23] — Docs Cleanup: Consolidate Markdown Documentation (Docs-Only, Uncommitted)
Documentation-only consolidation — **no app/source code change, no build, no commit, no push**
(read-only Git used for status/log/diff). Reduced overlapping tracking/report files down to a
single canonical set and re-pointed every cross-reference so nothing dangles.

### Kept (canonical docs)
* `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `docs/PROJECT_DOCUMENTATION.md`,
  `docs/PROJECT_CODEBASE_INDEX.md`, `docs/LOCAL_GIT_WORKFLOW.md`, and `frontend/README.md`
  (frontend-specific setup). The `database/` and `backend/` placeholder docs were left as-is.

### Removed (redundant, after merging useful content)
* `CLAUDE_BRIEF.md` — architecture brief + permanent rules already live in `CLAUDE.md` +
  `docs/PROJECT_CODEBASE_INDEX.md`; its "Latest Work" log duplicated this CHANGELOG.
* `CURRENT_STATUS.md` + `TASKS.md` — forward-looking status/phase/pending folded into the new
  **Current status & roadmap** section of `README.md`; history already in this CHANGELOG.
* `complete.md` — Hinglish dev-workflow notes duplicated `CLAUDE.md` §6–§7.
* `WEBSITE_TEST_REPORT.md` — QA fix-pass already logged in this CHANGELOG (2026-06-22 entry).
* `docs/EMPLOYEE_PROFILE_WORK_REPORT.md` — the Employee Profile feature is documented in
  `docs/PROJECT_DOCUMENTATION.md`; its build history is in this CHANGELOG.
* `docs/CLAUDE_AUTOMATION.md` — hook/skill/watcher setup summarized in `CLAUDE.md` §0.

### Changed (reference fixes)
* `CLAUDE.md` (§2–§5, §9), `README.md`, `frontend/README.md`,
  `docs/PROJECT_CODEBASE_INDEX.md`, and `docs/PROJECT_DOCUMENTATION.md` — replaced all links to
  the removed files with the canonical set; `CLAUDE.md` now records the current phase (Phase 7)
  and the consolidated doc-file purpose list.
* `docs/LOCAL_GIT_WORKFLOW.md` — added a "Rolling back a docs cleanup" section
  (`git restore .` + the `commit now:` phrase to keep the cleanup).

## [2026-06-22] — Documentation Save: Full Project Status Refresh (Docs-Only)
Documentation-only pass — **no code/UI change, no build required, no Git used, no new files
created**. Re-scanned the project and refreshed the existing markdown so the docs reflect the
current website (all role control centers, the Super Admin Feature Control Center, the employee
face **Sign-In / Sign-Out** flow, and the public landing UI polish).

### Added
* `WEBSITE_TEST_REPORT.md` — new **§21 Addendum** recording the features added after the original
  report (employee Sign-In/Sign-Out flow + landing UI polish) and the current build result
  (1632 modules, JS 577.01 kB), with the §7/§14 caveats that still apply to the new flow.
* `complete.md` — new **"Employee Face Attendance — Sign In / Sign Out"** section (Hinglish, matching
  the existing Manager notes): Start Camera, Start Scan auto-toggle, time calculation, the private
  `attendanceSessions` data flow, and a verify checklist.

### Changed
* `README.md` — the check-in highlight now describes the **Sign-In / Sign-Out** flow (toggle + live
  working-time clock + session log); the Scope/Roadmap "Done" section now also lists the HR / Branch
  Admin / Super Admin control centers, the Feature Control Center, the repeatable attendance flow,
  the landing polish, and the test-report fix pass.
* `CLAUDE_BRIEF.md` — "Latest Work" gained two new top bullets (Employee Sign-In/Sign-Out flow with
  the `attendanceSessions`/no-`SEED_VERSION`-bump note, and the landing UI polish with the shared
  `.ft-land-grid` / `.ft-feature-grid` caution).
* `docs/PROJECT_DOCUMENTATION.md` — the implementation-status banner now lists **every role as a full
  control center** (Employee Sign-In/Sign-Out, Manager, HR, Branch Admin, Super Admin + Feature Control)
  and the landing polish + fix pass, instead of just the Manager work.

### Fixed
* No code fixes (docs-only). Stale framing corrected: the docs banners/highlights previously stopped at
  the Manager work and omitted the later HR/Branch-Admin/Super-Admin/Feature-Control build and the
  employee Sign-In/Sign-Out flow.

### Pending
* Backend/database, Firebase Auth + Firestore, real face-api.js matching + liveness, real
  reverse-geocoding, and deployment remain **future work** (swap the mock service/store layer for the
  real one — same function shapes). Manual browser QA across roles (Phase 7) still open.

## [2026-06-22] — Employee Face Attendance Sign-In / Sign-Out Toggle (Frontend-Only Mock)
Reworked the employee **Mark Attendance** (Face Check-In) page so a face scan **auto-toggles**
Sign-In ↔ Sign-Out and supports **repeatable demo sessions** with a live working-time clock and a
today session log — all on `localStorage`/mockStore. **Frontend-only mock mode; no real biometrics/GPS/
face recognition; no backend/Firebase/API/`.env`/new packages; login, routes, theme, sidebar/header,
and HR/Manager/Admin/My-Attendance pages untouched; no Git.**

### Changed
* `frontend/src/pages/employee/MarkAttendancePage.jsx` — rewritten flow:
  * **Auto-toggle:** after a successful scan + (mock/simulated) location check, attendance is marked automatically — **odd scan → Sign In, even scan → Sign Out**, and a scan after sign-out starts a **new session** (no more "already completed today" lockout). The primary button label is now dynamic: **"Start Scan / Sign In"** or **"Start Scan / Sign Out"**. Low-confidence / multi-face / outside-radius branches still flag a suspicious scan or offer a correction request (they do **not** mark).
  * **Session log:** every sign-in/out is appended to a new **private `attendanceSessions`** collection in the same mockStore (keyed by employee+date, stored in `localStorage` via the existing store) — read **only** by this page, so HR/Manager/Admin/Reports are unaffected. On mount it back-fills the log from the seeded daily row (if any) so the timeline is continuous. A "Today's sessions" card lists each entry (`HH:MM — Signed in/out by face scan`).
  * **Shared daily row kept in sync:** the existing `attendance` row keeps its shape — first check-in / last check-out. Re-signing in after a sign-out preserves the first check-in and clears check-out (running again); signing out recomputes `overtimeMinutes` + `totalHours`. So `MyAttendance`, HR/Manager/Admin tables and reports keep working unchanged.
  * **Live time + richer status panel:** the right panel now shows Camera On/Off, Face match Matched/Pending (+confidence), Location Checked/Outside/Not-checked (mock tag when simulated), Current status Signed In/Signed Out, Check-in, Check-out (Pending while signed in), **Working time** (live `Xh Ym · Running` while signed in, via a 1 s tick), Last scan, and Employee code.
  * **Persistence:** signed-in/out state, times, working duration and today's session log all survive refresh (mockStore → `localStorage`).

### Verified
* `npm run build` green — 1632 modules, JS 577.01 kB / gzip 143.36 kB, CSS 49.63 kB / gzip 9.31 kB, built in 2.31s (Vite's >500 kB advisory only). Start Camera (with simulate fallback), Start Scan / Simulate scan → Sign In, second scan → Sign Out, running working-time, repeat sessions, and refresh-persistence all work on mock data. No backend/Firebase/API/`.env`/new deps; other roles' attendance pages unchanged.

## [2026-06-22] — Landing Face-Scan Workflow Cards → ~2× Larger (Frontend-Only)
Enlarged the public landing **"The face-scan workflow"** (Face check-in) step cards (Consent · Capture ·
AI Match · Location · Verified) to roughly double size — bigger card box, icon circle, icon and label —
while keeping them in one desktop row with arrows aligned. **Size/layout only; text, icons, colors,
theme, heading all unchanged. No backend/Firebase/API/`.env`/new packages; routes/other sections
untouched; no Git.**

### Changed
* `frontend/src/styles/theme.css` (scoped to the `.ft-flow-*` classes, used only in this section) — `.ft-flow-step`: width `130px → 210px`, added `min-height: 190px`, padding `22px 12px → 34px 28px`, gap `10px → 16px`, added `justify-content: center` (vertically centers the bigger content). `.ft-flow-icon` circle: `48×48 → 76×76`. `.ft-flow-label`: `0.86rem → 0.98rem`. The `.ft-flow` flex container already had `flex-wrap: wrap`/`justify-content: center`, and the existing `@media (max-width: 720px)` override (`.ft-flow-step { width: 150px }` + rotated arrows) is untouched — so tablet wrap / mobile stacking still work with no horizontal overflow. Arrow alignment is preserved by `.ft-flow-item { align-items: center }`.
* `frontend/src/pages/public/LandingPage.jsx` — the flow step icon size bumped `<Icon size={22} />` → `size={30}` to fill the larger circle (same icons, same content).

### Verified
* `npm run build` green — 1632 modules, JS 574.46 kB / gzip 142.57 kB, CSS 49.63 kB / gzip 9.31 kB, built in 1.96s (Vite's >500 kB advisory only). Workflow cards are ~2× larger, stay in one desktop row with aligned arrows; wrap neatly on tablet and stack cleanly on mobile (150px width override) with no horizontal scroll. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Landing Roles Section → Single-Row 5-Up Grid + Tighter Spacing (Frontend-Only)
Made the public landing **"Built for every role"** (Access control) section show all **five role cards in
one clean row** on desktop (Super Admin · Branch Admin · HR · Manager · Employee) instead of `auto-fit`
wrapping the 5th card to a second row with a big blank gap; also trimmed the section's vertical padding.
**CSS/layout only; text, icons, colors, theme, card style all unchanged. No backend/Firebase/API/`.env`/
new packages; navbar/routes/logic/other sections untouched; no Git.**

### Changed
* `frontend/src/styles/theme.css` — `.ft-roles-grid` changed from `repeat(auto-fit, minmax(300px, 1fr))` (which fit only 4 columns on the ~1480px container, wrapping the 5th card to a near-empty second row) to **`repeat(5, minmax(0, 1fr))`** — five equal columns in one row, `minmax(0,1fr)` so they shrink without horizontal scroll; gap kept at `16px`. Added section-scoped rules (no other section affected): `.ft-roles-grid .ft-role-card { padding: 18px 16px }` (slightly tighter so 5-across stays compact) and `#roles { padding-block: clamp(40px, 5vw, 48px) }` (trims the standard 56px vertical padding for this section only). New responsive breakpoints for `.ft-roles-grid`: `≤1024px` → 3 per row, `≤680px` → 2 per row, `≤480px` → 1 per row. The shared `.ft-land-section` rule and all other sections are untouched.

### Verified
* `npm run build` green — 1632 modules, JS 574.46 kB / gzip 142.57 kB (JS unchanged — CSS-only edit), CSS 49.59 kB / gzip 9.30 kB, built in 2.60s (Vite's >500 kB advisory only). Roles cards now sit in a single desktop row with no second-row blank space, tighter top/bottom padding, equal widths; tablet 3→2 per row, mobile 1 per row; no horizontal scroll. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Landing Problem Section → 4 + 4 Grid + 2 New Problem Cards (Frontend-Only)
Made the public landing **"Attendance is still broken at most companies"** problem section a balanced
**4 + 4** grid (4 per row on desktop) and added **2 more related problem cards** so it shows 8 total.
**Reused the existing 4/2/1 responsive layout; section heading, theme, colors, icon style, card design
all unchanged. No backend/Firebase/API/`.env`/new packages; routes/logic/other sections untouched; no Git.**

### Changed
* `frontend/src/components/landing/IndustryProblemCards.jsx` — added **2 new problem cards** to `DEFAULT_PROBLEMS` (now 8): **"Leave & correction chaos"** (`CalendarX` icon — "Manual leave approvals and attendance corrections cause delays, confusion and record mismatches.") and **"No branch-level control"** (`Building2` icon — "Hard to manage attendance policies, shifts and visibility separately across multiple branches."). Imported the two new lucide icons. The grid `<div>` now uses `className="ft-land-grid ft-feature-grid"` to opt into the balanced 4-per-row layout (same card markup, `ft-land-card--problem` red-icon modifier, and `ft-glass` design unchanged).
* `frontend/src/styles/theme.css` — no new rule needed; the problem grid reuses the existing `.ft-feature-grid` (desktop `repeat(4, minmax(0,1fr))` + `align-items: stretch`, `≤900px` → 2 per row, `≤560px` → 1 per row, `18px` gap). Only the rule's comment was generalized to note it now serves both the Features and Industry-Problem grids. Plain `.ft-land-grid` consumers remain unaffected.

### Verified
* `npm run build` green — 1632 modules, JS 574.46 kB / gzip 142.57 kB, CSS 49.27 kB / gzip 9.24 kB, built in 1.96s (Vite's >500 kB advisory only). Problem section now shows 8 cards as 4 + 4 on desktop, 2 per row on tablet, 1 per row on mobile; equal widths, consistent gaps. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Landing Features Section → Balanced 4-Per-Row Grid (Frontend-Only)
Made the public landing **"Everything you need to run attendance"** features section (8 cards: Face
Recognition, Location Verified Check-In, Role-Based Access, Smart Attendance Logic, Live Analytics,
Privacy & Consent, Multi-Branch HR, Reports & Export) render as a clean **4 + 4** grid (4 cards per
row on desktop) instead of `auto-fit`'s uneven wrapping. **CSS/layout only; card content, text,
icons, colors, theme, animation all unchanged. No backend/Firebase/API/`.env`/new packages; routes/
logic/other sections untouched; no Git.**

### Changed
* `frontend/src/pages/public/LandingPage.jsx` — the features grid `<div>` now carries an extra modifier class: `className="ft-land-grid ft-feature-grid"` (markup, card content, icons, animation all unchanged).
* `frontend/src/styles/theme.css` — added a dedicated **`.ft-feature-grid`** rule right after the shared `.ft-land-grid` (which was `repeat(auto-fit, minmax(260px,1fr))` and produced an uneven 5+3 on wide screens). New rule: desktop `grid-template-columns: repeat(4, minmax(0, 1fr))` + `align-items: stretch` (equal width + equal-height rows); `@media (max-width: 900px)` → `repeat(2, minmax(0, 1fr))` (tablet); `@media (max-width: 560px)` → `repeat(1, minmax(0, 1fr))` (mobile). Same `18px` gap (inherited from `.ft-land-grid`). The shared `.ft-land-grid` is untouched, so `IndustryProblemCards` and any other consumers are unaffected.

### Verified
* `npm run build` green — 1632 modules, JS 573.70 kB / gzip 142.43 kB, CSS 49.27 kB / gzip 9.24 kB, built in 2.70s (Vite's >500 kB advisory only). Features section now shows exactly 4 cards in row 1 and 4 in row 2 on desktop, 2 per row on tablet, 1 per row on mobile; equal card widths, consistent gaps, no overflow. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Landing Branch Network → Faster Auto-Scrolling Carousel (Frontend-Only)
Turned the public landing **"Built for multi-branch teams in Rajasthan"** branch cards (Jaipur HQ,
Jodhpur Branch, Udaipur Office, Kota Office, Bikaner Branch, Ajmer Office) from a 2-row wrapping
grid into a single **continuously looping horizontal marquee** — **faster (14s)** than the roadmap
carousel — that pauses on hover/focus and respects reduced motion. **CSS-only animation;
content/cards/theme unchanged. No backend, Firebase, API, `.env`, or new packages; login/routes/
other pages untouched; no Git.**

### Changed
* `frontend/src/pages/public/LandingPage.jsx` — the Rajasthan-office section's `.ft-land-grid` (which wrapped six cards into two rows) is now a `.ft-branch-marquee` → `.ft-branch-track`. The single `RAJASTHAN_OFFICES` array is rendered **twice** (`[0,1].map(...)`) so the track loops seamlessly; the second copy is `aria-hidden` + `data-clone` (no data duplicated in source). Same card markup (`.ft-land-card.ft-glass`, `Building2` icon, name, "city · code · 150 m geofence") — content unchanged. The map-chip pills above (`.ft-map-chips`) are untouched.
* `frontend/src/styles/components.css` — appended (loads last, additive): `.ft-branch-marquee` (overflow-hidden viewport + soft edge mask + vertical padding so the card hover-lift/glow isn't clipped), `.ft-branch-track` (`display:flex; width:max-content; animation: ft-branch-scroll 14s linear infinite` — faster than the 38s roadmap marquee), `.ft-branch-card` (fixed `clamp(232px,74vw,274px)` width + uniform `margin-right` for a seamless `translateX(-50%)` loop, single row, no wrap), hover/`:focus-within` → `animation-play-state: paused`, the `ft-branch-scroll` keyframes, and a `@media (prefers-reduced-motion: reduce)` block (animation off, clones hidden, first set wraps centered). The existing `.ft-land-card` / `.ft-glass` design rules are untouched.

### Verified
* `npm run build` green — 1632 modules, JS 573.68 kB / gzip 142.42 kB, CSS 49.00 kB / gzip 9.20 kB, built in 4.17s (Vite's >500 kB advisory only). Six branch cards now move as one horizontal row (no second-row wrapping), loop seamlessly right-to-left at 14s, pause on hover/focus and resume on leave; responsive (≈1 card/view on mobile via the clamp width, no page overflow); reduced-motion shows a static wrapped set. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Manager Approvals Polish + Lint/Key Cleanup (Frontend-Only)
Small, targeted improvements to the Manager area (data consistency + cleanup) — no rewrites,
no theme change. **Frontend-only mock mode preserved; no backend/Firebase/API/`.env`/new
packages; login, demo accounts, routes, sidebar/header all unchanged; no Git.**

### Changed
* `frontend/src/services/managerService.js` — added `teamOvertimeRows(team, attendance, status, days)` (a status-filterable view over the same attendance-derived overtime rows; `pendingOvertimeRows` kept unchanged for the pending counts/alerts).
* `frontend/src/pages/manager/ManagerDashboard.jsx` — **overtime approvals now mirror the leave/correction queues**: the Approvals **status filter** (Pending / Approved / Rejected / All) now applies to overtime too, the overtime **Status column reflects the real `overtimeApproved` decision** (was hardcoded "pending"), and a decided overtime shows a **"Reviewed"** state instead of silently vanishing after approve/reject. Removed unused imports (`FACE_STATUS`, `todayISO`); manager alert list now uses a **stable key** (`tone-text`) instead of the array index.
* `frontend/src/pages/manager/ManagerHomePanel.jsx` — manager alert list uses a stable key instead of the array index.
* `frontend/src/pages/manager/ManagerProfilePage.jsx` — removed the unused `todayISO` import (the `FALLBACK_MANAGER` was already the renamed **Neeraj Verma**).

### Verified
* `npm run build` green — 1632 modules, JS 573.52 kB / gzip 142.40 kB, CSS 47.98 kB (Vite's >500 kB advisory only). Manager Home live panel, Manager Dashboard/Profile, Team Attendance/Members, Approvals (leave/correction/overtime persist to `localStorage`), Reports, and the reusable View-Employee-Profile route all continue to work on the shared mock store. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Landing "Backend-ready by design" → Auto-Scrolling Carousel (Frontend-Only)
Turned the public landing **"Backend-ready by design"** roadmap section into a smooth, continuously
looping horizontal **marquee carousel** that pauses on hover/focus and respects reduced motion.
**CSS-only animation; content/cards/theme unchanged. No backend, Firebase, API, `.env`, or new
packages; login/routes/other pages untouched; no Git.**

### Changed
* `frontend/src/pages/public/LandingPage.jsx` — the roadmap section's `.ft-land-grid` is now a `.ft-roadmap-marquee` → `.ft-roadmap-track`. The single `ROADMAP` array (Firebase backend / Liveness detection / Map integration / Payroll export / WhatsApp / SMS alerts) is rendered **twice** (`[0,1].map(...)`) so the track loops seamlessly; the second copy is `aria-hidden` + `data-clone` (no data duplicated in source). Same card markup (`.ft-land-card.ft-glass`, icon, title + "Soon", text) — content unchanged.
* `frontend/src/styles/components.css` — appended (loads last, additive): `.ft-roadmap-marquee` (overflow-hidden viewport + soft edge mask + vertical padding so the card hover-lift/glow isn't clipped), `.ft-roadmap-track` (`display:flex; width:max-content; animation: ft-roadmap-scroll 38s linear infinite`), `.ft-roadmap-card` (fixed `clamp(248px,78vw,290px)` width + uniform `margin-right` for a seamless `translateX(-50%)` loop), hover/`:focus-within` → `animation-play-state: paused`, the `ft-roadmap-scroll` keyframes, and a `@media (prefers-reduced-motion: reduce)` block (animation off, clones hidden, first set wraps centered). The existing `.ft-land-card` / `.ft-soon` design rules are untouched.

### Verified
* `npm run build` green — 1632 modules, JS 573.02 kB / gzip 142.28 kB, CSS 47.98 kB (Vite's >500 kB advisory only). Auto-scrolls + loops; pauses on hover/focus, resumes on leave; responsive (≈1 card/view on mobile via the clamp width); reduced-motion shows a static wrapped set. No backend/Firebase/API/`.env`/new deps.

## [2026-06-22] — Fix Pass: High + Medium Priority Issues from WEBSITE_TEST_REPORT (Frontend-Only)
Fixed the verified P0/P1 issues from `WEBSITE_TEST_REPORT.md` without changing the theme or
leaving frontend-only mock mode. **No backend, Firebase runtime, API calls, `.env`, or new
packages. No pages/routes removed; login + 5 demo accounts unchanged; no Git used.**

### Fixed
* **Super Admin branch-admin seed (High)** — `frontend/src/data/branches.js`: `BR001 (Jaipur HQ).branchAdminId` was `'u-super'` (the org-level Super Admin), which inflated the "active branch admins" count and showed the Super Admin as HQ's branch admin in Branch Performance. Set to `null` (HQ unassigned until a real branchAdmin exists). Super Admin stays global; the active-branch-admin count is now correct (only `u-branch` / Jodhpur), and Branch Performance shows "Unassigned" for HQ instead of a wrong name.
* **HR attendance rate > 100% (Medium)** — `frontend/src/services/hrService.js` (`hrOverview` + `departmentSummary`): present/late were counted over **all** of today's rows while the denominator used **active** employees, so an inactive employee with a present/late row could push the rate above 100%. Both now count today's present/late over the **active** population only, so the rate can never exceed 100%.
* **Manual attendance time validation (Medium)** — `frontend/src/pages/features/AttendancePage.jsx`: the manual edit modal now validates check-in/out as 24-hour `HH:MM` (e.g. `09:30`) before saving — invalid values (`abc`, `99:99`) and a missing check-in on a present/late record show an inline field error and block the save (prevents `NaN` in late/overtime/hours math). Empty optional times still mean "cleared".
* **Employee delete orphaned data (Medium)** — `frontend/src/pages/features/EmployeesPage.jsx`: the destructive hard delete (which orphaned attendance/leave/correction/face rows into "Unknown") is now a **soft archive** — the record is kept (status `inactive`, `archived: true`) so historical rows still resolve the person's name; the confirm dialog + button copy now say "Archive". Audit action `employeeArchived`.
* **Correction approval silent no-op (Medium)** — `frontend/src/pages/features/CorrectionRequestsPage.jsx`: `applyAttendanceCorrection` now returns a result; approving a time-based correction with **no matching attendance row** is blocked with a clear "No matching attendance record found…" warning instead of a fake success. When a row is patched the toast reads "Correction approved — attendance updated".
* **Feature Control empty-roles guard (Medium)** — `frontend/src/services/featureControlService.js` (`setAllowedRoles` returns `{ emptyRoles: true }` for an empty list) + `frontend/src/pages/superAdmin/FeatureControlPage.jsx` (Save disabled at zero roles, inline "At least one role must have access to this feature." hint + warning toast). A feature can no longer be saved with zero allowed roles.
* **HR Management table rowKey (Medium)** — `frontend/src/pages/features/HRManagementPage.jsx`: added `rowKey="id"` to the HR Team `DataTable` (removes the React key/reconciliation risk on sort).
* **Public register role restriction (Medium)** — `frontend/src/pages/auth/RegisterPage.jsx`: removed the role `<select>`; public sign-up now always creates an **Employee** (role forced in the submit handler, read-only "Employee" field + helper note). Elevated roles are no longer self-assignable. Demo logins unchanged.
* **Home vs dashboard numbers (Medium)** — `frontend/src/pages/home/HomePage.jsx`: the "At a glance" cards were static (e.g. 248 employees) and contradicted the live dashboards (~14). They now derive from the **live reactive store** (role-scoped via `selectors`: `scopeEmployees`/`scopeAttendance`/`dashboardMetrics`/`employeeMonthSummary`), so Home and the role dashboards agree; label updated to "Live · mock store data". (`data/mockDashboardData.js` is no longer imported by Home but kept so `data/index.js` still resolves.)
* **Profile hardcoding (Medium)** — `frontend/src/pages/features/ProfilePage.jsx`: removed the name-based `isAyesha`/`EMP005` special-casing; identity (id/email/phone/branch/dept/shift) now comes straight from the employee record with neutral `—` fallbacks. Biometric consent + privacy/data-usage now derive from face-registration status, Location Status from the latest attendance scan's location (no more always-"Accepted"/"Inside Radius"), the Last Consent date from the latest face capture, and **Profile Completion is computed** from the fields actually held (was a static 85%). Documents show "Not uploaded" rather than implying verified paperwork that doesn't exist.

### Verified
* `npm run build` green — 1632 modules, JS 572.85 kB / gzip 142.20 kB, CSS 47.02 kB (Vite's >500 kB advisory only). All five demo logins, route protection, role dashboards, and refresh persistence unchanged; no backend/Firebase/API/`.env`/new deps; no Git used.

## [2026-06-22] — Super Admin: Website Feature Control Center (Frontend-Only)
Added a Super Admin **Website Feature Control Center** so Super Admin can enable/disable, show/hide,
and set role access for website features/modules from one place — all frontend mock, persisted to
`localStorage`, with a mock audit entry per change. **No backend, Firebase, API, `.env`, or new
packages. No code/routes/pages removed; login + demo accounts unchanged.**

### Added
* `frontend/src/services/featureControlService.js` — reactive, localStorage-backed feature-flag store (subscribe pattern like `mockStore`, key `ft_feature_flags_v1`). A 42-entry CATALOG (Public / Employee / Manager / HR / Branch Admin / Shared / Super Admin / Dashboards / System) with `status`, `visibility`, `allowedRoles`, `isProtected`; `setStatus`/`setVisibility`/`setAllowedRoles`/`resetFeature`/`resetAll` (each writes a mock audit log), plus `summary` and enforcement helpers (`isFeatureEnabledForRole`, `isNavVisible`).
* `frontend/src/hooks/useFeatures.js` — `useFeatures()` / `useFeatureEnabled()` reactive readers (useSyncExternalStore).
* `frontend/src/components/common/FeatureGate.jsx` — wraps every role feature route; if a feature is disabled (or the role was removed from its access list), shows a friendly "This feature is currently disabled by Super Admin in demo mode." message instead of the page — without removing the route.
* `frontend/src/pages/superAdmin/FeatureControlPage.jsx` — the control center at `/super-admin/feature-control`: summary cards (Total / Enabled / Disabled / Protected), search + module + status filters, and a feature table (Feature, Module, Visible-For-Roles, Status, Last Updated, Control) with Enable/Disable, Show/Hide, Role Access (modal), and Reset. Protected system features (login, logout, dashboards, settings, this page) cannot be disabled/hidden — attempting it shows the protected warning. Every change persists to localStorage + writes an audit entry + toasts + updates immediately.

### Changed
* `frontend/src/routes/AppRoutes.jsx` — added the `feature-control` route (`[S]`) and wrapped every feature route element in `<FeatureGate featureKey={seg} role={role}>`. No routes removed.
* `frontend/src/components/layout/Sidebar.jsx` — nav items are filtered by `isNavVisible` so disabled/hidden/role-removed features drop out of the sidebar (uncontrolled + protected items always remain).
* `frontend/src/utils/constants.js` — added a **Feature Control** link to the Super Admin sidebar.
* `frontend/src/pages/superAdmin/SuperAdminDashboard.jsx` — added a **Feature Control Summary** card (Total / Enabled / Disabled / Protected / Last Updated + "Open Feature Control" link), reactive to toggles.
* `frontend/src/pages/features/SettingsPage.jsx` — added a Super-Admin-only **Website Feature Controls** section with an "Open Feature Control Center" button.

### Verified
* `npm run build` green — 1632 modules, JS 571.28 kB / gzip 141.63 kB, CSS 47.02 kB (Vite's >500 kB advisory only). Toggles persist across refresh; protected features can't be disabled; disabling a feature hides it from the sidebar and shows the disabled message on its route; no backend/Firebase/API.

## [2026-06-22] — Super Admin: Global Control + Branch Monitoring + Role Management Center (Frontend-Only)
Upgraded the existing Super Admin section into a **Global Control + Branch Monitoring + Role
Management Center** on the **shared** mock store — without breaking existing pages, login, theme,
demo accounts, or other roles. Global / all-branch scope (distinct from HR org-wide, Branch Admin
branch, Manager team). **No backend, Firebase, API, `.env`, or new packages. Super Admin demo
account (`superadmin@demo.com / demo123`) unchanged.**

### Added
* `frontend/src/services/superAdminService.js` — global derivations over the shared store (reuses `selectors` + the store): `globalOverview` (branches/departments/employees + role counts + present/late/pending), `branchPerformance` (per-branch comparison + network), `roleAccessSummary` (per-role users/access/permissions), `dataQuality` (8-point missing-setup checker with Good/Warning/Needs Review/Critical badges), `platformHealth`, `systemAlerts`, `globalActivity` / `superAdminActivityOwn`.
* `frontend/src/pages/superAdmin/SuperAdminDashboard.jsx` — replaced the empty `DashboardShell` with the global control center: 10 global KPI cards (Branches, Departments, Employees, Active HR/Managers/Branch Admins, Present, Late, Pending Requests, Platform Health), **System Alerts Center** (severity filter + Mark Reviewed persisted to `localStorage`), **Branch Performance & Network** table (search + needs-review filter + View Branch/Employees/Attendance/Reports), **Role & Access Control** table (per-role view + Activate/Deactivate persisted to `localStorage`), **Data Quality Checker**, Global Activity Timeline, and Global Quick Actions (existing routes only).
* `frontend/src/pages/superAdmin/SuperAdminHomePanel.jsx` — superAdmin-only block on the shared `/home`: global platform summary, system alerts, pending global actions, branch performance snapshot, and data-quality warnings.
* `frontend/src/pages/superAdmin/SuperAdminProfilePage.jsx` — **Super Admin Identity + Global Control Center** at `/super-admin/profile`: header (95% completion), quick actions, system permissions, managed branches, global snapshot, security/login info, and global activity timeline. Super Admin is an org-level login with no employee record, so identity comes from the session + role profile with fallbacks; Edit Profile persists name/phone to a `localStorage` override (`ft_superadmin_profile`).

### Changed
* `frontend/src/pages/home/HomePage.jsx` — renders `<SuperAdminHomePanel/>` only when `role === 'superAdmin'`; other roles' Home unchanged.
* `frontend/src/routes/AppRoutes.jsx` — repointed **only** Super Admin's own `profile` route to `SuperAdminProfilePage` (`profile` FEATURES entry now: `[E]`→ProfilePage, `[M]`→Manager, `[H]`→HR, `[B]`→BranchAdmin, `[S]`→SuperAdmin); Super Admin's `employees/:employeeId/profile` still uses `ProfilePage`. No routes removed.
* `frontend/src/utils/constants.js` — added a **Profile** link to the Super Admin sidebar (`NAV_ITEMS`) and cleared `profile` from Super Admin `SECONDARY_NAV`.

### Notes
* Audit Logs (`AuditLogsPage`) + HR Management (`HRManagementPage`) already existed and are feature-complete (search/filter/export, HR roster + pending workload) — surfaced via the dashboard, not duplicated. Branches/Departments/Employees/Reports/Settings reuse the existing shared pages. No HR/Manager/Branch-Admin-only sections were copied; Super Admin sections are global-scoped.

### Verified
* `npm run build` green — 1628 modules, JS 552.92 kB / gzip 137.39 kB, CSS 47.02 kB (Vite's >500 kB advisory only; not an error). All global data reads the reactive localStorage store; reviewed-alert + role-status toggles persist locally; no backend/Firebase/API.

## [2026-06-22] — Branch Admin: Branch Operations + Attendance Control Center (Frontend-Only)
Upgraded the existing Branch Admin section into a **Branch Operations + Attendance Control Center**
on the **shared** mock store — without breaking existing pages, login, theme, demo accounts, or
other roles. Branch-level scope only (distinct from org-wide HR and team-level Manager). **No
backend, Firebase, API, `.env`, or new packages. Branch Admin demo account
(`branchadmin@demo.com / demo123`) unchanged.**

### Added
* `frontend/src/services/branchAdminService.js` — branch-scoped derivations over the shared store (reuses `selectors` + the store; separate from the Firebase-era `branchService.js` placeholder, which is untouched): `branchOverview` (today branch ops + counts + below-target flag), `departmentSummary` (per-department attendance % + head + corrections + needs-review), `shiftSummary` (per-shift assigned/late/attendance %), `branchInfo` (location/radius), `branchAlerts`, `branchActivity` / `branchActivityOwn`.
* `frontend/src/pages/branchAdmin/BranchAdminDashboard.jsx` — replaced the empty `DashboardShell` with a full branch control center: welcome/identity card, 8 branch KPI cards (Branch Employees, Present, Absent, Late, Pending Corrections, Departments, Active Shifts, Attendance %), **Branch Location & Radius** mock card (+ "Manage radius in Settings" link), **Department Summary** table (search + needs-review filter, View Employees/Attendance actions), **Shift Summary** table, Branch Attendance Snapshot, Branch Activity Timeline, Branch Alerts, and Branch Quick Actions (existing routes only).
* `frontend/src/pages/branchAdmin/BranchAdminHomePanel.jsx` — branchAdmin-only block on the shared `/home`: branch live status, today branch operations summary, branch alerts, and a department-wise quick snapshot.
* `frontend/src/pages/branchAdmin/BranchAdminProfilePage.jsx` — **Branch Admin Identity + Branch Responsibility Center** at `/branch-admin/profile`: header (90% completion), quick actions, job details, branch authority badges, attendance identity, today attendance, branch responsibility summary, **Branch Location & Radius** card, security/login info, and branch activity timeline. Identity from `EMP006` (Vikas Jain); `FALLBACK_BRANCH_ADMIN` keeps it crash-safe; Edit Profile persists name/phone.

### Changed
* `frontend/src/pages/home/HomePage.jsx` — renders `<BranchAdminHomePanel/>` only when `role === 'branchAdmin'`; other roles' Home unchanged.
* `frontend/src/routes/AppRoutes.jsx` — repointed **only** Branch Admin's own `profile` route to `BranchAdminProfilePage` (`profile` FEATURES entry now: `[S,E]` → `ProfilePage`, `[M]` → `ManagerProfilePage`, `[H]` → `HRProfilePage`, `[B]` → `BranchAdminProfilePage`); Branch Admin's `employees/:employeeId/profile` still uses `ProfilePage`. No routes removed.
* `frontend/src/utils/constants.js` — added a **Profile** link to the Branch Admin sidebar (`NAV_ITEMS`) and cleared `profile` from Branch Admin `SECONDARY_NAV`.

### Notes
* Branch Admin has no corrections/face/suspicious routes (those are HR-only) — pending corrections are shown as informational counts/alerts, never as broken links. Branch Employees + Attendance reuse the already-enhanced shared pages (Today status, View Attendance, Working Hours, Face Confidence, Mark Verified), which are branch-scoped.

### Verified
* `npm run build` green — 1625 modules, JS 522.25 kB / gzip 131.87 kB, CSS 47.02 kB (Vite's >500 kB advisory only; not an error). All branch data reads the reactive localStorage store; no backend/Firebase/API/real GPS.

## [2026-06-22] — Demo People Renamed to Simple Readable Indian Names (Frontend-Only)
Replaced every visible mock/demo person name with simple, readable Indian names, consistently
across all roles and surfaces (dashboards, profiles, employee/attendance/leave/correction tables,
reports, notifications, audit logs, activity timelines). **Demo login emails + passwords
unchanged; no backend/Firebase/API/`.env`/new packages; routes/UI/theme unchanged.**

### Mapping (roles)
* Super Admin: Sara Khan → **Arjun Sharma** · Branch Admin: Bilal Ahmed → **Vikas Jain** · HR: Hina Raza → **Pooja Sharma** · Manager: Imran Malik → **Neeraj Verma** · Employee: Ayesha Noor → **Anjali Sharma**.
* Employee roster (EMP001–014) renamed in lockstep: Priya Sharma, Rohit Kumar, Nisha Gupta, Neeraj Verma, Anjali Sharma, Vikas Jain, Amit Verma, Meera Joshi, Karan Verma, Sneha Mehta, Vivek Sharma, Pooja Sharma, Kavya Singh, Rahul Jain.

### Changed
* `frontend/src/data/employees.js` — all 14 employee `name`s + `FALLBACK_EMPLOYEE` (emails/IDs/links unchanged).
* `frontend/src/data/users.js` — the 5 demo login `name`s only (emails/passwords/roles/employeeId unchanged).
* `frontend/src/data/seed.js` — audit-log `actor` names + notification text.
* `frontend/src/data/mockActivities.js` + `frontend/src/data/notifications.js` — activity/notification names.
* `frontend/src/pages/features/ProfilePage.jsx`, `frontend/src/pages/manager/ManagerProfilePage.jsx`, `frontend/src/pages/hr/HRProfilePage.jsx` — fallback/identity name literals (`Anjali Sharma` / `Neeraj Verma` / `Pooja Sharma`).
* `frontend/src/services/mockStore.js` — bumped store to `ft_store_v5` / `SEED_VERSION = 5` so returning browsers re-seed with the new names.
* `frontend/src/services/mockAuthService.js` — `getCurrentUser()` now reconciles a demo session's display name/avatar with the current `MOCK_USERS` (display-only; no auth/email/role change), so an existing session shows the new name without a re-login.

### Verified
* `npm run build` green — 1622 modules, JS 492.06 kB / gzip 127.98 kB, CSS 47.02 kB. No old display names remain in source; all five demo logins still work.

## [2026-06-22] — HR: People Operations + Attendance Control Center (Frontend-Only)
Upgraded the existing HR section into an **HR People Operations + Attendance Control Center**
on the **shared** mock store — without breaking existing HR pages, login, theme, demo accounts,
or other roles. **No backend, Firebase, API, `.env`, or new packages. HR demo account
(`hr@demo.com / demo123`) unchanged.**

### Added
* `frontend/src/services/hrService.js` — org-wide + **department-level** HR derivations over the shared store (reuses `selectors` + `mockStore`, no duplicate data system): `hrOverview` (today people-ops + pending-action counts), `departmentSummary` (per-department attendance % + pending leave/corrections + needs-review flag), `hrAlerts`, `hrActivity` / `hrActivityOwn` (org-wide / HR's own timeline), and `decideLeave` (inline leave approve/reject + audit). Deliberately **org/department scope**, distinct from the team-level `managerService`.
* `frontend/src/pages/hr/HRDashboard.jsx` — replaced the empty `DashboardShell` with a full HR control center: welcome/identity card, 8 HR KPI cards (Total Employees, Present, Absent, Late, Leave Requests, Pending Corrections, Face Approvals, Departments), **Department Operations** table (search + needs-review filter), HR Alerts, HR Activity Timeline, a **Pending Action Queue** (inline leave approve/reject persisting to localStorage + links to Corrections / Face Approvals), and HR Quick Actions (existing routes only).
* `frontend/src/pages/hr/HRHomePanel.jsx` — HR-only block on the shared `/home`: pending HR actions, today people-operations summary, HR alerts, and a department-wise quick snapshot — all live from the shared store.
* `frontend/src/pages/hr/HRProfilePage.jsx` — **HR Identity + People Operations Center** at `/hr/profile`: header (90% completion), quick actions, job details, HR authority badges, attendance identity, today attendance, org-wide people-operations summary, security/login info, and HR activity timeline. Identity from `EMP012` (Hina Raza); `FALLBACK_HR` keeps it crash-safe; Edit Profile persists name/phone.

### Changed
* `frontend/src/pages/home/HomePage.jsx` — renders `<HRHomePanel/>` only when `role === 'hr'` (one import + one guarded line); other roles' Home unchanged.
* `frontend/src/routes/AppRoutes.jsx` — repointed **only** HR's own `profile` route to `HRProfilePage` (`profile` FEATURES entry split: `[S,B,E]` → `ProfilePage`, `[M]` → `ManagerProfilePage`, `[H]` → `HRProfilePage`); HR's `employees/:employeeId/profile` still uses `ProfilePage`. No routes removed.
* `frontend/src/utils/constants.js` — added a **Profile** link to the HR sidebar (`NAV_ITEMS`) and cleared `profile` from HR `SECONDARY_NAV`.
* `frontend/src/pages/features/EmployeesPage.jsx` — additive: live **Today** attendance-status column + a **View Attendance** row action (benefits superAdmin/branchAdmin/HR; routes resolve per role).
* `frontend/src/pages/features/AttendancePage.jsx` — additive: **Working Hours** + **Face Confidence** columns and a **Mark as Verified** action (shown only when the role can edit — manager stays read-only); persists `verified` + writes an audit log.

### Verified
* `npm run build` green — 1622 modules, JS 491.79 kB / gzip 127.95 kB, CSS 47.02 kB. All HR data reads the reactive localStorage store; approvals/verify persist locally; no backend/Firebase/API/network calls.

## [2026-06-22] — Manager Home: Live Team Status Panel (Frontend-Only)
Added a **manager-only** panel to the shared `/home` page so the Manager Home shows **live**
team data (the page otherwise used static demo mock). **No backend, Firebase, API, `.env`,
new packages. Other roles' Home, login, theme, and demo accounts unchanged.**

### Added
* `frontend/src/pages/manager/ManagerHomePanel.jsx` — pending-approval reminder (counts + links to approvals / team dashboard), team live-status cards (Team Size, Present, Absent, Late, Pending Approvals, Team Attendance %), Manager Alerts, and Today's team activity — all derived live from the shared mock store via `services/managerService` (reuses `selectors` + `mockStore`).

### Changed
* `frontend/src/pages/home/HomePage.jsx` — renders `<ManagerHomePanel/>` only when `role === 'manager'` (one import + one guarded line); existing welcome card, quick actions, at-a-glance cards, recent activity, and workspace card are all kept for every role.

### Verified
* `npm run build` green — 1619 modules, JS 462.29 kB / gzip 123.86 kB, CSS 47.02 kB. Panel reads the reactive localStorage store; no backend/Firebase/API/network calls.

## [2026-06-22] — Manager Profile: Identity + Team Responsibility Center (Frontend-Only)
Added a dedicated **Manager Profile** page (a "Manager Identity + Team Responsibility
Center") on the **shared** mock store. **No backend, Firebase, API, `.env`, new packages,
real GPS, or real biometric storage. Login, theme, demo accounts, and other role
dashboards unchanged.**

### Added
* `frontend/src/pages/manager/ManagerProfilePage.jsx` — 10 sections: Profile Header (avatar, name, Manager ID, email, phone, role, designation, branch, status, 90% completion bar), Quick Actions row, Job Details (designation/department/branch/joining/shift/reporting HR/reporting branch admin/assigned team), Team Responsibility, Manager Attendance Identity (face status/consent/last scan/confidence/location/radius/mock mode), Approval Authority (capability badges), Today Manager Attendance (derived from the manager's own attendance row), Team Quick Summary, Security / Login Info (session-backed last login), and a Manager Activity Timeline. Identity comes from the manager's employee record (`EMP004`), team data from `services/managerService` (reuses `selectors` + `mockStore`); reporting line / completion use clean fallbacks. **Edit Profile** persists name/phone via `store.update` + `store.addAudit`. A `FALLBACK_MANAGER` keeps it crash-safe.
* `frontend/src/services/managerService.js` — added `managerActivity()` (manager's own audit actions → team activity → static fallback).

### Changed
* `frontend/src/routes/AppRoutes.jsx` — repointed **only** the Manager's own `profile` route to `ManagerProfilePage` (split the `profile` FEATURES entry: `[S,B,H,E]` → `ProfilePage`, `[M]` → `ManagerProfilePage`). Other roles and the manager's `employees/:employeeId/profile` (view a team member) still use `ProfilePage`. No routes removed.
* `frontend/src/utils/constants.js` — added a **Profile** link to the Manager sidebar (`NAV_ITEMS`) and cleared `profile` from the Manager `SECONDARY_NAV` (now a primary item).

### Verified
* `npm run build` green — 1618 modules, JS 459.71 kB / gzip 123.37 kB, CSS 47.02 kB. Quick actions use existing routes only; Edit Profile + last-login use the store / `sessionStorage`; no backend/Firebase/API/network calls.

## [2026-06-22] — Documentation Save: Status + Manager Profile Plan + Permanent Rules (Docs-Only)
Documentation-only pass — **no code/UI change, no build required, no Git used, no new files
created**. Updated the existing markdown files (`README.md`, `CLAUDE_BRIEF.md`,
`CURRENT_STATUS.md`, `CHANGELOG.md`, `TASKS.md`, `complete.md`,
`docs/PROJECT_DOCUMENTATION.md`, `docs/EMPLOYEE_PROFILE_WORK_REPORT.md`) with the latest
completed and planned work.

### Recorded
* Updated existing documentation with the latest **Employee Profile** (now store-driven), **Manager pages** (Team Monitoring + Approval Dashboard), **Manager Profile** plan (Manager Identity + Team Responsibility Center at `/manager/profile`), **frontend-only mock mode** status, and the **Permanent Claude / Antigravity Working Rules** (saved in `CLAUDE_BRIEF.md`).
* Reaffirmed: backend/database not connected, Firebase runtime not connected, no API calls; temporary data from mock data + `localStorage`/`sessionStorage` + frontend state; future backend/Firebase connect later via service/mock-data-layer replacement.
* Corrected a stale fact in `CLAUDE_BRIEF.md` (store key/version `ft_store_v3 / SEED_VERSION = 3` → `ft_store_v4 / SEED_VERSION = 4`).

## [2026-06-22] — Manager: Team Monitoring + Approval Dashboard (Frontend-Only)
Improved the Manager role into a full **Team Monitoring + Approval Dashboard**, all on the
**shared** mock store (reuses `services/selectors` + `services/mockStore` — no duplicate
mock-data system, no new collections). **No backend, Firebase, API, `.env`, new packages,
real GPS, or real biometric storage. UI/theme, sidebar/header, login, and 5 demo logins
unchanged.**

### Added
* `frontend/src/services/managerService.js` — a thin frontend service layer that **derives** the manager's team data from the shared store (pure read functions: `managerTeam`, `teamTodayRows`, `teamOverview`, `lateOrMissing`, `pendingOvertimeRows`, `teamMonthlySnapshot`, `teamActivity`, `teamAlerts`) and **persists** approve/reject through the store (`decideLeave`, `decideCorrection`, `decideOvertime` → `store.update` + `store.addAudit`). Reuses the same `employees / attendance / leaveRequests / correctionRequests / faceRegistrations / shifts` data. Future backend = swap these function bodies, UI unchanged.

### Changed
* `frontend/src/pages/manager/ManagerDashboard.jsx` — replaced the generic `DashboardShell` (manager route only; other roles untouched) with a dedicated dashboard: welcome/identity header (name · role · department · branch · team size · team attendance %), 6 overview cards (team size, present, absent, late, pending approvals, attendance %), **Today Team Attendance** table (check-in/out, status, late, hours, face confidence, location, View Profile / View Attendance — existing routes only) with search + status filter, **Late / Not Checked-in** section (shift, check-in, late, monthly-late count, Late / Repeated Late / Not Checked-in badges), **Team Monthly Snapshot**, **Recent team activity** timeline, **Manager Alerts**, and an **Approvals** queue switcher for **leave / correction / overtime** with working Approve/Reject (persists to localStorage). Overtime approvals are derived from real attendance overtime rows and patch the row (`overtimeApproved`).
* `frontend/src/pages/manager/TeamMembersPage.jsx` — added **Employee ID** and **Location** columns and a **search + department + today-status** filter toolbar; kept the reusable `/manager/employees/:id/profile` View-Profile link and the existing metric cards.

### Verified
* `npm run build` green — 1617 modules, JS 446.66 kB / gzip 120.92 kB, CSS 47.02 kB. Approve/reject + filters run on the reactive localStorage store; no backend/Firebase/API/network calls.

## [2026-06-22] — Profile + Settings: Wire to Live Mock Store (Frontend-Only)
Made the remaining hardcoded surfaces fully data-driven against the reactive `mockStore`
so the temporary frontend mock mode reflects real local data everywhere and updates after
user actions. **No backend, Firebase, API, `.env`, new packages, real GPS, or real
biometric storage added. UI/theme and all 5 demo logins unchanged.**

### Changed
* `frontend/src/pages/features/ProfilePage.jsx` — replaced the hardcoded `isAyesha`/EMP005 persona literals with **store-derived data**: Today Attendance (status/check-in/check-out/working-hours/late/overtime) from today's attendance row; Monthly Snapshot from `employeeMonthSummary`; Correction-Requests count from the live `correctionRequests` collection; Face last-scan/confidence from the latest `faceRegistrations` record; and the Recent Activity timeline now merges this employee's real attendance/correction/leave/face events (most recent first). These now update live after Mark-Attendance / correction / leave / face-registration actions, for **any** employee (not just two demo personas). Replaced the fragile non-reactive `store.getState().employees ? {…} : null` status map with the shared `EMPLOYEE_STATUS` constant. Static-only fields with no mock schema (DOB, emergency contact, documents, consent date) remain labeled demo fallbacks. `FALLBACK_EMPLOYEE` cross-role fallback + reduced org-account view preserved — page still never crashes on missing data.
* `frontend/src/pages/features/SettingsPage.jsx` — the local editable form now re-syncs from the reactive settings via a `useEffect([settings])` (extracted `formFromSettings`), so it reflects the new values after **Save** and after **Reset demo data** instead of showing stale fields. The settings reference is stable across unrelated store mutations, so in-progress edits are not clobbered.

### Verified
* `npm run build` green — 1616 modules, JS 426.77 kB / gzip 116.37 kB, CSS 47.02 kB. Reactive localStorage store + 5 demo accounts unchanged; no backend/Firebase/API/network calls.

## [2026-06-20] — Documentation Save: Employee Profile Mock Build Complete (Docs-Only)
Documentation-only pass — **no code/UI change, no build required** — saving all completed
FaceTrack AI website work into existing markdown files. Records the full Employee Profile
control center built this cycle as a frontend-only mock.

### Employee Profile — built as a frontend mock (`pages/features/ProfilePage.jsx`)
Profile Header, Attendance Identity, Assigned Branch/Office, Today Attendance, Monthly
Snapshot, Personal Details, Emergency Contact, Documents Status, Privacy & Consent, Recent
Activity Timeline, and Quick Actions; cross-role links (HR/Branch Admin "View Profile",
Super Admin "View Full Profile", Manager "View Employee Profile") via the reusable
`employees/:employeeId/profile` route; centralized `FALLBACK_EMPLOYEE` temporary mock data
so it never crashes on a missing/unknown employee.

### Docs updated
* `docs/EMPLOYEE_PROFILE_WORK_REPORT.md` (completed-status section), `CLAUDE_BRIEF.md`, `README.md`, `docs/PROJECT_DOCUMENTATION.md` (status banner). `CURRENT_STATUS.md` + `TASKS.md` already updated in the prior entry.

### Status reaffirmed
* Frontend-only mock mode. No backend, Firebase, API, real GPS, or real biometric storage. Backend integration remains future work. (README theme description corrected light → dark; stale `COMPLETE_PROJECT_PROMPT.md` reference removed.)

## [2026-06-20] — Employee Profile: Temporary Mock-Data Fallback (Frontend-Only)
Added frontend-only temporary mock-data support so the Employee Profile (own profile,
all four cross-role views, and the reusable `employees/:employeeId/profile` route)
always renders clean data and never crashes on a missing/unknown employee.
**Temporary mock data support added for Employee Profile. Employee Profile works
without backend. No Firebase/API/real GPS/real biometric storage added. Backend
integration remains future work.** No `.env`, no new packages, no routes added/removed.

### Changed
* `frontend/src/data/employees.js` — added a self-contained `FALLBACK_EMPLOYEE` mock object (mirrors EMP005 / Ayesha Noor), used when a selected employee can't be resolved from the mock store.
* `frontend/src/pages/features/ProfilePage.jsx` — cross-role views (`employeeId` in URL) now fall back to `FALLBACK_EMPLOYEE` when the record isn't in the store, so the reusable route renders clean mock data instead of the logged-in user's org account. Own-profile org accounts keep the existing reduced view; every card value already has a mock fallback, so nothing crashes on missing data.

### Verified
* `npm run build` green — 1616 modules, JS 425.60 kB / gzip 116.08 kB, CSS 47.02 kB. Mock/localStorage login + 5 demo accounts unchanged; no backend/Firebase/API.

## [2026-06-20] — Added Employee Profile Work Report (Mock, Frontend-Only)
Added the `EMPLOYEE_PROFILE_WORK_REPORT.md` document detailing the Employee Profile upgrade. Also updated project status, changelogs, task lists, and briefs.

### Added
* `docs/EMPLOYEE_PROFILE_WORK_REPORT.md` — Complete documentation report detailing the redesigned Employee Identity & Attendance Control Center layout, mock data overrides, role-based navigation tooltips, and future integration plans.
* Documented planned employee profile sections, mock data, cross-role links, route behavior, and future work.

## [2026-06-20] — Fix: Public Navbar Visibility on Route Change (Mock, Frontend-Only)
Fixed a hide-on-scroll bug where the **public** navbar could stay hidden (or hide itself immediately)
after navigating to another public page. Behavior, theme, login logic, and the demo-credential helper
are all unchanged — this is a robustness fix scoped entirely to `PublicNavbar.jsx`. No backend, no
Firebase, no API, no `.env`, no new deps, no theme change, no routes touched; dashboard chrome unaffected.

### Changed
* `frontend/src/components/layout/PublicNavbar.jsx` —
  * **Root cause:** each public page (`LandingPage`/`PrivacyPolicyPage`/`ConsentPage`) mounts its own `<PublicNavbar />`, and React Router does **not** reset scroll on navigation. The scroll-tracking `lastY` ref initialized to `0` instead of the real `window.scrollY`, so the first scroll event on a freshly-opened page (often a browser scroll-*clamp* onto the shorter new page) read as a large "scroll-down" delta and hid the bar; nothing forced it visible on route change.
  * **Fix:** added a `useEffect` keyed on `location.pathname` (via the already-imported `useLocation`) that, on first mount and every route change, forces `setHidden(false)`, **scrolls the page to the top (`window.scrollTo(0, 0)`)** so a freshly-opened public page always shows its header in place (React Router otherwise preserves the old scroll position → the new page opened mid-scroll, reading as "header not showing properly"), and re-syncs `lastY.current = 0`. Tightened the scroll thresholds to the spec: visible at `y<=20`, hide only when scrolling **down** past `80px`, show on any scroll **up**. Mobile-sheet guard (`isHidden = hidden && !open`) retained. Scoped to `PublicNavbar` (public pages only); landing-page section anchors don't change the pathname, so in-page smooth-scroll links still work.

### Verified (adversarial audit)
* Ran a 4-lens adversarial audit (route-change / scroll-math / css-stacking / scope-regression) with per-finding verification (7 agents): **all 9 requirements pass, zero confirmed defects**. The scroll-to-top above resolves the one medium-risk item the audit flagged (new page opening mid-scroll). Dashboard `Navbar.jsx`/`Sidebar.jsx` independently confirmed to contain no scroll/visibility logic.

### Unchanged (verified)
* `frontend/src/styles/theme.css` — `.ft-pubnav` already had `position: sticky; top: 0; z-index: 50` (proper stacking) + the `.ft-pubnav--hidden` transform; no CSS added (no duplicate/conflicting styles). Login logic, demo-credential helper, mock data/auth, and dark theme tokens — untouched. Dashboard `Navbar`/`Sidebar` — untouched.

### Verified
* `npm run build` green — 1616 modules, CSS 46.90 kB / 8.83 kB gzip, JS 404.23 kB / 111.74 kB gzip.

## [2026-06-20] — Navbar Hide-on-Scroll + Login Demo-Credential Helper (Mock, Frontend-Only)
Re-added smart hide-on-scroll to the **public** navbar, replaced the big Quick Demo Login card on
the login page with a compact "Demo access for testing" dropdown that **auto-fills** (does not
auto-login) the email/password fields, and added a "Selected demo access" line before the Login
button. Still **frontend-only / mock** — no backend, no Firebase, no API, no `.env`, no new deps,
**no theme change**, no routes touched; mock email/password login + all 5 demo accounts unchanged.

### Changed
* `frontend/src/components/layout/PublicNavbar.jsx` — added a passive `scroll` listener (in a `useEffect`, last-Y tracked in a `useRef`): hides the bar on scroll-down, reveals it on scroll-up, always shows it at the top (`y<=8`), and never hides while the mobile sheet is open. Applies the `ft-pubnav--hidden` class via an `isHidden` flag. Public navbar only — dashboard `Navbar`/`Sidebar` untouched.
* `frontend/src/styles/theme.css` — `.ft-pubnav` gained `transition: transform .3s ease` + `will-change`; new `.ft-pubnav--hidden { transform: translateY(-100%) }`; new `.ft-demo-selected` text style (cyan accent — no token/theme change).
* `frontend/src/pages/auth/LoginPage.jsx` — **removed** the big Quick Demo Login card, its 5 large role buttons, and the texts "Quick Demo Login" / "Explore any role instantly…" / "or sign in with email". **Added** a compact `<select>` labelled "Demo access for testing" listing the 5 credentials; picking a role auto-fills email+password (no auto-login — user still clicks Login) and renders "Selected demo access: <Role> — <email> / demo123" before the Login button. `DEMO_CREDENTIALS` is derived from `MOCK_USERS` so the auto-filled values always match mock auth. Dropped the now-unused `devLogin`/`ROLES`/`ROLE_LABELS`-via-buttons usage and the redundant single-line demo note.

### Unchanged (verified)
* `frontend/src/data/users.js` (5 demo accounts) and `frontend/src/services/mockAuthService.js` — untouched. Dark `:root` theme tokens — untouched (no light override reintroduced).

### Verified
* `npm run build` green — 1616 modules, CSS 46.90 kB / 8.83 kB gzip, JS 404.15 kB / 111.72 kB gzip.

## [2026-06-20] — Removed Landing Demo CTA + Navbar "Get Started" (Mock, Frontend-Only)
Removed the landing page's final demo CTA card ("Ready to see FaceTrack AI in action?" /
"Launch the demo" / "Get started") and the public navbar's "Get Started" button (desktop +
mobile sheet). The navbar now shows a single **Login** CTA (restored to primary styling). Still
**frontend-only / mock** — no backend, no Firebase, no API, no `.env`, no new deps, no routes
touched; mock login unchanged.

### Changed
* `frontend/src/pages/public/LandingPage.jsx` — removed the entire Final CTA `<section>` (the `.ft-land-cta` glass card + its Launch-the-demo / Get-started buttons); `<PublicFooter />` now follows the privacy section directly (no empty gap).
* `frontend/src/components/layout/PublicNavbar.jsx` — removed the "Get Started" link (→ Register) from both the desktop CTA and the mobile sheet; the lone **Login** link is now `ft-btn--primary`.

### Out of scope (left intact, per the "remove only the demo CTA + navbar button" instruction)
* `PublicFooter.jsx` "Get Started" footer link and `ConsentPage.jsx` "I Agree — Get Started" consent action — both functional, neither the demo CTA nor the navbar button. The "...to get started" empty-state messages on Shifts/Departments pages are unrelated copy.

### Verified
* `npm run build` green — 1616 modules, CSS 46.67 kB / 8.78 kB gzip, JS 403.83 kB / 111.56 kB gzip. Login present (desktop + mobile); no routes removed.

## [2026-06-20] — Reverted Light Theme → Dark; Restored Quick Demo Login + Navbar "Get Started" (Mock, Frontend-Only)
Reverted the dark→light conversion (and the login/navbar cleanup) on user request: restored the
original **dark glassmorphism theme**, brought back the **Quick Demo Login** card, re-added the
navbar **"Get Started"** button, and removed the public-navbar hide-on-scroll behavior. Still
**frontend-only / mock** — no backend, no Firebase, no API, no `.env`, no new deps, no routes
touched. Mock email/password auth + demo accounts unchanged.

### Restore sources (honest provenance)
* **Dark `:root` tokens** — recovered **verbatim** from the only git commit (`495c25b` "Complete Phase 1 frontend scaffold"); `theme.css`'s dark tokens are byte-for-byte the originals.
* **Quick Demo card** — reconstructed against the **still-present** `.ft-demo*` / `.ft-divider` CSS (only the JSX had been removed) + the intact `devLogin` / `loginAsRole` mock fns.
* **Get Started navbar** — reconstructed; the dark `.ft-pubnav` (sticky, no transform) already lived in `theme.css`, so removing the light override fully restored it.
* No VS Code / Antigravity local-history snapshot existed for any of these source files (docs only), so the intermediate pre-change version was **not byte-exact recoverable** — the theme is an exact git restore; login/navbar are faithful reconstructions.

### Changed
* `frontend/src/styles/theme.css` — `:root` reverted to the dark palette (`--ft-bg #050816`, `--ft-card-bg rgba(255,255,255,0.08)`, `--ft-card-border rgba(255,255,255,0.12)`, `--ft-primary #00d4ff`, `--ft-accent #8b5cf6`, `--ft-text #f8fafc`, dark status colors); dropped the unused light-era `--ft-primary-2`.
* `frontend/src/styles/components.css` — removed the entire appended **LIGHT THEME** override block (1017→EOF); reverted the secondary `:root` tokens to dark (`--ft-card-2 rgba(255,255,255,0.05)`, `--ft-line rgba(255,255,255,0.08)`, deep-black shadows, `--ft-info #38bdf8`).
* `frontend/src/pages/auth/LoginPage.jsx` — re-added the Quick Demo Login panel (5 one-click role buttons via `devLogin`) + an "or sign in with email" divider above the email form.
* `frontend/src/components/layout/PublicNavbar.jsx` — re-added the "Get Started" CTA (→ Register) on desktop + mobile sheet; removed the scroll-hide `useEffect` / `hidden` state and the `ft-pubnav--hidden` toggle.

### Verified
* `npm run build` green — 1616 modules, CSS 46.67 kB / 8.78 kB gzip, JS 404.67 kB / 111.68 kB gzip. Full-tree sweep: no light-on-dark artifacts remain. No `.env`, no new deps, no routes removed.

## [2026-06-20] — Light-Theme Audit Fixes: hover / unread states (Mock, Frontend-Only)
Adversarial audit of the dark→light conversion (4 finder lenses + per-finding verification)
surfaced three real white-on-white / invisible-state defects the LIGHT THEME block had
missed — all in interaction states the base override didn't cover. Fixed as additive
overrides in the LIGHT THEME block; still **frontend-only / mock** — no backend, no deps,
no routes touched.

### Fixed — `frontend/src/styles/components.css` (LIGHT THEME block)
* `.ft-btn--danger:hover` — text was `#fff` on a light-red tint (invisible on white); now `#991b1b` (dark red).
* `.ft-btn--success:hover` — text was `#fff` on a light-green tint (invisible on white); now `#15803d` (dark green).
* `.ft-notif-item--unread` — background was `rgba(0, 212, 255, 0.06)` (6% cyan — vanished on white, unread indistinguishable from read); now `rgba(14, 165, 233, 0.12)` (visible blue wash).

### Reviewed — not a defect
* `components/common/Avatar.jsx` (`color: '#04121a'`) — flagged by the audit but kept: the avatar background is `colorFromString` = `hsl(h, 70%, 55%)`, a theme-independent mid-tone, so dark initials give ~5:1 contrast (better than white) and the chip renders identically to before the conversion — no regression.

### Verified
* `npm run build` green — 1616 modules, CSS 49.60 kB / 9.41 kB gzip, JS 404.14 kB / 111.63 kB gzip. No `.env`, no new deps, no routes removed.

## [2026-06-20] — Light Theme + Login/Navbar Cleanup + Scroll Behavior (Mock, Frontend-Only)
Converted the whole app from the dark glassmorphism theme to a **light, professional SaaS
theme** (white surfaces, slate text, blue/cyan brand accent), removed the Quick Demo login
UI and the navbar "Get Started" button, and added smart hide-on-scroll behavior to the
public navbar. Still **frontend-only / mock** — no backend, no Firebase, no API, no `.env`,
no new deps. Mock email/password auth, demo accounts, and routes are all unchanged.

### Changed — light theme (`frontend/src/styles/`)
* `theme.css` — redefined the `:root` design tokens to the light palette: `--ft-bg #f8fafc`, `--ft-card-bg #ffffff`, `--ft-card-border #e2e8f0`, `--ft-primary #0ea5e9` (+ new `--ft-primary-2 #06b6d4` cyan), `--ft-accent #7c3aed`, `--ft-text #0f172a`, `--ft-text-dim #475569`, plus light-tuned success/danger/warning/blue.
* `components.css` — retuned the `:root` extras (`--ft-card-2`, `--ft-line`, shadows, info/muted) for light, then appended a **"LIGHT THEME" override block** (loads last) that converts every remaining dark-assuming value: white sidebar/navbar/modals/toasts, solid white inputs with a blue focus ring, readable badge/alert text colors, soft gray raised tiles + table headers/hovers, light skeleton/progress/spinner, lightened hero scan visual + aurora/map grid lines, softer card shadows, and the public-navbar light style. Camera viewport intentionally stays dark (placeholder text lifted for contrast).
* `charts/TrendChart.jsx` + `charts/DonutChart.jsx` — grid/track strokes switched from white-translucent to `var(--ft-line)` so they read on white.

### Changed — login + navbar
* `pages/auth/LoginPage.jsx` — removed the **Quick Demo Login** card (role buttons + "or sign in with email" divider) and the unused `devLogin`/role imports; keeps the mock email/password form and adds a small professional helper note (`Demo access: employee@demo.com / demo123`). Mock auth service and demo accounts are untouched.
* `components/layout/PublicNavbar.jsx` — removed the **Get Started** CTA (desktop + mobile sheet); the public navbar now hides on scroll-down and reveals on scroll-up (visible at the top), via a `requestAnimationFrame` scroll listener toggling `.ft-pubnav--hidden`. Dashboard sidebar/navbar are unaffected.

### Verified
* `npm run build` succeeds — 1616 modules, CSS 49.49 kB / 9.39 kB gzip, JS 404.14 kB / 111.63 kB gzip. Runs with **no `.env`**; no routes removed; no new dependencies.
* Vite HMR/Fast Refresh works (no config change needed); refresh keeps valid routes (SPA fallback) and the mock `localStorage` session (ProtectedRoute waits on the `loading` flag — no login flash).

## [2026-06-20] — Frontend Design Refinement + Documentation Pass (Mock, Frontend-Only)
Final design-polish + documentation pass on top of the Rajasthan refinement. Additive
CSS only (no component rewrites, no logic changes); still **frontend-only / mock** — no
backend, no Firebase, no `.env`. Build stays green; no routes touched.

### Changed — UI polish (`frontend/src/styles/components.css`)
* **Empty states** — defined title/message typography (`.ft-empty strong` / `.ft-empty p`) for clearer, more readable placeholders.
* **Connected next actions** — the arrow now slides + tints on hover for a clear affordance; danger-toned cards hover **red** instead of the default cyan (button consistency).
* **Status badges** — the "Soon" marker (landing roadmap + disabled nav) is now a rounded, cyan-tinted chip consistent with the `.ft-badge` family.
* **Mock-mode notices** — banner radius aligned to sibling glass cards.
* **Spacing & responsive** — tightened page/section/panel/action padding under 560 px so dense feature pages breathe on small screens.

### Changed — documentation / wording
* `README.md` — rewritten into a professional project overview: frontend-only mock framing, highlights, tech stack, repo-structure table, run/build steps, **demo login accounts table** (verified emails), and a scope/roadmap section.
* `CURRENT_STATUS.md`, `CHANGELOG.md`, `CLAUDE_BRIEF.md`, `docs/COMPLETE_PROJECT_PROMPT.md`, `TASKS.md` — updated to record the design-refinement completion, Rajasthan offices, standardized branch mock data, improved location-verification + page-to-page connectivity, active mock mode, paused backend/Firebase, build status, and pending future work.

### Verified
* `npm run build` succeeds (no errors). Runs with **no `.env`**; no routes removed.

## [2026-06-20] — Frontend Refinement: Rajasthan Branch Network + Page Connectivity + Location UI (Mock, Frontend-Only)
Modern-design + connected-pages refinement pass. Replaced the demo branch network with six **Rajasthan offices**, standardized all entity IDs, added reusable "next step" connectivity across pages, and enriched the location-verification UI. Still **frontend-only / mock** — no backend, no Firebase, no `.env`. No routes removed; build stays green.

### Added — reusable components (`frontend/src/components/`)
* `common/ConnectedNextActions.jsx` — shared "next steps / related pages" panel (role-aware `<Link>` cards, falsy entries filtered) so no page is a dead end. Reuses the existing `.ft-home-action*` styling.
* `common/MockDataNotice.jsx` — single reusable demo/mock notice with `banner` / `inline` / `badge` variants (absorbs the old hand-duplicated disclaimers + the new "future backend" and "simulated location" notes).
* `common/LocationStatusPanel.jsx` — rich branch-location panel: assigned branch + city/address + allowed radius + inside/outside badge + distance ("18 m of 150 m"); safe with a null branch.
* `common/WorkflowStepper.jsx` — horizontal step strip (Face Scan → Location → Confirm → Done) for the Mark-Attendance flow.
* `landing/IndustryProblemCards.jsx` — data-driven "problems we solve" grid for the landing page.
* All five exported from `components/ui.js`. New CSS appended to `styles/components.css` (loads last; reuses existing tokens) for the notice, location panel, stepper, map placeholder, problem-card icon modifier, and a `.ft-home-action--danger` tone.

### Changed — Rajasthan data + standardized IDs (`frontend/src/data/`)
* `branches.js` — rewritten to **6 Rajasthan offices** (Jaipur HQ, Jodhpur, Udaipur, Kota, Bikaner, Ajmer), `state: 'Rajasthan'`, **150 m radius** for every branch, with the given demo coordinates. Field names (`name`/`lat`/`lng`/`radiusMeters`) kept stable (load-bearing in `checkRadius`/CRUD/selectors).
* `employees.js` — 14 employees redistributed across **all six branches** (none empty) with coherent designations + valid `managerId` links; standardized to **EMP001…**; `employeeCode` prefixed by city (JAI-/JOD-/…); phones to `+91`.
* `departments.js` (one focal dept per branch, **DPT001…**), `shifts.js` (**SH001…**), `users.js` (re-pointed `branchId`/`employeeId` to populated branches), `seed.js` (all hardcoded EMP/BR refs + suspicious-scan/notification/audit location strings → Rajasthan + 150 m).
* `services/mockStore.js` — bumped `SEED_VERSION` 2→3 and `KEY` to `ft_store_v3` so cached stores re-seed instead of serving the old data.
* `data/mockUsers.js` + `data/mockActivities.js` — home-page profile locations + activity feed updated to Rajasthan cities. Legacy unused `data/attendance.js` + `data/notifications.js` aligned to the new IDs (still not imported at runtime).

### Changed — page connectivity (`§10`/`§25`)
* Added `ConnectedNextActions` to MarkAttendance (done/related steps), MyAttendance, MyCorrections, TeamMembers (replaced a dead "Approvals page" text reference with real links), Attendance, Reports, SuspiciousScans, FaceApprovals, Branches, Settings.
* De-orphaned `/employee/face-test` (added to `SECONDARY_NAV` + surfaced via Mark-Attendance next actions). `NotFound.jsx` is now role-aware (dashboard/login shortcuts) instead of a dead end.

### Changed — location / radius UI
* `MarkAttendancePage.jsx` — added the WorkflowStepper, the LocationStatusPanel (branch + distance + simulated-location notice via a new `locationSimulated` flag), and a "Mock location mode" header badge. **Scan/location/confirm logic unchanged.**
* `BranchesPage.jsx` — new "Rajasthan Branch Network" section (map placeholder + city chips + per-branch LocationStatusPanel), `Allowed Radius` label, default radius `100`→`150`, Rajasthan-flavoured form placeholders, next-action links.
* `SettingsPage.jsx` — new "Geofence & location verification" section (per-branch radius list + future-backend note) + next-action links.

### Changed — landing / navigation
* `pages/public/LandingPage.jsx` — added **Industry Problems**, reframed Features as **The solution**, added a **Rajasthan office-network** preview (map placeholder + six office cards) and a **future-upgrade/roadmap** section (Firebase, liveness, map, payroll, WhatsApp/SMS — clearly labelled "Soon").
* `components/layout/PublicNavbar.jsx` — added `Problems` + `Network` section anchors.

### Verified
* `npm run build` succeeds (**1616 modules**, 404.81 kB JS / 111.68 kB gzip, CSS 45.83 kB, no errors). Runs with **no `.env`**.
* Adversarial review pass: data-graph integrity (all FKs resolve, no empty branch, faceStatus consistent), Mark-Attendance stepper/locInside mapping, and every `ConnectedNextActions` link cross-checked against the FEATURES route table — verdict **SHIP**.

## [2026-06-19] — Complete Project Prompt (docs) + Workspace Cleanup
Added a single consolidated prompt file that captures the whole project as it currently stands, and removed a few stale/redundant files. No source-code behavior changed.

### Added
* `docs/COMPLETE_PROJECT_PROMPT.md` — one file with **Part A: complete rebuild/build prompt** (current scope, tech stack + exact deps, full folder tree, architecture/wiring, roles/routes table, per-role sidebars, demo accounts, mock collections, per-page behavior, phased build order, run/verify steps, hard constraints) and **Part B: work-completed summary** (chronological build history + current status + pending items). Points to `docs/PROJECT_DOCUMENTATION.md` for the deep spec.

### Removed
* `Notes.md` (root scratch reminder).
* `frontend/src/components/forms/.gitkeep` and `frontend/src/components/tables/.gitkeep` (redundant — those folders now contain real files `Field.jsx` / `DataTable.jsx`).

## [2026-06-19] — Logged-in Home (`/home`) + Landing/Login Flow Redesign (Mock, Frontend-Only)
Added a dedicated logged-in **Home** page and a login→home flow, and polished the public landing/navigation to a premium futuristic AI-SaaS feel. Still **frontend-only / mock** — no backend, no Firebase, no `.env`. No existing routes removed; all role dashboard routes intact.

### Added — logged-in Home page + flow
* `pages/home/HomePage.jsx` (route `/home`): role-aware logged-in home rendered inside the dashboard Layout (Sidebar + Navbar). Welcome banner (avatar, name, role badge, job title/scope), role-based **quick actions**, role-based **analytics cards**, **recent activity** feed, **Go to My Dashboard** (routes to the role dashboard via `dashboardPathForRole`), **Logout** (clears mock session → `/login`), and a "View public site" link (stays logged in).
* `routes/AppRoutes.jsx`: registered `/home` (auth-guarded for any role, inside `Layout`); imported `HomePage`.
* `pages/auth/LoginPage.jsx` + `pages/auth/RegisterPage.jsx`: after email login, one-click demo-role login, and registration, users now redirect to **`/home`** (instead of straight to a role dashboard).
* `utils/constants.js`: added `ROUTES.HOME = '/home'`; prepended a **Home → /home** item to every role's `NAV_ITEMS` (sidebar).

### Added — mock data files (`frontend/src/data/`)
* `mockRoles.js` (`ROLE_META`/`getRoleMeta`): per-role label, tagline, accent and quick-action lists (each pointing at a real route).
* `mockUsers.js` (`MOCK_USER_PROFILES`/`getUserProfile`, re-exports demo accounts): per-role display profile extras.
* `mockDashboardData.js` (`MOCK_DASHBOARD_DATA`/`getDashboardData`): per-role at-a-glance KPI cards (Total Employees, Present Today, Late Check-ins, Pending Corrections, Branch Attendance, etc.).
* `mockActivities.js` (`MOCK_ACTIVITIES`/`getActivities`): per-role recent-activity feeds. All four re-exported from `data/index.js`.

### Changed — public landing / navigation polish
* `components/layout/PublicNavbar.jsx`: added the **Roles** link (now Home · Features · How It Works · Roles · Privacy · Consent · Login · Get Started).
* `pages/public/LandingPage.jsx`: hero now has **three CTAs** (Try Demo · Login · Privacy & Consent); **Features expanded to 8 cards** (added Privacy & Consent, Reports & Export); **Demo Analytics preview** KPIs set to Total Employees / Present Today / Late Check-ins / Pending Corrections / Branch Attendance.
* `components/layout/PublicFooter.jsx`: surfaces Privacy Policy · Consent · Login · Get Started + a "Frontend Demo Mode" badge.
* `styles/theme.css`: added Home-page styles (welcome banner, quick-action cards, section title row), footer badge, and the primary KPI tone.

### Review & fixes
* Ran a 5-dimension adversarial review (routing/auth, role-nav, runtime bugs, requirement coverage, theme/CSS). It confirmed routing, auth flow, role nav and coverage were correct, and caught one real regression: the new landing section classes (`ft-section*`) collided with the existing `SectionCard` classes of the same name in `components.css` (loaded later, so it won). **Fixed** by renaming the public marketing classes to `ft-land-section*` in `LandingPage`/`PrivacyPolicyPage`/`ConsentPage` + `theme.css`. Also added a rule for the previously dead `.ft-brand-text`, tidied the analytics-preview labels, and listed all five demo accounts on the login hint.

### Verified
* `npm run build` succeeds (1611 modules, ~385 kB JS / 107 kB gzip, CSS ~42 kB, no errors). Runs with **no `.env`**; all required routes (incl. `/home` and the 5 role dashboards) intact.

## [2026-06-19] — Documentation Consolidation and Workspace Cleanup
Consolidated all project specification documentation files into a single unified file. Kept tracking files separate in the root directory.

### Changed
* Merged `Face_Track.md`, `PROJECT_CONTEXT.md`, `BUILD_PROMPT.md`, `UI_REQUIREMENTS.md`, and `DATABASE_UI_TASKS.md` into `docs/PROJECT_DOCUMENTATION.md` with clear section headers.
* Removed the duplicate/split individual `.md` files from the root and `/docs` directories.
* Maintained all change/status tracking files (`CHANGELOG.md`, `TASKS.md`, `CURRENT_STATUS.md`, and `CLAUDE_BRIEF.md`) separately in the root directory.

## [2026-06-19] — Landing Page + Navigation Redesign (Mock, Frontend-Only)
Redesigned the public landing page and the navigation system. Still **frontend-only / mock** — no Firebase, no backend, no `.env`. No existing routes removed; all role-based dashboard routes still work.

### Added — public navigation + marketing UI
* `components/layout/PublicNavbar.jsx`: reusable, sticky, glassmorphism public navbar (Logo · Home · Features · How It Works · Privacy · Consent · Login · Get Started). Section links smooth-scroll on the landing page and route back to it from any public page. Collapses to a hamburger sheet on mobile. When a mock session exists it swaps Login/Get-Started for a role-aware "Dashboard" shortcut, so it works on public *and* logged-in contexts.
* `components/layout/PublicFooter.jsx`: shared footer for all public pages.
* Rebuilt `pages/public/LandingPage.jsx` into a full marketing page: animated aurora/grid hero background, glowing AI face-scan visual (animated scan sweep, pulsing rings, bracket corners, floating status chips), hero stats, and six sections — **Features**, **How It Works**, **Role-Based Access**, **Demo Analytics Preview** (mock KPIs + CSS bar chart + conic-gradient donut), **Face-Scan Workflow** preview, and a **Privacy/Consent** highlight + final CTA. Fully responsive (desktop / tablet / mobile), glassmorphism cards with hover lift, gradients and shadows, `prefers-reduced-motion` honored.
* Reworked `pages/public/PrivacyPolicyPage.jsx` + `pages/public/ConsentPage.jsx` to use the shared public navbar/footer with richer, sectioned layouts.

### Added — read-only role pages (mock display, no CRUD)
* `pages/features/HRManagementPage.jsx` (Super Admin): org-wide HR overview — HR team roster + pending HR workload KPIs (face approvals, corrections, leave, suspicious scans).
* `pages/manager/TeamMembersPage.jsx` (Manager): scoped team roster with today's attendance status, team-size / present / faces-registered KPIs.

### Changed — role-based sidebar navigation
* `utils/constants.js`: `NAV_ITEMS` reworked to the agreed per-role menus — Super Admin (Dashboard, Branches, Departments, Employees, HR Management, Reports, Settings); Branch Admin (Dashboard, Branch Employees, Departments, Shifts, Attendance, Reports); HR (Dashboard, Employees, Attendance, Leave Requests, Corrections, Reports); Manager (Dashboard, Team Attendance, Team Members, Approvals, Reports); Employee (Dashboard, Face Check-In, My Attendance, Leave, Corrections, Profile). Added `SECONDARY_NAV` to document the extra routes kept reachable but off the primary menu (nothing orphaned).
* `routes/AppRoutes.jsx`: registered the two new role-scoped routes (`/super-admin/hr-management`, `/manager/team-members`). All prior routes untouched.
* The logged-in dashboard chrome (Sidebar + Navbar with name, role, notification bell, profile dropdown; logout clears the mock session and redirects to `/login`) is unchanged and continues to work; the sidebar now renders the updated per-role menus.

### Verified
* `npm run build` succeeds (1606 modules, ~374 kB JS / 104 kB gzip, CSS ~39 kB, no errors). App runs with **no `.env`**; role-based dashboard routes intact.

## [2026-06-19] — Full Frontend Overhaul: Phases 2–8 Feature Build (Mock)
Built the Phase-1 base out into a complete, working frontend across all roles. Still **frontend-only / mock** — no Firebase, no backend, no `.env`. A hand-authored shared foundation (data + store + UI library) underpins 21 feature pages built in parallel and then hardened by an adversarial self-repair review.

### Added — data + reactive store
* `src/services/mockStore.js`: reactive, localStorage-backed CRUD store standing in for Firestore (`getAll/getById/insert/update/remove/replaceAll/patchSettings/resetStore/genId/addAudit` + `subscribe`).
* `src/hooks/useStore.js`: `useCollection(key)` + `useSettings()` via `useSyncExternalStore`.
* `src/services/selectors.js`: pure role-scoping (`scopeEmployees`/`scopeAttendance`) + dashboard/report aggregations.
* `src/data/seed.js`: generator for ~3 weeks of attendance + correction/leave requests, face-approval queue, suspicious scans, audit logs, notifications, settings. Enriched `branches/departments/shifts/employees/users` datasets.

### Added — UI library, chrome, hooks
* `src/components/ui.js` barrel: `DataTable`, `Modal`, `ConfirmDialog`, `StatusBadge`, `Avatar`, `EmptyState`, `SectionCard`, `MetricCard`, form `Field/TextField/SelectField/TextAreaField`, `SearchInput/FilterSelect/FilterChips`, charts `BarChart/DonutChart/TrendChart`.
* `context/ToastContext.jsx` + `hooks/useToast.js` (toasts); rebuilt `Sidebar` (icon nav), `Navbar` + `NotificationBell` (live unread + mark-read).
* `hooks/useWebcam.js` + `utils/faceSim.js` for camera pages; `styles/components.css` (tables, modals, forms, badges, charts, metrics, tabs, camera/scan UI, toasts, notifications).

### Added — 21 feature pages
* HR/Admin: Employees (CRUD), Branches, Departments, Shifts, Attendance (records + reason-required manual edit + CSV/print), Live Monitor, Face Approvals, Correction Requests, Leave Requests, Suspicious Scans, Audit Logs, Reports (6 types + CSV/JSON/print), Settings, Profile.
* Employee self-service: Mark Attendance (webcam + mock branch-radius location + check-in/out), Face Test, Face Registration (consent-gated), My Attendance, My Corrections, My Leave, Monthly Summary.

### Changed
* `components/dashboard/DashboardShell.jsx`: role-aware live dashboards (KPIs, donut/trend/bar charts, pending action items, recent activity) derived from the store.
* `routes/AppRoutes.jsx`: config-driven, role-prefixed routes for every feature page behind auth + role guards.
* `utils/constants.js`: full per-role icon nav, route bases, status→tone maps. `utils/{dateUtils,attendanceUtils,exportUtils,helpers}` expanded. `services/mockDataService.js` rewired to the store. Richer `LandingPage`.
* `FaceRegistrationPage`: capture now gives immediate local feedback (toast + inline confidence + Submit), instead of only updating a side panel.

### Verified
* `npm run build` succeeds (1602 modules, ~351 kB JS / 99 kB gzip, no errors). `npm run dev` serves; full module graph transforms clean.

## [2026-06-19] — Scope Change: FRONTEND-ONLY (Mock Mode), Phases 1–8
Project scope changed to **frontend-only**. Real backend/database integration is **paused**: no real Firebase Auth, no Firestore, no API, no `.env` required. No backend/database logic is to be implemented in any phase for now.

### Added
* `frontend/src/data/`: mock datasets — `users.js` (demo accounts), `branches.js`, `departments.js`, `shifts.js`, `employees.js`, `attendance.js`, `notifications.js`, `faceScans.js`, plus `index.js` barrel.
* `frontend/src/services/mockAuthService.js`: mock login/register/demo-role-login + logout, localStorage session (no Firebase).
* `frontend/src/services/mockDataService.js`: read-only accessors over mock data + `getDashboardSummary(role)`.

### Changed
* `context/AuthContext.jsx`: rewired to **mock auth only** (no `onAuthStateChanged`, no Firebase imports). Exposes `login`, `register`, `devLogin`, `logout`; `isFirebaseConfigured` is always `false`.
* `pages/auth/LoginPage.jsx`: mock email/password + quick demo-role logins + demo-credential hint.
* `pages/auth/RegisterPage.jsx`: mock registration (stored locally); demo-mode note.
* `components/dashboard/DashboardShell.jsx`: stat values now come from `mockDataService.getDashboardSummary(role)`; `EmployeeDashboard` simplified.
* `services/firebase.js` + `services/authService.js`: marked **PAUSED** placeholders — retained but not imported at runtime.

### Disabled (paused, not deleted)
* Runtime Firebase initialization and real Firebase Auth/Firestore. App no longer bundles Firebase (build JS ~193 kB vs ~645 kB).

### Verified
* `npm run build` succeeds (1554 modules, no errors, no chunk warning). App runs without `.env`; dev server HMR clean.

## [2026-06-19] — Phase 1 Realigned to BUILD_PROMPT.md (Real Firebase Auth)
This restructures the earlier scaffold (below) to match root `BUILD_PROMPT.md` and replaces the mock auth with real Firebase Authentication.

### Added
* `frontend/src/services/`: `firebase.js`, `authService.js` (Firebase email/password login/register/logout + `users` role doc), and stubs `employeeService`, `branchService`, `departmentService`, `shiftService`, `attendanceService`, `faceService`, `locationService`, `reportService`, `notificationService`.
* `frontend/src/routes/RoleBasedRoute.jsx` (role guard); reworked `ProtectedRoute.jsx` (auth + loading) and `AppRoutes.jsx` (public + role-prefixed routes).
* `frontend/src/context/AuthContext.jsx`: real Firebase auth state + Firestore role lookup (replaces mock).
* `frontend/src/hooks/`: `useAuth.js`, `useRole.js`, `useLocation.js`.
* `frontend/src/utils/`: `constants.js` (camelCase roles + routes), `helpers.js`, `dateUtils.js`, `attendanceUtils.js`, `exportUtils.js`.
* `frontend/src/pages/public/`: `LandingPage`, `PrivacyPolicyPage`, `ConsentPage`; `pages/auth/RegisterPage.jsx`; reworked `LoginPage.jsx` (real Firebase login).
* `frontend/src/pages/{superAdmin,branchAdmin,hr,manager,employee}/`: role dashboards using a shared `DashboardShell`.
* `frontend/src/components/`: `layout/{Layout,Sidebar,Navbar,ProfileDropdown}`, `dashboard/{DashboardShell,RecentActivity}`, `cards/StatCard`, `charts/PlaceholderChart`, `common/{LoadingScreen,PageHeader}`.
* `frontend/src/styles/`: `global.css` + reworked `theme.css` (auth forms, landing, charts, profile menu, responsive drawer).

### Changed
* `frontend/src/main.jsx`: imports `styles/global.css` + `styles/theme.css`.
* Role keys switched to camelCase (`superAdmin`, `branchAdmin`, `hr`, `manager`, `employee`); routes are role-prefixed (`/<role>/dashboard`) per BUILD_PROMPT.
* `services/firebase.js`: guard initialization when env is missing (`isFirebaseConfigured`); `AuthContext` + `authService` degrade gracefully so the app runs and public pages render without `.env` (auth reports "not configured").
* **Demo/test login**: when Firebase isn't configured, the Login page shows per-role test-login buttons (`AuthContext.devLogin` + unified `logout`, demo user stored in `localStorage`) so the dashboards can be explored without Firebase. Real Firebase auth takes over automatically once `.env` is set.
* `ProfileDropdown` now logs out via `AuthContext.logout` (handles both demo + Firebase). `RegisterPage` shows a hint to use Demo login when Firebase is unconfigured.
* `frontend/.env.example`: rewritten with annotated placeholders explaining each value and where to find it in the Firebase console.
* Verified: `npm run build` succeeds; `npm run dev` serves the app (HTTP 200, modules transform clean).

### Removed
* Superseded scaffold files: `src/firebase/firebase.js` (moved to `services/`), `src/index.css` (split into `styles/`), `src/pages/dashboards/*` (moved to per-role folders), `src/components/common/{StatCard,DashboardPlaceholder}.jsx`.

## [2026-06-19] — Phase 1 Base Frontend Scaffold (superseded by the entry above)
### Added
* `frontend/src/routes/`: `AppRoutes.jsx` (route table) and `ProtectedRoute.jsx` (auth + role guards).
* `frontend/src/context/AuthContext.jsx`: Phase 1 mock auth provider (localStorage-backed) and `hooks/useAuth.js`.
* `frontend/src/components/layout/`: `Layout.jsx`, `Sidebar.jsx`, `Navbar.jsx` master shell.
* `frontend/src/components/common/`: `StatCard.jsx`, `DashboardPlaceholder.jsx`.
* `frontend/src/pages/`: `auth/LoginPage.jsx` (role-picker mock), five role dashboard placeholders, and `NotFound.jsx`.
* `frontend/src/firebase/firebase.js`: Firebase Web SDK config scaffold (reads from `.env`).
* `frontend/src/utils/constants.js`: roles, route paths, and per-role nav definitions.
* `frontend/src/styles/theme.css`: glassmorphism design tokens and layout styling.
* `frontend/.env.example`, `frontend/README.md`, and `frontend/src/services/.gitkeep`.

### Changed
* `frontend/package.json`: added `react-router-dom`, `firebase`, `lucide-react` deps and `@vitejs/plugin-react` dev dep.
* `frontend/vite.config.js`: enabled the React plugin (JSX transform + Fast Refresh).
* `frontend/src/main.jsx`: wrapped app in `BrowserRouter` + `AuthProvider`.
* `frontend/src/App.jsx`: now renders `<AppRoutes />`.
* `frontend/src/index.css`: imports theme tokens and adds global base styles.
* Verified: `npm install` and `npm run build` succeed with no errors.

## [2026-06-19]
### Added
* Organized workspace folder structure into distinct `frontend/`, `database/`, `backend/`, and `docs/` directories.
* Moved all core documentation markdown files into the `docs/` directory.
* Created root configuration files: `README.md` and `.gitignore`.
* Created database configuration stubs in `database/` (security rules, collections definitions, and JSON samples).
* Initialized React boilerplate in `frontend/` (package settings, Vite configs, baseline components).
* Created a backend placeholder containing a README file and `.gitkeep` placeholder (no server or API logic implemented).

### Changed
* Rearranged prior workspace layout to locate all client code inside `frontend/`.
