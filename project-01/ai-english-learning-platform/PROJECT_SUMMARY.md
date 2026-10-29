# Project Summary — AI English Learning Website

---

## 1. Executive Summary & Stable Status

The **AI English Learning Website** is in a stable, integrated state. 
- The **Backend** is built on Java 21 Spring Boot 3.3.2 with Spring Security, JWT authentication, and Spring Data JPA.
- The **Frontend** is a React + Vite + TypeScript single-page application with a complete learner flow, practice tools, notebook, mistake logger, and admin workspace.
- The **Integration** between Frontend and Backend is active via `VITE_API_MODE=backend` pointing to `http://localhost:8080/api`, equipped with authorization header interceptors and safe error-degradation mechanisms.

---

## 2. Completed Frontend Modules

1. **Authentication Flow (`/login`, `/register`, `/forgot-password`)**:
   - Includes form validation with Zod / React Hook Form.
   - Demo login buttons for instant learner (`demo@example.com`) and admin (`admin@example.com`) sign-in.
   - Preserves JWT token and user profile in `localStorage`.
2. **Learner Dashboard (`/dashboard`)**:
   - Displays welcome banner, user level, streak counter, daily goal progress bar, suggested next lesson section, quick practice tiles, and pending mistakes count.
3. **Daily Lessons & Syllabus (`/daily-lessons`, `/daily-lessons/day/:dayNumber`, `/daily-lessons/day/:dayNumber/section/:sectionId`)**:
   - Overview of all available course days.
   - Day detail page splitting content into structured sections (Vocabulary, Grammar, Speaking, Practice).
   - Interactive Section Detail View with audio/listening prompts, checklist trackers, and note-saving tools.
4. **Practice Center & Drill Rooms (`/practice-center`, `/speaking`, `/writing`, `/reading`, `/vocabulary`, `/grammar`, `/prepositions`)**:
   - Dedicated modules for skill-specific drills.
   - Speech-to-text / Text-to-speech interaction via Web Speech API in browser.
   - Interactive exercise submission and feedback display.
5. **AI Notebook (`/ai-notebook`)**:
   - Create, edit, tag, filter, and delete personal study notes and imports.
   - Connected to backend `/api/notebook` REST endpoints.
6. **Mistake Tracker (`/mistakes`)**:
   - Log wrong sentences, view explanation and corrections, mark mistakes as fixed, or delete them.
   - Connected to backend `/api/mistakes` REST endpoints.
7. **Homework & Self Check (`/homework`, `/english-assessment`)**:
   - Form submission views for homework exercises and level assessment diagnostic tests.
   - Connected to backend `/api/homework` and `/api/self-check` REST endpoints.
8. **Reports & Progress (`/reports`, `/progress`, `/history`)**:
   - Visual summary of overall score, completed lessons, streak, and recent activity log.
   - Connected to backend `/api/report/summary`, `/api/report/weekly`, `/api/report/mistakes`, and `/api/progress` REST endpoints.
9. **User Profile & Setup (`/profile`, `/english-setup`)**:
   - Profile settings management (name, learning goals, daily goal minutes, level preference).
   - Profile update API connection to `/api/profile`.

---

## 3. Completed Backend Modules

1. **Security & Authentication (`AuthController`, `JwtAuthenticationFilter`, `SecurityConfig`, `JwtService`)**:
   - Stateless JWT authentication filter.
   - Password encryption with BCrypt.
   - Role-based authorization (`ROLE_USER` and `ROLE_ADMIN`).
   - Registration (`POST /api/auth/register`), Login (`POST /api/auth/login`), Profile fetch (`GET /api/auth/me`), and Profile update (`PUT /api/profile`).
2. **System Health (`HealthController`)**:
   - Public health check endpoint (`GET /api/health`).
3. **Lessons Management (`LessonController`, `AdminLessonController`)**:
   - Public lesson listings and day details (`GET /api/lessons`, `GET /api/lessons/day/{dayNumber}`).
   - Admin protected endpoints to create/update day content (`POST /api/admin/lessons/day/{dayNumber}`), delete days (`DELETE /api/admin/lessons/day/{dayNumber}`), and manage sections.
