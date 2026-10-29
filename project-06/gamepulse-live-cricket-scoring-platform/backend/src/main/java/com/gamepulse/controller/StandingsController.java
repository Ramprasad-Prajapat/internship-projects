package com.gamepulse.controller;

import com.gamepulse.dto.StandingsDTO;
import com.gamepulse.service.StandingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class StandingsController {

    @Autowired
    private StandingsService standingsService;

    @GetMapping("/{tournamentId}/standings")
    public ResponseEntity<List<StandingsDTO>> getStandings(@PathVariable Long tournamentId) {
        List<StandingsDTO> standings = standingsService.getStandings(tournamentId);
        return ResponseEntity.ok(standings);
    }
}
