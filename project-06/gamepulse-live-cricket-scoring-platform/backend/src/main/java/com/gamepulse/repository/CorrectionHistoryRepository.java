package com.gamepulse.repository;

import com.gamepulse.entity.CorrectionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CorrectionHistoryRepository extends JpaRepository<CorrectionHistory, Long> {
    List<CorrectionHistory> findByDeliveryId(Long deliveryId);
}
