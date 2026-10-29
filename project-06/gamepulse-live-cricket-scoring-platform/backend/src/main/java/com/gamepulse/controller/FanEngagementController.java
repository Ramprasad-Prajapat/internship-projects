package com.gamepulse.controller;

import com.gamepulse.dto.MatchPulseDTO;
import com.gamepulse.entity.FanPoll;
import com.gamepulse.service.FanEngagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FanEngagementController {

    @Autowired
    private FanEngagementService fanEngagementService;

    @GetMapping("/matches/{id}/pulse")
    public ResponseEntity<MatchPulseDTO> getMatchPulse(@PathVariable Long id) {
        return ResponseEntity.ok(fanEngagementService.getMatchPulse(id));
    }

    @GetMapping("/matches/{id}/polls")
    public ResponseEntity<List<FanPoll>> getMatchPolls(@PathVariable Long id) {
        return ResponseEntity.ok(fanEngagementService.getMatchPolls(id));
    }

    @PostMapping("/matches/{id}/polls")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<FanPoll> createPoll(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String question = (String) body.get("question");
        @SuppressWarnings("unchecked")
        List<String> options = (List<String>) body.get("options");
        return ResponseEntity.ok(fanEngagementService.createPoll(id, question, options));
    }

    @PostMapping("/polls/{pollId}/vote")
    public ResponseEntity<FanPoll> votePoll(@PathVariable Long pollId, @RequestBody Map<String, Integer> body) {
        Integer optionIndex = body.get("optionIndex");
        return ResponseEntity.ok(fanEngagementService.votePoll(pollId, optionIndex));
    }
}
