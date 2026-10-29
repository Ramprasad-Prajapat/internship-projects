package com.gamepulse.controller;

import com.gamepulse.dto.PlayerDTO;
import com.gamepulse.dto.TeamDTO;
import com.gamepulse.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO dto) {
        return ResponseEntity.ok(teamService.createTeam(dto));
    }

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PostMapping("/{id}/players")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<PlayerDTO> addPlayerToTeam(@PathVariable Long id, @RequestBody PlayerDTO dto) {
        return ResponseEntity.ok(teamService.addPlayerToTeam(id, dto));
    }
}
