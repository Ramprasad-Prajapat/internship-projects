package com.gamepulse.repository;

import com.gamepulse.entity.BowlingPerformance;
import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BowlingPerformanceRepository extends JpaRepository<BowlingPerformance, Long> {
    List<BowlingPerformance> findByInnings(Innings innings);
    Optional<BowlingPerformance> findByInningsAndPlayer(Innings innings, Player player);
    List<BowlingPerformance> findByPlayer(Player player);
    void deleteByInnings(Innings innings);
}
