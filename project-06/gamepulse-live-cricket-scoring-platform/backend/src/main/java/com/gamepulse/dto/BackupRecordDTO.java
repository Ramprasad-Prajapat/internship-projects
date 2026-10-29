package com.gamepulse.dto;

public class BackupRecordDTO {
    private String id;
    private String fileName;
    private long fileSizeBytes;
    private String createdAt;
    private String checksum;
    private boolean verified;
    private String status;
    private long recordCount;

    public BackupRecordDTO() {}

    public BackupRecordDTO(String id, String fileName, long fileSizeBytes, String createdAt, String checksum, boolean verified, String status, long recordCount) {
        this.id = id;
        this.fileName = fileName;
        this.fileSizeBytes = fileSizeBytes;
        this.createdAt = createdAt;
        this.checksum = checksum;
        this.verified = verified;
        this.status = status;
        this.recordCount = recordCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getRecordCount() {
        return recordCount;
    }

    public void setRecordCount(long recordCount) {
        this.recordCount = recordCount;
    }
}
