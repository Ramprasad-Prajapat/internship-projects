package com.gamepulse.dto;

import java.util.List;

public class PlayerStatsDTO {
    private Long playerId;
    private String playerName;
    private String teamName;
    private String role;

    // Batting
    private Integer matches = 0;
    private Integer innings = 0;
    private Integer runs = 0;
    private Integer ballsFaced = 0;
    private Integer highestScore = 0;
    private Boolean highestScoreNotOut = false;
    private Integer notOuts = 0;
    private Double average = 0.0;
    private Double strikeRate = 0.0;
    private Integer fifties = 0;
    private Integer hundreds = 0;
    private Integer fours = 0;
    private Integer sixes = 0;

    // Bowling
    private Integer bowlingInnings = 0;
    private Double oversBowled = 0.0;
    private Integer runsConceded = 0;
    private Integer wickets = 0;
    private Double bowlingAverage = 0.0;
    private Double economy = 0.0;
    private String bestBowling = "0/0";
    private Integer bestBowlingWickets = 0;
    private Integer bestBowlingRuns = 9999;
    private Integer fourWickets = 0;
    private Integer fiveWickets = 0;

    // Fielding
    private Integer catches = 0;
    private Integer stumpings = 0;
    private Integer runOuts = 0;

    // Recent Form
    private List<String> recentForm;

    public PlayerStatsDTO() {}

    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getMatches() { return matches; }
    public void setMatches(Integer matches) { this.matches = matches; }

    public Integer getInnings() { return innings; }
    public void setInnings(Integer innings) { this.innings = innings; }

    public Integer getRuns() { return runs; }
    public void setRuns(Integer runs) { this.runs = runs; }

    public Integer getBallsFaced() { return ballsFaced; }
    public void setBallsFaced(Integer ballsFaced) { this.ballsFaced = ballsFaced; }

    public Integer getHighestScore() { return highestScore; }
    public void setHighestScore(Integer highestScore) { this.highestScore = highestScore; }

    public Boolean getHighestScoreNotOut() { return highestScoreNotOut; }
    public void setHighestScoreNotOut(Boolean highestScoreNotOut) { this.highestScoreNotOut = highestScoreNotOut; }

    public Integer getNotOuts() { return notOuts; }
    public void setNotOuts(Integer notOuts) { this.notOuts = notOuts; }

    public Double getAverage() { return average; }
    public void setAverage(Double average) { this.average = average; }

    public Double getStrikeRate() { return strikeRate; }
    public void setStrikeRate(Double strikeRate) { this.strikeRate = strikeRate; }

    public Integer getFifties() { return fifties; }
    public void setFifties(Integer fifties) { this.fifties = fifties; }

    public Integer getHundreds() { return hundreds; }
    public void setHundreds(Integer hundreds) { this.hundreds = hundreds; }

    public Integer getFours() { return fours; }
    public void setFours(Integer fours) { this.fours = fours; }

    public Integer getSixes() { return sixes; }
    public void setSixes(Integer sixes) { this.sixes = sixes; }

    public Integer getBowlingInnings() { return bowlingInnings; }
    public void setBowlingInnings(Integer bowlingInnings) { this.bowlingInnings = bowlingInnings; }

    public Double getOversBowled() { return oversBowled; }
    public void setOversBowled(Double oversBowled) { this.oversBowled = oversBowled; }

    public Integer getRunsConceded() { return runsConceded; }
    public void setRunsConceded(Integer runsConceded) { this.runsConceded = runsConceded; }

    public Integer getWickets() { return wickets; }
    public void setWickets(Integer wickets) { this.wickets = wickets; }

    public Double getBowlingAverage() { return bowlingAverage; }
    public void setBowlingAverage(Double bowlingAverage) { this.bowlingAverage = bowlingAverage; }

    public Double getEconomy() { return economy; }
    public void setEconomy(Double economy) { this.economy = economy; }

    public String getBestBowling() { return bestBowling; }
    public void setBestBowling(String bestBowling) { this.bestBowling = bestBowling; }

    public Integer getBestBowlingWickets() { return bestBowlingWickets; }
    public void setBestBowlingWickets(Integer bestBowlingWickets) { this.bestBowlingWickets = bestBowlingWickets; }

    public Integer getBestBowlingRuns() { return bestBowlingRuns; }
    public void setBestBowlingRuns(Integer bestBowlingRuns) { this.bestBowlingRuns = bestBowlingRuns; }

    public Integer getFourWickets() { return fourWickets; }
    public void setFourWickets(Integer fourWickets) { this.fourWickets = fourWickets; }

    public Integer getFiveWickets() { return fiveWickets; }
    public void setFiveWickets(Integer fiveWickets) { this.fiveWickets = fiveWickets; }

    public Integer getCatches() { return catches; }
    public void setCatches(Integer catches) { this.catches = catches; }

    public Integer getStumpings() { return stumpings; }
    public void setStumpings(Integer stumpings) { this.stumpings = stumpings; }

    public Integer getRunOuts() { return runOuts; }
    public void setRunOuts(Integer runOuts) { this.runOuts = runOuts; }

    public List<String> getRecentForm() { return recentForm; }
    public void setRecentForm(List<String> recentForm) { this.recentForm = recentForm; }
}
