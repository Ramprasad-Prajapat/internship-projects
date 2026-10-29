# gamepulse-live-cricket-scoring-platform

An enterprise-grade real-time cricket match management, tournament scheduling, ball-by-ball scoring engine, and fan analytics platform featuring live WebSocket event broadcasting and role-based security.

## Tech Stack
- Backend: Java 21, Spring Boot 3.2, Spring Data JPA, Spring Security, Spring WebSocket (STOMP), Flyway
- Frontend: React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios, StompJS
- Database: H2 in-memory (default) / MySQL 8.0
- Observability: Logback MDC Structured Logging (X-Request-ID), HikariCP Connection Monitoring

## Features
- Real-time ball-by-ball delivery recording with overs tracking, extras, dismissals, and partnership stats
- Instant score updates pushed to connected clients via Spring WebSocket (STOMP / SockJS)
- Tournament and league management supporting Round Robin and Knockout fixtures with automated Net Run Rate (NRR) standings
- Interactive match analytics including run rate worm charts, progression graphs, and wagon wheel visualizations
- Role-based security (Admin, Scorer, User) with stateless JWT authentication
- Offline scorer capability with IndexedDB storage and automatic background sync upon reconnection
- System observability endpoints (/api/health, /api/readiness, /api/metrics) for containerized deployments

## Folder Structure
`
gamepulse-live-cricket-scoring-platform/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/main/java/com/gamepulse/
â”‚   â”œâ”€â”€ src/main/resources/
â”‚   â””â”€â”€ pom.xml
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ vite.config.js
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Java 21+, Maven 3.9+, Node.js 18+
2. Setup & Backend Run:
   `ash
   cd backend
   mvn clean install
   mvn spring-boot:run
   `
   Backend listens on http://localhost:8080.
3. Frontend Setup & Run:
   `ash
   cd frontend
   npm install
   npm run dev
   `
   Frontend runs on http://localhost:5173.

## Environment Variables / Config
- PORT: Backend HTTP port (default: 8080)
- DB_URL: JDBC database URL
- DB_USERNAME: Database username
- DB_PASSWORD: Database password
- JWT_SECRET: Secret key for JWT signing
- CORS_ALLOWED_ORIGINS: Comma-separated list of allowed origins
- VITE_API_BASE_URL: Frontend backend API URL
- VITE_WS_BASE_URL: Frontend WebSocket endpoint
