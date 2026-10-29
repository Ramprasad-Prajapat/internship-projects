package com.gamepulse.service;

import com.gamepulse.dto.BackupRecordDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BackupServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private BackupService backupService;

    @BeforeEach
    public void setUp() {
        when(jdbcTemplate.queryForList(anyString())).thenReturn(List.of(
                Map.of("id", 1L, "username", "admin", "role", "ADMIN"),
                Map.of("id", 2L, "username", "user1", "role", "USER")
        ));
    }

    @Test
    public void testCreateAndVerifyBackup() {
        BackupRecordDTO backup = backupService.createBackup();

        assertNotNull(backup);
        assertNotNull(backup.getId());
        assertNotNull(backup.getChecksum());
        assertTrue(backup.getFileSizeBytes() > 0);
        assertTrue(backup.isVerified());
        assertEquals("VALIDATED", backup.getStatus());

        BackupRecordDTO verified = backupService.verifyBackup(backup.getId());
        assertTrue(verified.isVerified());
        assertEquals("VERIFIED", verified.getStatus());
    }

    @Test
    public void testGetBackupList() {
        BackupRecordDTO backup = backupService.createBackup();
        List<BackupRecordDTO> list = backupService.getBackupList();

        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertTrue(list.stream().anyMatch(b -> b.getId().equals(backup.getId())));
    }

    @Test
    public void testRetentionPolicy() {
        backupService.createBackup();
        backupService.createBackup();

        Map<String, Object> retentionResult = backupService.applyRetentionPolicy(1);
        assertNotNull(retentionResult);
        assertTrue((int) retentionResult.get("retainedCount") <= 1);
    }
}
