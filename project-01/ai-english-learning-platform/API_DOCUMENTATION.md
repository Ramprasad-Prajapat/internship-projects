# API Documentation — AI English Learning Backend REST API

Base URL: `http://localhost:8080/api`

All endpoints accept and return JSON (`Content-Type: application/json`).
Protected endpoints require an `Authorization` header in the format: `Bearer <JWT_TOKEN>`.

---

## 1. Auth & Profile APIs (`AuthController`)

### `POST /api/auth/register`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Registers a new user account.
- **Request Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "level": "BEGINNER"
    }
  }
  ```
- **Error Response (400 Bad Request)**: `{"error": "Email is already registered"}`

---

### `POST /api/auth/login`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Authenticates user credentials and returns a JWT token.
- **Request Payload**:
  ```json
  {
    "email": "demo@example.com",
    "password": "password123"
  }
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 2,
      "name": "Demo Learner",
      "email": "demo@example.com",
      "role": "USER",
      "level": "BEGINNER"
    }
  }
  ```
- **Error Response (401 Unauthorized)**: `{"error": "Invalid email or password"}`

---

### `GET /api/auth/me`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user (`USER` or `ADMIN`)
- **Purpose**: Returns the current authenticated user's profile details.
- **Response Shape (200 OK)**:
  ```json
  {
    "id": 2,
    "name": "Demo Learner",
    "email": "demo@example.com",
    "role": "USER",
    "level": "BEGINNER"
  }
  ```

---

### `PUT /api/profile`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Updates profile details (e.g. name, learning level).
- **Request Payload**:
  ```json
  {
    "name": "Updated Name",
    "level": "INTERMEDIATE"
  }
  ```
- **Response Shape (200 OK)**: Updated user object.

---

### `POST /api/auth/change-password`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Changes the password of the currently authenticated user.
- **Request Payload**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response Shape (200 OK)**: `{"message": "Password changed successfully"}`
- **Error Response (400 Bad Request)**: `{"error": "Current password is incorrect"}`

---

### `POST /api/auth/forgot-password`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Requests a password reset link. Returns a generic message to prevent user enumeration.
- **Request Payload**:
  ```json
  {
    "email": "demo@example.com"
  }
  ```
- **Response Shape (200 OK)**: `{"message": "If an account with that email exists, a password reset link has been sent."}`

---

### `POST /api/auth/reset-password`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Resets the password using a reset token.
- **Request Payload**:
  ```json
  {
    "token": "reset-token-value",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response Shape (200 OK)**: `{"message": "Password has been reset successfully"}`
- **Error Response (400 Bad Request)**: `{"error": "Invalid or expired token"}`

---

## 2. Health API (`HealthController`)

### `GET /api/health`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Service health check and database connection verification.
- **Response Shape (200 OK)**:
  ```json
  {
    "service": "ai-english-learning-backend",
    "status": "UP",
    "database": "ai_english",
    "timestamp": 1782987723996
  }
  ```

---

## 3. Lesson APIs (`LessonController`)

### `GET /api/lessons`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Retrieves all published day lessons.
- **Response Shape (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "dayNumber": 1,
      "title": "Day 1: Greetings & Introductions",
      "rawContent": "Welcome to Day 1...",
      "isPublished": true
    }
  ]
  ```

---

### `GET /api/lessons/day/{dayNumber}`
- **Auth Required**: No (Public)
- **Role Required**: None
- **Purpose**: Retrieves details for a specific lesson day including its sections.
- **Response Shape (200 OK)**:
  ```json
  {
    "id": 1,
    "dayNumber": 1,
    "title": "Day 1: Greetings & Introductions",
    "rawContent": "Welcome to Day 1...",
    "sections": [
      {
        "id": 1,
        "title": "Vocabulary: Common Greetings",
        "category": "vocabulary",
        "content": "Learn these essential greeting words..."
      }
    ]
  }
  ```

---

## 4. Admin Lesson APIs (`AdminLessonController`)

### `POST /api/admin/lessons/day/{dayNumber}`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Creates or updates a day lesson and its sections.
- **Request Payload**:
  ```json
  {
    "title": "Day 2: Family & Friends",
    "rawContent": "Lesson text content...",
    "sections": []
  }
  ```
- **Security Note**: Requires `ROLE_ADMIN`. Calls from non-admin users return `403 Forbidden`.

---

### `DELETE /api/admin/lessons/day/{dayNumber}`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Deletes a day lesson by its day number.
- **Response Shape (200 OK)**: `{"success": true}`

---

### `PUT /api/admin/lessons/sections/{sectionId}`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Updates a specific section by section ID.

---

### `DELETE /api/admin/lessons/sections/{sectionId}`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Deletes a section by section ID.

---

## 4b. Admin User Management APIs (`AdminUserController`)

### `GET /api/admin/users`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Lists all registered users with optional search and filters (search name/email, role, enabled).
- **Request Parameters**:
  - `search` (optional String): search term for name/email
  - `role` (optional Role enum): USER or ADMIN
  - `enabled` (optional Boolean): filter by enabled status
- **Response Shape (200 OK)**:
  ```json
  [
    {
      "id": 2,
      "name": "Demo Learner",
      "email": "demo@example.com",
      "role": "USER",
      "enabled": true,
      "level": "BEGINNER"
    }
  ]
  ```

---

### `PATCH /api/admin/users/{id}/status`
- **Auth Required**: Yes
- **Role Required**: `ADMIN`
- **Purpose**: Ensembles/disables a user account.
- **Request Payload**:
  ```json
  {
    "enabled": false
  }
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "message": "User enabled status updated",
    "user": {
      "id": 2,
      "name": "Demo Learner",
      "email": "demo@example.com",
      "role": "USER",
      "enabled": false,
      "level": "BEGINNER"
    }
  }
  ```
- **Validation Protections**:
  - Admins cannot disable their own account (returns 400 Bad Request: `{"error": "Admins cannot disable their own account"}`).
  - Cannot disable the last enabled admin in the system (returns 400 Bad Request: `{"error": "Cannot disable the last enabled admin"}`).

---

## 5. User Notebook APIs (`NotebookController`)

### `GET /api/notebook` (or `/api/notes`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Fetches all notes created by the current user sorted by most recently updated.
- **Response Shape (200 OK)**:
  ```json
  [
    {
      "id": "1",
      "title": "My Verbs Note",
      "content": "Verb list...",
      "tags": "grammar,verbs",
      "createdAt": "2026-07-02T10:00:00",
      "updatedAt": "2026-07-02T10:00:00"
    }
  ]
  ```

---

### `POST /api/notebook` (or `/api/notes`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Creates a new note or updates an existing note.
- **Ownership Security**: Verifies that `user_id` matches authenticated user before modification.

---

### `DELETE /api/notebook/{id}` (or `/api/notes/{id}`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Deletes a note by ID.

---

## 6. User Mistakes APIs (`MistakeController`)

### `GET /api/mistakes`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Lists all mistakes logged by the current user.

---

### `POST /api/mistakes`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Creates a new mistake entry.
- **Request Payload**:
  ```json
  {
    "originalText": "I goes to school",
    "correctedText": "I go to school",
    "explanation": "Subject-verb agreement rule",
    "category": "grammar"
  }
  ```

---

### `PATCH /api/mistakes/{id}/fixed` (or `PUT /api/mistakes/{id}/mark-fixed`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Marks a mistake as resolved/fixed.

---

### `DELETE /api/mistakes/{id}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Deletes a mistake record.

