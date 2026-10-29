package com.gamepulse.controller;

import com.gamepulse.entity.Notification;
import com.gamepulse.entity.NotificationPreference;
import com.gamepulse.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        String username = getUsername();
        return ResponseEntity.ok(notificationService.getUserNotifications(username));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        String username = getUsername();
        long count = notificationService.getUnreadCount(username);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @RequestMapping(value = "/{id}/read", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        String username = getUsername();
        try {
            Notification notification = notificationService.markAsRead(id, username);
            return ResponseEntity.ok(notification);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @RequestMapping(value = "/read-all", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Void> markAllAsRead() {
        String username = getUsername();
        notificationService.markAllAsRead(username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreference> getPreferences() {
        String username = getUsername();
        return ResponseEntity.ok(notificationService.getPreferences(username));
    }

    @PutMapping("/preferences")
    public ResponseEntity<NotificationPreference> updatePreferences(@RequestBody NotificationPreference pref) {
        String username = getUsername();
        return ResponseEntity.ok(notificationService.updatePreferences(username, pref));
    }

    private String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication() != null ?
                SecurityContextHolder.getContext().getAuthentication().getName() : "ANONYMOUS";
    }
}
