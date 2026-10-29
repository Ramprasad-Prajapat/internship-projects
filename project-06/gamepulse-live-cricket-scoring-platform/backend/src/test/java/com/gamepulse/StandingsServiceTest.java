package com.gamepulse;

import com.gamepulse.config.PointsConfig;
import com.gamepulse.dto.StandingsDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.StandingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class StandingsServiceTest {

    @Autowired
    private StandingsService standingsService;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private TournamentTeamStatisticsRepository statsRepository;

    private Tournament tournament;
    private Team teamA;
    private Team teamB;

    @BeforeEach
    void setUp() {
        teamA = Team.builder().name("Team Alpha").shortName("ALPHA").active(true).build();
        teamB = Team.builder().name("Team Beta").shortName("BETA").active(true).build();
        teamRepository.save(teamA);
        teamRepository.save(teamB);

        tournament = Tournament.builder()
                .name("Premier Cup 2026")
                .slug("premier-cup-2026")
                .status(TournamentStatus.LIVE)
                .teams(List.of(teamA, teamB))
                .build();
        tournamentRepository.save(tournament);
    }

    @Test
    @DisplayName("Recalculate standings for a completed win match and verify NRR precision")
    void testRecalculateStandingsWinMatch() {
        Match match = Match.builder()
                .tournament(tournament)
                .teamA(teamA)
                .teamB(teamB)
                .status(MatchStatus.COMPLETED)
                .winningTeam(teamA)
                .resultSummary("Team Alpha won by 20 runs")
                .build();
        matchRepository.save(match);

        // Innings 1: Team A scored 180 runs in 20 overs (120 legal balls)
        Innings inn1 = Innings.builder()
                .match(match)
                .inningsNumber(1)
                .battingTeam(teamA)
                .bowlingTeam(teamB)
                .totalRuns(180)
                .legalBallCount(120)
                .build();
        inningsRepository.save(inn1);

        // Innings 2: Team B scored 160 runs in 20 overs (120 legal balls)
        Innings inn2 = Innings.builder()
                .match(match)
                .inningsNumber(2)
                .battingTeam(teamB)
                .bowlingTeam(teamA)
                .totalRuns(160)
                .legalBallCount(120)
                .build();
        inningsRepository.save(inn2);

        standingsService.recalculateStandings(tournament.getId());

        List<StandingsDTO> standings = standingsService.getStandings(tournament.getId());
        assertEquals(2, standings.size());

        StandingsDTO first = standings.get(0);
        assertEquals(teamA.getId(), first.getTeamId());
        assertEquals(1, first.getPlayed());
        assertEquals(1, first.getWon());
        assertEquals(2, first.getPoints());
        assertEquals(1.0, first.getNrr()); // (180/20) - (160/20) = 9.0 - 8.0 = 1.0

        StandingsDTO second = standings.get(1);
        assertEquals(teamB.getId(), second.getTeamId());
        assertEquals(1, second.getPlayed());
        assertEquals(1, second.getLost());
        assertEquals(0, second.getPoints());
        assertEquals(-1.0, second.getNrr());
    }
}
