# FaceTrack-AI Permanent AI Workflow Rules

## 0. Quick Reference & Automatic Working Rules

* **Runtime app lives in `frontend/`** (Vite + React 18 + JSX, no TypeScript). This is **frontend-only mock mode** — no backend, no Firebase runtime, no API, no `.env`.
* **Read before editing.** Always read the relevant existing files (and the docs below) before changing anything. Reuse existing patterns; do not re-architect.
* **Do not ask for file names or locations.** Search the codebase automatically (rg / Glob / dir).
* **Codebase map:** `docs/PROJECT_CODEBASE_INDEX.md` — structure, routes, auth/attendance/data flow, build/check commands, and the "do not break" list. Read it to orient quickly.
* **Project skills** (in `.claude/skills/`): `facetrack-read-project` (scan/understand the project), `facetrack-frontend-change` (any frontend edit), `facetrack-attendance-mock` (attendance / face check-in / localStorage work).
* **Auto build verification:** a `PostToolUse` hook (`.claude/hooks/verify-frontend.ps1`, wired in `.claude/settings.json`) runs `cd frontend && npm run build` after Claude edits frontend files and reports pass/fail back. The active `.claude/` lives at the **workspace root** (`r:\Inernship\.claude`, = `${CLAUDE_PROJECT_DIR}`), one level above this project. Verify the hook with `/hooks`; scripts run under PowerShell `-ExecutionPolicy RemoteSigned`. Manual VS Code edits are NOT covered — run `scripts/watch-frontend-build.ps1` yourself if you want auto-build for those.
* **Auto-run (live preview, no manual run needed):** run `scripts/auto-run.ps1` **once** (`powershell -ExecutionPolicy RemoteSigned -File scripts/auto-run.ps1`). It starts the Vite dev server and auto-opens the browser; after that **every change live-reloads automatically via HMR** — Claude's edits and the user's manual edits both — so there's no need to invoke `/run` or rebuild for each change. Only `package.json`/`vite.config.js` changes need a restart. (The build hook above still runs as an independent production-build safety check.)
* **Standing guardrails (apply to every task unless explicitly told otherwise):**
  * Preserve theme (dark glassmorphism), sidebar, header/navbar, and login/mock-auth + the 5 demo accounts.
  * Prefer existing mock/`localStorage` patterns (`mockStore` + `useStore` + `selectors`); do not invent a parallel data system.
  * Do NOT add backend/Firebase/API for frontend-only mock tasks.
  * Do NOT install npm packages without explicit permission (explain why first).
  * Keep changes scoped to the requested pages/features.
  * After frontend **code** changes, run `cd frontend && npm run build` and fix errors before reporting done.

## 0a. Local Git Safety Rules (local-only repo, no remote)

Full guide: `docs/LOCAL_GIT_WORKFLOW.md`. This repo is **local only** — never push, never add a remote.

* **Always run `git status` before editing.**
* **Never commit** unless the user explicitly says one of: **"commit now"**, **"make checkpoint"**, **"create local commit"**, **"create baseline commit"**.
* **Never push** to a remote. **Never create a remote.** **Never auto-commit after a build.**
* After each implementation, report the changed files and **remind that the changes are uncommitted** (unless the user asked for a commit).
* If the user asks for a rollback:
  * first run `git status`;
  * explain whether the changes are **committed** or **uncommitted**;
  * suggest the **safest** rollback command (`git restore` for uncommitted, `git stash` to set work aside, `git reset --hard` only for a committed rewind);
  * only run destructive commands like `git reset --hard` (or `git restore .`) **after explicit user confirmation**.
* Prefer **small, scoped changes** so rollback stays easy.

## 1. Common Rules

* Always work inside the existing `FaceTrack-AI` project folder.
* Do not assume previous chat context.
* Use project files as the source of truth.
* Do not delete files without permission.
* Do not rewrite the full project unless clearly asked.
* Keep changes small and step-by-step.
* Before editing source code, mention which files will be modified.
* After every important work, update the correct tracking files.

