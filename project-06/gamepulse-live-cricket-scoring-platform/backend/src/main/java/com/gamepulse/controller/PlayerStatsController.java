package com.gamepulse.controller;

import com.gamepulse.dto.LeaderboardDTO;
import com.gamepulse.dto.PlayerStatsDTO;
import com.gamepulse.service.PlayerStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PlayerStatsController {

    @Autowired
    private PlayerStatsService playerStatsService;

    @GetMapping("/players/{id}/stats")
    public ResponseEntity<PlayerStatsDTO> getPlayerStats(
            @PathVariable Long id,
            @RequestParam(required = false) Long tournamentId) {
        return ResponseEntity.ok(playerStatsService.getPlayerStats(id, tournamentId));
    }

    @GetMapping("/leaderboards")
    public ResponseEntity<LeaderboardDTO> getLeaderboards(
            @RequestParam(required = false) Long tournamentId) {
        return ResponseEntity.ok(playerStatsService.getLeaderboards(tournamentId));
    }
}