---

## 7. Progress APIs (`ProgressController`)

### `GET /api/progress`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Retrieves overall lesson completion list for user.

---

### `POST /api/progress`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Updates completion status for a day.

---

### `GET /api/progress/day/{dayNumber}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Checks completion status for a specific day.

---

### `GET /api/progress/section/{sectionId}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Gets completion status and score for a section.

---

### `POST /api/progress/section/{sectionId}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Updates completion status and score for a section.

---

## 8. Homework APIs (`HomeworkController`)

### `GET /api/homework/{sourceId}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Retrieves homework submission status for a lesson/section.

---

### `PUT /api/homework/{sourceId}`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Saves or updates draft homework submission.

---

### `POST /api/homework/{sourceId}/check`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Submits homework for automated evaluation and scoring.

---

### `GET /api/homework/submissions`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Fetches all historical homework submissions of the user.

---

## 9. Self Check APIs (`SelfCheckController`)

### `GET /api/self-check/submissions`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Lists past diagnostic assessment test submissions.

---

### `POST /api/self-check/submissions`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Submits self check test answers and scores.

---

## 10. Practice History APIs (`PracticeController`)

### `POST /api/practice/check`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Submits a practice question answer for checking and logs session history.

---

### `GET /api/practice/history`
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Retrieves recent practice session history.

---

## 11. Reports & History APIs (`ReportController`)

### `GET /api/report/summary` (or `/api/reports/summary`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Returns aggregate statistics (completed lessons, fixed mistakes, streak score).

---

### `GET /api/report/weekly` (or `/api/reports/weekly`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Returns weekly practice breakdown.

---

### `GET /api/report/mistakes` (or `/api/reports/mistakes`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Returns summary of fixed vs pending mistakes.

---

### `GET /api/history` (or `/api/reports/history`)
- **Auth Required**: Yes
- **Role Required**: Any authenticated user
- **Purpose**: Returns top 10 recent activity logs for current user.
