package com.gamepulse.service;

import com.gamepulse.entity.Notification;
import com.gamepulse.entity.NotificationPreference;
import com.gamepulse.repository.NotificationPreferenceRepository;
import com.gamepulse.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(String username) {
        return notificationRepository.findByRecipientUsernameOrderByCreatedAtDesc(username);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String username) {
        return notificationRepository.countByRecipientUsernameAndIsReadFalse(username);
    }

    @Transactional
    public Notification markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + notificationId));

        if (!notification.getRecipientUsername().equals(username) && !"ALL".equals(notification.getRecipientUsername())) {
            throw new SecurityException("Unauthorized access to notification id: " + notificationId);
        }

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String username) {
        List<Notification> unread = notificationRepository.findByRecipientUsernameAndIsReadFalseOrderByCreatedAtDesc(username);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public Notification sendNotification(String username, String title, String message, Notification.NotificationType type, Long referenceId, String actionUrl) {
        Notification notification = new Notification();
        notification.setRecipientUsername(username);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setActionUrl(actionUrl);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);
        try {
            messagingTemplate.convertAndSendToUser(username, "/queue/notifications", saved);
        } catch (Exception ignored) {}

        return saved;
    }

    @Transactional
    public Notification sendNotification(String username, String title, String message, Notification.NotificationType type, Long referenceId) {
        return sendNotification(username, title, message, type, referenceId, null);
    }

    @Transactional
    public void broadcastNotification(String title, String message, Notification.NotificationType type, Long referenceId, String actionUrl) {
        Notification notification = new Notification();
        notification.setRecipientUsername("ALL");
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setActionUrl(actionUrl);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);
        try {
            messagingTemplate.convertAndSend("/topic/notifications", saved);
        } catch (Exception ignored) {}
    }

    @Transactional
    public void broadcastNotification(String title, String message, Notification.NotificationType type, Long referenceId) {
        broadcastNotification(title, message, type, referenceId, null);
    }

    @Transactional(readOnly = true)
    public NotificationPreference getPreferences(String username) {
        return preferenceRepository.findByUsername(username).orElseGet(() -> {
            NotificationPreference pref = new NotificationPreference();
            pref.setUsername(username);
            return pref;
        });
    }

    @Transactional
    public NotificationPreference updatePreferences(String username, NotificationPreference updated) {
        NotificationPreference pref = preferenceRepository.findByUsername(username).orElseGet(() -> {
            NotificationPreference p = new NotificationPreference();
            p.setUsername(username);
            return p;
        });

        if (updated.getMatchStartAlerts() != null) pref.setMatchStartAlerts(updated.getMatchStartAlerts());
        if (updated.getWicketAlerts() != null) pref.setWicketAlerts(updated.getWicketAlerts());
        if (updated.getMilestoneAlerts() != null) pref.setMilestoneAlerts(updated.getMilestoneAlerts());
        if (updated.getMatchCompletionAlerts() != null) pref.setMatchCompletionAlerts(updated.getMatchCompletionAlerts());
        if (updated.getTournamentAlerts() != null) pref.setTournamentAlerts(updated.getTournamentAlerts());
        if (updated.getPollAlerts() != null) pref.setPollAlerts(updated.getPollAlerts());
        if (updated.getSystemAlerts() != null) pref.setSystemAlerts(updated.getSystemAlerts());

        return preferenceRepository.save(pref);
    }
}
