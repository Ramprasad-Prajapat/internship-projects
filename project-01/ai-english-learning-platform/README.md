# ai-english-learning-platform

An interactive, AI-assisted English learning web application designed for comprehensive daily practice. It delivers structured lesson modules for speaking, writing, reading, vocabulary, and grammar, coupled with automated mistake tracking and personal learning streak analytics.

## Tech Stack
- Frontend: React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Axios, React Hook Form, Zod, Lucide React
- Backend: Java 21, Spring Boot 3.3.2, Spring Security 6, JJWT (io.jsonwebtoken 0.12.6), Spring Data JPA
- Database: H2 in-memory DB (default development) / MySQL 8.0 (production)
- Build Tools: Maven 3.9, Node.js (npm)

## Features
- Structured daily lesson plans covering reading, writing, and spoken English
- Interactive practice centers for essay writing, pronunciation, and preposition drills
- Personal digital AI notebook for saving lesson notes, vocabulary, and imports
- Automated mistake tracker and historical progress reporting dashboard
- Role-based security (Student and Admin) with stateless JWT authentication and BCrypt password encoding
- Mock mode fallback for offline frontend testing and rapid prototyping

## Folder Structure
`
ai-english-learning-platform/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/main/java/com/aienglish/
â”‚   â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ controller/
â”‚   â”‚   â”œâ”€â”€ model/
â”‚   â”‚   â”œâ”€â”€ repository/
â”‚   â”‚   â”œâ”€â”€ security/
â”‚   â”‚   â””â”€â”€ service/
â”‚   â”œâ”€â”€ src/main/resources/
â”‚   â””â”€â”€ pom.xml
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ types/
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ vite.config.ts
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
   Backend starts on http://localhost:8080.
3. Frontend Setup & Run:
   `ash
   cd frontend
   npm install
   npm run dev
   `
   Frontend runs on http://localhost:5173.

## Environment Variables / Config
- SERVER_PORT: Backend server HTTP port (default: 8080)
- DB_URL: JDBC database connection string (default: H2 in-memory)
- DB_USERNAME: Database username
- DB_PASSWORD: Database password
- JWT_SECRET: Secret key for JWT token signing
- VITE_API_MODE: Frontend data source mode (mock or ackend)
- VITE_API_BASE_URL: Base URL of the backend API
