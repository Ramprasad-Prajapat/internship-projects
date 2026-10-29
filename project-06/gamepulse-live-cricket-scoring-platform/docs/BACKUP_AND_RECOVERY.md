# GamePulse Live — Backup & Disaster Recovery Runbook

## Executive Summary
This document defines the operational procedures for Database Backup, Verification, Restoration, Retention Management, and Disaster Recovery for the GamePulse Live platform.

---

## 1. Database Backup Process

### Automated & On-Demand Backup Generation
- Database backups are generated in SQL dump format containing complete schema structure and records for core tables (`users`, `tournaments`, `teams`, `players`, `matches`, `deliveries`, `commentary`, `audit_logs`, `polls`).
- Backups are written to the secured `backups/` directory relative to the backend execution context.
- Each backup generates twin files:
  1. `gamepulse_backup-<TIMESTAMP>.sql`: SQL script starting with `-- GAMEPULSE BACKUP DUMP v1.0 --` header.
  2. `gamepulse_backup-<TIMESTAMP>.json`: JSON metadata file containing backup ID, file size, timestamp, SHA-256 checksum, record count, and validation status.

### Manual Backup Creation via API
```http
POST /api/admin/backups/create
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### Manual Backup Creation via Admin Console
1. Log in to GamePulse Live with an **ADMIN** account.
2. Navigate to **Admin Control Center** (`/admin`).
3. Scroll to **Database Backup & Disaster Recovery**.
4. Click **⚡ Create Backup**.

---

## 2. Backup Verification Procedure

Every generated backup undergoes automated integrity checks:
1. **Header Validation**: Verifies the file begins with `-- GAMEPULSE BACKUP DUMP v1.0 --`.
2. **SHA-256 Checksum Matching**: Reads the raw `.sql` file bytes and recomputes the SHA-256 hash. Compares the hash against the JSON metadata record.
3. **File Size Check**: Confirms the archive size is greater than 0 bytes.

### Trigger Verification via API
```http
POST /api/admin/backups/{id}/verify
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

## 3. Database Restore Procedure

> [!WARNING]
> Restoring a database snapshot overwrites current table contents. Execute only during maintenance windows or emergency recovery situations.

### Online Restoration Steps
1. Identify the desired valid backup ID from `/api/admin/backups`.
2. Run backup verification to ensure status is `VERIFIED`.
3. Trigger restoration via API or Admin Console:

```http
POST /api/admin/backups/{id}/restore
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

4. The `BackupService` executes the SQL statements inside a transactional boundary.
5. Verify application functionality using `/api/health` and `/api/readiness`.

---

## 4. Retention Policy

To prevent storage exhaustion:
- The system enforces a default retention limit of **10 active backups**.
- Oldest backups exceeding the limit are pruned automatically upon retention trigger.

### Trigger Retention Cleanup via API
```http
POST /api/admin/backups/retention?limit=10
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

## 5. Deployment Failure Recovery Procedure

If a production deployment or database migration fails:

1. **Step 1 — Immediate Isolation**:
   Set load balancer / ingress traffic to point to the maintenance page or verify `/api/health` status.
2. **Step 2 — Rollback Application Container**:
   Revert the application artifact to the last stable release tag (`gamepulse-backend-0.1.0-SNAPSHOT.jar`).
3. **Step 3 — Restore Pre-Deployment Snapshot**:
   Select the pre-deployment backup archive ID from `backups/` and execute `/api/admin/backups/{id}/restore`.
4. **Step 4 — Verify Readiness**:
   Query `/api/readiness` until status returns `200 OK (READY)`.
5. **Step 5 — Re-enable Ingress Traffic**:
   Resume live user traffic and monitor `/api/metrics` for latency or error anomalies.
