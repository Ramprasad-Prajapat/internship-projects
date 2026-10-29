package com.gamepulse.controller;

import com.gamepulse.dto.PlayerDTO;
import com.gamepulse.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<PlayerDTO> createPlayer(@RequestBody PlayerDTO dto) {
        return ResponseEntity.ok(playerService.createPlayer(dto));
    }

    @GetMapping
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }
}
