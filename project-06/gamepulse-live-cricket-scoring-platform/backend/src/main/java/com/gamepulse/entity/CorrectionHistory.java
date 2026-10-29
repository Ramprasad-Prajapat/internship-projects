package com.gamepulse.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "correction_history")
public class CorrectionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_id", nullable = false)
    private Long deliveryId;

    @Column(name = "innings_id", nullable = false)
    private Long inningsId;

    @Column(name = "match_id", nullable = false)
    private Long matchId;

    @Column(name = "corrected_by", nullable = false)
    private String correctedBy;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Lob
    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Lob
    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "corrected_at", nullable = false)
    private Instant correctedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }
    public Long getInningsId() { return inningsId; }
    public void setInningsId(Long inningsId) { this.inningsId = inningsId; }
    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
    public String getCorrectedBy() { return correctedBy; }
    public void setCorrectedBy(String correctedBy) { this.correctedBy = correctedBy; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public Instant getCorrectedAt() { return correctedAt; }
    public void setCorrectedAt(Instant correctedAt) { this.correctedAt = correctedAt; }
}
