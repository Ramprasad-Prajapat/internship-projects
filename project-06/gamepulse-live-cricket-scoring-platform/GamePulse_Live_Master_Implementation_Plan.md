# GamePulse Live — Complete Implementation Master Plan

## Purpose

This is the master implementation prompt for upgrading the existing **GamePulse Live** project into a production-ready grassroots/college/local cricket live-scoring and tournament-management platform.

**Important:** Do not rebuild the project from scratch. Inspect the existing code first, reuse working functionality, and implement the roadmap phase-by-phase.

---

# 0. CURRENT PROJECT BASELINE

The supplied ZIP was inspected in depth.

### Existing architecture

- Frontend: React + Vite + Bootstrap 5 + React Router + Axios
- Backend: Java 21 + Spring Boot 3.5.x + Spring Security + JWT + Spring Data JPA
- Database: MySQL
- Existing modules:
  - Authentication
  - Users
  - Teams
  - Players
  - Matches
  - Streams
  - Ball events
  - Scoreboard
  - Scorecard
  - Squads / Playing XI
  - Highlights
  - Polls
  - Favorites
  - Saved highlights
  - Match reminders
  - User activity
  - Admin
  - Scorer

### Critical source-code issue

The supplied ZIP contains compiled frontend/backend artifacts, while the actual source files under `frontend/src` and `backend/src/main/java` are largely missing.

Therefore the implementing AI MUST:

1. Inspect the current workspace/repository.
2. Inspect Git history and branches.
3. Recover the real source if it exists.
4. Never directly maintain the application by editing compiled `dist` or JAR files.
5. Never silently rebuild the whole application if source is missing.
6. If source cannot be recovered, stop and report exactly what is missing before destructive work.

---

# GLOBAL MASTER INSTRUCTION

Act as a senior full-stack engineer responsible for the existing GamePulse Live application.

For every phase:

1. Inspect before changing.
2. Identify existing implementation.
3. Reuse existing components, services, entities, routes and APIs.
4. Do not duplicate existing functionality.
5. Do not break working features.
6. Keep the current GamePulse identity unless a redesign is explicitly required.
7. Keep frontend/backend API contracts synchronized.
8. Keep database migrations synchronized with entities.
9. Never hard-code production secrets.
10. Never use localhost URLs in production builds.
11. Never delete existing production data without a migration strategy.
12. Never create fake success messages for unfinished functionality.
13. Run tests/builds after each phase.
14. Update documentation after each completed phase.
15. Do not mark a phase complete until its acceptance criteria pass.

---

# PHASE 1 — SOURCE RECOVERY + AUDIT + BASELINE

## Objective

Create a reliable source-controlled baseline.

### Tasks

Inspect:

- `frontend/`
- `backend/`
- `database/`
- `docs/`
- `package.json`
- `pom.xml`
- environment files
- Git history
- build configuration
- API configuration
- authentication
- database configuration
- seed data

Recover the actual source tree where possible:

```text
frontend/src/
backend/src/main/java/
backend/src/main/resources/
```

Verify:

```text
Frontend build
Backend build
Database connection
Register
Login
Logout
Admin login
Scorer login
User login
Existing match flow
Existing scoring flow
```

Create/update:

```text
docs/ARCHITECTURE.md
docs/API.md
docs/DATABASE.md
docs/DEPLOYMENT.md
docs/FEATURE_STATUS.md
```

### Acceptance criteria

- Real source is available and buildable.
- Frontend builds.
- Backend builds.
- Existing authentication works.
- Existing admin/scorer/user flows work.
- Baseline Git commit/tag exists.

---

# PHASE 2 — PRODUCTION CONFIGURATION + SECURITY

## Objective

Separate development, staging and production configuration.

### Frontend

Use:

```text
VITE_API_BASE_URL
VITE_APP_ENV
VITE_ENABLE_MOCK
```

Never hard-code:

```text
http://localhost:8080/api
```

Create:

```text
.env.example
.env.development
.env.production
```

Never commit secrets.

### Backend

