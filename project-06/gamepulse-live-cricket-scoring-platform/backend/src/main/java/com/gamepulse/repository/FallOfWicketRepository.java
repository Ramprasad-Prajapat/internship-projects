package com.gamepulse.repository;

import com.gamepulse.entity.FallOfWicket;
import com.gamepulse.entity.Innings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FallOfWicketRepository extends JpaRepository<FallOfWicket, Long> {
    List<FallOfWicket> findByInningsOrderByWicketNumberAsc(Innings innings);
    void deleteByInnings(Innings innings);
}
