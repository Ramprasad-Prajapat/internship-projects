# Database Audit and Backup Readiness Summary

This document presents the schema structure, data seeder configuration, and backup strategies for the `ai_english` database.

---

## 1. Database & Table Structures

The application utilizes an in-memory H2 database by default, using Hibernate `ddl-auto: update` to initialize the database tables dynamically from JPA entities.

### Entity & Tables Summary

| Entity Class | Database Table Name | Description | Key Relationships |
| :--- | :--- | :--- | :--- |
| `User` | `users` | User credentials, roles, and profile settings. | - |
| `LessonDay` | `lesson_days` | Learning days containing overall day summaries. | One-to-Many to `LessonSection` |
| `LessonSection` | `lesson_sections` | Specific section content within a Day Lesson. | Many-to-One to `LessonDay` |
| `DailyProgress` | `daily_progress` | Completed learning days checklist markers. | Many-to-One to `User` |
| `SectionProgress` | `section_progress` | Detailed reading, listening, writing and speaking checkbox states. | Many-to-One to `User` |
| `HomeworkSubmission` | `homework_submissions` | Saved drafts and checked feedback stats for homework questions. | Many-to-One to `User` |
| `SelfCheckSubmission` | `self_check_submissions` | Self-evaluation checklist records. | Many-to-One to `User` |
| `PracticeHistory` | `practice_history` | Practice sessions and logs for reports/history timelines. | Many-to-One to `User` |
| `UserNote` | `user_notes` | User-saved notebook notes. | Many-to-One to `User` |
| `UserMistake` | `user_mistakes` | Logged grammar and speaking practice mistakes. | Many-to-One to `User` |

---

## 2. Seed Data & Credentials

The `DataSeeder.java` script automatically seeds the database with essential initial data upon booting. It employs check-before-insert verification (using `existsByEmail` and `findByDayNumber(1)`) to safely ignore seeding if records are already present.

### Seeded Credentials

*   **Demo Administrator**:
    *   **Email**: `admin@example.com`
    *   **Password**: `password123`
    *   **Role**: `ADMIN`
*   **Demo Learner**:
    *   **Email**: `demo@example.com`
    *   **Password**: `password123`
    *   **Role**: `USER`

### Seeded Lessons

*   **Day 1**: `Day 1: Greetings & Introductions`
    *   *Section 1*: `Vocabulary: Common Greetings`
    *   *Section 2*: `Grammar: Introducing Yourself`
    *   *Section 3*: `Speaking Practice: Sample Dialogue`

---

## 3. Backup and Export Command Notes

Since H2 in-memory tables are wiped upon restarting the application, export scripts can be used to export database snapshots.

### Export H2 Tables to SQL Script
To backup all data in H2:
```sql
SCRIPT TO 'backup.sql';
```
This query can be run directly inside an H2 console or as an endpoint function.

### Restore H2 Tables from SQL Script
To import a backup:
```sql
RUNSCRIPT FROM 'backup.sql';
```

---

> [!SAFETY]
> **Do not commit actual database credentials or environment configurations to git repositories.** Always rely on placeholder properties (`${DB_PASSWORD:}`) to inject passwords via runtime environment parameters.