Use environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MS
FRONTEND_URL
CORS_ALLOWED_ORIGINS
```

Remove insecure default production secrets.

### Security

Verify:

- password hashing
- JWT validation
- token expiration
- role authorization
- CORS
- request validation
- 401 handling
- 403 handling
- no password leakage
- no secret logging

### Database

Use proper migrations/versioning. Do not use destructive schema recreation in production.

### Acceptance criteria

- Production build contains no localhost API URL.
- No production secret is hard-coded.
- Invalid JWT => 401.
- Unauthorized role => 403.
- CORS is environment-controlled.
- Backend starts from environment configuration.

---

# PHASE 3 — COMPLETE CRICKET SCORING ENGINE

## Objective

Upgrade the current basic scoring system into a reliable cricket scoring engine.

### Ball events

Support:

```text
DOT
RUN
FOUR
SIX
WIDE
NO_BALL
BYE
LEG_BYE
PENALTY
WICKET
```

Suggested event data:

```text
id
matchId
inningsNumber
overNumber
ballNumber
strikerId
nonStrikerId
bowlerId
eventType
batRuns
extraRuns
totalRuns
extraType
wicketType
dismissedPlayerId
fielderId
isLegalDelivery
commentary
createdAt
createdBy
sequenceNumber
```

### Wickets

Support:

```text
BOWLED
CAUGHT
LBW
RUN_OUT
STUMPED
HIT_WICKET
RETIRED_HURT
RETIRED_OUT
OBSTRUCTING_FIELD
TIMED_OUT
```

### Extras

Correctly calculate:

- wides
- no-balls
- byes
- leg-byes
- penalty runs

### Legal delivery rules

Implement correct legal-ball logic:

- Wide is not legal.
- No-ball is not legal.
- Bye/leg-bye on a legal delivery counts as a legal ball.
- Overs are based on legal deliveries.

### Strike management

Automatically handle:

- striker
- non-striker
- odd-run rotation
- over-end rotation
- wicket flow

Allow scorer override where necessary.

### Bowler validation

Enforce:

- over limit
- current bowler
- no consecutive over
- innings limit

### Wicket flow

When wicket occurs:

1. Validate batter.
2. Record dismissal.
3. Update score.
4. Update wicket count.
5. Mark dismissed batter unavailable.
6. Request/select replacement.
7. Correctly restore striker/non-striker state.
8. Recalculate scorecard.

### Undo

Implement safe undo that restores:

- score
- wickets
- batter state
- bowler figures
- strike
- commentary
- scorecard

Preserve audit history.

### Ball correction

Add scorer-only:

```text
Edit Ball
Preview Recalculation
Confirm
Recalculate
Publish Updated State
```

### Acceptance tests

At minimum test:

- 1/2/3 runs
- 4
- 6
- dot
- wide
- no-ball
- bye
- leg-bye
- wicket
- run-out
- over completion
- strike rotation
- innings completion
- undo
- correction
- scorecard recalculation

---

# PHASE 4 — REAL-TIME LIVE SCORE

## Objective

Provide true live synchronization.

Recommended architecture:

```text
Scorer
  ↓
REST command
  ↓
Spring Boot
  ↓
Persist event
  ↓
Publish event
  ↓
WebSocket/STOMP
  ↓
