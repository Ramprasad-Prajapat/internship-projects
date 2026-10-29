# Phase 26 — Backup + Recovery Implementation Plan

## Official Phase Title
Phase 26 — Backup + Recovery

## Exact Roadmap Requirements
- Database backup (creation of verifiable SQL backups)
- Backup verification (checksum validation & SQL integrity verification)
- Restore procedure (database restoration from backup artifact)
- Retention policy (automated cleanup keeping top N backups)
- Admin backup status (API & Admin Console interface)
- Documentation:
  - Backup process
  - Restore process
  - Recovery after deployment failure

## Existing Implementation Audit
- Currently no backup services or endpoints exist in `com.gamepulse`.
- `AdminDashboard.jsx` handles general stats, audit logs, and system health metrics.

## Proposed Component Architecture
1. **`BackupRecordDTO.java`**: DTO representing backup metadata (backupId, fileName, fileSizeBytes, createdAt, checksum, verified, status, recordCount).
2. **`BackupService.java`**:
   - Generates SQL database backup dumps targeting active H2/MySQL database tables.
   - Computes SHA-256 checksum for backup integrity verification.
   - Restores database schema & records safely.
   - Applies retention policy limiting total stored backups.
3. **`BackupController.java`**:
   - `GET /api/admin/backups`: List all available backup files.
   - `POST /api/admin/backups/create`: Trigger a new database backup.
   - `POST /api/admin/backups/{id}/verify`: Verify checksum and SQL integrity.
   - `POST /api/admin/backups/{id}/restore`: Restore database state from backup.
   - `POST /api/admin/backups/retention`: Trigger retention policy cleanup.
4. **Security**: Enforce `@PreAuthorize("hasRole('ADMIN')")` on all backup operations.
5. **Frontend (`AdminDashboard.jsx`)**: Add interactive Database Backup & Disaster Recovery management widget.
6. **Documentation (`docs/BACKUP_AND_RECOVERY.md`)**: Comprehensive Disaster Recovery Runbook.
7. **Tests**: `BackupServiceTest.java` and `BackupControllerTest.java`.

## Completion Checklist
- [x] Create DTO and Backup Service
- [x] Create Backup REST Controller with ADMIN role guards
- [x] Add Backup & Disaster Recovery section to Admin Dashboard UI
- [x] Write comprehensive backend unit & integration tests
- [x] Create `docs/BACKUP_AND_RECOVERY.md` runbook
- [x] Verify Maven tests pass (100%) and backend package builds
- [x] Verify frontend lint and production build pass
