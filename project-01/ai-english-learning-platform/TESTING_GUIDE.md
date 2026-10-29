# Testing & QA Guide — AI English Learning Website

This guide provides testing procedures, commands, authorization checks, and QA checklists for manual and automated verification.

---

## 1. Development & Build Commands (Documentation Only)

*(Note: Do not run build/dev commands during documentation-only audit phases).*

### Backend (`backend/`)
- **Compile Java Code**:
  ```bash
  cd backend
  ./mvnw.cmd clean compile
  ```
- **Run Backend Server (Port 8080)**:
  ```bash
  cd backend
  ./mvnw.cmd spring-boot:run
  ```
- **Package executable JAR**:
  ```bash
  cd backend
  ./mvnw.cmd clean package
  ```

### Frontend (`frontend/`)
- **Install NPM Dependencies**:
  ```bash
  cd frontend
  npm install
  ```
- **Start Vite Dev Server (Port 5173)**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Type-check and Build Production Bundle**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 2. Database Setup Notes

- **Database Name**: `ai_english`
- **Default Strategy**: In-Memory H2 DB (`jdbc:h2:mem:ai_english`) for zero-setup local development. Schema is auto-generated on startup by Hibernate (`hibernate.ddl-auto: update`).
- **Persistence Strategy (MySQL)**: Set `DB_URL=jdbc:mysql://localhost:3306/ai_english?useSSL=false&serverTimezone=UTC`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DRIVER=com.mysql.cj.jdbc.Driver` in environment variables or `application.yml`.
- **Automatic Seed Data**: Managed by `DataSeeder.java` on application startup.

---

## 3. Core API Verification Steps

### Step 3.1: Health API Test
- **Request**: `GET http://localhost:8080/api/health`
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "service": "ai-english-learning-backend",
    "status": "UP",
    "database": "ai_english",
    "timestamp": 1782987723996
  }
  ```

### Step 3.2: Demo Learner Authentication Test
- **Request**: `POST http://localhost:8080/api/auth/login`
  ```json
  {
    "email": "demo@example.com",
    "password": "password123"
  }
  ```
- **Expected Status**: `200 OK`
- **Expected Output**: Returns JWT string and user object (`role: "USER"`).

### Step 3.3: Admin Authentication Test
- **Request**: `POST http://localhost:8080/api/auth/login`
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Expected Status**: `200 OK`
- **Expected Output**: Returns JWT string and user object (`role: "ADMIN"`).

---

## 4. Authorization & Security Checks Matrix

| Test Case | Request | Authorization Header | Expected Status | Notes |
|-----------|---------|----------------------|-----------------|-------|
| **No Token** | `GET /api/auth/me` | None | `401 Unauthorized` | Protected endpoint blocks request |
| **Invalid Token** | `GET /api/notebook` | `Bearer invalid.jwt.token` | `401 Unauthorized` | JWT filter fails signature validation |
| **USER Token on Learner API** | `GET /api/notebook` | `Bearer <USER_JWT>` | `200 OK` | User accesses own notes |
| **USER Token on Admin API** | `POST /api/admin/lessons/day/1` | `Bearer <USER_JWT>` | `403 Forbidden` | Learner token denied for admin route |
| **ADMIN Token on Admin API** | `POST /api/admin/lessons/day/1` | `Bearer <ADMIN_JWT>` | `200 OK` | Admin token permits management action |

---

## 5. Error & Edge Case Verification

1. **Invalid ID Format**: Passing string UUID or invalid numeric ID to `/api/notebook/{id}` or `/api/mistakes/{id}` should fail gracefully or return empty response without crashing server.
2. **Empty Payload**: Sending empty JSON `{}` to `/api/auth/login` returns `401 Unauthorized` (`Invalid email or password`).
3. **Empty Data State**: Initial launch with empty notebook returns `[]` (200 OK), rendering a clean empty state in UI instead of crashing.
4. **Backend Unavailable**: When backend is offline, `apiClient.ts` logs a warning and gracefully falls back to mock storage mode or safe error UI.
5. **Browser Refresh After Login**: Token in `localStorage` persists authentication state; user remains logged in after hard browser refresh (`F5`).

---

## 6. Learner QA Checklist

- [ ] **Login Flow**: Sign in using Demo User button (`demo@example.com`). Token stored in `localStorage`.
- [ ] **Dashboard Load**: Welcome card, calculated level, streak counter, and daily goal progress display accurately.
- [ ] **Syllabus / Daily Lessons**: View list of days, open Day 1 detail, view Vocabulary, Grammar, and Speaking sections.
- [ ] **Section Detail View**: Audio/listening buttons function without errors. Notes can be typed and saved.
- [ ] **AI Notebook**: Create a new note, filter by tag, edit content, delete note. Verified sync with backend `/api/notebook`.
- [ ] **Mistake Tracker**: Add a new mistake, click "Mark as Fixed", delete mistake. Verified sync with `/api/mistakes`.
- [ ] **Practice Center**: Open Speaking / Writing / Preposition room. Speech recognition / Synthesis triggers Web Speech API.
- [ ] **Reports Page**: Completed lessons count, mistakes count, and recent activity timeline render accurately.
- [ ] **Profile**: Edit user level or daily target minutes; verify persistence via `/api/profile`.
- [ ] **Logout**: Click logout button. `localStorage` tokens cleared and user redirected to `/login`.

---

## 7. Admin QA Checklist

- [ ] **Admin Login**: Sign in using Admin button (`admin@example.com`). Redirected to `/admin/dashboard`.
- [ ] **Admin Day Lessons List**: View list of all structured day lessons.
- [ ] **Paste Lesson Importer**: Paste raw text into `/admin/day-lessons/:dayNumber/paste` and save.
- [ ] **Edit Section View**: Modify section heading or content and save updates.
- [ ] **Admin Settings**: View system configuration options.

---

## 8. Common Issues & Troubleshooting

- **Cors Policy Error**: Ensure `SecurityConfig.java` allows origins `http://localhost:5173` or origin pattern `*`.
- **401 Unauthorized on API call**: Check if token expired (`expiration: 86400000` ms = 24 hours). Re-login via frontend.
- **Port 8080 Conflict**: If port 8080 is occupied by another process, stop the process or configure `server.port` in `application.yml`.
- **Port 5173 Conflict**: Vite will auto-assign next available port (e.g. `5174`). Check console output when running `npm run dev`.
