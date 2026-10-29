package com.gamepulse.dto;

import java.util.List;

public class MatchPulseDTO {
    private Long matchId;
    private Double teamAWinProbability;
    private Double teamBWinProbability;
    private String currentStatusText;
    private Double requiredRunRate;
    private Double currentRunRate;
    private String matchMomentum;
    private List<String> keyHighlights;

    public MatchPulseDTO() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Double getTeamAWinProbability() { return teamAWinProbability; }
    public void setTeamAWinProbability(Double teamAWinProbability) { this.teamAWinProbability = teamAWinProbability; }

    public Double getTeamBWinProbability() { return teamBWinProbability; }
    public void setTeamBWinProbability(Double teamBWinProbability) { this.teamBWinProbability = teamBWinProbability; }

    public String getCurrentStatusText() { return currentStatusText; }
    public void setCurrentStatusText(String currentStatusText) { this.currentStatusText = currentStatusText; }

    public Double getRequiredRunRate() { return requiredRunRate; }
    public void setRequiredRunRate(Double requiredRunRate) { this.requiredRunRate = requiredRunRate; }

    public Double getCurrentRunRate() { return currentRunRate; }
    public void setCurrentRunRate(Double currentRunRate) { this.currentRunRate = currentRunRate; }

    public String getMatchMomentum() { return matchMomentum; }
    public void setMatchMomentum(String matchMomentum) { this.matchMomentum = matchMomentum; }

    public List<String> getKeyHighlights() { return keyHighlights; }
    public void setKeyHighlights(List<String> keyHighlights) { this.keyHighlights = keyHighlights; }
}
