package com.gamepulse.controller;

import com.gamepulse.dto.DeliveryRequestDTO;
import com.gamepulse.dto.DeliveryResponseDTO;
import com.gamepulse.service.ScoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ScoringController {

    @Autowired
    private ScoringService scoringService;

    @PostMapping("/innings/{id}/deliveries")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<DeliveryResponseDTO> scoreDelivery(@PathVariable Long id, @RequestBody DeliveryRequestDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "SCORER";
        return ResponseEntity.ok(scoringService.processDelivery(id, dto, username));
    }

    @PostMapping("/innings/{id}/sync")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<List<DeliveryResponseDTO>> syncDeliveries(@PathVariable Long id, @RequestBody List<DeliveryRequestDTO> batchRequests) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "SCORER";
        return ResponseEntity.ok(scoringService.syncDeliveries(id, batchRequests, username));
    }

    @PostMapping("/innings/{id}/undo")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Void> undoLastDelivery(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "SCORER";
        scoringService.undoLastDelivery(id, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/deliveries/{id}/correct")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCORER')")
    public ResponseEntity<Void> correctDelivery(@PathVariable Long id, @RequestBody DeliveryRequestDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "SCORER";
        scoringService.correctDelivery(id, dto, username);
        return ResponseEntity.ok().build();
    }
}
