# GamePulse Live — REST API Reference

All API endpoints are prefixed with `/api`. Protected endpoints require a valid JWT Bearer token in the `Authorization: Bearer <TOKEN>` header.

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`username`, `password`, `email`, `role`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT Bearer token |

---

## 2. Match & Scoring Endpoints (`/api/matches`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/matches` | Public | Get all matches (filterable by status: `LIVE`, `COMPLETED`, `UPCOMING`) |
| `GET` | `/api/matches/{id}` | Public | Get match details and current scorecard |
| `POST` | `/api/matches` | `SCORER`, `ADMIN` | Create a new match |
| `POST` | `/api/matches/{id}/toss` | `SCORER`, `ADMIN` | Record toss winner and decision (`BAT`/`BOWL`) |
| `POST` | `/api/matches/{id}/xi` | `SCORER`, `ADMIN` | Submit playing XI for both teams |
| `POST` | `/api/matches/{id}/score` | `SCORER`, `ADMIN` | Score a delivery (runs, extra type, dismissal) |
| `POST` | `/api/matches/{id}/corrections` | `ADMIN` | Overwrite score correction with audit trail logging |
| `GET` | `/api/matches/{id}/corrections` | `ADMIN` | View audit trail history for score corrections |

---

## 3. Tournament Endpoints (`/api/v1/tournaments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/tournaments` | Public | List all tournaments |
| `GET` | `/api/v1/tournaments/{id}` | Public | Get tournament details, fixtures, and teams |
| `POST` | `/api/v1/tournaments` | `ADMIN` | Create a new tournament |
| `POST` | `/api/v1/tournaments/{id}/generate-fixtures` | `ADMIN` | Generate tournament match schedule |
| `GET` | `/api/v1/tournaments/{id}/standings` | Public | Get dynamic Points Table and Net Run Rate (NRR) |

---

## 4. Teams & Players (`/api/teams`, `/api/players`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/teams` | Public | List all cricket teams |
| `POST` | `/api/teams` | `ADMIN` | Create team |
| `GET` | `/api/players` | Public | List players |
| `GET` | `/api/players/{id}/stats` | Public | Get player career statistics (runs, wickets, average, strike rate) |

---

## 5. Analytics & Fan Engagement (`/api/analytics`, `/api/polls`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/matches/{id}/analytics` | Public | Get match run rate worm graph and wagon wheel metrics |
| `GET` | `/api/polls/active` | Public | Get active fan poll for match |
| `POST` | `/api/polls/{id}/vote` | Public | Submit vote on poll option |

---

## 6. Search & Discovery (`/api/search`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/search?q={query}` | Public | Multi-entity global search across teams, players, matches, and tournaments |

---

## 7. Observability & System Health (`/api/health`, `/api/metrics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check (HTTP 200 OK if healthy; HTTP 503 if DB down) |
| `GET` | `/api/readiness` | Public | Readiness status check (HTTP 200 READY; HTTP 503 NOT_READY) |
| `GET` | `/api/metrics` | Public | System metrics (total requests, 4xx/5xx error counts, average latency) |

---

## 8. Backup & Recovery (`/api/admin/backups`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/backups` | `ADMIN` | List database backup snapshots |
| `POST` | `/api/admin/backups/create` | `ADMIN` | Generate SQL database backup snapshot |
| `POST` | `/api/admin/backups/{id}/verify` | `ADMIN` | Verify SHA-256 checksum integrity |
| `POST` | `/api/admin/backups/{id}/restore` | `ADMIN` | Execute transactional database restoration |
| `POST` | `/api/admin/backups/retention` | `ADMIN` | Apply backup retention policy cleanup |
| `GET` | `/api/admin/backups/{id}/download` | `ADMIN` | Download backup `.sql` file |
