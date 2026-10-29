package com.gamepulse.repository;

import com.gamepulse.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    Optional<Tournament> findBySlug(String slug);
    List<Tournament> findByNameContainingIgnoreCase(String name);
    org.springframework.data.domain.Page<Tournament> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
