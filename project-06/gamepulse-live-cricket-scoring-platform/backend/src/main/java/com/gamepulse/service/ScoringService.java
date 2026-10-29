package com.gamepulse.service;

import com.gamepulse.dto.DeliveryRequestDTO;
import com.gamepulse.dto.DeliveryResponseDTO;
import com.gamepulse.dto.ScorecardResponseDTO;
import com.gamepulse.entity.*;
import com.gamepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScoringService {

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OverRepository overRepository;

    @Autowired
    private BattingPerformanceRepository battingPerformanceRepository;

    @Autowired
    private BowlingPerformanceRepository bowlingPerformanceRepository;

    @Autowired
    private PartnershipRepository partnershipRepository;

    @Autowired
    private FallOfWicketRepository fallOfWicketRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private MatchEventPublisher eventPublisher;

    @Autowired
    private StandingsService standingsService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CorrectionHistoryRepository correctionHistoryRepository;

    @Transactional
    public DeliveryResponseDTO processDelivery(Long inningsId, DeliveryRequestDTO request, String username) {
        // Idempotency check
        if (request.getClientEventId() != null && !request.getClientEventId().isBlank()) {
            Optional<Delivery> existing = deliveryRepository.findByClientEventId(request.getClientEventId());
            if (existing.isPresent()) {
                Delivery del = existing.get();
                return mapToDeliveryResponseDTO(del, del.getInnings());
            }
        }

        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new IllegalArgumentException("Innings not found with id: " + inningsId));

        Match match = innings.getMatch();
        if (match.getStatus() != MatchStatus.LIVE) {
            throw new IllegalStateException("Match is not in LIVE state for scoring");
        }
        if (innings.getStatus() != InningsStatus.IN_PROGRESS) {
            throw new IllegalStateException("Innings is not IN_PROGRESS");
        }

        // Determine current sequence number
        Long seq = deliveryRepository.findTopByInningsOrderBySequenceNumberDesc(innings)
                .map(d -> d.getSequenceNumber() + 1)
                .orElse(1L);

        // Resolve players
        Player striker = request.getStrikerId() != null ?
                playerRepository.findById(request.getStrikerId()).orElse(innings.getCurrentStriker()) : innings.getCurrentStriker();
        Player nonStriker = request.getNonStrikerId() != null ?
                playerRepository.findById(request.getNonStrikerId()).orElse(innings.getCurrentNonStriker()) : innings.getCurrentNonStriker();
        Player bowler = request.getBowlerId() != null ?
                playerRepository.findById(request.getBowlerId()).orElse(innings.getCurrentBowler()) : innings.getCurrentBowler();

        if (striker == null || nonStriker == null || bowler == null) {
            throw new IllegalArgumentException("Striker, non-striker, and bowler must be specified");
        }

        // Extra type logic
        ExtraType extraType = request.getExtraType() != null ? request.getExtraType() : ExtraType.NONE;
        boolean isLegal = (extraType == ExtraType.NONE || extraType == ExtraType.BYE || extraType == ExtraType.LEG_BYE || extraType == ExtraType.PENALTY);

        int runsOffBat = request.getRunsOffBat() != null ? request.getRunsOffBat() : 0;
        int extraRuns = request.getExtraRuns() != null ? request.getExtraRuns() : 0;

        if (extraType == ExtraType.WIDE && extraRuns == 0) {
            extraRuns = 1;
        } else if (extraType == ExtraType.NO_BALL && extraRuns == 0) {
            extraRuns = 1;
        }

        int totalRuns = runsOffBat + extraRuns;

        boolean isWicket = Boolean.TRUE.equals(request.getIsWicket()) || (request.getWicketType() != null && request.getWicketType() != WicketType.NONE);
        WicketType wicketType = request.getWicketType() != null ? request.getWicketType() : (isWicket ? WicketType.BOWLED : WicketType.NONE);

        Player dismissedPlayer = null;
        if (isWicket) {
            dismissedPlayer = request.getDismissedPlayerId() != null ?
                    playerRepository.findById(request.getDismissedPlayerId()).orElse(striker) : striker;
        }

        Player fielder = request.getFielderId() != null ? playerRepository.findById(request.getFielderId()).orElse(null) : null;

        // Current over calculation
        int currentOverNumber = (innings.getLegalBallCount() / 6) + 1;
        int currentBallNumber = (innings.getLegalBallCount() % 6) + (isLegal ? 1 : 0);

        String commentary = request.getCommentary();
        if (commentary == null || commentary.isBlank()) {
            commentary = buildAutoCommentary(striker, bowler, runsOffBat, extraRuns, extraType, isWicket, wicketType, dismissedPlayer);
        }

        Delivery delivery = Delivery.builder()
                .innings(innings)
                .overNumber(currentOverNumber)
                .ballNumber(currentBallNumber)
                .sequenceNumber(seq)
                .clientEventId(request.getClientEventId())
                .striker(striker)
                .nonStriker(nonStriker)
                .bowler(bowler)
                .runsOffBat(runsOffBat)
                .extraRuns(extraRuns)
                .totalRuns(totalRuns)
                .extraType(extraType)
                .isLegalDelivery(isLegal)
                .isWicket(isWicket)
                .wicketType(wicketType)
                .dismissedPlayer(dismissedPlayer)
                .fielder(fielder)
                .commentary(commentary)
                .createdBy(username != null ? username : "SCORER")
                .build();

        deliveryRepository.save(delivery);

        // Apply delivery to recalculate state
        applyDeliveryToInnings(innings, delivery, request.getNewBatterId(), request.getNewBowlerId());

        DeliveryResponseDTO response = mapToDeliveryResponseDTO(delivery, innings);

        // Audit log
        AuditLog audit = AuditLog.builder()
                .action("DELIVERY_SCORED")
                .entityName("Delivery")
                .entityId(delivery.getId())
                .performedBy(username != null ? username : "SCORER")
                .details("Scored delivery #" + seq + ": " + totalRuns + " runs, Wicket: " + isWicket)
                .build();
        auditLogRepository.save(audit);

        // Publish live update
        eventPublisher.publishMatchUpdate(match.getId(), "DELIVERY", getScorecard(match.getId()));

        // Phase 12 Notifications
        try {
            if (delivery.getIsWicket()) {
                notificationService.broadcastNotification(
                        "Wicket Alert!",
                        striker.getName() + " is OUT (" + delivery.getWicketType() + ")",
                        Notification.NotificationType.WICKET,
                        match.getId(),
                        "/scoreboard/" + match.getId()
                );
            }
            if (match.getStatus() == MatchStatus.COMPLETED && match.getWinningTeam() != null) {
                notificationService.broadcastNotification(
                        "Match Completed",
                        match.getWinningTeam().getName() + " won the match!",
                        Notification.NotificationType.MATCH_COMPLETED,
                        match.getId(),
                        "/scoreboard/" + match.getId()
                );
            }
        } catch (Exception ignored) {}

        return response;
    }

    @Transactional
    public void undoLastDelivery(Long inningsId, String username) {
        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new IllegalArgumentException("Innings not found with id: " + inningsId));

        Optional<Delivery> lastDelivery = deliveryRepository.findTopByInningsOrderBySequenceNumberDesc(innings);
        if (lastDelivery.isEmpty()) {
            return;
        }

        deliveryRepository.delete(lastDelivery.get());

        // Replay all remaining deliveries to recalculate clean state
        replayInningsState(innings);

        AuditLog audit = AuditLog.builder()
                .action("UNDO_DELIVERY")
                .entityName("Innings")
                .entityId(innings.getId())
                .performedBy(username != null ? username : "SCORER")
                .details("Reversed delivery #" + lastDelivery.get().getSequenceNumber())
                .build();
        auditLogRepository.save(audit);

        eventPublisher.publishMatchUpdate(innings.getMatch().getId(), "UNDO", getScorecard(innings.getMatch().getId()));
    }

    @Transactional
    public void correctDelivery(Long deliveryId, DeliveryRequestDTO newRequest, String username) {
        // Fetch existing delivery and snapshot old state
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found with id: " + deliveryId));
        // Convert old delivery to simple JSON-like string
        String oldValue = serializeDelivery(delivery);
        // Keep reference to innings before changes for audit
        Innings innings = delivery.getInnings();
        // Apply updates (same as original logic)
        if (newRequest.getRunsOffBat() != null) delivery.setRunsOffBat(newRequest.getRunsOffBat());
        if (newRequest.getExtraRuns() != null) delivery.setExtraRuns(newRequest.getExtraRuns());
        if (newRequest.getExtraType() != null) delivery.setExtraType(newRequest.getExtraType());
        boolean isLegal = (delivery.getExtraType() == ExtraType.NONE || delivery.getExtraType() == ExtraType.BYE || delivery.getExtraType() == ExtraType.LEG_BYE || delivery.getExtraType() == ExtraType.PENALTY);
        delivery.setIsLegalDelivery(isLegal);
        delivery.setTotalRuns(delivery.getRunsOffBat() + delivery.getExtraRuns());
        if (newRequest.getIsWicket() != null) delivery.setIsWicket(newRequest.getIsWicket());
        if (newRequest.getWicketType() != null) delivery.setWicketType(newRequest.getWicketType());
        if (newRequest.getCommentary() != null) delivery.setCommentary(newRequest.getCommentary());
        deliveryRepository.save(delivery);
        // Recalculate innings state after correction
        replayInningsState(innings);
        // Snapshot new state
        String newValue = serializeDelivery(delivery);
        // Persist correction history
        CorrectionHistory ch = new CorrectionHistory();
        ch.setDeliveryId(deliveryId);
        ch.setInningsId(innings.getId());
        ch.setMatchId(innings.getMatch().getId());
        ch.setCorrectedBy(username != null ? username : "SCORER");
        ch.setOldValue(oldValue);
        ch.setNewValue(newValue);
        ch.setCorrectedAt(Instant.now());
        correctionHistoryRepository.save(ch);
        // Audit log (already logs CORRECT_DELIVERY)
        AuditLog audit = AuditLog.builder()
                .action("CORRECT_DELIVERY")
                .entityName("Delivery")
                .entityId(delivery.getId())
                .performedBy(username != null ? username : "SCORER")
                .details("Corrected delivery #" + delivery.getSequenceNumber())
                .build();
        auditLogRepository.save(audit);
        eventPublisher.publishMatchUpdate(innings.getMatch().getId(), "CORRECTION", getScorecard(innings.getMatch().getId()));
    }

    // Simple serialization for audit/comparison purposes
    private String serializeDelivery(Delivery d) {
        return "{\"id\":" + d.getId() + ",\"runsOffBat\":" + d.getRunsOffBat() + ",\"extraRuns\":" + d.getExtraRuns() + ",\"extraType\":" + d.getExtraType() + ",\"isWicket\":" + d.getIsWicket() + ",\"wicketType\":" + d.getWicketType() + "}";
    }

    private void applyDeliveryToInnings(Innings innings, Delivery delivery, Long newBatterId, Long newBowlerId) {
        Player striker = delivery.getStriker();
        Player nonStriker = delivery.getNonStriker();
        Player bowler = delivery.getBowler();

        // 1. Update Innings totals
        innings.setTotalRuns(innings.getTotalRuns() + delivery.getTotalRuns());

        ExtraType extra = delivery.getExtraType();
        int extraRuns = delivery.getExtraRuns();

        if (extra == ExtraType.BYE) {
            innings.setByes(innings.getByes() + extraRuns);
        } else if (extra == ExtraType.LEG_BYE) {
            innings.setLegByes(innings.getLegByes() + extraRuns);
        } else if (extra == ExtraType.WIDE) {
            innings.setWides(innings.getWides() + extraRuns);
        } else if (extra == ExtraType.NO_BALL) {
            innings.setNoBalls(innings.getNoBalls() + 1);
            if (extraRuns > 1) {
                innings.setByes(innings.getByes() + (extraRuns - 1));
            }
        } else if (extra == ExtraType.PENALTY) {
            innings.setPenalties(innings.getPenalties() + extraRuns);
        }

        if (delivery.getIsLegalDelivery()) {
            innings.setLegalBallCount(innings.getLegalBallCount() + 1);
        }

        int compOvers = innings.getLegalBallCount() / 6;
        int remBalls = innings.getLegalBallCount() % 6;
        innings.setTotalOversDisplay(compOvers + "." + remBalls);

        // 2. Update Batting Performance
        BattingPerformance batPerf = battingPerformanceRepository.findByInningsAndPlayer(innings, striker)
                .orElseGet(() -> BattingPerformance.builder()
                        .innings(innings)
                        .player(striker)
                        .battingOrder(battingPerformanceRepository.findByInningsOrderByBattingOrderAsc(innings).size() + 1)
                        .build());

        batPerf.setRuns(batPerf.getRuns() + delivery.getRunsOffBat());
        if (extra != ExtraType.WIDE) {
            batPerf.setBallsFaced(batPerf.getBallsFaced() + 1);
        }
        if (delivery.getRunsOffBat() == 4) batPerf.setFours(batPerf.getFours() + 1);
        if (delivery.getRunsOffBat() == 6) batPerf.setSixes(batPerf.getSixes() + 1);
        battingPerformanceRepository.save(batPerf);

        // Ensure non-striker has a performance record
        battingPerformanceRepository.findByInningsAndPlayer(innings, nonStriker)
                .orElseGet(() -> battingPerformanceRepository.save(BattingPerformance.builder()
                        .innings(innings)
                        .player(nonStriker)
                        .battingOrder(battingPerformanceRepository.findByInningsOrderByBattingOrderAsc(innings).size() + 1)
                        .build()));

        // 3. Update Bowling Performance
        BowlingPerformance bowlPerf = bowlingPerformanceRepository.findByInningsAndPlayer(innings, bowler)
                .orElseGet(() -> BowlingPerformance.builder()
                        .innings(innings)
                        .player(bowler)
                        .build());

        if (extra != ExtraType.BYE && extra != ExtraType.LEG_BYE) {
            bowlPerf.setRunsConceded(bowlPerf.getRunsConceded() + delivery.getTotalRuns());
        }
        if (delivery.getIsLegalDelivery()) {
            bowlPerf.setLegalBallsCount(bowlPerf.getLegalBallsCount() + 1);
        }
        if (extra == ExtraType.WIDE) bowlPerf.setWides(bowlPerf.getWides() + 1);
        if (extra == ExtraType.NO_BALL) bowlPerf.setNoBalls(bowlPerf.getNoBalls() + 1);

        int bCompOvers = bowlPerf.getLegalBallsCount() / 6;
        int bRemBalls = bowlPerf.getLegalBallsCount() % 6;
        bowlPerf.setOversDisplay(bCompOvers + "." + bRemBalls);

        // 4. Over tracking
        int overNum = (innings.getLegalBallCount() - (delivery.getIsLegalDelivery() ? 1 : 0)) / 6 + 1;
        Over over = overRepository.findByInningsAndOverNumber(innings, overNum)
                .orElseGet(() -> Over.builder()
                        .innings(innings)
                        .overNumber(overNum)
                        .bowler(bowler)
                        .build());

        if (delivery.getIsLegalDelivery()) {
            over.setLegalBallCount(over.getLegalBallCount() + 1);
        }
        over.setTotalRuns(over.getTotalRuns() + delivery.getTotalRuns());

        // 5. Wicket processing
        if (delivery.getIsWicket()) {
            WicketType wt = delivery.getWicketType();
            Player dismissed = delivery.getDismissedPlayer() != null ? delivery.getDismissedPlayer() : striker;

            if (wt != WicketType.RETIRED_HURT) {
                innings.setTotalWickets(innings.getTotalWickets() + 1);
                over.setTotalWickets(over.getTotalWickets() + 1);

                if (wt == WicketType.BOWLED || wt == WicketType.CAUGHT || wt == WicketType.LBW || wt == WicketType.STUMPED || wt == WicketType.HIT_WICKET) {
                    bowlPerf.setWickets(bowlPerf.getWickets() + 1);
                }

                BattingPerformance disPerf = battingPerformanceRepository.findByInningsAndPlayer(innings, dismissed)
                        .orElse(batPerf);
                disPerf.setIsOut(true);
                disPerf.setDismissalText(buildDismissalText(wt, bowler, delivery.getFielder()));
                battingPerformanceRepository.save(disPerf);

                // Fall of Wicket
                FallOfWicket fow = FallOfWicket.builder()
                        .innings(innings)
                        .wicketNumber(innings.getTotalWickets())
                        .runsAtDismissal(innings.getTotalRuns())
                        .oversAtDismissal(innings.getTotalOversDisplay())
                        .dismissedPlayer(dismissed)
                        .build();
                fallOfWicketRepository.save(fow);

                // Close active partnership
                Optional<Partnership> currentPart = partnershipRepository.findByInningsAndIsCurrentTrue(innings);
                if (currentPart.isPresent()) {
                    Partnership p = currentPart.get();
                    p.setIsCurrent(false);
                    p.setWicketNumber(innings.getTotalWickets());
                    partnershipRepository.save(p);
                }
            }
        }
        bowlingPerformanceRepository.save(bowlPerf);

        if (over.getLegalBallCount() >= 6) {
            over.setIsCompleted(true);
        }
        overRepository.save(over);

        // 6. Update Partnership
        Optional<Partnership> activePart = partnershipRepository.findByInningsAndIsCurrentTrue(innings);
        if (activePart.isPresent()) {
            Partnership p = activePart.get();
            p.setRuns(p.getRuns() + delivery.getTotalRuns());
            if (delivery.getIsLegalDelivery()) {
                p.setBalls(p.getBalls() + 1);
            }
            partnershipRepository.save(p);
        } else if (!delivery.getIsWicket()) {
            Partnership newP = Partnership.builder()
                    .innings(innings)
                    .batter1(striker)
                    .batter2(nonStriker)
                    .runs(delivery.getTotalRuns())
                    .balls(delivery.getIsLegalDelivery() ? 1 : 0)
                    .isCurrent(true)
                    .build();
            partnershipRepository.save(newP);
        }

        // 7. Strike Rotation
        int physicalRuns = (extra == ExtraType.BYE || extra == ExtraType.LEG_BYE) ? extraRuns : delivery.getRunsOffBat();
        Player nextStriker = striker;
        Player nextNonStriker = nonStriker;

        if (physicalRuns % 2 != 0) {
            // Swap striker and non-striker
            Player temp = nextStriker;
            nextStriker = nextNonStriker;
            nextNonStriker = temp;
        }

        // End of over rotation
        if (over.getLegalBallCount() == 6 && delivery.getIsLegalDelivery()) {
            Player temp = nextStriker;
            nextStriker = nextNonStriker;
            nextNonStriker = temp;
        }

        // Handle replacement batter if wicket occurred
        if (delivery.getIsWicket() && delivery.getWicketType() != WicketType.RETIRED_HURT) {
            Player newBatter = newBatterId != null ? playerRepository.findById(newBatterId).orElse(null) : null;
            Player dismissed = delivery.getDismissedPlayer() != null ? delivery.getDismissedPlayer() : striker;

            if (dismissed.getId().equals(nextStriker.getId())) {
                nextStriker = newBatter;
            } else {
                nextNonStriker = newBatter;
            }

            if (newBatter != null && (nextStriker != null && nextNonStriker != null)) {
                Partnership newP = Partnership.builder()
                        .innings(innings)
                        .batter1(nextStriker)
                        .batter2(nextNonStriker)
                        .runs(0)
                        .balls(0)
                        .isCurrent(true)
                        .build();
                partnershipRepository.save(newP);
            }
        }

        innings.setCurrentStriker(nextStriker);
        innings.setCurrentNonStriker(nextNonStriker);

        if (newBowlerId != null) {
            Player newBowler = playerRepository.findById(newBowlerId).orElse(null);
            innings.setCurrentBowler(newBowler);
        }

        // 8. Innings / Match Completion Checks
        Match match = innings.getMatch();
        int maxLegalBalls = match.getTotalOvers() * 6;

        boolean inningsEnded = (innings.getTotalWickets() >= 10)
                || (innings.getLegalBallCount() >= maxLegalBalls)
                || (innings.getInningsNumber() == 2 && innings.getTargetRuns() != null && innings.getTotalRuns() >= innings.getTargetRuns());

        if (inningsEnded) {
            innings.setStatus(InningsStatus.COMPLETED);
            if (innings.getInningsNumber() == 1) {
                match.setStatus(MatchStatus.INNINGS_BREAK);
                match.setCurrentInningsNumber(2);
            } else {
                match.setStatus(MatchStatus.COMPLETED);
                Innings innings1 = inningsRepository.findByMatchAndInningsNumber(match, 1).orElse(null);
                if (innings1 != null) {
                    if (innings.getTotalRuns() >= innings.getTargetRuns()) {
                        int wicketsLeft = 10 - innings.getTotalWickets();
                        match.setWinningTeam(innings.getBattingTeam());
                        match.setResultSummary(innings.getBattingTeam().getName() + " won by " + wicketsLeft + " wickets");
                    } else if (innings.getTotalRuns() < innings1.getTotalRuns()) {
                        int runsDiff = innings1.getTotalRuns() - innings.getTotalRuns();
                        match.setWinningTeam(innings1.getBattingTeam());
                        match.setResultSummary(innings1.getBattingTeam().getName() + " won by " + runsDiff + " runs");
                    } else {
                        match.setResultSummary("Match Tied");
                    }
                }
                matchRepository.save(match);
                // Recalculate tournament standings if applicable
                if (match.getTournament() != null) {
                    standingsService.recalculateStandings(match.getTournament().getId());
                    // Publish standings updated event (scorecard can be null)
                    eventPublisher.publishMatchUpdate(match.getId(), "STANDINGS_UPDATED", null);
                }
            }
            matchRepository.save(match);
        }

        inningsRepository.save(innings);
    }

    private void replayInningsState(Innings innings) {
        // Reset innings parameters
        innings.setTotalRuns(0);
        innings.setTotalWickets(0);
        innings.setLegalBallCount(0);
        innings.setTotalOversDisplay("0.0");
        innings.setByes(0);
        innings.setLegByes(0);
        innings.setWides(0);
        innings.setNoBalls(0);
        innings.setPenalties(0);
        innings.setStatus(InningsStatus.IN_PROGRESS);

        // Delete performance, over, partnership, FOW records
        battingPerformanceRepository.deleteByInnings(innings);
        bowlingPerformanceRepository.deleteByInnings(innings);
        partnershipRepository.deleteByInnings(innings);
        fallOfWicketRepository.deleteByInnings(innings);
        overRepository.deleteAll(overRepository.findByInningsOrderByOverNumberAsc(innings));

        Match match = innings.getMatch();
        match.setStatus(MatchStatus.LIVE);
        matchRepository.save(match);

        List<Delivery> deliveries = deliveryRepository.findByInningsOrderBySequenceNumberAsc(innings);
        for (Delivery d : deliveries) {
            applyDeliveryToInnings(innings, d, null, null);
        }
    }

    public ScorecardResponseDTO getScorecard(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        List<ScorecardResponseDTO.InningsDetailsDTO> inningsDetails = new ArrayList<>();

        for (Innings inn : inningsList) {
            List<BattingPerformance> batPerfs = battingPerformanceRepository.findByInningsOrderByBattingOrderAsc(inn);
            List<ScorecardResponseDTO.BattingCardDTO> batTable = batPerfs.stream().map(b ->
                    ScorecardResponseDTO.BattingCardDTO.builder()
                            .playerId(b.getPlayer().getId())
                            .playerName(b.getPlayer().getName())
                            .runs(b.getRuns())
                            .ballsFaced(b.getBallsFaced())
                            .fours(b.getFours())
                            .sixes(b.getSixes())
                            .strikeRate(b.getBallsFaced() > 0 ? Math.round((b.getRuns() * 100.0 / b.getBallsFaced()) * 100.0) / 100.0 : 0.0)
                            .isOut(b.getIsOut())
                            .dismissalText(b.getDismissalText() != null ? b.getDismissalText() : (b.getIsOut() ? "out" : "not out"))
                            .battingOrder(b.getBattingOrder())
                            .build()
            ).collect(Collectors.toList());

            List<BowlingPerformance> bowlPerfs = bowlingPerformanceRepository.findByInnings(inn);
            List<ScorecardResponseDTO.BowlingCardDTO> bowlTable = bowlPerfs.stream().map(b ->
                    ScorecardResponseDTO.BowlingCardDTO.builder()
                            .playerId(b.getPlayer().getId())
                            .playerName(b.getPlayer().getName())
                            .oversDisplay(b.getOversDisplay())
                            .legalBallsCount(b.getLegalBallsCount())
                            .maidens(b.getMaidens())
                            .runsConceded(b.getRunsConceded())
                            .wickets(b.getWickets())
                            .economy(b.getLegalBallsCount() > 0 ? Math.round((b.getRunsConceded() * 6.0 / b.getLegalBallsCount()) * 100.0) / 100.0 : 0.0)
                            .wides(b.getWides())
                            .noBalls(b.getNoBalls())
                            .build()
            ).collect(Collectors.toList());

            List<Partnership> parts = partnershipRepository.findByInningsOrderByIdAsc(inn);
            List<ScorecardResponseDTO.PartnershipDTO> partTable = parts.stream().map(p ->
                    ScorecardResponseDTO.PartnershipDTO.builder()
                            .id(p.getId())
                            .batter1Name(p.getBatter1().getName())
                            .batter2Name(p.getBatter2().getName())
                            .runs(p.getRuns())
                            .balls(p.getBalls())
                            .isCurrent(p.getIsCurrent())
                            .wicketNumber(p.getWicketNumber())
                            .build()
            ).collect(Collectors.toList());

            List<FallOfWicket> fows = fallOfWicketRepository.findByInningsOrderByWicketNumberAsc(inn);
            List<ScorecardResponseDTO.FallOfWicketDTO> fowTable = fows.stream().map(f ->
                    ScorecardResponseDTO.FallOfWicketDTO.builder()
                            .wicketNumber(f.getWicketNumber())
                            .runsAtDismissal(f.getRunsAtDismissal())
                            .oversAtDismissal(f.getOversAtDismissal())
                            .dismissedPlayerName(f.getDismissedPlayer().getName())
                            .build()
            ).collect(Collectors.toList());

            List<Delivery> recDels = deliveryRepository.findByInningsOrderBySequenceNumberAsc(inn);
            int startIdx = Math.max(0, recDels.size() - 12);
            List<DeliveryResponseDTO> recentDeliveries = recDels.subList(startIdx, recDels.size()).stream()
                    .map(d -> mapToDeliveryResponseDTO(d, inn))
                    .collect(Collectors.toList());

            ScorecardResponseDTO.ExtrasSummaryDTO extras = ScorecardResponseDTO.ExtrasSummaryDTO.builder()
                    .byes(inn.getByes())
                    .legByes(inn.getLegByes())
                    .wides(inn.getWides())
                    .noBalls(inn.getNoBalls())
                    .penalties(inn.getPenalties())
                    .total(inn.getByes() + inn.getLegByes() + inn.getWides() + inn.getNoBalls() + inn.getPenalties())
                    .build();

            ScorecardResponseDTO.InningsDetailsDTO details = ScorecardResponseDTO.InningsDetailsDTO.builder()
                    .id(inn.getId())
                    .inningsNumber(inn.getInningsNumber())
                    .battingTeamName(inn.getBattingTeam().getName())
                    .bowlingTeamName(inn.getBowlingTeam().getName())
                    .totalRuns(inn.getTotalRuns())
                    .totalWickets(inn.getTotalWickets())
                    .totalOversDisplay(inn.getTotalOversDisplay())
                    .legalBallCount(inn.getLegalBallCount())
                    .targetRuns(inn.getTargetRuns())
                    .status(inn.getStatus())
                    .currentStriker(inn.getCurrentStriker() != null ? mapPlayerToDTO(inn.getCurrentStriker()) : null)
                    .currentNonStriker(inn.getCurrentNonStriker() != null ? mapPlayerToDTO(inn.getCurrentNonStriker()) : null)
                    .currentBowler(inn.getCurrentBowler() != null ? mapPlayerToDTO(inn.getCurrentBowler()) : null)
                    .extras(extras)
                    .battingTable(batTable)
                    .bowlingTable(bowlTable)
                    .partnerships(partTable)
                    .fallOfWickets(fowTable)
                    .recentDeliveries(recentDeliveries)
                    .build();

            inningsDetails.add(details);
        }

        return ScorecardResponseDTO.builder()
                .matchId(match.getId())
                .teamAName(match.getTeamA().getName())
                .teamBName(match.getTeamB().getName())
                .venue(match.getVenue())
                .status(match.getStatus())
                .resultSummary(match.getResultSummary())
                .winningTeamName(match.getWinningTeam() != null ? match.getWinningTeam().getName() : null)
                .currentInningsNumber(match.getCurrentInningsNumber())
                .inningsList(inningsDetails)
                .build();
    }

    public List<DeliveryResponseDTO> getCommentary(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with id: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        List<DeliveryResponseDTO> commentaryList = new ArrayList<>();

        for (Innings inn : inningsList) {
            List<Delivery> deliveries = deliveryRepository.findByInningsOrderBySequenceNumberAsc(inn);
            for (Delivery d : deliveries) {
                commentaryList.add(0, mapToDeliveryResponseDTO(d, inn));
            }
        }
        return commentaryList;
    }

    private DeliveryResponseDTO mapToDeliveryResponseDTO(Delivery delivery, Innings innings) {
        return DeliveryResponseDTO.builder()
                .id(delivery.getId())
                .sequenceNumber(delivery.getSequenceNumber())
                .overNumber(delivery.getOverNumber())
                .ballNumber(delivery.getBallNumber())
                .strikerName(delivery.getStriker().getName())
                .nonStrikerName(delivery.getNonStriker().getName())
                .bowlerName(delivery.getBowler().getName())
                .runsOffBat(delivery.getRunsOffBat())
                .extraRuns(delivery.getExtraRuns())
                .totalRuns(delivery.getTotalRuns())
                .extraType(delivery.getExtraType())
                .isLegalDelivery(delivery.getIsLegalDelivery())
                .isWicket(delivery.getIsWicket())
                .wicketType(delivery.getWicketType())
                .dismissedPlayerName(delivery.getDismissedPlayer() != null ? delivery.getDismissedPlayer().getName() : null)
                .fielderName(delivery.getFielder() != null ? delivery.getFielder().getName() : null)
                .commentary(delivery.getCommentary())
                .timestamp(delivery.getTimestamp())
                .inningsScoreDisplay(innings.getTotalRuns() + "/" + innings.getTotalWickets() + " (" + innings.getTotalOversDisplay() + ")")
                .targetRuns(innings.getTargetRuns())
                .inningsStatus(innings.getStatus())
                .matchStatus(innings.getMatch().getStatus())
                .build();
    }

    private com.gamepulse.dto.PlayerDTO mapPlayerToDTO(Player p) {
        return com.gamepulse.dto.PlayerDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .displayName(p.getDisplayName())
                .jerseyNumber(p.getJerseyNumber())
                .role(p.getRole())
                .battingStyle(p.getBattingStyle())
                .bowlingStyle(p.getBowlingStyle())
                .build();
    }

    private String buildAutoCommentary(Player striker, Player bowler, int runs, int extraRuns, ExtraType extra, boolean isWicket, WicketType wt, Player dismissed) {
        StringBuilder sb = new StringBuilder();
        sb.append(bowler.getLastNameOrName()).append(" to ").append(striker.getLastNameOrName()).append(", ");
        if (isWicket) {
            sb.append("OUT! ").append(wt).append("! ").append(dismissed != null ? dismissed.getName() : striker.getName()).append(" is out.");
        } else if (extra == ExtraType.WIDE) {
            sb.append("WIDE ball (").append(extraRuns).append(" runs).");
        } else if (extra == ExtraType.NO_BALL) {
            sb.append("NO BALL! ").append(runs).append(" runs off bat.");
        } else if (extra == ExtraType.BYE) {
            sb.append(extraRuns).append(" BYE runs taken.");
        } else if (extra == ExtraType.LEG_BYE) {
            sb.append(extraRuns).append(" LEG BYE runs taken.");
        } else if (runs == 4) {
            sb.append("FOUR! Superb shot to the boundary.");
        } else if (runs == 6) {
            sb.append("SIX! Massive hit over the ropes!");
        } else if (runs == 0) {
            sb.append("no run, dot ball.");
        } else {
            sb.append(runs).append(runs == 1 ? " run taken." : " runs taken.");
        }
        return sb.toString();
    }

    private String buildDismissalText(WicketType wt, Player bowler, Player fielder) {
        switch (wt) {
            case BOWLED:
                return "b " + bowler.getName();
            case CAUGHT:
                return "c " + (fielder != null ? fielder.getName() : "fielder") + " b " + bowler.getName();
            case LBW:
                return "lbw b " + bowler.getName();
            case STUMPED:
                return "st " + (fielder != null ? fielder.getName() : "keeper") + " b " + bowler.getName();
            case RUN_OUT:
                return "run out (" + (fielder != null ? fielder.getName() : "") + ")";
            case HIT_WICKET:
                return "hit wicket b " + bowler.getName();
            case RETIRED_HURT:
                return "retired hurt";
            case RETIRED_OUT:
                return "retired out";
            default:
                return "out";
        }
    }

    @Transactional
    public List<DeliveryResponseDTO> syncDeliveries(Long inningsId, List<DeliveryRequestDTO> batchRequests, String username) {
        List<DeliveryResponseDTO> responses = new ArrayList<>();
        for (DeliveryRequestDTO req : batchRequests) {
            DeliveryResponseDTO resp = processDelivery(inningsId, req, username);
            responses.add(resp);
        }
        return responses;
    }
}

