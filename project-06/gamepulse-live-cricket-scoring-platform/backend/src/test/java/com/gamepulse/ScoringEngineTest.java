package com.gamepulse;

import com.gamepulse.dto.DeliveryRequestDTO;
import com.gamepulse.dto.DeliveryResponseDTO;
import com.gamepulse.dto.MatchCreateRequestDTO;
import com.gamepulse.dto.StartInningsRequestDTO;
import com.gamepulse.dto.TossRequestDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.MatchService;
import com.gamepulse.service.ScoringService;
import com.gamepulse.service.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ScoringEngineTest {

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

    @Autowired
    private MatchService matchService;

    @Autowired
    private ScoringService scoringService;

    private Team teamA;
    private Team teamB;
    private Player batter1;
    private Player batter2;
    private Player batter3;
    private Player bowler1;
    private Player bowler2;
    private Match match;
    private Innings innings;

    @BeforeEach
    public void setup() {
        teamA = teamRepository.save(Team.builder().name("India").shortName("IND").city("Mumbai").build());
        teamB = teamRepository.save(Team.builder().name("Australia").shortName("AUS").city("Sydney").build());

        batter1 = playerRepository.save(Player.builder().name("Rohit Sharma").role(PlayerRole.BATTER).team(teamA).build());
        batter2 = playerRepository.save(Player.builder().name("Shubman Gill").role(PlayerRole.BATTER).team(teamA).build());
        batter3 = playerRepository.save(Player.builder().name("Virat Kohli").role(PlayerRole.BATTER).team(teamA).build());

        bowler1 = playerRepository.save(Player.builder().name("Mitchell Starc").role(PlayerRole.BOWLER).team(teamB).build());
        bowler2 = playerRepository.save(Player.builder().name("Pat Cummins").role(PlayerRole.BOWLER).team(teamB).build());

        MatchCreateRequestDTO createMatch = MatchCreateRequestDTO.builder()
                .teamAId(teamA.getId())
                .teamBId(teamB.getId())
                .venue("Wankhede Stadium")
                .format("T20")
                .totalOvers(20)
                .matchDate(Instant.now())
                .build();
        match = matchService.createMatch(createMatch);

        TossRequestDTO toss = TossRequestDTO.builder()
                .tossWinnerId(teamA.getId())
                .tossDecision("BAT")
                .build();
        match = matchService.recordToss(match.getId(), toss);

        StartInningsRequestDTO start = StartInningsRequestDTO.builder()
                .strikerId(batter1.getId())
                .nonStrikerId(batter2.getId())
                .bowlerId(bowler1.getId())
                .build();
        innings = matchService.startInnings(match.getId(), start);
    }

    @Test
    @DisplayName("TEST 1: Dot ball")
    public void test01_dotBall() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(0).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(0, res.getTotalRuns());
        assertTrue(res.getIsLegalDelivery());
        assertEquals("0/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 2: Single run")
    public void test02_singleRun() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(1).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(1, res.getTotalRuns());
        assertEquals("1/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 3: Two runs")
    public void test03_twoRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(2).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(2, res.getTotalRuns());
        assertEquals("2/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 4: Three runs")
    public void test04_threeRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(3).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(3, res.getTotalRuns());
        assertEquals("3/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 5: Four runs")
    public void test05_fourRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(4).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(4, res.getTotalRuns());
        assertEquals("4/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 6: Six runs")
    public void test06_sixRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(6).extraType(ExtraType.NONE).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(6, res.getTotalRuns());
        assertEquals("6/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 7: Wide ball")
    public void test07_wide() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.WIDE).extraRuns(1).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(1, res.getTotalRuns());
        assertFalse(res.getIsLegalDelivery());
        assertEquals("1/0 (0.0)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 8: Multiple wide runs")
    public void test08_multipleWideRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.WIDE).extraRuns(3).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(3, res.getTotalRuns());
        assertFalse(res.getIsLegalDelivery());
        assertEquals("3/0 (0.0)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 9: No ball")
    public void test09_noBall() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.NO_BALL).extraRuns(1).runsOffBat(0).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(1, res.getTotalRuns());
        assertFalse(res.getIsLegalDelivery());
        assertEquals("1/0 (0.0)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 10: No ball + bat runs")
    public void test10_noBallWithBatRuns() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.NO_BALL).extraRuns(1).runsOffBat(4).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(5, res.getTotalRuns()); // 1 penalty + 4 bat runs
        assertFalse(res.getIsLegalDelivery());
        assertEquals("5/0 (0.0)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 11: Bye runs")
    public void test11_bye() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.BYE).extraRuns(2).runsOffBat(0).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(2, res.getTotalRuns());
        assertTrue(res.getIsLegalDelivery());
        assertEquals("2/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 12: Leg bye runs")
    public void test12_legBye() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().extraType(ExtraType.LEG_BYE).extraRuns(1).runsOffBat(0).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(1, res.getTotalRuns());
        assertTrue(res.getIsLegalDelivery());
        assertEquals("1/0 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 13: Bowled wicket")
    public void test13_bowled() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .isWicket(true)
                .wicketType(WicketType.BOWLED)
                .dismissedPlayerId(batter1.getId())
                .newBatterId(batter3.getId())
                .build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertTrue(res.getIsWicket());
        assertEquals(WicketType.BOWLED, res.getWicketType());
        assertEquals("0/1 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 14: Caught wicket")
    public void test14_caught() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .isWicket(true)
                .wicketType(WicketType.CAUGHT)
                .dismissedPlayerId(batter1.getId())
                .newBatterId(batter3.getId())
                .build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertTrue(res.getIsWicket());
        assertEquals(WicketType.CAUGHT, res.getWicketType());
        assertEquals("0/1 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 15: LBW wicket")
    public void test15_lbw() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .isWicket(true)
                .wicketType(WicketType.LBW)
                .dismissedPlayerId(batter1.getId())
                .newBatterId(batter3.getId())
                .build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertTrue(res.getIsWicket());
        assertEquals(WicketType.LBW, res.getWicketType());
        assertEquals("0/1 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 16: Run out wicket")
    public void test16_runOut() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .runsOffBat(1)
                .isWicket(true)
                .wicketType(WicketType.RUN_OUT)
                .dismissedPlayerId(batter2.getId())
                .newBatterId(batter3.getId())
                .build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertTrue(res.getIsWicket());
        assertEquals(WicketType.RUN_OUT, res.getWicketType());
        assertEquals("1/1 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 17: Stumped wicket")
    public void test17_stumped() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .isWicket(true)
                .wicketType(WicketType.STUMPED)
                .dismissedPlayerId(batter1.getId())
                .newBatterId(batter3.getId())
                .build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertTrue(res.getIsWicket());
        assertEquals(WicketType.STUMPED, res.getWicketType());
        assertEquals("0/1 (0.1)", res.getInningsScoreDisplay());
    }

    @Test
    @DisplayName("TEST 18: Six legal balls completes over")
    public void test18_sixLegalBallsCompletesOver() {
        for (int i = 0; i < 6; i++) {
            DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(0).build();
            scoringService.processDelivery(innings.getId(), req, "TEST");
        }
        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals("1.0", updated.getTotalOversDisplay());
        assertEquals(6, updated.getLegalBallCount());
    }

    @Test
    @DisplayName("TEST 19: Wide does not count as legal ball")
    public void test19_wideDoesNotCountAsLegalBall() {
        DeliveryRequestDTO wideReq = DeliveryRequestDTO.builder().extraType(ExtraType.WIDE).extraRuns(1).build();
        scoringService.processDelivery(innings.getId(), wideReq, "TEST");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(0, updated.getLegalBallCount());
        assertEquals("0.0", updated.getTotalOversDisplay());
    }

    @Test
    @DisplayName("TEST 20: No-ball does not count as legal ball")
    public void test20_noBallDoesNotCountAsLegalBall() {
        DeliveryRequestDTO nbReq = DeliveryRequestDTO.builder().extraType(ExtraType.NO_BALL).extraRuns(1).build();
        scoringService.processDelivery(innings.getId(), nbReq, "TEST");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(0, updated.getLegalBallCount());
        assertEquals("0.0", updated.getTotalOversDisplay());
    }

    @Test
    @DisplayName("TEST 21: Strike rotation on odd runs")
    public void test21_strikeRotation() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(1).build();
        scoringService.processDelivery(innings.getId(), req, "TEST");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(batter2.getId(), updated.getCurrentStriker().getId());
        assertEquals(batter1.getId(), updated.getCurrentNonStriker().getId());
    }

    @Test
    @DisplayName("TEST 22: Over-end strike rotation")
    public void test22_overEndStrikeRotation() {
        // 6 dot balls (even total runs = 0 on each ball, but 6th ball completes over)
        for (int i = 0; i < 6; i++) {
            DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(0).build();
            scoringService.processDelivery(innings.getId(), req, "TEST");
        }
        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        // After 6 dot balls, striker should rotate due to end of over!
        assertEquals(batter2.getId(), updated.getCurrentStriker().getId());
        assertEquals(batter1.getId(), updated.getCurrentNonStriker().getId());
    }

    @Test
    @DisplayName("TEST 23: Innings completion on 10 wickets")
    public void test23_inningsCompletion() {
        Innings inn = inningsRepository.findById(innings.getId()).orElseThrow();
        inn.setTotalWickets(9);
        inningsRepository.save(inn);

        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .isWicket(true)
                .wicketType(WicketType.BOWLED)
                .dismissedPlayerId(batter1.getId())
                .build();
        scoringService.processDelivery(innings.getId(), req, "TEST");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(InningsStatus.COMPLETED, updated.getStatus());
        assertEquals(10, updated.getTotalWickets());
    }

    @Test
    @DisplayName("TEST 24: Target chase completion in Innings 2")
    public void test24_targetChaseCompletion() {
        // Set match to innings 2
        Match m = matchRepository.findById(match.getId()).orElseThrow();
        m.setCurrentInningsNumber(2);
        matchRepository.save(m);

        Innings inn2 = inningsRepository.save(Innings.builder()
                .match(m)
                .inningsNumber(2)
                .battingTeam(teamB)
                .bowlingTeam(teamA)
                .currentStriker(bowler1)
                .currentNonStriker(bowler2)
                .currentBowler(batter1)
                .targetRuns(50)
                .totalRuns(48)
                .status(InningsStatus.IN_PROGRESS)
                .build());

        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(4).build();
        scoringService.processDelivery(inn2.getId(), req, "TEST");

        Innings updated = inningsRepository.findById(inn2.getId()).orElseThrow();
        assertEquals(InningsStatus.COMPLETED, updated.getStatus());
        assertEquals(52, updated.getTotalRuns());

        Match updatedMatch = matchRepository.findById(match.getId()).orElseThrow();
        assertEquals(MatchStatus.COMPLETED, updatedMatch.getStatus());
        assertNotNull(updatedMatch.getWinningTeam());
    }

    @Test
    @DisplayName("TEST 25: Undo delivery")
    public void test25_undo() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(4).build();
        scoringService.processDelivery(innings.getId(), req, "TEST");

        Innings mid = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(4, mid.getTotalRuns());

        scoringService.undoLastDelivery(innings.getId(), "TEST");

        Innings postUndo = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(0, postUndo.getTotalRuns());
        assertEquals(0, postUndo.getLegalBallCount());
    }

    @Test
    @DisplayName("TEST 26: Delivery correction")
    public void test26_correction() {
        DeliveryRequestDTO req = DeliveryRequestDTO.builder().runsOffBat(4).build();
        DeliveryResponseDTO res = scoringService.processDelivery(innings.getId(), req, "TEST");

        DeliveryRequestDTO correctReq = DeliveryRequestDTO.builder().runsOffBat(6).build();
        scoringService.correctDelivery(res.getId(), correctReq, "TEST");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(6, updated.getTotalRuns());
    }

    @Test
    @DisplayName("TEST 27: Duplicate scoring request (Idempotency)")
    public void test27_duplicateScoringRequest() {
        String clientEvtId = "evt-12345";
        DeliveryRequestDTO req = DeliveryRequestDTO.builder()
                .clientEventId(clientEvtId)
                .runsOffBat(4)
                .build();

        DeliveryResponseDTO res1 = scoringService.processDelivery(innings.getId(), req, "TEST");
        DeliveryResponseDTO res2 = scoringService.processDelivery(innings.getId(), req, "TEST");

        assertEquals(res1.getId(), res2.getId());
        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(4, updated.getTotalRuns());
        assertEquals(1, updated.getLegalBallCount());
    }

    @Test
    @DisplayName("TEST 28: Concurrent scoring protection")
    public void test28_concurrentScoringProtection() {
        DeliveryRequestDTO req1 = DeliveryRequestDTO.builder().runsOffBat(1).build();
        DeliveryRequestDTO req2 = DeliveryRequestDTO.builder().runsOffBat(2).build();

        scoringService.processDelivery(innings.getId(), req1, "SCORER_1");
        scoringService.processDelivery(innings.getId(), req2, "SCORER_2");

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(3, updated.getTotalRuns());
        assertEquals(2, updated.getLegalBallCount());
    }

    @Test
    @DisplayName("TEST 29: Bowler conceded runs excludes byes/leg-byes")
    public void test29_bowlerConcededRuns() {
        // Bye
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().extraType(ExtraType.BYE).extraRuns(4).build(), "TEST");
        // Leg bye
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().extraType(ExtraType.LEG_BYE).extraRuns(2).build(), "TEST");
        // Wide
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().extraType(ExtraType.WIDE).extraRuns(1).build(), "TEST");

        BowlingPerformance bowlPerf = bowlingPerformanceRepository.findByInningsAndPlayer(innings, bowler1).orElseThrow();
        // Bowler should ONLY be charged 1 run for the WIDE (Byes & Leg Byes are team extras, not bowler conceded runs)
        assertEquals(1, bowlPerf.getRunsConceded());
    }

    @Test
    @DisplayName("TEST 30: Batter statistics calculation")
    public void test30_batterStatistics() {
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().runsOffBat(4).build(), "TEST");
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().extraType(ExtraType.WIDE).extraRuns(1).build(), "TEST"); // wide does NOT add ball faced
        scoringService.processDelivery(innings.getId(), DeliveryRequestDTO.builder().runsOffBat(6).build(), "TEST");

        BattingPerformance batPerf = battingPerformanceRepository.findByInningsAndPlayer(innings, batter1).orElseThrow();
        assertEquals(10, batPerf.getRuns());
        assertEquals(2, batPerf.getBallsFaced()); // 2 legal balls faced
        assertEquals(1, batPerf.getFours());
        assertEquals(1, batPerf.getSixes());
    }

    @Test
    @DisplayName("TEST 31: Batch offline delivery synchronization (Phase 11)")
    public void test31_syncDeliveriesBatch() {
        DeliveryRequestDTO req1 = DeliveryRequestDTO.builder().clientEventId("sync-001").runsOffBat(4).build();
        DeliveryRequestDTO req2 = DeliveryRequestDTO.builder().clientEventId("sync-002").runsOffBat(1).build();
        DeliveryRequestDTO req3 = DeliveryRequestDTO.builder().clientEventId("sync-003").extraType(ExtraType.WIDE).extraRuns(1).build();

        var resList = scoringService.syncDeliveries(innings.getId(), java.util.List.of(req1, req2, req3), "OFFLINE_SCORER");
        assertEquals(3, resList.size());

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(6, updated.getTotalRuns()); // 4 + 1 + 1
        assertEquals(2, updated.getLegalBallCount()); // 4 and 1 are legal, WIDE is not
    }

    @Test
    @DisplayName("TEST 32: Batch sync idempotency protection (Phase 11)")
    public void test32_syncDeliveriesIdempotency() {
        DeliveryRequestDTO req1 = DeliveryRequestDTO.builder().clientEventId("sync-dup-001").runsOffBat(6).build();
        DeliveryRequestDTO req2 = DeliveryRequestDTO.builder().clientEventId("sync-dup-002").runsOffBat(2).build();

        scoringService.syncDeliveries(innings.getId(), java.util.List.of(req1, req2), "OFFLINE_SCORER");

        // Repeat exact same batch sync
        var secondSyncRes = scoringService.syncDeliveries(innings.getId(), java.util.List.of(req1, req2), "OFFLINE_SCORER");
        assertEquals(2, secondSyncRes.size());

        Innings updated = inningsRepository.findById(innings.getId()).orElseThrow();
        assertEquals(8, updated.getTotalRuns()); // 6 + 2 = 8 runs ONLY once
        assertEquals(2, updated.getLegalBallCount()); // 2 legal balls ONLY once
    }
}