All spectators
```

REST remains the source of truth.

Implement events for:

- score
- wicket
- over completion
- innings break
- match completion
- poll update
- highlight update

Implement:

- connection indicator
- reconnect
- fallback polling
- state resynchronization after reconnect

### Acceptance criteria

- Scorer changes score.
- Backend persists it.
- Connected spectators see it without refresh.
- Reconnection restores current state.
- Duplicate events do not duplicate score.

---

# PHASE 5 — TOURNAMENT MANAGEMENT

## Objective

Make GamePulse a complete tournament platform.

Create `Tournament`.

Fields:

```text
id
name
slug
description
logoUrl
organizer
venue
format
startDate
endDate
status
oversPerInnings
numberOfTeams
createdAt
updatedAt
```

Formats:

```text
T20
T10
ODI
TEST
CUSTOM
```

Statuses:

```text
DRAFT
REGISTRATION_OPEN
UPCOMING
LIVE
COMPLETED
CANCELLED
```

Implement:

- team registration
- team removal
- groups
- fixtures
- automatic fixture generation
- manual fixture creation
- tournament stages
- league
- quarter-final
- semi-final
- final
- third-place match

### Acceptance criteria

Admin can create tournament, add teams, generate fixtures, open fixture as a match, score it, complete it, and automatically update tournament standings.

---

# PHASE 6 — POINTS TABLE + NRR

## Objective

Automatically maintain tournament standings.

Display:

```text
Team
Played
Won
Lost
Tied
No Result
Points
Runs For
Overs For
Runs Against
Overs Against
NRR
```

Configurable points:

```text
winPoints
tiePoints
noResultPoints
lossPoints
```

NRR must use precise backend calculations and handle:

- all-out innings
- completed innings
- reduced overs
- abandoned/no-result matches

Configurable tie-break:

```text
Points
NRR
Wins
Head-to-head
```

### Acceptance criteria

Completing a match automatically updates the table and NRR.

---

# PHASE 7 — ADVANCED MATCH RULES

Implement:

```text
Toss
Toss decision
Playing XI lock
Substitutes
Powerplay
Innings break
Rain delay
Reduced overs
Super over
Abandoned
No Result
Match completion
Result confirmation
```

Design DLS as an extensible rules module. Do not invent an unofficial DLS formula.

Clearly distinguish:

```text
Scheduled
Live
Innings Break
Delayed
Rain Delay
Completed
Abandoned
No Result
```

---

# PHASE 8 — PLAYER CAREER + STATISTICS

## Objective

Create long-term player profiles.

Display:

```text
Matches
Runs
Balls
Average
Strike Rate
Highest Score
50s
100s
4s
6s
Wickets
Bowling Average
Economy
Best Bowling
Catches
Stumpings
Recent Form
```

Statistics must support:

```text
Career
Season
Tournament
Match
Team
```

Leaderboards:

```text
Top Run Scorers
Top Wicket Takers
Best Average
Best Strike Rate
Best Economy
Most Sixes
Most Fours
Best Bowling
Most Catches
```

All statistics must be derived from authoritative match events.

---

# PHASE 9 — ADVANCED ANALYTICS

Implement:

```text
Run-rate graph
Required run rate
Runs per over
Worm graph
Partnership graph
Fall of wickets
Batting phase analysis
Bowling phase analysis
Boundary %
Dot-ball %
Strike rotation
Powerplay analysis
Death-over analysis
```

Prepare extensible structures for:

```text
shot direction
shot location
delivery location
pitch map
```

Only show analytics backed by real data.

---

# PHASE 10 — HIGHLIGHTS + MEDIA

Enhance the existing highlights module.

Support:

```text
WICKET
SIX
FOUR
CATCH
BEST_OVER
BEST_PARTNERSHIP
TURNING_POINT
OTHER
```

Add:

- timestamp
- match association
- player association
- team association
- thumbnail
- description
- save
- share
- admin moderation
- match highlight timeline

---

# PHASE 11 — POLLS + FAN ENGAGEMENT

Implement:

- live polls
- pre-match polls
- post-match polls
- multiple-choice questions
- one-user-one-vote
- expiration
- results
- server-side duplicate-vote prevention

Examples:

```text
Who will win?
Who will score most?
Player of the Match?
Who will take first wicket?
```

---

# PHASE 12 — NOTIFICATIONS

Create a real notification system.

Types:

```text
MATCH_STARTING
MATCH_STARTED
WICKET
MILESTONE
INNINGS_BREAK
MATCH_COMPLETED
POLL
HIGHLIGHT
```

Support:

- in-app notifications
- user preferences
- push notifications for mobile

Use Firebase Cloud Messaging for Android if appropriate.

Do not send every-ball notifications by default.

---

# PHASE 13 — OFFLINE SCORER

## Objective

Scoring must continue when the ground has poor connectivity.

Architecture:

```text
Scorer
 ↓
