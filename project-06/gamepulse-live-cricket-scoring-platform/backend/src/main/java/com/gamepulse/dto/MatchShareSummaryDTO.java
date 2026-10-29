package com.gamepulse.dto;

public class MatchShareSummaryDTO {
    private Long matchId;
    private String teamAName;
    private String teamBName;
    private String format;
    private String venue;
    private String status;
    private String resultSummary;
    private String currentScoreDisplay;
    private String headline;
    private String formattedText;
    private String shareUrl;

    public MatchShareSummaryDTO() {}

    public MatchShareSummaryDTO(Long matchId, String teamAName, String teamBName, String format, String venue,
                               String status, String resultSummary, String currentScoreDisplay,
                               String headline, String formattedText, String shareUrl) {
        this.matchId = matchId;
        this.teamAName = teamAName;
        this.teamBName = teamBName;
        this.format = format;
        this.venue = venue;
        this.status = status;
        this.resultSummary = resultSummary;
        this.currentScoreDisplay = currentScoreDisplay;
        this.headline = headline;
        this.formattedText = formattedText;
        this.shareUrl = shareUrl;
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public String getTeamAName() {
        return teamAName;
    }

    public void setTeamAName(String teamAName) {
        this.teamAName = teamAName;
    }

    public String getTeamBName() {
        return teamBName;
    }

    public void setTeamBName(String teamBName) {
        this.teamBName = teamBName;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResultSummary() {
        return resultSummary;
    }

    public void setResultSummary(String resultSummary) {
        this.resultSummary = resultSummary;
    }

    public String getCurrentScoreDisplay() {
        return currentScoreDisplay;
    }

    public void setCurrentScoreDisplay(String currentScoreDisplay) {
        this.currentScoreDisplay = currentScoreDisplay;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getFormattedText() {
        return formattedText;
    }

    public void setFormattedText(String formattedText) {
        this.formattedText = formattedText;
    }

    public String getShareUrl() {
        return shareUrl;
    }

    public void setShareUrl(String shareUrl) {
        this.shareUrl = shareUrl;
    }
}
