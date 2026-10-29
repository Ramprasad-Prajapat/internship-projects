package com.gamepulse.service;

import com.gamepulse.config.PointsConfig;
import com.gamepulse.dto.StandingsDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StandingsService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private TournamentTeamStatisticsRepository statsRepository;

    @Autowired
    private PointsConfig pointsConfig;

    @Transactional
    public void recalculateStandings(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));
        // Clear existing stats
        List<TournamentTeamStatistics> existing = statsRepository.findByTournamentId(tournamentId);
        statsRepository.deleteAll(existing);

        // Initialize stats for each team
        Map<Long, TournamentTeamStatistics> teamStatsMap = new HashMap<>();
        for (Team team : tournament.getTeams()) {
            TournamentTeamStatistics stats = new TournamentTeamStatistics();
            stats.setTournament(tournament);
            stats.setTeam(team);
            teamStatsMap.put(team.getId(), stats);
        }

        // Process completed matches of this tournament
        List<Match> matches = matchRepository.findByTournamentIdAndStatus(tournamentId, MatchStatus.COMPLETED);
        for (Match match : matches) {
            // Determine result
            Team winner = match.getWinningTeam();
            boolean isTie = match.getResultSummary() != null && match.getResultSummary().equalsIgnoreCase("Match Tied");
            boolean isNoResult = match.getResultSummary() != null && match.getResultSummary().toLowerCase().contains("no result");

            // Update points
            for (Team team : Arrays.asList(match.getTeamA(), match.getTeamB())) {
                TournamentTeamStatistics stats = teamStatsMap.get(team.getId());
                stats.setPlayed(stats.getPlayed() + 1);
                if (isNoResult) {
                    stats.setNoResult(stats.getNoResult() + 1);
                    stats.setPoints(stats.getPoints() + pointsConfig.getNoResultPoints());
                } else if (isTie) {
                    stats.setTied(stats.getTied() + 1);
                    stats.setPoints(stats.getPoints() + pointsConfig.getTiePoints());
                } else if (team.equals(winner)) {
                    stats.setWon(stats.getWon() + 1);
                    stats.setPoints(stats.getPoints() + pointsConfig.getWinPoints());
                } else {
                    stats.setLost(stats.getLost() + 1);
                    stats.setPoints(stats.getPoints() + pointsConfig.getLossPoints());
                }
            }

            // Aggregate runs and overs from innings
            List<Innings> innList = inningsRepository.findByMatch(match);
            for (Innings inn : innList) {
                Team batting = inn.getBattingTeam();
                TournamentTeamStatistics stats = teamStatsMap.get(batting.getId());
                // Runs for
                stats.setRunsFor(stats.getRunsFor() + inn.getTotalRuns());
                // Overs for (legal balls or full allocated overs if all-out)
                double oversFor = (inn.getTotalWickets() >= 10 && match.getTotalOvers() > 0)
                        ? (double) match.getTotalOvers()
                        : (inn.getLegalBallCount() / 6.0);
                stats.setOversFor(stats.getOversFor() + oversFor);
                // Runs against (the opponent's innings runs)
                // Determine opponent team
                Team opponent = inn.getBowlingTeam();
                TournamentTeamStatistics oppStats = teamStatsMap.get(opponent.getId());
                oppStats.setRunsAgainst(oppStats.getRunsAgainst() + inn.getTotalRuns());
                oppStats.setOversAgainst(oppStats.getOversAgainst() + oversFor);
            }
        }

        // Calculate NRR for each team
        for (TournamentTeamStatistics stats : teamStatsMap.values()) {
            double runRateFor = stats.getOversFor() > 0 ? ((double) stats.getRunsFor() / stats.getOversFor()) : 0.0;
            double runRateAgainst = stats.getOversAgainst() > 0 ? ((double) stats.getRunsAgainst() / stats.getOversAgainst()) : 0.0;
            double nrr = runRateFor - runRateAgainst;
            stats.setNrr(Math.round(nrr * 1000.0) / 1000.0); // 3 decimal precision
            statsRepository.save(stats);
        }
    }

    @Transactional(readOnly = true)
    public List<StandingsDTO> getStandings(Long tournamentId) {
        List<TournamentTeamStatistics> stats = statsRepository.findByTournamentId(tournamentId);
        // Sort by points, then NRR, then won
        List<TournamentTeamStatistics> sorted = stats.stream()
                .sorted(Comparator.comparingInt(TournamentTeamStatistics::getPoints).reversed()
                        .thenComparing(Comparator.comparingDouble(TournamentTeamStatistics::getNrr).reversed())
                        .thenComparing(Comparator.comparingInt(TournamentTeamStatistics::getWon).reversed()))
                .collect(Collectors.toList());
        List<StandingsDTO> dtoList = new ArrayList<>();
        for (TournamentTeamStatistics s : sorted) {
            StandingsDTO dto = new StandingsDTO();
            dto.setTeamId(s.getTeam().getId());
            dto.setTeamName(s.getTeam().getName());
            dto.setPlayed(s.getPlayed());
            dto.setWon(s.getWon());
            dto.setLost(s.getLost());
            dto.setTied(s.getTied());
            dto.setNoResult(s.getNoResult());
            dto.setPoints(s.getPoints());
            dto.setRunsFor(s.getRunsFor());
            dto.setOversFor(s.getOversFor());
            dto.setRunsAgainst(s.getRunsAgainst());
            dto.setOversAgainst(s.getOversAgainst());
            dto.setNrr(s.getNrr());
            dtoList.add(dto);
        }
        return dtoList;
    }
}
