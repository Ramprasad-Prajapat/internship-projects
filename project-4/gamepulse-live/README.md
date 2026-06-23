# GamePulse Live — College Cricket Live Streaming Portal

A college-level cricket **live streaming web application**. Users can watch a live cricket
match (YouTube Live embed), follow a real-time scoreboard and ball-by-ball commentary, view
team/player details, vote in fan polls, and watch match highlights. Admins manage matches,
teams, players, streams, highlights and results; scorers update the score ball-by-ball from a
mobile-friendly panel.

> Built for college matches, local tournaments, school matches, and small sports events.

---

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React.js, Vite, Bootstrap 5, React Router DOM |
| Backend  | Java 21, Spring Boot 3, Spring Security, JWT  |
| Database | MySQL (Spring Data JPA)                        |
| Realtime | API polling first, WebSocket (STOMP) later     |
| Media    | YouTube Live / YouTube Unlisted / Cloudinary   |
| Deploy   | Vercel (frontend), Render/Railway (backend), Aiven/Railway MySQL |

---

## Current Status

**Phase: Documentation + structure setup (frontend-first).**

* ✅ Project documentation written (`docs/`)
* ✅ Project folder structure scaffolded
* ⏳ Frontend implementation — **next** (mock data + `localStorage`, backend-ready services)
* ⛔ Backend — planned only, **not implemented yet**
* ⛔ Database — planned only, **not implemented yet**

### Frontend-first / Mock approach

The frontend is being built first with **temporary mock data + `localStorage`** acting as the
backend/database. All data access goes through a service layer (`frontend/src/services/`), so
later only those service files need to change to connect the real Spring Boot + MySQL backend
(no UI changes required).

---

## Planned Folders

```text
gamepulse-live/
├── docs/        # Project documentation (report, frontend prompt, index)
├── frontend/    # React.js + Vite app (mock + localStorage first)
├── backend/     # Java Spring Boot (planned, not implemented yet)
├── database/    # MySQL schema & seed planning (not implemented yet)
├── scripts/     # Helper / dev scripts
└── README.md
```

---

## Later Backend Plan

Once the frontend MVP is complete:

1. Build the Spring Boot backend following [`docs/GAMEPULSE_PROJECT_REPORT.md`](docs/GAMEPULSE_PROJECT_REPORT.md) (APIs in sections 23–24).
2. Create the MySQL schema from [`database/schema-plan.md`](database/schema-plan.md) and seed it from [`database/seed-data-plan.md`](database/seed-data-plan.md).
3. Switch the frontend service layer from mock/`localStorage` mode to Axios calls using `VITE_API_BASE_URL`.

---

## Local Development Workflow

This project follows a **local-first, manual-commit** workflow. Full rules are in
[CLAUDE.md](CLAUDE.md).

* **No automatic commits.** A commit is created only when you explicitly say `commit now`,
  `make checkpoint`, `create local commit`, or `save checkpoint`.
* **No automatic push.** `git push` and remote changes never happen unless you explicitly
  ask — changes stay local.
* **Run the app:** `powershell -ExecutionPolicy Bypass -File scripts/auto-run.ps1`
  (Vite dev server on `http://localhost:5173`; add `-NoOpen` to skip the browser).
* **Stop the app:** `powershell -ExecutionPolicy Bypass -File scripts/stop-dev.ps1`
  (frees port 5173).
* After **frontend** changes the app is run/verified automatically; **docs-only** changes
  skip the dev server.

---

## Documentation

| Document                                                              | Description                          |
| -------------------------------------------------------------------- | ------------------------------------ |
| [docs/GAMEPULSE_PROJECT_REPORT.md](docs/GAMEPULSE_PROJECT_REPORT.md)  | Full project report (college format) |
| [docs/FRONTEND_MASTER_PROMPT.md](docs/FRONTEND_MASTER_PROMPT.md)      | Complete frontend build instructions |
| [database/schema-plan.md](database/schema-plan.md)                    | Planned MySQL schema                  |
| [database/seed-data-plan.md](database/seed-data-plan.md)              | Planned initial/demo data             |
| [docs/README.md](docs/README.md)                                     | Documentation index                   |
