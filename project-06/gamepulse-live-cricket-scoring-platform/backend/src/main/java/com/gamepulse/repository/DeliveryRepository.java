package com.gamepulse.repository;

import com.gamepulse.entity.Delivery;
import com.gamepulse.entity.Innings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByInningsOrderBySequenceNumberAsc(Innings innings);
    Optional<Delivery> findTopByInningsOrderBySequenceNumberDesc(Innings innings);
    Optional<Delivery> findByClientEventId(String clientEventId);
    void deleteByInnings(Innings innings);
}