## 2. Documentation Reading Rules

When only reading documentation:

* Read only the requested file.
* Do not write code.
* Do not modify source code.
* If useful project info is found, update `docs/PROJECT_DOCUMENTATION.md` (spec) or `docs/PROJECT_CODEBASE_INDEX.md` (codebase map) as appropriate.
* Do not update `CHANGELOG.md` because no code change was made.

## 3. Code Change Rules

When source code is modified:

* Update `CHANGELOG.md` with the real code change (concise dated entry).
* Update `docs/PROJECT_DOCUMENTATION.md` only if architecture, tech stack, module flow, database flow, features, or an important project rule changed.
* Update `docs/PROJECT_CODEBASE_INDEX.md` if files / routes / data flow changed.
* Update the **Current status & roadmap** section of `README.md` if the phase or pending work changed.

## 4. Phase Tracking Rules

After inspecting the project, classify the project into one of these phases:

* Phase 0: Documentation / Planning
* Phase 1: Project Setup / Folder Structure
* Phase 2: Basic UI / Pages Created
* Phase 3: Authentication / User Roles
* Phase 4: Face Detection / Face Tracking Core Logic
* Phase 5: Attendance / Records / Storage
* Phase 6: Dashboard / Reports / Analytics
* Phase 7: Testing / Bug Fixing
* Phase 8: Deployment Ready

Record a phase change in `CHANGELOG.md` and in the **Current status & roadmap** section of `README.md`. Current phase: **Phase 7 — Testing / Bug Fixing** (the frontend mock build of Phases 1–8 is feature-complete).

## 5. Documentation File Purpose (consolidated set)

* `CLAUDE.md` = Claude-specific permanent rules, automation, and Git safety (this file)
* `README.md` = human-facing overview, setup, demo accounts, **current status & roadmap**
* `CHANGELOG.md` = dated history of real code/doc changes
* `docs/PROJECT_DOCUMENTATION.md` = full project specification / single source of truth
* `docs/PROJECT_CODEBASE_INDEX.md` = codebase map (structure, routes, data flow, build commands, do-not-break list)
* `docs/LOCAL_GIT_WORKFLOW.md` = local-only Git workflow + rollback / checkpoint rules

## 6. React / Vite Development Workflow (HMR)

* **Start the dev server once**: `cd frontend && npm run dev`
* **Vite HMR** updates the browser automatically. Do **NOT** restart the dev server after every small frontend edit.
* Only restart the server if `package.json`/`vite.config.js` changes, a new dependency is installed, the server crashes, or HMR fails.

## 7. Build Verification Rule

* If only markdown/documentation files are updated, a build is **NOT** required.
* If any frontend code changes are made, **always run the build**: `cd frontend && npm run build`.
* Fix any build errors before providing the final summary.

## 8. Scope Guardrails

* **Frontend-only mock mode**: No real backend, no real database, no Firebase runtime imports, no `.env` required.
* No new npm dependencies without explicit approval.
* Build only inside `frontend/`.

## 9. Startup Rule for Future Sessions

At the start of every future session, first read:
1. `CLAUDE.md` (rules + automation + Git safety)
2. `docs/PROJECT_CODEBASE_INDEX.md` (codebase map)
3. `README.md` (overview, demo accounts, current status & roadmap)
4. `CHANGELOG.md` (history)
5. `docs/PROJECT_DOCUMENTATION.md` (full spec)
6. `docs/LOCAL_GIT_WORKFLOW.md` (Git workflow)

## 10. Final Response Rule

After any implementation, reply shortly with:
1. What was done
2. **Files changed**
3. **Build result** (pass/fail + module count / bundle size, or "not required" for docs-only)
4. **What was tested** (and how)
5. **Anything not tested** / known gaps
6. Current phase
7. Next recommended step

Do not start coding unless the user approves.
