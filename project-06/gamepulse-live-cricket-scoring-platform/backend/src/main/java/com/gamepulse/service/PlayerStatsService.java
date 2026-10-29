package com.gamepulse.service;

import com.gamepulse.dto.LeaderboardDTO;
import com.gamepulse.dto.PlayerStatsDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlayerStatsService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private BattingPerformanceRepository battingPerformanceRepository;

    @Autowired
    private BowlingPerformanceRepository bowlingPerformanceRepository;

    @Transactional(readOnly = true)
    public PlayerStatsDTO getPlayerStats(Long playerId, Long tournamentId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + playerId));

        PlayerStatsDTO stats = new PlayerStatsDTO();
        stats.setPlayerId(player.getId());
        stats.setPlayerName(player.getName());
        stats.setTeamName(player.getTeam() != null ? player.getTeam().getName() : "Free Agent");
        stats.setRole(player.getRole() != null ? player.getRole().name() : "PLAYER");

        List<BattingPerformance> battingList = battingPerformanceRepository.findByPlayer(player);
        List<BowlingPerformance> bowlingList = bowlingPerformanceRepository.findByPlayer(player);

        if (tournamentId != null) {
            battingList = battingList.stream()
                    .filter(bp -> bp.getInnings().getMatch().getTournament() != null &&
                            tournamentId.equals(bp.getInnings().getMatch().getTournament().getId()))
                    .collect(Collectors.toList());

            bowlingList = bowlingList.stream()
                    .filter(bp -> bp.getInnings().getMatch().getTournament() != null &&
                            tournamentId.equals(bp.getInnings().getMatch().getTournament().getId()))
                    .collect(Collectors.toList());
        }

        // Aggregate Batting
        Set<Long> matchIds = new HashSet<>();
        int runs = 0, balls = 0, highest = 0, notOuts = 0, fifties = 0, hundreds = 0, fours = 0, sixes = 0;
        boolean highestNotOut = false;
        List<String> formList = new ArrayList<>();

        for (BattingPerformance bp : battingList) {
            if (bp.getInnings() != null && bp.getInnings().getMatch() != null) {
                matchIds.add(bp.getInnings().getMatch().getId());
            }
            int r = bp.getRuns() != null ? bp.getRuns() : 0;
            int b = bp.getBallsFaced() != null ? bp.getBallsFaced() : 0;
            runs += r;
            balls += b;
            fours += bp.getFours() != null ? bp.getFours() : 0;
            sixes += bp.getSixes() != null ? bp.getSixes() : 0;

            boolean isOut = Boolean.TRUE.equals(bp.getIsOut()) || (bp.getDismissalText() != null && !bp.getDismissalText().isEmpty());
            if (!isOut) {
                notOuts++;
            }

            if (r >= 100) hundreds++;
            else if (r >= 50) fifties++;

            if (r > highest || (r == highest && !isOut)) {
                highest = r;
                highestNotOut = !isOut;
            }

            formList.add(r + (isOut ? "" : "*"));
        }

        int innings = battingList.size();
        stats.setInnings(innings);
        stats.setRuns(runs);
        stats.setBallsFaced(balls);
        stats.setHighestScore(highest);
        stats.setHighestScoreNotOut(highestNotOut);
        stats.setNotOuts(notOuts);
        stats.setFifties(fifties);
        stats.setHundreds(hundreds);
        stats.setFours(fours);
        stats.setSixes(sixes);

        int dismissals = innings - notOuts;
        stats.setAverage(dismissals > 0 ? Math.round((double) runs / dismissals * 100.0) / 100.0 : (double) runs);
        stats.setStrikeRate(balls > 0 ? Math.round((double) runs / balls * 100.0 * 100.0) / 100.0 : 0.0);

        // Recent Form (last 5)
        if (formList.size() > 5) {
            formList = formList.subList(formList.size() - 5, formList.size());
        }
        stats.setRecentForm(formList);

        // Aggregate Bowling
        int bowlInnings = bowlingList.size();
        int runsConceded = 0, wickets = 0, legalBalls = 0, fourW = 0, fiveW = 0;
        int bestW = 0, bestR = 9999;

        for (BowlingPerformance bp : bowlingList) {
            if (bp.getInnings() != null && bp.getInnings().getMatch() != null) {
                matchIds.add(bp.getInnings().getMatch().getId());
            }
            int w = bp.getWickets() != null ? bp.getWickets() : 0;
            int r = bp.getRunsConceded() != null ? bp.getRunsConceded() : 0;
            int b = bp.getLegalBallsCount() != null ? bp.getLegalBallsCount() : 0;

            wickets += w;
            runsConceded += r;
            legalBalls += b;

            if (w >= 5) fiveW++;
            else if (w == 4) fourW++;

            if (w > bestW || (w == bestW && r < bestR)) {
                bestW = w;
                bestR = r;
            }
        }

        stats.setMatches(matchIds.size());
        stats.setBowlingInnings(bowlInnings);
        double overs = (legalBalls / 6) + (legalBalls % 6) / 10.0;
        stats.setOversBowled(overs);
        stats.setRunsConceded(runsConceded);
        stats.setWickets(wickets);
        stats.setFourWickets(fourW);
        stats.setFiveWickets(fiveW);
        if (bestR != 9999) {
            stats.setBestBowling(bestW + "/" + bestR);
        }

        double totalOversDec = legalBalls / 6.0;
        stats.setBowlingAverage(wickets > 0 ? Math.round((double) runsConceded / wickets * 100.0) / 100.0 : 0.0);
        stats.setEconomy(totalOversDec > 0 ? Math.round((double) runsConceded / totalOversDec * 100.0) / 100.0 : 0.0);

        return stats;
    }

    @Transactional(readOnly = true)
    public LeaderboardDTO getLeaderboards(Long tournamentId) {
        List<Player> players = playerRepository.findAll();
        List<PlayerStatsDTO> allStats = players.stream()
                .map(p -> getPlayerStats(p.getId(), tournamentId))
                .collect(Collectors.toList());

        LeaderboardDTO dto = new LeaderboardDTO();

        dto.setTopRunScorers(allStats.stream()
                .filter(s -> s.getRuns() > 0)
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getRuns).reversed())
                .limit(10).collect(Collectors.toList()));

        dto.setTopWicketTakers(allStats.stream()
                .filter(s -> s.getWickets() > 0)
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getWickets).reversed())
                .limit(10).collect(Collectors.toList()));

        dto.setBestStrikeRates(allStats.stream()
                .filter(s -> s.getBallsFaced() >= 10)
                .sorted(Comparator.comparingDouble(PlayerStatsDTO::getStrikeRate).reversed())
                .limit(10).collect(Collectors.toList()));

        dto.setBestEconomies(allStats.stream()
                .filter(s -> s.getOversBowled() >= 2.0)
                .sorted(Comparator.comparingDouble(PlayerStatsDTO::getEconomy))
                .limit(10).collect(Collectors.toList()));

        dto.setMostSixes(allStats.stream()
                .filter(s -> s.getSixes() > 0)
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getSixes).reversed())
                .limit(10).collect(Collectors.toList()));

        dto.setMostFours(allStats.stream()
                .filter(s -> s.getFours() > 0)
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getFours).reversed())
                .limit(10).collect(Collectors.toList()));

        dto.setMostCatches(allStats.stream()
                .filter(s -> s.getCatches() > 0)
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getCatches).reversed())
                .limit(10).collect(Collectors.toList()));

        return dto;
    }
}
