package com.gamepulse.repository;

import com.gamepulse.entity.Match;
import com.gamepulse.entity.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournamentIdAndStatus(Long tournamentId, MatchStatus status);
    List<Match> findByStatus(MatchStatus status);
    List<Match> findAll();
    org.springframework.data.domain.Page<Match> findByVenueContainingIgnoreCase(String venue, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Match> findByStatus(MatchStatus status, org.springframework.data.domain.Pageable pageable);
}
