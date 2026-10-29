# Phase 6 – Points Table + NRR Implementation Plan

## Goal Description
Implement the tournament standings (points table) with full Net Run Rate (NRR) calculations, configurable point values, and real‑time updates. This includes backend data model, services, REST API, WebSocket event, database migration, unit/integration tests, and a responsive frontend component.

## User Review Required
> [!IMPORTANT]
> The plan introduces new database tables and config properties. No existing functionality will be altered, but the new entities will be linked to existing `Tournament` and `Match` data.

## Open Questions
> [!WARNING]
> - **Points configuration source**: Should point values be stored in `application.yml` under `gamepulse.points` or a dedicated `PointsConfig` entity?
> - **NRR precision**: Desired decimal precision (e.g., 3 places) for NRR display?
> - **Tie‑break order**: The master plan lists Points → NRR → Wins → Head‑to‑Head. Confirm this order or provide overrides.

## Proposed Changes
---
### Backend Entity & Migration
- **[NEW]** `TournamentTeamStatistics.java` – stores cumulative stats per team per tournament (played, won, lost, tied, noResult, points, runsFor, oversFor, runsAgainst, oversAgainst, nrr).
- **[NEW]** Flyway migration `VXX__create_tournament_team_statistics.sql` to create the table with appropriate foreign keys to `tournament` and `team`.

### Repository
- **[NEW]** `TournamentTeamStatisticsRepository.java` extending `JpaRepository<TournamentTeamStatistics, Long>` with a method to find stats by tournament.

### Configuration
- **[NEW]** `PointsConfig.java` – `@ConfigurationProperties(prefix="gamepulse.points")` exposing `winPoints`, `tiePoints`, `noResultPoints`, `lossPoints`.
- Add default values to `application.yml`.

### Service Layer
- **[NEW]** `StandingsService.java`
  - `recalculateStandings(Long tournamentId)` – iterates over completed matches, aggregates runs/overs, computes points using `PointsConfig`, calculates NRR:
    ```java
    double oversFor = totalBallsFor / 6.0;
    double oversAgainst = totalBallsAgainst / 6.0;
    double nrr = (runsFor / oversFor) - (runsAgainst / oversAgainst);
    ```
    Handles edge cases (zero overs, all‑out, reduced‑overs).
  - `getStandings(Long tournamentId)` returns `List<StandingsDTO>` sorted by points, NRR, wins, head‑to‑head.

### Integration with Match Completion
- Update `MatchService.completeMatch()` (or the block where match status is set to `COMPLETED`) to call `standingsService.recalculateStandings(tournamentId)`.
- After recalculation, publish WebSocket topic `STANDINGS_UPDATED` via existing `MatchEventPublisher`.

### Controller
- **[NEW]** `StandingsController.java`
  - `@GetMapping("/api/tournaments/{tournamentId}/standings")` returns list of `StandingsDTO`.
  - Secured with role `ADMIN`/`SCORER`/`VIEWER` as needed.

### DTO
- Already present (`StandingsDTO`). No changes needed.

### Frontend
- Add `src/pages/StandingsPage.jsx` (React component) that fetches standings via Axios and subscribes to STOMP topic `STANDINGS_UPDATED` to refresh data.
- Use a premium table UI with gradient rows, hover effects, and responsive layout.
- Add navigation link in the sidebar.

### Tests
- **Backend unit tests** for `StandingsService` covering:
  - Standard win/loss/tie/no‑result point allocation.
  - NRR calculations for normal, all‑out, reduced‑overs, and zero‑overs scenarios.
- **Integration test**: simulate completing a match and verify standings API returns updated values.
- **Frontend tests** (React Testing Library) for `StandingsPage` rendering and WebSocket update handling.

### Documentation
- Update `docs/IMPLEMENTATION_STATUS.md` – mark Phase 6 as **IMPLEMENTED** after verification.
- Add a brief section in `docs/API.md` describing the new `/tournaments/{id}/standings` endpoint.
- Add config explanation in `docs/CONFIGURATION.md` for point values.

## Verification Plan
### Automated Tests
- Run `mvn test` – all existing tests must pass plus new `StandingsServiceTest`.
- Run `npm test` for frontend.

### Manual Verification
- Use the UI to navigate to the Standings page after completing a match; verify points and NRR update instantly.
- Check the database table for correct aggregated values.
- Validate WebSocket messages are received (inspect network tab).

---
*End of implementation plan.*
