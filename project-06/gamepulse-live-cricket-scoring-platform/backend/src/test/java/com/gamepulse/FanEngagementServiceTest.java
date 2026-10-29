package com.gamepulse;

import com.gamepulse.dto.MatchPulseDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import com.gamepulse.service.FanEngagementService;
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
public class FanEngagementServiceTest {

    @Autowired
    private FanEngagementService fanEngagementService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    private Team t1;
    private Team t2;
    private Match match;

    @BeforeEach
    void setUp() {
        t1 = Team.builder().name("India").shortName("IND").active(true).build();
        t2 = Team.builder().name("Australia").shortName("AUS").active(true).build();
        teamRepository.save(t1);
        teamRepository.save(t2);

        match = Match.builder().teamA(t1).teamB(t2).format("T20").totalOvers(20).status(MatchStatus.LIVE).build();
        matchRepository.save(match);
    }

    @Test
    @DisplayName("Verify Match Pulse 1st innings win probability and fan voting")
    void testFanEngagementFirstInnings() {
        Innings inn = Innings.builder().match(match).inningsNumber(1).battingTeam(t1).bowlingTeam(t2).totalRuns(140).legalBallCount(90).totalWickets(2).build();
        inningsRepository.save(inn);

        MatchPulseDTO pulse = fanEngagementService.getMatchPulse(match.getId());
        assertNotNull(pulse);
        assertNotNull(pulse.getTeamAWinProbability());
        assertNotNull(pulse.getTeamBWinProbability());
        assertEquals(100.0, pulse.getTeamAWinProbability() + pulse.getTeamBWinProbability(), 0.1);

        // Fan Poll test
        FanPoll poll = fanEngagementService.createPoll(match.getId(), "Who will win?", List.of("India", "Australia"));
        assertNotNull(poll.getId());
        assertEquals(2, poll.getOptions().size());

        FanPoll voted = fanEngagementService.votePoll(poll.getId(), 0);
        assertEquals(1, voted.getVotes().get(0));
    }

    @Test
    @DisplayName("Verify Match Pulse 2nd innings target chase probability and RRR calculation")
    void testFanEngagementSecondInnings() {
        Innings inn1 = Innings.builder().match(match).inningsNumber(1).battingTeam(t1).bowlingTeam(t2).totalRuns(160).legalBallCount(120).totalWickets(5).build();
        Innings inn2 = Innings.builder().match(match).inningsNumber(2).battingTeam(t2).bowlingTeam(t1).targetRuns(161).totalRuns(100).legalBallCount(60).totalWickets(3).build();
        inningsRepository.save(inn1);
        inningsRepository.save(inn2);

        MatchPulseDTO pulse = fanEngagementService.getMatchPulse(match.getId());
        assertNotNull(pulse);
        assertNotNull(pulse.getRequiredRunRate());
        assertTrue(pulse.getRequiredRunRate() > 0);
        assertEquals(100.0, pulse.getTeamAWinProbability() + pulse.getTeamBWinProbability(), 0.1);
    }

    @Test
    @DisplayName("Verify inactive poll vote rejection")
    void testInactivePollVoting() {
        FanPoll poll = fanEngagementService.createPoll(match.getId(), "Next boundary?", List.of("Yes", "No"));
        poll.setActive(false);

        assertThrows(IllegalStateException.class, () -> {
            fanEngagementService.votePoll(poll.getId(), 0);
        });
    }

    @Test
    @DisplayName("Verify invalid option index vote rejection")
    void testInvalidOptionIndexVoting() {
        FanPoll poll = fanEngagementService.createPoll(match.getId(), "Next boundary?", List.of("Yes", "No"));

        assertThrows(IllegalArgumentException.class, () -> {
            fanEngagementService.votePoll(poll.getId(), 99);
        });
    }
}