Local persistent event queue
 ↓
Offline
 ↓
Network returns
 ↓
Sync
 ↓
Backend
```

Each queued event requires:

```text
clientEventId
sequenceNumber
matchId
createdAt
payload
syncStatus
```

Backend sync must be idempotent.

Requirements:

- offline indicator
- persistent queue
- restart-safe queue
- automatic sync
- duplicate protection
- conflict reporting

Never silently overwrite conflicting scores.

---

# PHASE 14 — SHAREABLE MATCH EXPERIENCE

Create public URLs:

```text
/matches/{id}
/matches/{id}/scorecard
/matches/{id}/commentary
/matches/{id}/highlights
/tournaments/{slug}
```

Add:

```text
Copy Link
WhatsApp
Telegram
X
Web Share API
```

Never expose private admin/scorer routes through sharing.

---

# PHASE 15 — PDF + EXPORT

Implement:

```text
Download Scorecard PDF
Download Match Summary
Export Points Table
Export Tournament Statistics
```

PDF should include:

- tournament
- match
- teams
- venue
- date
- score
- batting
- bowling
- extras
- fall of wickets
- result
- player of match

Generate official PDFs server-side.

---

# PHASE 16 — SEARCH + DISCOVERY

Global search:

```text
Players
Teams
Matches
Tournaments
Venues
```

Filters:

```text
Live
Upcoming
Completed
Tournament
Team
Player
Date
```

Use pagination.

---

# PHASE 17 — ADMIN CONTROL CENTER

Admin sections:

```text
Dashboard
Users
Roles
Teams
Players
Tournaments
Matches
Scoring
Highlights
Polls
Streams
Announcements
Settings
Audit Logs
Backups
```

Audit every important action:

```text
actor
action
entity
entityId
oldValue
newValue
timestamp
```

Never log passwords, tokens or secrets.

---

# PHASE 18 — SCORE CORRECTION + AUDIT

Workflow:

```text
Incorrect Ball
 ↓
Edit
 ↓
Show Old Event
 ↓
Change
 ↓
Preview Recalculation
 ↓
Confirm
 ↓
Persist Correction
 ↓
Recalculate
 ↓
Update Scorecard
 ↓
