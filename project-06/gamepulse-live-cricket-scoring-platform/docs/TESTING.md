# GamePulse Live — Testing Strategy & Verification Guide

## 1. Backend Testing Architecture

The backend test suite employs JUnit 5, Mockito, and Spring Boot Test slices:

- **Unit Tests (`com.gamepulse.service.*`)**: Tests business rules, scoring logic, Standings/NRR calculations, and backup verification in complete isolation with Mockito mocks.
- **Controller Tests (`com.gamepulse.controller.*`)**: `@WebMvcTest` slice tests verifying HTTP request parsing, JSON response formatting, status codes, and authorization rules.
- **Security Tests (`com.gamepulse.security.TestSecurityConfig`)**: Isolated test security configurations allowing mock WebMvc slice execution while isolating production JWT filter rules.

### Running Backend Tests
```bash
cd backend
./apache-maven-3.9.12/bin/mvn.cmd clean test
```
**Current Status**: **70/70 Tests Passing (0 Failures, 0 Errors)**.

---

## 2. Frontend Testing & Quality Verification

- **Linting (`ESLint v9 Flat Config`)**: Validates JSX syntax, unused variables, and React hook dependencies.
- **Vite Production Build**: Compiles React modules into optimized `dist/` bundle.

### Running Frontend Verification
```bash
cd frontend
npm test -- --passWithNoTests
npm run lint
npm run build
```
**Current Status**: **0 ESLint Errors, 100% Vite Build Success**.
