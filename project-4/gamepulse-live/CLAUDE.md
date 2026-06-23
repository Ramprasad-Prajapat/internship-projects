# CLAUDE.md — GamePulse Live

Guidance for Claude Code (and any AI/human contributor) working in this project.
**GamePulse Live** is a college cricket live streaming portal. Full specs live in
[`docs/`](docs/).

> This file is the **main permanent instruction file** for the project. The rules in
> [Permanent Project Workflow Rules](#permanent-project-workflow-rules) below apply to
> **every** task, in every session, unless the user explicitly overrides them in the moment.

---

## Project Snapshot

* **Frontend-first.** Build the React + Vite frontend using **mock data + `localStorage`**
  until a backend is explicitly requested. Keep a backend-ready service layer
  (`frontend/src/services/`) so only those files change when the real Spring Boot + MySQL
  backend is connected.
* **Backend & database: planned only** — do **not** implement until explicitly asked.
* **Docs:** [`docs/GAMEPULSE_PROJECT_REPORT.md`](docs/GAMEPULSE_PROJECT_REPORT.md),
  [`docs/FRONTEND_MASTER_PROMPT.md`](docs/FRONTEND_MASTER_PROMPT.md),
  [`database/schema-plan.md`](database/schema-plan.md),
  [`database/seed-data-plan.md`](database/seed-data-plan.md).

---

## Permanent Project Workflow Rules

These rules are **permanent**. Follow them in every task unless the user explicitly overrides
them.

### 1. Git commit — manual only

* **Never** commit automatically.
* Commit **only** when the user explicitly says one of:
  * `commit now`
  * `make checkpoint`
  * `create local commit`
  * `save checkpoint`
* Do **not** run `git commit` for any other reason.
* Do **not** auto-commit after a build, after tests, or after a successful run.

### 2. Git push & remote — never (unless explicitly asked)

* **Never** run `git push`.
* **Never** create or change a remote.
* **Never** change remote settings.
* Keep all changes **local only** until the user explicitly asks to push.

### 3. Before every code change

* Run `git status`.
* Note the current branch.
* Note whether there are uncommitted changes.
* Continue safely **without** committing.

### 4. After every code change

* Show the changed files.
* If frontend/app code changed → run the app automatically (see [Auto-run](#5-auto-run-frontend-changes)).
* Show the run / build / test result.
* Show visible website/page verification where possible.
* Show `git status`.
* Clearly state: **"Commit was NOT created"** — unless the user explicitly asked for a commit.

### 5. Auto-run (frontend changes)

* After frontend code changes, automatically run the project.
* Prefer the existing script: [`scripts/auto-run.ps1`](scripts/auto-run.ps1) (PowerShell).
* Dev server: Vite on host `127.0.0.1`, port `5173` → `http://localhost:5173`.
* `-NoOpen` runs without opening a browser (use for automated tests).
* Without `-NoOpen`, the browser opens normally.
* Avoid orphan Node/Vite processes (the scripts clean up port 5173).

### 6. Website verification (frontend changes)

* Launch the app locally and open `http://localhost:5173`.
* Verify the main page loads.
* If login exists and mock credentials are documented, test mock login.
* Verify changed pages visually if browser automation is available; capture a
  screenshot/report if possible.
* After automated verification, **stop the server** ([`scripts/stop-dev.ps1`](scripts/stop-dev.ps1))
  and **free port 5173** — unless the user asks to keep it running.

### 7. Docs-only changes

* If **only** Markdown/docs files changed → do **not** run the frontend build or dev server.
* Only show `git status` and the changed docs.

---

## Helper Scripts

| Script                                       | Purpose                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`scripts/auto-run.ps1`](scripts/auto-run.ps1) | Safely starts the Vite dev server on port 5173. `-NoOpen` skips the browser. Frees a stale port first; exits gracefully if the frontend isn't scaffolded yet. **Never commits/pushes.** |
| [`scripts/stop-dev.ps1`](scripts/stop-dev.ps1) | Safely stops the Vite/node process owning port 5173 and reports whether the port is free. **Never commits/pushes.** |

> Both scripts only ever stop a `node` process that owns port 5173 — never unrelated
> processes — and never run `git` or install packages.

---

## Quick Reference

**Create a local commit** (only when you want one) — say one of:

```text
commit now
make checkpoint
create local commit
save checkpoint
```

**Run the frontend manually:**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/auto-run.ps1
# without opening a browser (for automated checks):
powershell -ExecutionPolicy Bypass -File scripts/auto-run.ps1 -NoOpen
```

**Stop the dev server / free port 5173:**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/stop-dev.ps1
```

---

## Optional: Claude verification hook (documented, NOT auto-enabled)

This project does **not** currently use a `.claude/` config folder, so no hook has been
created (per the "document instead of risky setup" rule). If you later want an automatic
**reminder** after edits, create `.claude/settings.json` with a **non-destructive** `PostToolUse`
hook. It must never commit, never push, and never start long-lived processes — a reminder
only:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[reminder] If frontend code changed: run scripts/auto-run.ps1 -NoOpen to verify, then scripts/stop-dev.ps1. Do NOT commit unless the user said commit/checkpoint.\""
          }
        ]
      }
    ]
  }
}
```

Notes:

* The matcher fires on every Write/Edit/MultiEdit; to fire **only** for frontend files, wrap
  the command in a small script that reads the tool input `file_path` from stdin and checks
  for `frontend/`. Kept simple here on purpose.
* This is **documented, not created**. Enable it deliberately if you want it.
