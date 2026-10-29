package com.gamepulse.controller;

import com.gamepulse.dto.BackupRecordDTO;
import com.gamepulse.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/backups")
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @GetMapping
    public ResponseEntity<List<BackupRecordDTO>> listBackups() {
        return ResponseEntity.ok(backupService.getBackupList());
    }

    @PostMapping("/create")
    public ResponseEntity<BackupRecordDTO> createBackup() {
        BackupRecordDTO backup = backupService.createBackup();
        return ResponseEntity.ok(backup);
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<BackupRecordDTO> verifyBackup(@PathVariable("id") String id) {
        BackupRecordDTO verified = backupService.verifyBackup(id);
        return ResponseEntity.ok(verified);
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<BackupRecordDTO> restoreBackup(@PathVariable("id") String id) {
        BackupRecordDTO restored = backupService.restoreBackup(id);
        return ResponseEntity.ok(restored);
    }

    @PostMapping("/retention")
    public ResponseEntity<Map<String, Object>> applyRetention(@RequestParam(name = "limit", defaultValue = "10") int limit) {
        Map<String, Object> result = backupService.applyRetentionPolicy(limit);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadBackup(@PathVariable("id") String id) {
        File file = backupService.getBackupFile(id);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
