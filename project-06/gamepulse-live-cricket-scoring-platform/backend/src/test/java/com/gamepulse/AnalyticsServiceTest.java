package com.gamepulse;

import com.gamepulse.dto.MatchAnalyticsDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AnalyticsServiceTest {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private OverRepository overRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    private Match match;
    private Match emptyMatch;
    private Match T10Match;

    @BeforeEach
    void setUp() {
        Team t1 = Team.builder().name("Team A").shortName("TA").active(true).build();
        Team t2 = Team.builder().name("Team B").shortName("TB").active(true).build();
        teamRepository.save(t1);
        teamRepository.save(t2);

        Player p1 = Player.builder().name("Player 1").role(PlayerRole.BATTER).team(t1).active(true).build();
        Player p2 = Player.builder().name("Player 2").role(PlayerRole.BATTER).team(t1).active(true).build();
        Player p3 = Player.builder().name("Player 3").role(PlayerRole.BOWLER).team(t2).active(true).build();
        playerRepository.save(p1);
        playerRepository.save(p2);
        playerRepository.save(p3);

        match = Match.builder().teamA(t1).teamB(t2).format("T20").totalOvers(20).status(MatchStatus.LIVE).build();
        matchRepository.save(match);

        emptyMatch = Match.builder().teamA(t1).teamB(t2).format("T20").totalOvers(20).status(MatchStatus.SCHEDULED).build();
        matchRepository.save(emptyMatch);

        T10Match = Match.builder().teamA(t1).teamB(t2).format("T10").totalOvers(10).status(MatchStatus.LIVE).build();
        matchRepository.save(T10Match);

        Innings inn = Innings.builder().match(match).inningsNumber(1).battingTeam(t1).bowlingTeam(t2).build();
        inningsRepository.save(inn);

        Over o1 = Over.builder().innings(inn).overNumber(1).bowler(p3).totalRuns(8).totalWickets(0).build();
        overRepository.save(o1);

        Delivery d1 = Delivery.builder().innings(inn).overNumber(1).ballNumber(1).sequenceNumber(1L).striker(p1).nonStriker(p2).bowler(p3).runsOffBat(4).isLegalDelivery(true).build();
        Delivery d2 = Delivery.builder().innings(inn).overNumber(1).ballNumber(2).sequenceNumber(2L).striker(p1).nonStriker(p2).bowler(p3).runsOffBat(0).isLegalDelivery(true).build();
        Delivery d3 = Delivery.builder().innings(inn).overNumber(1).ballNumber(3).sequenceNumber(3L).striker(p1).nonStriker(p2).bowler(p3).runsOffBat(1).isLegalDelivery(true).build();
        deliveryRepository.save(d1);
        deliveryRepository.save(d2);
        deliveryRepository.save(d3);
    }

    @Test
    @DisplayName("Verify match worm graph, phase breakdown and dot/boundary percentages")
    void testMatchAnalytics() {
        MatchAnalyticsDTO analytics = analyticsService.getMatchAnalytics(match.getId());
        assertNotNull(analytics);
        assertEquals(match.getId(), analytics.getMatchId());

        assertNotNull(analytics.getWormGraph());
        assertFalse(analytics.getWormGraph().isEmpty());

        assertEquals(8, analytics.getPhaseAnalysis().getPowerplay().getRunsScored());
        assertEquals(33.33, analytics.getStatsPercentages().getBoundaryPercentage()); // 1 boundary out of 3 legal balls
        assertEquals(33.33, analytics.getStatsPercentages().getDotBallPercentage()); // 1 dot out of 3 legal balls
        assertEquals(33.33, analytics.getStatsPercentages().getStrikeRotationPercentage()); // 1 single out of 3 legal balls
    }

    @Test
    @DisplayName("Verify empty match handling without division by zero errors")
    void testEmptyMatchAnalytics() {
        MatchAnalyticsDTO analytics = analyticsService.getMatchAnalytics(emptyMatch.getId());
        assertNotNull(analytics);
        assertEquals(0.0, analytics.getStatsPercentages().getDotBallPercentage());
        assertEquals(0.0, analytics.getStatsPercentages().getBoundaryPercentage());
        assertEquals(0.0, analytics.getStatsPercentages().getStrikeRotationPercentage());
    }

    @Test
    @DisplayName("Verify reduced overs match phase calculation")
    void testReducedOversPhaseCalculation() {
        MatchAnalyticsDTO analytics = analyticsService.getMatchAnalytics(T10Match.getId());
        assertNotNull(analytics);
        assertNotNull(analytics.getPhaseAnalysis());
        assertTrue(analytics.getPhaseAnalysis().getPowerplay().getPhaseName().contains("Overs 1-3"));
    }
}
