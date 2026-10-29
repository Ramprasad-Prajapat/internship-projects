package com.gamepulse.repository;

import com.gamepulse.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(String username);
    List<Notification> findByRecipientUsernameAndIsReadFalseOrderByCreatedAtDesc(String username);
    long countByRecipientUsernameAndIsReadFalse(String username);
}
