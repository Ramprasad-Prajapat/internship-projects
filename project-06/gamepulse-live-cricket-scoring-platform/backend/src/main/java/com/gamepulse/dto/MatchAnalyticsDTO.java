package com.gamepulse.dto;

import java.util.List;

public class MatchAnalyticsDTO {
    private Long matchId;
    private List<InningsWormDTO> wormGraph;
    private PhaseAnalysisDTO phaseAnalysis;
    private PercentageStatsDTO statsPercentages;

    public MatchAnalyticsDTO() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public List<InningsWormDTO> getWormGraph() { return wormGraph; }
    public void setWormGraph(List<InningsWormDTO> wormGraph) { this.wormGraph = wormGraph; }

    public PhaseAnalysisDTO getPhaseAnalysis() { return phaseAnalysis; }
    public void setPhaseAnalysis(PhaseAnalysisDTO phaseAnalysis) { this.phaseAnalysis = phaseAnalysis; }

    public PercentageStatsDTO getStatsPercentages() { return statsPercentages; }
    public void setStatsPercentages(PercentageStatsDTO statsPercentages) { this.statsPercentages = statsPercentages; }

    public static class InningsWormDTO {
        private Integer inningsNumber;
        private String teamName;
        private List<OverPointDTO> overPoints;

        public InningsWormDTO() {}

        public Integer getInningsNumber() { return inningsNumber; }
        public void setInningsNumber(Integer inningsNumber) { this.inningsNumber = inningsNumber; }

        public String getTeamName() { return teamName; }
        public void setTeamName(String teamName) { this.teamName = teamName; }

        public List<OverPointDTO> getOverPoints() { return overPoints; }
        public void setOverPoints(List<OverPointDTO> overPoints) { this.overPoints = overPoints; }
    }

    public static class OverPointDTO {
        private Integer overNumber;
        private Integer runsInOver;
        private Integer cumulativeRuns;
        private Integer wickets;
        private Double currentRunRate;

        public OverPointDTO() {}

        public Integer getOverNumber() { return overNumber; }
        public void setOverNumber(Integer overNumber) { this.overNumber = overNumber; }

        public Integer getRunsInOver() { return runsInOver; }
        public void setRunsInOver(Integer runsInOver) { this.runsInOver = runsInOver; }

        public Integer getCumulativeRuns() { return cumulativeRuns; }
        public void setCumulativeRuns(Integer cumulativeRuns) { this.cumulativeRuns = cumulativeRuns; }

        public Integer getWickets() { return wickets; }
        public void setWickets(Integer wickets) { this.wickets = wickets; }

        public Double getCurrentRunRate() { return currentRunRate; }
        public void setCurrentRunRate(Double currentRunRate) { this.currentRunRate = currentRunRate; }
    }

    public static class PhaseAnalysisDTO {
        private PhaseDataDTO powerplay; // Overs 1-6
        private PhaseDataDTO middleOvers; // Overs 7-15
        private PhaseDataDTO deathOvers; // Overs 16-20

        public PhaseAnalysisDTO() {}

        public PhaseDataDTO getPowerplay() { return powerplay; }
        public void setPowerplay(PhaseDataDTO powerplay) { this.powerplay = powerplay; }

        public PhaseDataDTO getMiddleOvers() { return middleOvers; }
        public void setMiddleOvers(PhaseDataDTO middleOvers) { this.middleOvers = middleOvers; }

        public PhaseDataDTO getDeathOvers() { return deathOvers; }
        public void setDeathOvers(PhaseDataDTO deathOvers) { this.deathOvers = deathOvers; }
    }

    public static class PhaseDataDTO {
        private String phaseName;
        private Integer runsScored;
        private Integer wicketsLost;
        private Double runRate;

        public PhaseDataDTO() {}

        public String getPhaseName() { return phaseName; }
        public void setPhaseName(String phaseName) { this.phaseName = phaseName; }

        public Integer getRunsScored() { return runsScored; }
        public void setRunsScored(Integer runsScored) { this.runsScored = runsScored; }

        public Integer getWicketsLost() { return wicketsLost; }
        public void setWicketsLost(Integer wicketsLost) { this.wicketsLost = wicketsLost; }

        public Double getRunRate() { return runRate; }
        public void setRunRate(Double runRate) { this.runRate = runRate; }
    }

    public static class PercentageStatsDTO {
        private Double dotBallPercentage;
        private Double boundaryPercentage;
        private Double strikeRotationPercentage;

        public PercentageStatsDTO() {}

        public Double getDotBallPercentage() { return dotBallPercentage; }
        public void setDotBallPercentage(Double dotBallPercentage) { this.dotBallPercentage = dotBallPercentage; }

        public Double getBoundaryPercentage() { return boundaryPercentage; }
        public void setBoundaryPercentage(Double boundaryPercentage) { this.boundaryPercentage = boundaryPercentage; }

        public Double getStrikeRotationPercentage() { return strikeRotationPercentage; }
        public void setStrikeRotationPercentage(Double strikeRotationPercentage) { this.strikeRotationPercentage = strikeRotationPercentage; }
    }
}