Publish Updated Live State
```

Maintain correction history.

Never silently mutate historical scoring data.

---

# PHASE 19 — AI FEATURES

Only implement AI after deterministic scoring/statistics are reliable.

## AI commentary

Input:

```text
ball event
batter
bowler
runs
wicket
score
over
match situation
```

AI must NEVER determine the official score.

## AI match summary

Generate:

```text
Match summary
Turning point
Top performers
Key partnership
Winning factors
```

## AI player insights

Use actual statistics only.

Never invent facts.

---

# PHASE 20 — MOBILE APP

Recommended technology:

```text
Flutter
```

### Spectator mode

```text
Live matches
Score
Commentary
Scorecard
Highlights
Polls
Notifications
Favorites
```

### Scorer mode

```text
Select match
Playing XI
Scoring
Wickets
Undo
Correction
Offline
Sync
```

### Admin mode

Only expose necessary admin operations.

Reuse the same backend API.

---

# PHASE 21 — UI/UX REFINEMENT

Keep GamePulse's identity but make it production quality.

Implement consistently:

- responsive layout
- mobile navigation
- loading states
- skeleton loaders
- empty states
- error states
- toast notifications
- confirmation dialogs
- form validation
- accessible controls
- keyboard focus
- consistent typography
- spacing
- cards
- status badges

### Live page priority

The first viewport should emphasize:

```text
LIVE
Score
Overs
Wickets
Batsmen
Bowler
Required Run Rate
Recent Balls
Commentary
Poll
Highlights
```

Avoid clutter.

---

# PHASE 22 — PERFORMANCE

### Frontend

Implement where justified:

- route lazy loading
- API caching
- pagination
- image lazy loading
- optimized assets
- controlled global state updates

### Backend

Implement:

- indexes
- pagination
- optimized queries
- DTO projections where useful
- sensible caching
- connection-pool tuning

Never sacrifice score correctness for premature optimization.

---

# PHASE 23 — TESTING

## Backend

Add:

```text
Unit tests
Service tests
Controller tests
Security tests
Integration tests
```

## Frontend

Test:

```text
Authentication
Routes
Scoring
Scoreboard
Scorecard
Polls
Favorites
Permissions
Scorer flows
Admin flows
```

## Mandatory scoring tests

```text
Single
Double
Triple
Four
Six
Wide
No-ball
Bye
Leg-bye
Wicket
Run-out
Over completion
Strike rotation
Innings completion
Undo
Correction
```

---

# PHASE 24 — CI/CD

Create GitHub Actions for:

```text
Frontend build
Backend build
Tests
Lint
Security checks
```

Pull requests must fail if:

- build fails
- tests fail
- lint fails
- secrets are detected

Use:

```text
Development
Staging
Production
```

with repeatable deployment.

---

# PHASE 25 — OBSERVABILITY

Implement:

```text
Health endpoint
Readiness endpoint
Structured logs
Error tracking
Performance metrics
Database health
API latency
```

Health responses should distinguish:

```text
Application healthy
Database unavailable
External dependency unavailable
```

Do not expose sensitive diagnostics.

---

# PHASE 26 — BACKUP + RECOVERY

Implement:

```text
Database backup
Backup verification
Restore procedure
Retention policy
Admin backup status
```

Document:

- backup process
- restore process
- recovery after deployment failure

A backup feature is not complete unless the backup can actually be restored.

---

# PHASE 27 — DOCUMENTATION

Update/create:

```text
README.md
docs/ARCHITECTURE.md
docs/API.md
docs/DATABASE.md
docs/AUTH.md
docs/SCORING_ENGINE.md
docs/TOURNAMENTS.md
docs/DEPLOYMENT.md
docs/TESTING.md
docs/OFFLINE_SCORING.md
docs/ADMIN_GUIDE.md
docs/SCORER_GUIDE.md
```

Remove stale claims such as "backend not implemented" when no longer true.

---

# PHASE 28 — FINAL PRODUCTION READINESS

## Functional verification

Verify:

- registration
- login
- logout
- roles
- teams
- players
- tournaments
- matches
- playing XI
- scoring
- scorecard
- commentary
- highlights
- polls
- notifications
- favorites
- reminders
- statistics
- points table
- NRR
- search
- exports

## Security

Verify:

- no default production JWT secret
- no hard-coded DB password
- HTTPS
- secure CORS
- JWT expiration
- role authorization
- validation
- audit logs
- no sensitive logs

## Reliability

Verify:

- database backup
- restore
- error handling
- reconnect
- offline scoring
- idempotent sync

## Deployment

Verify:

- production frontend URL
- production backend URL
- production database
- environment variables
- CI/CD
- monitoring
- health checks

---

# PRIORITY MATRIX

## P0 — Must do first

1. Source recovery
2. Production configuration
3. Security hardening
4. Correct cricket scoring
5. Score correction/audit
6. Tournament management
7. Points table
8. NRR
9. Real-time synchronization
10. Testing

## P1 — High value

11. Advanced match rules
12. Player career statistics
13. Notifications
14. Offline scoring
15. Search
16. Shareable matches
17. PDF scorecards
18. Admin audit

## P2 — Differentiators

19. Advanced analytics
20. Wagon wheel
21. Pitch map
22. AI commentary
23. AI match summaries
24. Mobile application
25. Advanced community features

---

# NON-NEGOTIABLE RULES

### Rule 1
Do not rebuild unnecessarily.

### Rule 2
Backend is the official source of truth.

### Rule 3
Scoring must be deterministic.

### Rule 4
No fake production data.

### Rule 5
No hard-coded secrets.

### Rule 6
No localhost production builds.

### Rule 7
Database migrations are mandatory.

### Rule 8
Scoring and admin changes must be auditable.

### Rule 9
APIs/events must be idempotent where retries are possible.

### Rule 10
Every spectator page must be mobile responsive.

---

# DEFINITION OF DONE

A phase is complete only when all applicable items pass:

```text
[ ] Existing implementation inspected
[ ] Feature implemented
[ ] API contract synchronized
[ ] Database migration completed
[ ] Frontend integrated
[ ] Backend integrated
[ ] Validation added
[ ] Error handling added
[ ] Authorization checked
[ ] Tests added
[ ] Tests pass
[ ] Build passes
[ ] Manual critical-flow test passes
[ ] Documentation updated
[ ] No existing feature intentionally broken
[ ] Git commit created
```

Do not report completion when only the UI exists.

Every feature must work end-to-end:

```text
UI
 ↓
