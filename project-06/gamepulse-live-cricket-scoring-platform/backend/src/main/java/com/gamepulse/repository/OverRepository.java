package com.gamepulse.repository;

import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Over;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OverRepository extends JpaRepository<Over, Long> {
    List<Over> findByInningsOrderByOverNumberAsc(Innings innings);
    Optional<Over> findByInningsAndOverNumber(Innings innings, Integer overNumber);
}
