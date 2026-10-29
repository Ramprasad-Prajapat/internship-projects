package com.gamepulse.dto;

/**
 * Data Transfer Object representing a team's standing in a tournament.
 * Includes points, win/loss record and Net Run Rate (NRR).
 */
public class StandingsDTO {
    private Long teamId;
    private String teamName;
    private Integer played;
    private Integer won;
    private Integer lost;
    private Integer tied;
    private Integer noResult;
    private Integer points;
    private Integer runsFor;
    private Double oversFor;
    private Integer runsAgainst;
    private Double oversAgainst;
    private Double nrr;

    public StandingsDTO() {}

    public StandingsDTO(Long teamId, String teamName, Integer played, Integer won, Integer lost, Integer tied,
            Integer noResult, Integer points, Integer runsFor, Double oversFor, Integer runsAgainst,
            Double oversAgainst, Double nrr) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.played = played;
        this.won = won;
        this.lost = lost;
        this.tied = tied;
        this.noResult = noResult;
        this.points = points;
        this.runsFor = runsFor;
        this.oversFor = oversFor;
        this.runsAgainst = runsAgainst;
        this.oversAgainst = oversAgainst;
        this.nrr = nrr;
    }

    // Getters and setters
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public Integer getPlayed() { return played; }
    public void setPlayed(Integer played) { this.played = played; }
    public Integer getWon() { return won; }
    public void setWon(Integer won) { this.won = won; }
    public Integer getLost() { return lost; }
    public void setLost(Integer lost) { this.lost = lost; }
    public Integer getTied() { return tied; }
    public void setTied(Integer tied) { this.tied = tied; }
    public Integer getNoResult() { return noResult; }
    public void setNoResult(Integer noResult) { this.noResult = noResult; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    public Integer getRunsFor() { return runsFor; }
    public void setRunsFor(Integer runsFor) { this.runsFor = runsFor; }
    public Double getOversFor() { return oversFor; }
    public void setOversFor(Double oversFor) { this.oversFor = oversFor; }
    public Integer getRunsAgainst() { return runsAgainst; }
    public void setRunsAgainst(Integer runsAgainst) { this.runsAgainst = runsAgainst; }
    public Double getOversAgainst() { return oversAgainst; }
    public void setOversAgainst(Double oversAgainst) { this.oversAgainst = oversAgainst; }
    public Double getNrr() { return nrr; }
    public void setNrr(Double nrr) { this.nrr = nrr; }
}
