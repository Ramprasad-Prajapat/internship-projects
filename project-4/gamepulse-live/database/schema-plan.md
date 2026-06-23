# GamePulse Live — Database Schema Plan

> **Status: Planning only.** No SQL has been written yet. This document describes the planned
> MySQL schema so the frontend mock data and the future backend entities stay aligned.

Database name: **`gamepulse_live`** (MySQL)

---

## 1. Tables Overview

| Table         | Purpose                                   |
| ------------- | ----------------------------------------- |
| `users`       | Accounts and roles (USER / SCORER / ADMIN)|
| `teams`       | Cricket teams                             |
| `players`     | Players belonging to teams                |
| `matches`     | Match metadata and status                 |
| `streams`     | YouTube live stream details per match     |
| `scoreboards` | Live score state per match/innings        |
| `ball_events` | Ball-by-ball events / commentary          |
| `highlights`  | Highlight videos per match                |
| `polls`       | Fan polls per match                       |
| `votes`       | User votes on polls                       |

---

## 2. Planned Table Definitions

> Field types below are **planned** (indicative), not final DDL.

### 2.1 `users`

| Field      | Type             | Notes                          |
| ---------- | ---------------- | ------------------------------ |
| id         | BIGINT PK AI     | Primary key                    |
| name       | VARCHAR(100)     | Display name                   |
| email      | VARCHAR(150)     | Unique, login id               |
| password   | VARCHAR(255)     | BCrypt hashed                  |
| role       | ENUM/VARCHAR(20) | USER, SCORER, ADMIN            |
| created_at | TIMESTAMP        | Default now                    |

### 2.2 `teams`

| Field        | Type         | Notes              |
| ------------ | ------------ | ------------------ |
| id           | BIGINT PK AI | Primary key        |
| team_name    | VARCHAR(100) | Team display name  |
| logo         | VARCHAR(255) | Logo URL           |
| captain_name | VARCHAR(100) | Captain name       |
| description  | VARCHAR(255) | Short description  |

### 2.3 `players`

| Field         | Type         | Notes                          |
| ------------- | ------------ | ------------------------------ |
| id            | BIGINT PK AI | Primary key                    |
| team_id       | BIGINT FK    | -> `teams.id`                  |
| name          | VARCHAR(100) | Player name                    |
| role          | VARCHAR(50)  | Batsman / Bowler / All-rounder |
| jersey_number | INT          | Jersey number                  |

### 2.4 `matches`

| Field      | Type             | Notes                                      |
| ---------- | ---------------- | ------------------------------------------ |
| id         | BIGINT PK AI     | Primary key                                |
| team_a_id  | BIGINT FK        | -> `teams.id`                              |
| team_b_id  | BIGINT FK        | -> `teams.id`                              |
| venue      | VARCHAR(150)     | Ground / venue                             |
| match_date | DATE / DATETIME  | Scheduled date/time                        |
| status     | ENUM/VARCHAR(20) | Upcoming, Live, Innings Break, Completed   |
| toss_winner| VARCHAR(100)     | Toss-winning team                          |
| toss_decision | VARCHAR(10)   | Bat / Bowl                                 |
| result     | VARCHAR(255)     | Final result summary                       |

### 2.5 `streams`

| Field            | Type         | Notes                       |
| ---------------- | ------------ | --------------------------- |
| id               | BIGINT PK AI | Primary key                 |
| match_id         | BIGINT FK    | -> `matches.id`             |
| youtube_video_id | VARCHAR(50)  | YouTube video ID            |
| embed_url        | VARCHAR(255) | Full embed URL              |
| is_live          | BOOLEAN      | Whether stream is live      |

### 2.6 `scoreboards`

| Field           | Type         | Notes                          |
| --------------- | ------------ | ------------------------------ |
| id              | BIGINT PK AI | Primary key                    |
| match_id        | BIGINT FK    | -> `matches.id`                |
| innings         | INT          | 1 or 2                         |
| batting_team_id | BIGINT FK    | -> `teams.id`                  |
| bowling_team_id | BIGINT FK    | -> `teams.id`                  |
| runs            | INT          | Total runs                     |
| wickets         | INT          | Total wickets                  |
| overs           | INT          | Completed overs                |
| balls           | INT          | Balls in current over          |
| target          | INT NULL     | Target for 2nd innings         |
| current_batsman | VARCHAR(100) | Current batsman name           |
| current_bowler  | VARCHAR(100) | Current bowler name            |

### 2.7 `ball_events`

| Field      | Type             | Notes                                  |
| ---------- | ---------------- | -------------------------------------- |
| id         | BIGINT PK AI     | Primary key                            |
| match_id   | BIGINT FK        | -> `matches.id`                        |
| over_no    | INT              | Over number                            |
| ball_no    | INT              | Ball number within over                |
| runs       | INT              | Runs scored on this ball               |
| event_type | VARCHAR(20)      | RUN, WIDE, NO_BALL, WICKET, DOT        |
| commentary | VARCHAR(255)     | Commentary text                        |
| created_at | TIMESTAMP        | Order of events                        |

### 2.8 `highlights`

| Field       | Type         | Notes                                                  |
| ----------- | ------------ | ------------------------------------------------------ |
| id          | BIGINT PK AI | Primary key                                            |
| match_id    | BIGINT FK    | -> `matches.id`                                        |
| title       | VARCHAR(150) | Highlight title                                        |
| video_url   | VARCHAR(255) | YouTube/Cloudinary URL                                 |
| thumbnail   | VARCHAR(255) | Thumbnail URL                                          |
| category    | VARCHAR(30)  | Four, Six, Wicket, Best Moment, Winning Moment, Full Match |
| description | VARCHAR(255) | Short description                                      |

### 2.9 `polls`

| Field    | Type         | Notes              |
| -------- | ------------ | ------------------ |
| id       | BIGINT PK AI | Primary key        |
| match_id | BIGINT FK    | -> `matches.id`    |
| question | VARCHAR(255) | Poll question      |
| option_a | VARCHAR(100) | First option       |
| option_b | VARCHAR(100) | Second option      |

### 2.10 `votes`

| Field           | Type         | Notes                          |
| --------------- | ------------ | ------------------------------ |
| id              | BIGINT PK AI | Primary key                    |
| poll_id         | BIGINT FK    | -> `polls.id`                  |
| user_id         | BIGINT FK    | -> `users.id`                  |
| selected_option | VARCHAR(100) | option_a or option_b           |

---

## 3. Planned Relationships

```text
teams (1) ───< (N) players
teams (1) ───< (N) matches    (as team_a and team_b)
matches (1) ──< (1) streams
matches (1) ──< (N) scoreboards   (one per innings)
matches (1) ──< (N) ball_events
matches (1) ──< (N) highlights
matches (1) ──< (N) polls
polls (1) ────< (N) votes
users (1) ────< (N) votes
```

---

## 4. Notes

* All foreign keys use `BIGINT` referencing the parent `id`.
* `status` and `event_type` may be implemented as MySQL `ENUM` or validated `VARCHAR`.
* Passwords are stored **hashed** (never plain text) once the backend is built.
* A unique constraint on `(poll_id, user_id)` enforces "one vote per user per poll".
* These definitions mirror the mock data shapes in the frontend so migration is smooth.

The real DDL (`CREATE TABLE` statements) will be authored only when the backend phase
begins and is explicitly requested.
