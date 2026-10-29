package com.gamepulse;

import com.gamepulse.dto.*;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.MatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MatchServiceTest {

    @Autowired
    private MatchService matchService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    private Team teamA;
    private Team teamB;
    private Player p1;
    private Player p2;
    private Player p3;

    @BeforeEach
    void setUp() {
        teamA = Team.builder().name("Team A").shortName("TA").active(true).build();
        teamB = Team.builder().name("Team B").shortName("TB").active(true).build();
        teamRepository.save(teamA);
        teamRepository.save(teamB);

        p1 = Player.builder().name("Player 1").role(PlayerRole.BATTER).team(teamA).active(true).build();
        p2 = Player.builder().name("Player 2").role(PlayerRole.ALL_ROUNDER).team(teamA).active(true).build();
        p3 = Player.builder().name("Bowler 1").role(PlayerRole.BOWLER).team(teamB).active(true).build();
        playerRepository.save(p1);
        playerRepository.save(p2);
        playerRepository.save(p3);
    }

    @Test
    @DisplayName("Create match, record toss, save Playing XI and update rules")
    void testMatchFlow() {
        MatchCreateRequestDTO createDTO = MatchCreateRequestDTO.builder()
                .teamAId(teamA.getId())
                .teamBId(teamB.getId())
                .venue("Stadium A")
                .format("T20")
                .totalOvers(20)
                .build();

        Match match = matchService.createMatch(createDTO);
        assertNotNull(match.getId());
        assertEquals(MatchStatus.SCHEDULED, match.getStatus());

        // Record Toss
        TossRequestDTO tossDTO = TossRequestDTO.builder()
                .tossWinnerId(teamA.getId())
                .tossDecision("BAT")
                .build();
        match = matchService.recordToss(match.getId(), tossDTO);
        assertEquals(MatchStatus.TOSS, match.getStatus());
        assertEquals("BAT", match.getTossDecision());

        // Save Playing XI
        PlayingXIDTO xiDTO = new PlayingXIDTO();
        xiDTO.setMatchId(match.getId());
        xiDTO.setTeamId(teamA.getId());
        xiDTO.setIsLocked(true);

        PlayingXIDTO.MemberDTO m1 = new PlayingXIDTO.MemberDTO();
        m1.setPlayerId(p1.getId());
        m1.setIsCaptain(true);

        PlayingXIDTO.MemberDTO m2 = new PlayingXIDTO.MemberDTO();
        m2.setPlayerId(p2.getId());
        m2.setIsWicketKeeper(true);

        xiDTO.setPlayers(List.of(m1, m2));

        PlayingXIDTO savedXI = matchService.savePlayingXI(match.getId(), teamA.getId(), xiDTO);
        assertTrue(savedXI.getIsLocked());
        assertEquals(2, savedXI.getPlayers().size());

        final Long currentMatchId = match.getId();
        final PlayingXIDTO lockedDTO = xiDTO;
        // Verify locked XI modification throws exception
        assertThrows(IllegalStateException.class, () -> {
            matchService.savePlayingXI(currentMatchId, teamA.getId(), lockedDTO);
        });

        // Update Rules (e.g. Rain Delay & Reduced overs)
        MatchRuleRequestDTO ruleDTO = new MatchRuleRequestDTO();
        ruleDTO.setStatus(MatchStatus.RAIN_DELAY);
        ruleDTO.setRevisedOvers(15);
        ruleDTO.setInterruptionReason("Heavy Rain");

        Match updatedMatch = matchService.updateMatchRules(match.getId(), ruleDTO);
        assertEquals(MatchStatus.RAIN_DELAY, updatedMatch.getStatus());
        assertEquals(15, updatedMatch.getTotalOvers());

        // Test Share Summary Generation (Phase 14)
        MatchShareSummaryDTO shareSummary = matchService.getMatchShareSummary(match.getId());
        assertNotNull(shareSummary);
        assertEquals(match.getId(), shareSummary.getMatchId());
        assertEquals("Team A", shareSummary.getTeamAName());
        assertEquals("Team B", shareSummary.getTeamBName());
        assertNotNull(shareSummary.getHeadline());
        assertNotNull(shareSummary.getFormattedText());
        assertTrue(shareSummary.getShareUrl().contains("/scoreboard/"));
    }
}

