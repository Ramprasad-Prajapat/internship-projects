package com.gamepulse.controller;

import com.gamepulse.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class AiController {

    @Autowired
    private AiService aiService;

    @GetMapping("/{id}/ai-summary")
    public ResponseEntity<Map<String, Object>> getAiMatchSummary(@PathVariable Long id) {
        return ResponseEntity.ok(aiService.generateMatchSummary(id));
    }
}
