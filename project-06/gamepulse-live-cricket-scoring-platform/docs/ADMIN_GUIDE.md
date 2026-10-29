# GamePulse Live — Admin Control Center Manual

## 1. Overview
The Admin Control Center (`/admin`) provides platform administrators with tools to manage users, monitor infrastructure health, inspect audit logs, perform score corrections, and manage database backup/recovery operations.

---

## 2. Key Administrative Operations

### 2.1 System Observability & Diagnostics
- Navigate to the **Infrastructure Observability & Metrics** panel.
- Inspect real-time **System Health Status** (`UP` / `DOWN`).
- Monitor **Database Ping Latency (ms)**, **JVM Memory Usage (MB)**, and **Active Thread Counts**.
- Review average API latency and 4xx/5xx HTTP response totals.

### 2.2 System Audit Log Inspection
- View complete audit logs detailing historical actions (Match score override, tournament creation, user role changes).
- Filter by actor, timestamp, action type, and entity ID.

### 2.3 Database Backup & Disaster Recovery
- **Create Backup**: Click `⚡ Create Backup` to generate an instant SQL snapshot archive with SHA-256 integrity hash.
- **Verify Backup**: Click `Verify` next to any backup file to confirm SHA-256 checksum validity.
- **Restore Database**: Click `Restore` to restore database schema & records from a verified snapshot.
- **Prune Old Archives**: Click `🧹 Cleanup Policy` to enforce retention policy (retaining max 10 backups).
