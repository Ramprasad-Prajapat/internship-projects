package com.gamepulse.repository;

import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InningsRepository extends JpaRepository<Innings, Long> {
    List<Innings> findByMatch(Match match);
    Optional<Innings> findByMatchAndInningsNumber(Match match, Integer inningsNumber);
}
