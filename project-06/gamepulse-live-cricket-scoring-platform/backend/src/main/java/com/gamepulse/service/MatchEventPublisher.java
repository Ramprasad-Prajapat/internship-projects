package com.gamepulse.service;

import com.gamepulse.dto.ScorecardResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MatchEventPublisher {

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    public void publishMatchUpdate(Long matchId, String eventType, ScorecardResponseDTO scorecard) {
        if (messagingTemplate != null) {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", eventType);
            event.put("matchId", matchId);
            event.put("timestamp", System.currentTimeMillis());
            event.put("scorecard", scorecard);
            messagingTemplate.convertAndSend("/topic/match/" + matchId, event);
        }
    }
}
