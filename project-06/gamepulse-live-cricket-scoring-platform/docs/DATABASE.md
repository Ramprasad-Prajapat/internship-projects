# GamePulse Live — Database Schema Specification

GamePulse Live uses Flyway for schema versioning. Migrations are stored under `backend/src/main/resources/db/migration/`.

---

## 1. Flyway Migration Inventory

| Migration Version | Description | Key Tables Created/Modified |
|---|---|---|
| `V1__init_schema.sql` | Base Schema | `users`, `tournaments`, `teams`, `players`, `matches`, `deliveries` |
| `V2__add_commentary_and_audit.sql` | Commentary & Audit | `commentary`, `audit_logs` |
| `V3__add_polls_and_highlights.sql` | Polls & Highlights | `polls`, `poll_options`, `highlights` |
| `V4__add_offline_scoring_support.sql` | Offline Support | `offline_sync_queue` |

---

## 2. Core Entities & Relationships

### `users`
- `id` (BIGINT, Primary Key, Auto Increment)
- `username` (VARCHAR 50, UNIQUE, NOT NULL)
- `email` (VARCHAR 100, UNIQUE, NOT NULL)
- `password_hash` (VARCHAR 255, NOT NULL)
- `role` (VARCHAR 20, NOT NULL — `USER`, `SCORER`, `ADMIN`)

### `tournaments`
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR 100, NOT NULL)
- `format` (VARCHAR 30 — `ROUND_ROBIN`, `KNOCKOUT`, `GROUPS_KNOCKOUT`)
- `start_date`, `end_date` (DATE)

### `teams`
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR 100, NOT NULL)
- `short_name` (VARCHAR 10, NOT NULL)
- `logo_url` (VARCHAR 255)

### `matches`
- `id` (BIGINT, Primary Key)
- `tournament_id` (BIGINT, Foreign Key -> `tournaments.id`)
- `team1_id`, `team2_id` (BIGINT, Foreign Keys -> `teams.id`)
- `status` (VARCHAR 20 — `UPCOMING`, `LIVE`, `COMPLETED`, `ABANDONED`)
- `toss_winner_id`, `toss_decision`
- `team1_score`, `team1_wickets`, `team1_overs`
- `team2_score`, `team2_wickets`, `team2_overs`

### `deliveries`
- `id` (BIGINT, Primary Key)
- `match_id` (BIGINT, Foreign Key -> `matches.id`)
- `innings` (INT, NOT NULL)
- `over_number` (INT, NOT NULL)
- `ball_number` (INT, NOT NULL)
- `batsman_id`, `bowler_id` (BIGINT, Foreign Keys -> `players.id`)
- `runs_scored` (INT)
- `extra_runs` (INT)
- `extra_type` (VARCHAR 20 — `NONE`, `WIDE`, `NO_BALL`, `BYE`, `LEG_BYE`, `PENALTY`)
- `is_wicket` (BOOLEAN)
- `dismissal_type` (VARCHAR 30)
- `dismissed_player_id` (BIGINT)

---

## 3. Indexing & Optimization Strategy
- **`idx_deliveries_match_innings`**: Composite index on `deliveries(match_id, innings, over_number, ball_number)` for ultra-fast scorecard construction.
- **`idx_matches_status`**: Index on `matches(status)` for instantaneous live/upcoming match queries.
- **`idx_audit_logs_timestamp`**: Index on `audit_logs(timestamp)` for fast admin trail filtering.
