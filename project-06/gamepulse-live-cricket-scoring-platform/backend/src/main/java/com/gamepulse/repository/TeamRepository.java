package com.gamepulse.repository;

import com.gamepulse.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByActiveTrue();
    List<Team> findByNameContainingIgnoreCase(String name);
    org.springframework.data.domain.Page<Team> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