API
 ↓
Business Logic
 ↓
Database
 ↓
Real-time / Notification where required
 ↓
Tests
```

---

# FINAL PRODUCT TARGET

GamePulse Live should become:

```text
                         GAMEPULSE LIVE
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    SPECTATOR                SCORER                ADMIN
        │                      │                      │
    Live Matches          Live Scoring          Platform Control
    Scoreboard            Ball Events           Users
    Commentary            Scorecard             Teams
    Scorecard             Corrections           Players
    Highlights            Offline Sync          Tournaments
    Polls                  Playing XI            Matches
    Statistics             Match Control         Streams
    Notifications          Audit                 Polls
    Favorites                                      Highlights
        │                                           Reports
        └──────────────────┬────────────────────────┘
                           │
                    Spring Boot API
                           │
          ┌────────────────┼────────────────┐
          │                │                │
        MySQL          WebSocket          Storage
          │                │                │
          └────────────────┼────────────────┘
                           │
                     Analytics / AI
```

## Product positioning

GamePulse Live should remain focused on:

**A complete live cricket scoring and tournament-management platform for colleges, academies, clubs and grassroots cricket.**

Do not turn it into a generic cricket-news portal unless explicitly requested.

---

# MASTER EXECUTION ORDER

Execute in this order:

```text
Phase 1   Source Recovery + Audit
   ↓
Phase 2   Production + Security
   ↓
Phase 3   Cricket Scoring Engine
   ↓
Phase 4   Real-Time
   ↓
Phase 5   Tournament
   ↓
Phase 6   Points Table + NRR
   ↓
Phase 7   Advanced Match Rules
   ↓
Phase 8   Player Statistics
   ↓
Phase 9   Analytics
   ↓
Phase 10  Highlights
   ↓
Phase 11  Polls
   ↓
Phase 12  Notifications
   ↓
Phase 13  Offline Scoring
   ↓
Phase 14  Sharing
   ↓
Phase 15  PDF/Export
   ↓
Phase 16  Search
   ↓
Phase 17  Admin Control
   ↓
Phase 18  Score Audit
   ↓
Phase 19  AI
   ↓
Phase 20  Mobile
   ↓
Phase 21  UI/UX
   ↓
Phase 22  Performance
   ↓
Phase 23  Testing
   ↓
Phase 24  CI/CD
   ↓
Phase 25  Observability
   ↓
Phase 26  Backup/Recovery
   ↓
Phase 27  Documentation
   ↓
Phase 28  Final Production Readiness
```

---

# FINAL IMPLEMENTATION COMMAND

Start with **Phase 1 only**.

Before changing code:

1. Inspect repository.
2. Inspect Git history.
3. Find/recover source files.
4. Determine what is actually implemented.
5. Create a baseline.
6. Report the baseline.
7. Implement Phase 1.
8. Test it.
9. Fix failures.
10. Update documentation.
11. Commit the completed phase.
12. Only then proceed to Phase 2.

Never skip source inspection.

Never overwrite the project blindly.

Never claim success without verification.

The goal is not to make GamePulse merely look complete.

The goal is to make every feature genuinely functional end-to-end.
