# GamePulse Live — Documentation Index

This folder holds the project documentation for **GamePulse Live — College Cricket Live
Streaming Portal**.

## Documents

| Document                                                | Description                                                              |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| [GAMEPULSE_PROJECT_REPORT.md](GAMEPULSE_PROJECT_REPORT.md) | Full project report in college-report format — overview, scope, features, APIs, DB tables, deployment, roadmap, future scope. |
| [FRONTEND_MASTER_PROMPT.md](FRONTEND_MASTER_PROMPT.md)     | Complete frontend build instructions — stack, routes, mock/localStorage strategy, score panel logic, components, backend-ready service plan. |

## Related Documents (outside `docs/`)

| Document                                                  | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| [../README.md](../README.md)                              | Project root overview                |
| [../database/README.md](../database/README.md)            | Database planning overview           |
| [../database/schema-plan.md](../database/schema-plan.md)  | Planned MySQL tables & relationships |
| [../database/seed-data-plan.md](../database/seed-data-plan.md) | Planned initial/demo data       |
| [../backend/README.md](../backend/README.md)              | Planned backend structure            |

## Development Workflow

Permanent local Git + run/verify rules live in [../CLAUDE.md](../CLAUDE.md). In short:
**no automatic commits or pushes** (commit only on explicit request such as `commit now` /
`make checkpoint`); after **frontend** changes the app is run via
[`../scripts/auto-run.ps1`](../scripts/auto-run.ps1) and stopped via
[`../scripts/stop-dev.ps1`](../scripts/stop-dev.ps1); **docs-only** changes skip the dev
server.

## Project Status

* **Documentation:** complete (this phase)
* **Frontend:** to be built next (mock data + localStorage, backend-ready)
* **Backend:** planned only
* **Database:** planned only
