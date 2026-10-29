package com.gamepulse.service;

import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import com.gamepulse.repository.InningsRepository;
import com.gamepulse.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> generateMatchSummary(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        Map<String, Object> summary = new HashMap<>();
        summary.put("matchId", matchId);
        summary.put("title", match.getTeamA().getName() + " vs " + match.getTeamB().getName() + " Tactical Breakdown");

        if (inningsList.isEmpty()) {
            summary.put("status", "Match scheduled or not started yet.");
            summary.put("turningPoint", "Toss result will be pivotal.");
            summary.put("winningFactor", "Initial powerplay execution.");
            return summary;
        }

        Innings inn1 = inningsList.get(0);
        Innings inn2 = inningsList.size() > 1 ? inningsList.get(1) : null;

        String resultText = match.getResultSummary() != null ? match.getResultSummary() : "Match in progress";

        summary.put("headline", resultText);
        summary.put("firstInningsSummary", inn1.getBattingTeam().getName() + " scored " + inn1.getTotalRuns() + "/" + inn1.getTotalWickets() + " in " + inn1.getTotalOversDisplay() + " overs.");

        if (inn2 != null) {
            summary.put("secondInningsSummary", inn2.getBattingTeam().getName() + " replied with " + inn2.getTotalRuns() + "/" + inn2.getTotalWickets() + " in " + inn2.getTotalOversDisplay() + " overs.");
            summary.put("turningPoint", "The middle-overs control in the 2nd innings determined the momentum shift.");
            summary.put("winningFactor", "Disciplined bowling performance under pressure.");
        } else {
            summary.put("turningPoint", "Powerplay dominance in the 1st innings provided a solid platform.");
            summary.put("winningFactor", "Aggressive strike rotation and boundary percentage.");
        }

        return summary;
    }
}
