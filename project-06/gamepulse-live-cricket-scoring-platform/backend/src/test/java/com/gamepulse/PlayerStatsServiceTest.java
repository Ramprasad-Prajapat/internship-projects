package com.gamepulse;

import com.gamepulse.dto.LeaderboardDTO;
import com.gamepulse.dto.PlayerStatsDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.PlayerStatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PlayerStatsServiceTest {

    @Autowired
    private PlayerStatsService playerStatsService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private BattingPerformanceRepository battingPerformanceRepository;

    @Autowired
    private BowlingPerformanceRepository bowlingPerformanceRepository;

    private Player batter;
    private Player bowler;

    @BeforeEach
    void setUp() {
        Team team = Team.builder().name("Strikers").shortName("STR").active(true).build();
        teamRepository.save(team);

        batter = Player.builder().name("Virat").role(PlayerRole.BATTER).team(team).active(true).build();
        bowler = Player.builder().name("Bumrah").role(PlayerRole.BOWLER).team(team).active(true).build();
        playerRepository.save(batter);
        playerRepository.save(bowler);

        Match match = Match.builder().teamA(team).teamB(team).format("T20").status(MatchStatus.COMPLETED).build();
        matchRepository.save(match);

        Innings innings = Innings.builder().match(match).inningsNumber(1).battingTeam(team).bowlingTeam(team).build();
        inningsRepository.save(innings);

        BattingPerformance bp = BattingPerformance.builder()
                .innings(innings)
                .player(batter)
                .runs(56)
                .ballsFaced(30)
                .fours(6)
                .sixes(2)
                .isOut(true)
                .dismissalText("c Smith b Starc")
                .build();
        battingPerformanceRepository.save(bp);

        BowlingPerformance bowl = BowlingPerformance.builder()
                .innings(innings)
                .player(bowler)
                .legalBallsCount(24)
                .runsConceded(20)
                .wickets(3)
                .build();
        bowlingPerformanceRepository.save(bowl);
    }

    @Test
    @DisplayName("Verify career statistics and leaderboards derivation")
    void testPlayerStatsAndLeaderboards() {
        PlayerStatsDTO stats = playerStatsService.getPlayerStats(batter.getId(), null);
        assertEquals("Virat", stats.getPlayerName());
        assertEquals(56, stats.getRuns());
        assertEquals(30, stats.getBallsFaced());
        assertEquals(1, stats.getFifties());
        assertEquals(186.67, stats.getStrikeRate());

        PlayerStatsDTO bStats = playerStatsService.getPlayerStats(bowler.getId(), null);
        assertEquals(3, bStats.getWickets());
        assertEquals(5.0, bStats.getEconomy()); // 20 / 4 overs = 5.0

        LeaderboardDTO leaderboards = playerStatsService.getLeaderboards(null);
        assertNotNull(leaderboards.getTopRunScorers());
        assertFalse(leaderboards.getTopRunScorers().isEmpty());
        assertEquals(56, leaderboards.getTopRunScorers().get(0).getRuns());
    }
}
