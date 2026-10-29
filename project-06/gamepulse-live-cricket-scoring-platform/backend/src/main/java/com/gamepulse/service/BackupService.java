package com.gamepulse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamepulse.dto.BackupRecordDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BackupService {

    private static final Logger logger = LoggerFactory.getLogger(BackupService.class);
    private static final String BACKUP_HEADER = "-- GAMEPULSE BACKUP DUMP v1.0 --";
    private static final Path BACKUP_DIR = Paths.get("backups");
    private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss").withZone(ZoneId.systemDefault());

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public BackupService() {
        try {
            if (!Files.exists(BACKUP_DIR)) {
                Files.createDirectories(BACKUP_DIR);
            }
        } catch (IOException e) {
            logger.error("Failed to initialize backup directory", e);
        }
    }

    public synchronized BackupRecordDTO createBackup() {
        String timestampStr = FILE_DATE_FORMAT.format(Instant.now());
        String backupId = "backup-" + timestampStr;
        String fileName = "gamepulse_" + backupId + ".sql";
        Path sqlFilePath = BACKUP_DIR.resolve(fileName);
        Path jsonFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".json");

        try {
            StringBuilder sqlBuilder = new StringBuilder();
            sqlBuilder.append(BACKUP_HEADER).append("\n");
            sqlBuilder.append("-- Created At: ").append(Instant.now().toString()).append("\n\n");

            long recordCount = 0;
            List<String> tables = List.of("users", "tournaments", "teams", "players", "matches", "deliveries", "commentary", "audit_logs", "polls");

            for (String table : tables) {
                try {
                    List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM " + table);
                    if (rows.isEmpty()) continue;

                    sqlBuilder.append("-- Table: ").append(table).append("\n");
                    for (Map<String, Object> row : rows) {
                        recordCount++;
                        sqlBuilder.append("INSERT INTO ").append(table).append(" (");
                        List<String> cols = new ArrayList<>(row.keySet());
                        sqlBuilder.append(String.join(", ", cols)).append(") VALUES (");

                        List<String> valStrings = new ArrayList<>();
                        for (String col : cols) {
                            Object val = row.get(col);
                            if (val == null) {
                                valStrings.add("NULL");
                            } else if (val instanceof Number || val instanceof Boolean) {
                                valStrings.add(val.toString());
                            } else {
                                String escaped = val.toString().replace("'", "''");
                                valStrings.add("'" + escaped + "'");
                            }
                        }
                        sqlBuilder.append(String.join(", ", valStrings)).append(");\n");
                    }
                    sqlBuilder.append("\n");
                } catch (Exception e) {
                    logger.warn("Could not dump table {}: {}", table, e.getMessage());
                }
            }

            byte[] sqlBytes = sqlBuilder.toString().getBytes(StandardCharsets.UTF_8);
            Files.write(sqlFilePath, sqlBytes);

            String checksum = computeSha256(sqlBytes);
            BackupRecordDTO dto = new BackupRecordDTO(
                    backupId,
                    fileName,
                    sqlBytes.length,
                    Instant.now().toString(),
                    checksum,
                    true,
                    "VALIDATED",
                    recordCount
            );

            objectMapper.writeValue(jsonFilePath.toFile(), dto);
            logger.info("Database backup created successfully: {}", backupId);
            return dto;

        } catch (Exception e) {
            logger.error("Failed to create database backup", e);
            throw new RuntimeException("Backup creation failed: " + e.getMessage(), e);
        }
    }

    public List<BackupRecordDTO> getBackupList() {
        List<BackupRecordDTO> list = new ArrayList<>();
        File dir = BACKUP_DIR.toFile();
        if (!dir.exists() || !dir.isDirectory()) return list;

        File[] jsonFiles = dir.listFiles((d, name) -> name.startsWith("gamepulse_backup-") && name.endsWith(".json"));
        if (jsonFiles != null) {
            for (File file : jsonFiles) {
                try {
                    BackupRecordDTO dto = objectMapper.readValue(file, BackupRecordDTO.class);
                    list.add(dto);
                } catch (Exception e) {
                    logger.warn("Failed to parse metadata file: {}", file.getName());
                }
            }
        }
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public BackupRecordDTO verifyBackup(String backupId) {
        Path sqlFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".sql");
        Path jsonFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".json");

        if (!Files.exists(sqlFilePath) || !Files.exists(jsonFilePath)) {
            throw new IllegalArgumentException("Backup record not found for ID: " + backupId);
        }

        try {
            BackupRecordDTO dto = objectMapper.readValue(jsonFilePath.toFile(), BackupRecordDTO.class);
            byte[] sqlBytes = Files.readAllBytes(sqlFilePath);
            String currentChecksum = computeSha256(sqlBytes);

            boolean checksumMatches = currentChecksum.equalsIgnoreCase(dto.getChecksum());
            String sqlContent = new String(sqlBytes, StandardCharsets.UTF_8);
            boolean headerValid = sqlContent.startsWith(BACKUP_HEADER);

            boolean isVerified = checksumMatches && headerValid && sqlBytes.length > 0;
            dto.setVerified(isVerified);
            dto.setStatus(isVerified ? "VERIFIED" : "CORRUPTED");

            objectMapper.writeValue(jsonFilePath.toFile(), dto);
            return dto;
        } catch (Exception e) {
            logger.error("Verification failed for backup ID: {}", backupId, e);
            throw new RuntimeException("Verification failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public synchronized BackupRecordDTO restoreBackup(String backupId) {
        BackupRecordDTO dto = verifyBackup(backupId);
        if (!dto.isVerified()) {
            throw new IllegalStateException("Cannot restore corrupted backup file: " + backupId);
        }

        Path sqlFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".sql");
        try {
            List<String> lines = Files.readAllLines(sqlFilePath, StandardCharsets.UTF_8);
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("--")) continue;
                try {
                    jdbcTemplate.execute(trimmed);
                } catch (Exception e) {
                    logger.warn("Error executing restore SQL line [{}]: {}", trimmed, e.getMessage());
                }
            }
            dto.setStatus("RESTORED");
            Path jsonFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".json");
            objectMapper.writeValue(jsonFilePath.toFile(), dto);
            logger.info("Database successfully restored from backup ID: {}", backupId);
            return dto;
        } catch (Exception e) {
            logger.error("Restore failed for backup ID: {}", backupId, e);
            throw new RuntimeException("Restore failed: " + e.getMessage(), e);
        }
    }

    public synchronized Map<String, Object> applyRetentionPolicy(int maxBackupsToKeep) {
        List<BackupRecordDTO> backups = getBackupList();
        int totalBefore = backups.size();
        int deletedCount = 0;

        if (backups.size() > maxBackupsToKeep) {
            List<BackupRecordDTO> toDelete = backups.subList(maxBackupsToKeep, backups.size());
            for (BackupRecordDTO dto : toDelete) {
                Path sqlPath = BACKUP_DIR.resolve(dto.getFileName());
                Path jsonPath = BACKUP_DIR.resolve("gamepulse_" + dto.getId() + ".json");
                try {
                    Files.deleteIfExists(sqlPath);
                    Files.deleteIfExists(jsonPath);
                    deletedCount++;
                } catch (IOException e) {
                    logger.warn("Could not delete backup file: {}", dto.getId());
                }
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalBefore", totalBefore);
        result.put("deletedCount", deletedCount);
        result.put("retainedCount", totalBefore - deletedCount);
        result.put("maxRetentionLimit", maxBackupsToKeep);
        return result;
    }

    public File getBackupFile(String backupId) {
        Path sqlFilePath = BACKUP_DIR.resolve("gamepulse_" + backupId + ".sql");
        if (!Files.exists(sqlFilePath)) {
            throw new IllegalArgumentException("File not found for backup ID: " + backupId);
        }
        return sqlFilePath.toFile();
    }

    private String computeSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 algorithm missing", e);
        }
    }
}
