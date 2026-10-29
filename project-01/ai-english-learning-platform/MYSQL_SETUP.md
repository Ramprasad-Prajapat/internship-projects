# Real MySQL Persistent Database Setup Guide

This guide describes how to configure and run the `ai-english-learning-backend` with a persistent MySQL database (`ai_english`).

---

## 1. Database Creation

Run the following SQL query in your MySQL client (e.g. MySQL Workbench, phpMyAdmin, or `mysql` CLI) to create the database:

```sql
CREATE DATABASE IF NOT EXISTS ai_english CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2. Environment Variables

The backend application is configured via environment variables in `application.yml` with default fallbacks to H2 in-memory DB:

| Variable | Default Value (H2 Fallback) | Description |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:h2:mem:ai_english;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE` | Database JDBC Connection URL |
| `DB_USERNAME` | `sa` | Database User Name |
| `DB_PASSWORD` | *(empty)* | Database Password |
| `DB_DRIVER` | `org.h2.Driver` | Database JDBC Driver Class |

---

## 3. PowerShell Launch Example (Windows)

Set environment variables in your PowerShell terminal and start the Spring Boot application using Maven wrapper:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/ai_english?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:DB_DRIVER="com.mysql.cj.jdbc.Driver"

cd backend
.\mvnw.cmd spring-boot:run
```

---

## 4. Linux / macOS Bash Launch Example

```bash
export DB_URL="jdbc:mysql://localhost:3306/ai_english?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
export DB_DRIVER="com.mysql.cj.jdbc.Driver"

cd backend
./mvnw spring-boot:run
```

---

## 5. Seed Data & Initial Accounts

On startup, `DataSeeder` checks if data already exists before inserting. If missing, it seeds:

* **Admin User**: `admin@english.com` / `Admin123` (`ADMIN` role)
* **Demo Learner**: `demo@example.com` / `password123` (`USER` role)
* **Day 1 Lesson**: Day 1 with 12 default sections (`PUBLISHED` state)

---

## 6. Persistence Test Checklist

1. **Database Connection**: Ensure MySQL server is running on port 3306.
2. **Start Backend**: Launch with MySQL env variables set.
3. **Register User**: Register a new user via API (`POST /api/auth/register`) or Frontend UI.
4. **Login**: Login with the newly registered user credentials (`POST /api/auth/login`).
5. **Restart Verification**:
   - Stop the backend process (`Ctrl + C`).
   - Re-launch the backend using the same environment variables.
   - Login again with the registered user.
   - Verify user account and data persist across restarts without duplicate seed errors.

---

## 7. Troubleshooting Notes

* **Connection Refused (`Communications link failure`)**: Verify MySQL service is active and listening on port `3306`.
* **Access Denied**: Double-check `DB_USERNAME` and `DB_PASSWORD`.
* **Database Not Found**: Ensure `ai_english` schema exists or `createDatabaseIfNotExist=true` is enabled in `DB_URL`.
* **Fallback to H2**: If environment variables are omitted, Spring Boot will automatically fallback to the in-memory H2 database.