4. **User Notebook (`NotebookController`)**:
   - Full CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE` under `/api/notebook` and `/api/notes`) with user ownership verification.
5. **Mistakes Management (`MistakeController`)**:
   - Endpoints to retrieve (`GET`), save (`POST`), mark fixed (`PATCH`/`PUT`), and remove (`DELETE`) user mistakes under `/api/mistakes`.
6. **Progress Tracking (`ProgressController`)**:
   - Overall progress retrieval, day progress, and section progress updates (`/api/progress`, `/api/progress/day/{dayNumber}`, `/api/progress/section/{sectionId}`).
7. **Homework Submissions (`HomeworkController`)**:
   - Retrieve, submit, and auto-evaluate homework submissions (`/api/homework/{sourceId}`, `/api/homework/{sourceId}/check`, `/api/homework/submissions`).
8. **Self Check Submissions (`SelfCheckController`)**:
   - Record and view assessment test results (`/api/self-check/submissions`).
9. **Practice History (`PracticeController`)**:
   - Save practice attempts and list historical sessions (`/api/practice/check`, `/api/practice/history`).
10. **Reports & Analytics (`ReportController`)**:
    - Aggregated learner reports (`/api/report/summary`, `/api/report/weekly`, `/api/report/mistakes`, `/api/history`).

---

## 4. Completed Database Modules (`ai_english`)

Database entities created via Spring Data JPA (`hibernate.ddl-auto: update`):
- `User`: Stored fields (`id`, `name`, `email`, `password`, `role`, `level`, `createdAt`).
- `LessonDay` & `LessonSection`: Stores daily course structure, raw text, and section breakdowns.
- `DailyProgress` & `SectionProgress`: Maps completed days and section scores per user.
- `UserNote`: Stores user notes, source types, titles, tags, and original content per user.
- `UserMistake`: Stores original text, corrected text, explanation, category, fixed status per user.
- `HomeworkSubmission`: Stores submission content, status, score, and feedback per user.
- `PracticeHistory`: Log of practice sessions, activity types, scores, and details per user.
- `SelfCheckSubmission`: Diagnostic test results and scores per user.
- `DataSeeder`: Startup component that seeds `admin@example.com` (ADMIN), `demo@example.com` (USER), and Day 1 lesson data.

---

## 5. Auth Summary

- **Authentication Protocol**: JWT (JSON Web Token) with Bearer token header (`Authorization: Bearer <token>`).
- **Storage**: Client stores token in `localStorage.getItem("token")` and user JSON object in `localStorage.getItem("user")`.
- **Interceptors**: `apiClient.ts` automatically attaches the token header to all outbound HTTP requests.
- **Protected Routes**: React `ProtectedRoute` component guards all learner routes (`/dashboard`, `/daily-lessons`, etc.) and redirects unauthenticated users to `/login`.
- **Admin Protection**: Spring Security enforces `hasRole('ADMIN')` on all `/api/admin/**` endpoints.

---

## 6. Learner Summary

- **User Journey**:
  1. Login as `demo@example.com` / `password123`.
  2. Access Dashboard showing personal streak and syllabus recommendation.
  3. Navigate to Daily Lessons, select a day, and study sections.
  4. Perform interactive speech/writing exercises in the Practice Center.
  5. Save notes to AI Notebook or log mistakes to Mistake Tracker.
  6. Review performance in Reports.

---

## 7. Admin Status

- **Admin Dashboard UI**: `/admin/dashboard`, `/admin/day-lessons`, `/admin/day-lessons/:dayNumber/paste`, `/admin/settings`.
- **Admin Backend Integration**: Connected to `/api/admin/lessons/day/{dayNumber}` and `/api/admin/lessons/sections/{sectionId}` endpoints.
- **Access Control**: Users without `ROLE_ADMIN` receive `403 Forbidden` if attempting to call `/api/admin/**`.

---

## 8. AI Status

- **Current Implementation**:
  - Rule-based mock practice generator in frontend services (`aiPracticeService.ts`).
  - Web Speech API (SpeechRecognition & SpeechSynthesis) for voice drills.
  - Mock evaluation engines for instant scoring and simple grammar rule tips.
- **Pending Implementation**:
  - Real cloud LLM API integration (e.g., Google Gemini API or OpenAI API) for dynamic natural language conversation and AI writing evaluation is *not implemented yet*.

---

## 9. Copy-Paste Import Status

- **Learner Text Import (`/personal-import`, `/personal-import/preview`)**:
  - Allows learners to paste custom English text, extract vocabulary/grammar, and save as personal notes in AI Notebook.
- **Admin Lesson Importer (`/admin/day-lessons/:dayNumber/paste`)**:
  - Allows admins to paste raw lesson text and save it to the backend via `/api/admin/lessons/day/{dayNumber}`.

---

## 10. Reports, Progress & History Status

- **Progress**: Tracked in database via `DailyProgress` and `SectionProgress` entities.
- **Reports**: Backend `ReportController` aggregates completed lessons, mistakes fixed, total mistakes, and streak.
- **History**: Backend `PracticeHistoryRepository` stores past practice activity; frontend displays recent activities.

---

## 11. Pending Improvements

1. Real LLM Cloud AI integration (Gemini / OpenAI API) for live conversational feedback.
2. Direct DB entity mapping for specific client-side checklists currently held in local storage.
3. Expanded automated test suite (JUnit / Integration tests) for backend controllers.
