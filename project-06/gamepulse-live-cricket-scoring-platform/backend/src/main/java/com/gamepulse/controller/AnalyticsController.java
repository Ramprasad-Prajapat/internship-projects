package com.gamepulse.controller;

import com.gamepulse.dto.MatchAnalyticsDTO;
import com.gamepulse.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/{id}/analytics")
    public ResponseEntity<MatchAnalyticsDTO> getMatchAnalytics(@PathVariable("id") Long id) {
        return ResponseEntity.ok(analyticsService.getMatchAnalytics(id));
    }
}
