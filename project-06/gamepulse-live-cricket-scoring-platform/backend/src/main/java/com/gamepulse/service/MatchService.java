package com.gamepulse.service;

import com.gamepulse.dto.MatchCreateRequestDTO;
import com.gamepulse.dto.MatchRuleRequestDTO;
import com.gamepulse.dto.PlayingXIDTO;
import com.gamepulse.dto.StartInningsRequestDTO;
import com.gamepulse.dto.TossRequestDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchPlayingXIRepository matchPlayingXIRepository;

    @Autowired
    private MatchEventPublisher eventPublisher;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Match createMatch(MatchCreateRequestDTO dto) {
        Team teamA = teamRepository.findById(dto.getTeamAId())
                .orElseThrow(() -> new IllegalArgumentException("Team A not found with id: " + dto.getTeamAId()));
        Team teamB = teamRepository.findById(dto.getTeamBId())
                .orElseThrow(() -> new IllegalArgumentException("Team B not found with id: " + dto.getTeamBId()));

        Tournament tournament = null;
        if (dto.getTournamentId() != null) {
            tournament = tournamentRepository.findById(dto.getTournamentId()).orElse(null);
        }

        Match match = Match.builder()
                .teamA(teamA)
                .teamB(teamB)
                .tournament(tournament)
                .venue(dto.getVenue())
                .matchDate(dto.getMatchDate())
                .format(dto.getFormat() != null ? dto.getFormat() : "T20")
                .totalOvers(dto.getTotalOvers() != null ? dto.getTotalOvers() : 20)
                .status(MatchStatus.SCHEDULED)
                .currentInningsNumber(1)
                .build();

        return matchRepository.save(match);
    }

    @Transactional
    public Match recordToss(Long matchId, TossRequestDTO request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        Team tossWinner = teamRepository.findById(request.getTossWinnerId())
                .orElseThrow(() -> new IllegalArgumentException("Toss winner team not found with id: " + request.getTossWinnerId()));

        match.setTossWinner(tossWinner);
        match.setTossDecision(request.getTossDecision().toUpperCase());
        match.setStatus(MatchStatus.TOSS);

        return matchRepository.save(match);
    }

    @Transactional
    public PlayingXIDTO savePlayingXI(Long matchId, Long teamId, PlayingXIDTO dto) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));

        List<MatchPlayingXI> existingList = matchPlayingXIRepository.findByMatchIdAndTeamId(matchId, teamId);
        boolean currentlyLocked = existingList.stream().anyMatch(MatchPlayingXI::getIsLocked);
        if (currentlyLocked && (dto.getIsLocked() == null || dto.getIsLocked())) {
            throw new IllegalStateException("Playing XI is locked and cannot be modified unless unlocked.");
        }

        matchPlayingXIRepository.deleteByMatchIdAndTeamId(matchId, teamId);

        List<MatchPlayingXI> list = new ArrayList<>();
        for (PlayingXIDTO.MemberDTO member : dto.getPlayers()) {
            Player player = playerRepository.findById(member.getPlayerId())
                    .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + member.getPlayerId()));

            MatchPlayingXI xi = MatchPlayingXI.builder()
                    .match(match)
                    .team(team)
                    .player(player)
                    .isCaptain(Boolean.TRUE.equals(member.getIsCaptain()))
                    .isWicketKeeper(Boolean.TRUE.equals(member.getIsWicketKeeper()))
                    .isSubstitute(Boolean.TRUE.equals(member.getIsSubstitute()))
                    .isLocked(Boolean.TRUE.equals(dto.getIsLocked()))
                    .build();
            list.add(xi);
        }

        matchPlayingXIRepository.saveAll(list);
        return getPlayingXI(matchId, teamId);
    }

    @Transactional(readOnly = true)
    public PlayingXIDTO getPlayingXI(Long matchId, Long teamId) {
        List<MatchPlayingXI> xiList = matchPlayingXIRepository.findByMatchIdAndTeamId(matchId, teamId);
        PlayingXIDTO dto = new PlayingXIDTO();
        dto.setMatchId(matchId);
        dto.setTeamId(teamId);
        boolean isLocked = xiList.stream().anyMatch(MatchPlayingXI::getIsLocked);
        dto.setIsLocked(isLocked);

        List<PlayingXIDTO.MemberDTO> members = xiList.stream().map(xi -> {
            PlayingXIDTO.MemberDTO m = new PlayingXIDTO.MemberDTO();
            m.setPlayerId(xi.getPlayer().getId());
            m.setPlayerName(xi.getPlayer().getName());
            m.setIsCaptain(xi.getIsCaptain());
            m.setIsWicketKeeper(xi.getIsWicketKeeper());
            m.setIsSubstitute(xi.getIsSubstitute());
            return m;
        }).collect(Collectors.toList());

        dto.setPlayers(members);
        return dto;
    }

    @Transactional
    public Match updateMatchRules(Long matchId, MatchRuleRequestDTO request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        if (request.getStatus() != null) {
            match.setStatus(request.getStatus());
        }

        if (request.getRevisedOvers() != null) {
            match.setTotalOvers(request.getRevisedOvers());
        }

        if (request.getRevisedTarget() != null && match.getCurrentInningsNumber() == 2) {
            Innings innings2 = inningsRepository.findByMatchAndInningsNumber(match, 2).orElse(null);
            if (innings2 != null) {
                innings2.setTargetRuns(request.getRevisedTarget());
                inningsRepository.save(innings2);
            }
        }

        if (request.getStatus() == MatchStatus.ABANDONED || request.getStatus() == MatchStatus.NO_RESULT) {
            match.setResultSummary(request.getInterruptionReason() != null ? request.getInterruptionReason() : "Match Abandoned / No Result");
        }

        return matchRepository.save(match);
    }

    @Transactional
    public Innings startInnings(Long matchId, StartInningsRequestDTO request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        if (match.getTossWinner() == null || match.getTossDecision() == null) {
            throw new IllegalStateException("Toss must be completed before starting innings");
        }

        Team battingTeam;
        Team bowlingTeam;

        int currentInningsNum = match.getCurrentInningsNumber();
        if (currentInningsNum == 1) {
            if ("BAT".equalsIgnoreCase(match.getTossDecision())) {
                battingTeam = match.getTossWinner();
                bowlingTeam = match.getTossWinner().getId().equals(match.getTeamA().getId()) ? match.getTeamB() : match.getTeamA();
            } else {
                bowlingTeam = match.getTossWinner();
                battingTeam = match.getTossWinner().getId().equals(match.getTeamA().getId()) ? match.getTeamB() : match.getTeamA();
            }
        } else {
            // Innings 2: Swap teams
            Innings innings1 = inningsRepository.findByMatchAndInningsNumber(match, 1)
                    .orElseThrow(() -> new IllegalStateException("Innings 1 not found"));
            battingTeam = innings1.getBowlingTeam();
            bowlingTeam = innings1.getBattingTeam();
        }

        Player striker = playerRepository.findById(request.getStrikerId())
                .orElseThrow(() -> new IllegalArgumentException("Striker not found with id: " + request.getStrikerId()));
        Player nonStriker = playerRepository.findById(request.getNonStrikerId())
                .orElseThrow(() -> new IllegalArgumentException("Non-striker not found with id: " + request.getNonStrikerId()));
        Player bowler = playerRepository.findById(request.getBowlerId())
                .orElseThrow(() -> new IllegalArgumentException("Bowler not found with id: " + request.getBowlerId()));

        Integer targetRuns = null;
        if (currentInningsNum == 2) {
            Innings innings1 = inningsRepository.findByMatchAndInningsNumber(match, 1).orElse(null);
            if (innings1 != null) {
                targetRuns = innings1.getTotalRuns() + 1;
            }
        }

        Innings innings = Innings.builder()
                .match(match)
                .inningsNumber(currentInningsNum)
                .battingTeam(battingTeam)
                .bowlingTeam(bowlingTeam)
                .currentStriker(striker)
                .currentNonStriker(nonStriker)
                .currentBowler(bowler)
                .targetRuns(targetRuns)
                .status(InningsStatus.IN_PROGRESS)
                .build();

        innings = inningsRepository.save(innings);

        match.setStatus(MatchStatus.LIVE);
        matchRepository.save(match);

        try {
            notificationService.broadcastNotification(
                    "Match Live!",
                    match.getTeamA().getName() + " vs " + match.getTeamB().getName() + " is now LIVE!",
                    com.gamepulse.entity.Notification.NotificationType.MATCH_STARTED,
                    match.getId(),
                    "/scoreboard/" + match.getId()
            );
        } catch (Exception ignored) {}

        return innings;
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + id));
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public List<Match> getLiveMatches() {
        return matchRepository.findByStatus(MatchStatus.LIVE);
    }

    public com.gamepulse.dto.MatchShareSummaryDTO getMatchShareSummary(Long matchId) {
        Match match = getMatchById(matchId);
        List<Innings> inningsList = inningsRepository.findByMatch(match);

        String teamAName = match.getTeamA() != null ? match.getTeamA().getName() : "Team A";
        String teamBName = match.getTeamB() != null ? match.getTeamB().getName() : "Team B";
        String statusStr = match.getStatus() != null ? match.getStatus().name() : "SCHEDULED";
        String venueStr = match.getVenue() != null ? match.getVenue() : "Stadium";
        String formatStr = match.getFormat() != null ? match.getFormat() : "T20";
        String resultStr = match.getResultSummary();

        String currentScoreDisplay = "";
        if (!inningsList.isEmpty()) {
            Innings lastInnings = inningsList.get(inningsList.size() - 1);
            String battingTeam = lastInnings.getBattingTeam() != null ? lastInnings.getBattingTeam().getName() : "Innings";
            int totalRuns = lastInnings.getTotalRuns() != null ? lastInnings.getTotalRuns() : 0;
            int totalWickets = lastInnings.getTotalWickets() != null ? lastInnings.getTotalWickets() : 0;
            String oversDisplay = lastInnings.getTotalOversDisplay() != null ? lastInnings.getTotalOversDisplay() : "0.0";
            currentScoreDisplay = battingTeam + " " + totalRuns + "/" + totalWickets + " (" + oversDisplay + " ov)";
        } else {
            currentScoreDisplay = "Match scheduled";
        }

        String headline = teamAName + " vs " + teamBName + " — " + ("COMPLETED".equals(statusStr) && resultStr != null ? resultStr : statusStr) + " | GamePulse Live";

        StringBuilder textBuilder = new StringBuilder();
        textBuilder.append("GamePulse Live Scorecard\n");
        textBuilder.append(teamAName).append(" vs ").append(teamBName).append("\n");
        textBuilder.append("Status: ").append(statusStr).append("\n");
        textBuilder.append("Score: ").append(currentScoreDisplay).append("\n");
        if (resultStr != null && !resultStr.trim().isEmpty()) {
            textBuilder.append("Result: ").append(resultStr).append("\n");
        }
        textBuilder.append("Format: ").append(formatStr).append(" | Venue: ").append(venueStr);

        String shareUrl = "/scoreboard/" + matchId;

        return new com.gamepulse.dto.MatchShareSummaryDTO(
                matchId,
                teamAName,
                teamBName,
                formatStr,
                venueStr,
                statusStr,
                resultStr,
                currentScoreDisplay,
                headline,
                textBuilder.toString(),
                shareUrl
        );
    }
}

