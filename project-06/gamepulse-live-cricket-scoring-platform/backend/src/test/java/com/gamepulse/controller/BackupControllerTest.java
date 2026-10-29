package com.gamepulse.controller;

import com.gamepulse.dto.BackupRecordDTO;
import com.gamepulse.security.TestSecurityConfig;
import com.gamepulse.service.BackupService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(BackupController.class)
public class BackupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BackupService backupService;

    @Test
    public void testListBackups() throws Exception {
        BackupRecordDTO dto = new BackupRecordDTO("b1", "file.sql", 1024L, "2026-08-31", "sha256", true, "VALIDATED", 10);
        when(backupService.getBackupList()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/admin/backups")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("b1"))
                .andExpect(jsonPath("$[0].fileName").value("file.sql"));
    }

    @Test
    public void testCreateBackup() throws Exception {
        BackupRecordDTO dto = new BackupRecordDTO("b2", "file2.sql", 2048L, "2026-08-31", "sha256", true, "VALIDATED", 20);
        when(backupService.createBackup()).thenReturn(dto);

        mockMvc.perform(post("/api/admin/backups/create")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("b2"))
                .andExpect(jsonPath("$.status").value("VALIDATED"));
    }

    @Test
    public void testVerifyBackup() throws Exception {
        BackupRecordDTO dto = new BackupRecordDTO("b1", "file.sql", 1024L, "2026-08-31", "sha256", true, "VERIFIED", 10);
        when(backupService.verifyBackup("b1")).thenReturn(dto);

        mockMvc.perform(post("/api/admin/backups/b1/verify")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VERIFIED"));
    }

    @Test
    public void testApplyRetention() throws Exception {
        when(backupService.applyRetentionPolicy(5)).thenReturn(Map.of(
                "totalBefore", 10,
                "deletedCount", 5,
                "retainedCount", 5
        ));

        mockMvc.perform(post("/api/admin/backups/retention?limit=5")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletedCount").value(5))
                .andExpect(jsonPath("$.retainedCount").value(5));
    }
}
