package com.gamepulse.service;

import com.gamepulse.dto.MatchPulseDTO;
import com.gamepulse.entity.Delivery;
import com.gamepulse.entity.FanPoll;
import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import com.gamepulse.repository.DeliveryRepository;
import com.gamepulse.repository.FanPollRepository;
import com.gamepulse.repository.InningsRepository;
import com.gamepulse.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FanEngagementService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private FanPollRepository fanPollRepository;

    @Autowired(required = false)
    private MatchEventPublisher matchEventPublisher;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public FanPoll createPoll(Long matchId, String question, List<String> options) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        FanPoll poll = new FanPoll();
        poll.setMatch(match);
        poll.setQuestion(question);
        poll.setOptions(new ArrayList<>(options));
        List<Integer> initialVotes = new ArrayList<>();
        for (int i = 0; i < options.size(); i++) {
            initialVotes.add(0);
        }
        poll.setVotes(initialVotes);
        poll.setActive(true);

        FanPoll saved = fanPollRepository.save(poll);
        if (matchEventPublisher != null) {
            matchEventPublisher.publishMatchUpdate(matchId, "POLL_CREATED", null);
        }

        try {
            notificationService.broadcastNotification(
                    "New Fan Poll!",
                    question,
                    com.gamepulse.entity.Notification.NotificationType.POLL,
                    matchId,
                    "/scoreboard/" + matchId
            );
        } catch (Exception ignored) {}

        return saved;
    }

    @Transactional
    public FanPoll votePoll(Long pollId, Integer optionIndex) {
        FanPoll poll = fanPollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("Poll not found: " + pollId));

        if (!Boolean.TRUE.equals(poll.getActive())) {
            throw new IllegalStateException("Cannot vote on an inactive poll: " + pollId);
        }

        if (optionIndex == null || optionIndex < 0 || optionIndex >= poll.getOptions().size()) {
            throw new IllegalArgumentException("Invalid option index: " + optionIndex);
        }

        List<Integer> votes = new ArrayList<>(poll.getVotes());
        votes.set(optionIndex, votes.get(optionIndex) + 1);
        poll.setVotes(votes);

        FanPoll saved = fanPollRepository.save(poll);
        if (matchEventPublisher != null && poll.getMatch() != null) {
            matchEventPublisher.publishMatchUpdate(poll.getMatch().getId(), "POLL_VOTED", null);
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<FanPoll> getMatchPolls(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));
        return fanPollRepository.findByMatch(match);
    }

    @Transactional(readOnly = true)
    public MatchPulseDTO getMatchPulse(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        MatchPulseDTO pulse = new MatchPulseDTO();
        pulse.setMatchId(matchId);

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        if (inningsList.isEmpty()) {
            pulse.setTeamAWinProbability(50.0);
            pulse.setTeamBWinProbability(50.0);
            pulse.setCurrentStatusText("Match Scheduled");
            pulse.setMatchMomentum("EVEN");
            pulse.setKeyHighlights(List.of());
            return pulse;
        }

        Innings currentInnings = inningsList.get(inningsList.size() - 1);
        int currentInningsNum = currentInnings.getInningsNumber();

        double winProbA = 50.0;
        double winProbB = 50.0;
        double rrr = 0.0;
        double crr = 0.0;

        int totalOvers = match.getTotalOvers() != null ? match.getTotalOvers() : 20;
        int ballsBowled = currentInnings.getLegalBallCount() != null ? currentInnings.getLegalBallCount() : 0;
        int remainingBalls = Math.max(1, (totalOvers * 6) - ballsBowled);
        int runs = currentInnings.getTotalRuns() != null ? currentInnings.getTotalRuns() : 0;
        int wickets = currentInnings.getTotalWickets() != null ? currentInnings.getTotalWickets() : 0;

        crr = ballsBowled > 0 ? Math.round((double) runs / (ballsBowled / 6.0) * 100.0) / 100.0 : 0.0;

        if (currentInningsNum == 1) {
            // First innings prediction model based on projected score vs average par
            int parScore = totalOvers * 8; // ~160 in T20
            int projectedScore = (int) (crr * totalOvers);
            if (ballsBowled < 18) projectedScore = parScore;
            double diff = projectedScore - parScore - (wickets * 8);

            winProbA = Math.min(95.0, Math.max(5.0, 50.0 + diff * 0.8));
            winProbB = 100.0 - winProbA;
        } else {
            // Second innings target chase model
            Innings innings1 = inningsList.get(0);
            int target = currentInnings.getTargetRuns() != null ? currentInnings.getTargetRuns() : innings1.getTotalRuns() + 1;
            int neededRuns = Math.max(0, target - runs);

            rrr = Math.round((double) neededRuns / (remainingBalls / 6.0) * 100.0) / 100.0;

            if (neededRuns <= 0) {
                // Batting team won
                winProbB = currentInnings.getBattingTeam().getId().equals(match.getTeamA().getId()) ? 100.0 : 0.0;
                winProbA = 100.0 - winProbB;
            } else if (wickets >= 10 || remainingBalls == 0) {
                // Bowling team won
                winProbA = currentInnings.getBowlingTeam().getId().equals(match.getTeamA().getId()) ? 100.0 : 0.0;
                winProbB = 100.0 - winProbA;
            } else {
                double wicketsFactor = (10 - wickets) * 5.0;
                double rrrFactor = (12.0 - rrr) * 4.0;
                double battingWinChance = Math.min(95.0, Math.max(5.0, 50.0 + wicketsFactor + rrrFactor));

                if (currentInnings.getBattingTeam().getId().equals(match.getTeamA().getId())) {
                    winProbA = battingWinChance;
                    winProbB = 100.0 - winProbA;
                } else {
                    winProbB = battingWinChance;
                    winProbA = 100.0 - winProbB;
                }
            }
        }

        pulse.setTeamAWinProbability(Math.round(winProbA * 10.0) / 10.0);
        pulse.setTeamBWinProbability(Math.round(winProbB * 10.0) / 10.0);
        pulse.setCurrentRunRate(crr);
        pulse.setRequiredRunRate(rrr);
        pulse.setCurrentStatusText(match.getStatus() != null ? match.getStatus().name() : "LIVE");
        pulse.setMatchMomentum(winProbA > 60 ? match.getTeamA().getName() + " DOMINATING" : winProbB > 60 ? match.getTeamB().getName() + " DOMINATING" : "HIGHLY BALANCED");

        // Key Highlights filter (wickets, 4s, 6s)
        List<Delivery> deliveries = deliveryRepository.findByInningsOrderBySequenceNumberAsc(currentInnings);
        List<String> highlights = deliveries.stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsWicket()) || (d.getRunsOffBat() != null && d.getRunsOffBat() >= 4))
                .map(d -> "Over " + d.getOverNumber() + "." + d.getBallNumber() + ": " + (Boolean.TRUE.equals(d.getIsWicket()) ? "WICKET! " + d.getCommentary() : d.getRunsOffBat() + " RUNS! " + d.getCommentary()))
                .limit(10)
                .collect(Collectors.toList());

        pulse.setKeyHighlights(highlights);
        return pulse;
    }
}
