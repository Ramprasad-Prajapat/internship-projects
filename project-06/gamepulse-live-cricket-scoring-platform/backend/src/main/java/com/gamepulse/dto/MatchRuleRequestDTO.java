package com.gamepulse.dto;

import com.gamepulse.entity.MatchStatus;

public class MatchRuleRequestDTO {
    private MatchStatus status;
    private Integer revisedOvers;
    private Integer revisedTarget;
    private Integer powerplayStartOver;
    private Integer powerplayEndOver;
    private Boolean isSuperOver;
    private String interruptionReason;

    public MatchRuleRequestDTO() {}

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public Integer getRevisedOvers() { return revisedOvers; }
    public void setRevisedOvers(Integer revisedOvers) { this.revisedOvers = revisedOvers; }

    public Integer getRevisedTarget() { return revisedTarget; }
    public void setRevisedTarget(Integer revisedTarget) { this.revisedTarget = revisedTarget; }

    public Integer getPowerplayStartOver() { return powerplayStartOver; }
    public void setPowerplayStartOver(Integer powerplayStartOver) { this.powerplayStartOver = powerplayStartOver; }

    public Integer getPowerplayEndOver() { return powerplayEndOver; }
    public void setPowerplayEndOver(Integer powerplayEndOver) { this.powerplayEndOver = powerplayEndOver; }

    public Boolean getIsSuperOver() { return isSuperOver; }
    public void setIsSuperOver(Boolean isSuperOver) { this.isSuperOver = isSuperOver; }

    public String getInterruptionReason() { return interruptionReason; }
    public void setInterruptionReason(String interruptionReason) { this.interruptionReason = interruptionReason; }
}
