package com.gamepulse.service;

import com.gamepulse.dto.MatchAnalyticsDTO;
import com.gamepulse.entity.Delivery;
import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import com.gamepulse.entity.Over;
import com.gamepulse.repository.DeliveryRepository;
import com.gamepulse.repository.InningsRepository;
import com.gamepulse.repository.MatchRepository;
import com.gamepulse.repository.OverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private OverRepository overRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Transactional(readOnly = true)
    public MatchAnalyticsDTO getMatchAnalytics(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        MatchAnalyticsDTO analytics = new MatchAnalyticsDTO();
        analytics.setMatchId(matchId);

        List<MatchAnalyticsDTO.InningsWormDTO> wormList = new ArrayList<>();
        int totalDots = 0, totalBoundaries = 0, totalSinglesDoubles = 0, totalLegalBalls = 0;

        // Phase trackers across innings
        int ppRuns = 0, ppWickets = 0, ppBalls = 0;
        int midRuns = 0, midWickets = 0, midBalls = 0;
        int deathRuns = 0, deathWickets = 0, deathBalls = 0;

        int maxOvers = (match != null && match.getTotalOvers() != null && match.getTotalOvers() > 0) ? match.getTotalOvers() : 20;
        int ppLimit = maxOvers <= 10 ? Math.max(1, (int) Math.round(maxOvers * 0.3)) : 6;
        int midLimit = maxOvers <= 10 ? Math.max(ppLimit + 1, maxOvers - (int) Math.round(maxOvers * 0.25)) : 15;

        for (Innings inn : inningsList) {
            MatchAnalyticsDTO.InningsWormDTO worm = new MatchAnalyticsDTO.InningsWormDTO();
            worm.setInningsNumber(inn.getInningsNumber());
            worm.setTeamName(inn.getBattingTeam() != null ? inn.getBattingTeam().getName() : "Team " + inn.getInningsNumber());

            List<Over> overs = overRepository.findByInningsOrderByOverNumberAsc(inn);
            List<MatchAnalyticsDTO.OverPointDTO> points = new ArrayList<>();
            int cumulativeRuns = 0;

            for (Over ov : overs) {
                cumulativeRuns += ov.getTotalRuns() != null ? ov.getTotalRuns() : 0;
                int overNum = ov.getOverNumber();
                double rr = overNum > 0 ? Math.round((double) cumulativeRuns / overNum * 100.0) / 100.0 : 0.0;

                MatchAnalyticsDTO.OverPointDTO pt = new MatchAnalyticsDTO.OverPointDTO();
                pt.setOverNumber(overNum);
                pt.setRunsInOver(ov.getTotalRuns());
                pt.setCumulativeRuns(cumulativeRuns);
                pt.setWickets(ov.getTotalWickets());
                pt.setCurrentRunRate(rr);
                points.add(pt);

                // Phase attribution
                int runs = ov.getTotalRuns() != null ? ov.getTotalRuns() : 0;
                int w = ov.getTotalWickets() != null ? ov.getTotalWickets() : 0;
                if (overNum <= ppLimit) {
                    ppRuns += runs;
                    ppWickets += w;
                    ppBalls += 6;
                } else if (overNum <= midLimit) {
                    midRuns += runs;
                    midWickets += w;
                    midBalls += 6;
                } else {
                    deathRuns += runs;
                    deathWickets += w;
                    deathBalls += 6;
                }
            }
            worm.setOverPoints(points);
            wormList.add(worm);

            // Ball event details for percentage breakdown
            List<Delivery> deliveries = deliveryRepository.findByInningsOrderBySequenceNumberAsc(inn);
            for (Delivery del : deliveries) {
                if (Boolean.TRUE.equals(del.getIsLegalDelivery())) {
                    totalLegalBalls++;
                    int r = del.getRunsOffBat() != null ? del.getRunsOffBat() : 0;
                    if (r == 0 && (del.getExtraRuns() == null || del.getExtraRuns() == 0)) {
                        totalDots++;
                    } else if (r == 4 || r == 6) {
                        totalBoundaries++;
                    } else if (r == 1 || r == 2 || r == 3) {
                        totalSinglesDoubles++;
                    }
                }
            }
        }

        analytics.setWormGraph(wormList);

        // Phase analysis setup
        MatchAnalyticsDTO.PhaseAnalysisDTO phases = new MatchAnalyticsDTO.PhaseAnalysisDTO();

        MatchAnalyticsDTO.PhaseDataDTO pp = new MatchAnalyticsDTO.PhaseDataDTO();
        pp.setPhaseName("Powerplay (Overs 1-" + ppLimit + ")");
        pp.setRunsScored(ppRuns);
        pp.setWicketsLost(ppWickets);
        pp.setRunRate(ppBalls > 0 ? Math.round((double) ppRuns / (ppBalls / 6.0) * 100.0) / 100.0 : 0.0);

        MatchAnalyticsDTO.PhaseDataDTO mid = new MatchAnalyticsDTO.PhaseDataDTO();
        mid.setPhaseName("Middle Overs (Overs " + (ppLimit + 1) + "-" + midLimit + ")");
        mid.setRunsScored(midRuns);
        mid.setWicketsLost(midWickets);
        mid.setRunRate(midBalls > 0 ? Math.round((double) midRuns / (midBalls / 6.0) * 100.0) / 100.0 : 0.0);

        MatchAnalyticsDTO.PhaseDataDTO death = new MatchAnalyticsDTO.PhaseDataDTO();
        death.setPhaseName("Death Overs (Overs " + (midLimit + 1) + "-" + maxOvers + ")");
        death.setRunsScored(deathRuns);
        death.setWicketsLost(deathWickets);
        death.setRunRate(deathBalls > 0 ? Math.round((double) deathRuns / (deathBalls / 6.0) * 100.0) / 100.0 : 0.0);

        phases.setPowerplay(pp);
        phases.setMiddleOvers(mid);
        phases.setDeathOvers(death);
        analytics.setPhaseAnalysis(phases);

        // Percentages
        MatchAnalyticsDTO.PercentageStatsDTO stats = new MatchAnalyticsDTO.PercentageStatsDTO();
        stats.setDotBallPercentage(totalLegalBalls > 0 ? Math.round((double) totalDots / totalLegalBalls * 100.0 * 100.0) / 100.0 : 0.0);
        stats.setBoundaryPercentage(totalLegalBalls > 0 ? Math.round((double) totalBoundaries / totalLegalBalls * 100.0 * 100.0) / 100.0 : 0.0);
        stats.setStrikeRotationPercentage(totalLegalBalls > 0 ? Math.round((double) totalSinglesDoubles / totalLegalBalls * 100.0 * 100.0) / 100.0 : 0.0);
        analytics.setStatsPercentages(stats);

        return analytics;
    }
}
