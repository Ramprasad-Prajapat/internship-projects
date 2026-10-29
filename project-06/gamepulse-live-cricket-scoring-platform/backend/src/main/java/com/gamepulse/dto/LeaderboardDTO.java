package com.gamepulse.dto;

import java.util.List;

public class LeaderboardDTO {
    private List<PlayerStatsDTO> topRunScorers;
    private List<PlayerStatsDTO> topWicketTakers;
    private List<PlayerStatsDTO> bestStrikeRates;
    private List<PlayerStatsDTO> bestEconomies;
    private List<PlayerStatsDTO> mostSixes;
    private List<PlayerStatsDTO> mostFours;
    private List<PlayerStatsDTO> mostCatches;

    public LeaderboardDTO() {}

    public List<PlayerStatsDTO> getTopRunScorers() { return topRunScorers; }
    public void setTopRunScorers(List<PlayerStatsDTO> topRunScorers) { this.topRunScorers = topRunScorers; }

    public List<PlayerStatsDTO> getTopWicketTakers() { return topWicketTakers; }
    public void setTopWicketTakers(List<PlayerStatsDTO> topWicketTakers) { this.topWicketTakers = topWicketTakers; }

    public List<PlayerStatsDTO> getBestStrikeRates() { return bestStrikeRates; }
    public void setBestStrikeRates(List<PlayerStatsDTO> bestStrikeRates) { this.bestStrikeRates = bestStrikeRates; }

    public List<PlayerStatsDTO> getBestEconomies() { return bestEconomies; }
    public void setBestEconomies(List<PlayerStatsDTO> bestEconomies) { this.bestEconomies = bestEconomies; }

    public List<PlayerStatsDTO> getMostSixes() { return mostSixes; }
    public void setMostSixes(List<PlayerStatsDTO> mostSixes) { this.mostSixes = mostSixes; }

    public List<PlayerStatsDTO> getMostFours() { return mostFours; }
    public void setMostFours(List<PlayerStatsDTO> mostFours) { this.mostFours = mostFours; }

    public List<PlayerStatsDTO> getMostCatches() { return mostCatches; }
    public void setMostCatches(List<PlayerStatsDTO> mostCatches) { this.mostCatches = mostCatches; }
}
