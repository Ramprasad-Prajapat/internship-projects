# GamePulse Live — Architecture Specification

## Overview
GamePulse Live is built as a high-throughput, real-time sports scoring and statistics platform. It utilizes a decoupled client-server architecture with REST APIs for state synchronization and WebSockets for low-latency live events.

---

## 1. System Components

### 1.1 Backend Core (Spring Boot 3.2 / Java 21)
- **Controller Layer (`com.gamepulse.controller`)**: Exposes REST endpoints for Auth, Match, Tournament, Player, Team, Search, Analytics, Backup, Health, and Admin features.
- **Service Layer (`com.gamepulse.service`)**: Encapsulates core business rules (Scoring engine calculations, NRR updates, Tournament fixture creation, Performance metrics tracking, Backup checksum generation).
- **Repository Layer (`com.gamepulse.repository`)**: Spring Data JPA interfaces interfacing with relational storage.
- **Filter Pipeline (`com.gamepulse.filter`)**:
  - `JwtAuthenticationFilter`: Stateless Bearer token verification.
  - `PerformanceMetricsFilter`: Request duration tracking and MDC `X-Request-ID` correlation ID injection.
- **Security (`com.gamepulse.security`)**: Spring Security configuration guarding endpoints via `@EnableMethodSecurity` and RBAC roles (`USER`, `SCORER`, `ADMIN`).

### 1.2 Frontend Web Application (React 18 / Vite 5)
- **State Management & Services (`frontend/src/services`)**: Modular API services (`api.js`, `matchService.js`, `tournamentService.js`, `matchCache.js`).
- **Realtime Listener**: STOMP client subscribing to `/topic/match/{id}` for instant ball-by-ball UI state re-rendering.
- **Design System**: Tailored Glassmorphic Tailwind CSS theme with responsive drawer navigation, custom cards, skeleton loaders, and interactive toast feedback.

---

## 2. Request Processing & Security Pipeline

```text
HTTP Request ---> [PerformanceMetricsFilter] (Inject X-Request-ID into MDC)
                      |
                      v
             [JwtAuthenticationFilter] (Validate Bearer Token -> SecurityContext)
                      |
                      v
             [Spring Security Filter Chain] (Check Endpoint Authorization)
                      |
                      v
             [Controller Layer] (Validate Request Body & Parameters)
                      |
                      v
             [Service Layer] (@Transactional Business Execution)
                      |
                      v
             [WebSocket Publisher] (Broadcast Score Event to STOMP Topic)
                      |
                      v
             [HTTP Response] (With X-Request-ID Header)
```

---

## 3. Realtime Event Architecture

1. Scorer posts delivery payload to `POST /api/matches/{id}/score`.
2. `ScoringService` calculates updated innings totals, over counts, wickets, partnerships, and required run rate.
3. `ScoringService` publishes event to `/topic/match/{id}` via `SimpMessagingTemplate`.
4. Connected fan clients listening on `/topic/match/{id}` automatically update scoreboards without page refresh.

---

## 4. Fault Tolerance & Observability
- **Correlation Tracking**: Every log line includes `[X-Request-ID=...]` via Logback MDC.
- **Health Checks**: `/api/health` evaluates database ping latency and returns HTTP 503 if critical storage is disconnected.
- **Backups**: Standard SQL dump backups with SHA-256 cryptographic integrity verification.
