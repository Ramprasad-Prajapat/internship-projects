package com.gamepulse.repository;

import com.gamepulse.entity.BattingPerformance;
import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BattingPerformanceRepository extends JpaRepository<BattingPerformance, Long> {
    List<BattingPerformance> findByInningsOrderByBattingOrderAsc(Innings innings);
    Optional<BattingPerformance> findByInningsAndPlayer(Innings innings, Player player);
    List<BattingPerformance> findByPlayer(Player player);
    void deleteByInnings(Innings innings);
}
