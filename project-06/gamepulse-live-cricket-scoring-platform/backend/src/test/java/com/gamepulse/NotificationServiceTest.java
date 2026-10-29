package com.gamepulse;

import com.gamepulse.entity.Notification;
import com.gamepulse.entity.NotificationPreference;
import com.gamepulse.service.NotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Test
    @DisplayName("Verify user notification dispatch, unread fetching and marking read")
    void testNotifications() {
        notificationService.sendNotification("user1", "Wicket Alert!", "Player out for 45 runs", Notification.NotificationType.WICKET, 100L, "/scoreboard/100");

        List<Notification> userNotifs = notificationService.getUserNotifications("user1");
        assertFalse(userNotifs.isEmpty());
        assertEquals("Wicket Alert!", userNotifs.get(0).getTitle());
        assertEquals("/scoreboard/100", userNotifs.get(0).getActionUrl());
        assertFalse(userNotifs.get(0).getIsRead());

        notificationService.markAllAsRead("user1");
        List<Notification> updatedNotifs = notificationService.getUserNotifications("user1");
        assertTrue(updatedNotifs.get(0).getIsRead());
    }

    @Test
    @DisplayName("Verify unread count and single mark-as-read with ownership protection")
    void testUnreadCountAndSingleMarkRead() {
        Notification n1 = notificationService.sendNotification("user1", "Match Start", "Match is live", Notification.NotificationType.MATCH_STARTED, 1L);
        Notification n2 = notificationService.sendNotification("user1", "Poll Created", "Vote now!", Notification.NotificationType.POLL, 1L);

        assertEquals(2, notificationService.getUnreadCount("user1"));

        notificationService.markAsRead(n1.getId(), "user1");
        assertEquals(1, notificationService.getUnreadCount("user1"));

        // Unauthorized access by another user
        assertThrows(SecurityException.class, () -> notificationService.markAsRead(n2.getId(), "user2"));

        // Missing notification ID
        assertThrows(IllegalArgumentException.class, () -> notificationService.markAsRead(99999L, "user1"));
    }

    @Test
    @DisplayName("Verify notification preferences management with all categories")
    void testPreferences() {
        NotificationPreference pref = notificationService.getPreferences("user1");
        assertNotNull(pref);
        assertTrue(pref.getWicketAlerts());
        assertTrue(pref.getTournamentAlerts());

        pref.setWicketAlerts(false);
        pref.setPollAlerts(false);
        NotificationPreference updated = notificationService.updatePreferences("user1", pref);
        assertFalse(updated.getWicketAlerts());
        assertFalse(updated.getPollAlerts());
    }

    @Test
    @DisplayName("Verify broadcast notification persistence")
    void testBroadcastNotification() {
        notificationService.broadcastNotification("Tournament Alert", "IPL 2026 starts today!", Notification.NotificationType.TOURNAMENT_UPDATE, 50L, "/tournaments");
        List<Notification> notifs = notificationService.getUserNotifications("ALL");
        assertFalse(notifs.isEmpty());
        assertEquals("Tournament Alert", notifs.get(0).getTitle());
        assertEquals("/tournaments", notifs.get(0).getActionUrl());
    }
}
