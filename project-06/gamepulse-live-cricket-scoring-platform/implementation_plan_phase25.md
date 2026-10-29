# Phase 25 — Observability Implementation Plan

## Official Phase Title
Phase 25 — Observability

## Exact Roadmap Requirements
- Health endpoint (`/api/health`)
- Readiness endpoint (`/api/readiness`)
- Structured logs (MDC request correlation ID, HTTP request duration, method, status, URI)
- Error tracking (Global error counter, 4xx/5xx classification, structured exception logging)
- Performance metrics (`/api/metrics` exposing total requests, error rates, average latency, endpoint latency breakdown)
- Database health (Hikari connection pool stats, DB ping latency, connection state)
- API latency tracking (Intercepting filter recording response times)
- Health responses distinguishing Application Healthy vs Database Unavailable vs External Dependency Unavailable (HTTP 200 vs 503)
- No sensitive diagnostics exposed (passwords, tokens, internal connection strings)

## Existing Implementation Audit
- `HealthController.java`: Has basic `/api/health` and `/api/readiness` returning status maps.
  - Gap: Always returned HTTP 200 even if DB was DOWN.
  - Gap: Lacked DB ping latency & connection pool metrics.
  - Gap: No `/api/metrics` endpoint for latency, request counts, or error tracking.
- `SecurityConfig.java`: Has `/api/health` and `/api/readiness` permitted. Needs `/api/metrics` permitted for monitoring.
- Logging: Default Spring Boot logging without MDC correlation IDs or request execution timing.

## Required File Changes
- **[NEW]** `backend/src/main/java/com/gamepulse/service/PerformanceMetricsService.java`: Thread-safe in-memory metrics aggregation (request counts, latency histograms, error counts, endpoint statistics).
- **[NEW]** `backend/src/main/java/com/gamepulse/filter/PerformanceMetricsFilter.java`: `OncePerRequestFilter` generating `X-Request-ID` correlation ID, setting MDC, measuring API execution duration, updating `PerformanceMetricsService`.
- **[NEW]** `backend/src/main/resources/logback-spring.xml`: Structured logging configuration with MDC support (`[X-Request-ID]`).
- **[MODIFY]** `backend/src/main/java/com/gamepulse/controller/HealthController.java`: Enhanced `/api/health` (HTTP 200 if UP, HTTP 503 if DOWN), `/api/readiness`, and new `/api/metrics` endpoint.
- **[MODIFY]** `backend/src/main/java/com/gamepulse/security/SecurityConfig.java`: Add `/api/metrics` to public permitAll endpoints.
- **[MODIFY]** `backend/src/main/java/com/gamepulse/exception/GlobalExceptionHandler.java`: Record 4xx/5xx exceptions in `PerformanceMetricsService`.
- **[NEW]** `backend/src/test/java/com/gamepulse/controller/HealthControllerTest.java`: Comprehensive tests for health, readiness, metrics, and DB status response codes.
- **[MODIFY]** `frontend/src/pages/AdminDashboard.jsx`: Observability widget/tab displaying live system health, DB latency, JVM memory, API latency, and request stats.

## Verification Plan
1. Backend Tests: `./apache-maven-3.9.12/bin/mvn.cmd clean test`
2. Backend Package: `./apache-maven-3.9.12/bin/mvn.cmd clean package`
3. Frontend Lint & Build: `npm run lint` & `npm run build`
4. Security Audit: Ensure no sensitive details exposed and endpoints are properly configured.
