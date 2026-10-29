package com.gamepulse.controller;

import com.gamepulse.dto.*;
import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import com.gamepulse.service.MatchService;
import com.gamepulse.service.ScoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private ScoringService scoringService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Match> createMatch(@RequestBody MatchCreateRequestDTO dto) {
        return ResponseEntity.ok(matchService.createMatch(dto));
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        return ResponseEntity.ok(matchService.getLiveMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/{id}/toss")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Match> recordToss(@PathVariable Long id, @RequestBody TossRequestDTO dto) {
        return ResponseEntity.ok(matchService.recordToss(id, dto));
    }

    @PostMapping("/{id}/playing-xi/{teamId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<PlayingXIDTO> savePlayingXI(@PathVariable Long id, @PathVariable Long teamId, @RequestBody PlayingXIDTO dto) {
        return ResponseEntity.ok(matchService.savePlayingXI(id, teamId, dto));
    }

    @GetMapping("/{id}/playing-xi/{teamId}")
    public ResponseEntity<PlayingXIDTO> getPlayingXI(@PathVariable Long id, @PathVariable Long teamId) {
        return ResponseEntity.ok(matchService.getPlayingXI(id, teamId));
    }

    @PutMapping("/{id}/rules")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Match> updateMatchRules(@PathVariable Long id, @RequestBody MatchRuleRequestDTO dto) {
        return ResponseEntity.ok(matchService.updateMatchRules(id, dto));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Innings> startInnings(@PathVariable Long id, @RequestBody StartInningsRequestDTO dto) {
        return ResponseEntity.ok(matchService.startInnings(id, dto));
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<ScorecardResponseDTO> getScorecard(@PathVariable Long id) {
        return ResponseEntity.ok(scoringService.getScorecard(id));
    }

    @GetMapping("/{id}/commentary")
    public ResponseEntity<?> getCommentary(@PathVariable Long id) {
        return ResponseEntity.ok(scoringService.getCommentary(id));
    }

    @GetMapping("/{id}/share-summary")
    public ResponseEntity<com.gamepulse.dto.MatchShareSummaryDTO> getMatchShareSummary(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchShareSummary(id));
    }
}

