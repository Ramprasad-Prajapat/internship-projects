# Feature Checklist — AI English Learning Website

Status legend:
- `Completed`: Confirmed present and working in code.
- `Partially completed`: Implemented partially or with local limitations.
- `Not implemented yet`: Not present in current code.
- `Not confirmed from current code`: Unable to verify in source audit.
- `Pending future phase`: Planned for subsequent project phases.

---

## 1. Frontend

- [x] **React + Vite + TypeScript Architecture**: `Completed`
- [x] **Tailwind CSS & Responsive Layout**: `Completed`
- [x] **Form Handling & Zod Validation**: `Completed`
- [x] **Axios HTTP Client & Interceptors**: `Completed`
- [x] **Offline / Mock Fallback Engine**: `Completed`
- [x] **React Router DOM v6 Routing**: `Completed`

---

## 2. Backend

- [x] **Java 21 + Spring Boot 3.3.2 REST API**: `Completed`
- [x] **Spring Security JWT Authentication Filter**: `Completed`
- [x] **BCrypt Password Encoder**: `Completed`
- [x] **Spring Data JPA Repositories**: `Completed`
- [x] **REST Controllers (Auth, Lessons, Admin, Notebook, Mistakes, Progress, Homework, SelfCheck, Practice, Reports)**: `Completed`
- [x] **Startup Data Seeder (`DataSeeder.java`)**: `Completed`

---

## 3. Database (`ai_english`)

- [x] **Database Schema Name (`ai_english`)**: `Completed`
- [x] **H2 In-Memory DB Support**: `Completed`
- [x] **MySQL Production Config**: `Completed`
- [x] **JPA Entities (`User`, `LessonDay`, `LessonSection`, `DailyProgress`, `SectionProgress`, `UserNote`, `UserMistake`, `HomeworkSubmission`, `PracticeHistory`, `SelfCheckSubmission`)**: `Completed`
- [x] **Automatic Schema Generation (`ddl-auto: update`)**: `Completed`
- [x] **Default Seeding (`admin@example.com` & `demo@example.com`)**: `Completed`

---

## 4. Auth

- [x] **User Registration (`POST /api/auth/register`)**: `Completed`
- [x] **User Login (`POST /api/auth/login`)**: `Completed`
- [x] **User Profile Fetch (`GET /api/auth/me`)**: `Completed`
- [x] **User Profile Update (`PUT /api/profile`)**: `Completed`
- [x] **React Protected Route Component**: `Completed`
- [x] **Role-Based Access Control (`ROLE_USER` / `ROLE_ADMIN`)**: `Completed`

---

## 5. Learner

- [x] **Learner Dashboard (`/dashboard`)**: `Completed`
- [x] **Syllabus & Daily Lessons (`/daily-lessons`)**: `Completed`
- [x] **Multi-Section Day View (`/daily-lessons/day/:dayNumber/section/:sectionId`)**: `Completed`
- [x] **Practice Center (`/practice-center`)**: `Completed`
- [x] **AI Notebook Management (`/ai-notebook`)**: `Completed`
- [x] **Mistake Logger & Fix Tracker (`/mistakes`)**: `Completed`
- [x] **User Profile & Setup (`/profile`, `/english-setup`)**: `Completed`
- [x] **English Assessment Quiz (`/english-assessment`)**: `Completed`

---

## 6. Admin

- [x] **Admin Dashboard UI (`/admin/dashboard`)**: `Completed`
- [x] **Admin Lesson Management (`/admin/day-lessons`)**: `Completed`
- [x] **Admin Paste Day Content (`/admin/day-lessons/:dayNumber/paste`)**: `Completed`
- [x] **Admin Section Editor (`/admin/sections/:sectionId/edit`)**: `Completed`
- [x] **Backend Admin API Protection (`/api/admin/**` -> `hasRole('ADMIN')`)**: `Completed`

---

## 7. AI

- [x] **Rule-based Mock Question & Answer Evaluation**: `Completed`
- [x] **Web Speech API Speech Recognition & Speech Synthesis**: `Completed`
- [ ] **Cloud LLM API Integration (Gemini / OpenAI API keys)**: `Not implemented yet`
- [ ] **Real-Time Streamed LLM Conversation**: `Pending future phase`

---

## 8. Copy-Paste Lesson Import

- [x] **Learner Personal Text Importer (`/personal-import`)**: `Completed`
- [x] **Extension Inbox Importer (`/extension-inbox`)**: `Completed`
- [x] **Admin Day Lesson Paste Importer (`/admin/day-lessons/:dayNumber/paste`)**: `Completed`

---

## 9. Reports / Progress / History

- [x] **Daily & Section Progress API (`/api/progress`)**: `Completed`
- [x] **Reports Summary API (`/api/report/summary`)**: `Completed`
- [x] **Weekly Breakdown API (`/api/report/weekly`)**: `Completed`
- [x] **Mistakes Breakdown API (`/api/report/mistakes`)**: `Completed`
- [x] **Practice & Activity History (`/api/history`, `/api/practice/history`)**: `Completed`

---

## 10. Pre-Final Readiness

- [x] **Full Decoupled API Integration**: `Completed`
- [x] **Frontend & Backend Compilation**: `Completed`
- [x] **Comprehensive Documentation Suite**: `Completed`
- [ ] **Cloud Production Deployment**: `Pending future phase`
