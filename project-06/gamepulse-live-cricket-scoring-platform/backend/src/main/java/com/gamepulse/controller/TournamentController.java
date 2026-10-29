package com.gamepulse.controller;

import com.gamepulse.dto.TeamRegistrationDTO;
import com.gamepulse.dto.TournamentCreateRequestDTO;
import com.gamepulse.dto.TournamentResponseDTO;
import com.gamepulse.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @GetMapping
    public ResponseEntity<List<TournamentResponseDTO>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponseDTO> getTournament(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournament(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    public ResponseEntity<TournamentResponseDTO> createTournament(@RequestBody TournamentCreateRequestDTO dto) {
        return ResponseEntity.ok(tournamentService.createTournament(dto));
    }

    @PostMapping("/{id}/teams")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    public ResponseEntity<TournamentResponseDTO> registerTeam(@PathVariable Long id, @RequestBody TeamRegistrationDTO dto) {
        return ResponseEntity.ok(tournamentService.registerTeam(id, dto));
    }

    @DeleteMapping("/{id}/teams/{teamId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    public ResponseEntity<TournamentResponseDTO> removeTeam(@PathVariable Long id, @PathVariable Long teamId) {
        return ResponseEntity.ok(tournamentService.removeTeam(id, teamId));
    }
}
