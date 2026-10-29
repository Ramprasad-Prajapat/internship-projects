package com.gamepulse.repository;

import com.gamepulse.entity.Player;
import com.gamepulse.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamAndActiveTrue(Team team);
    List<Player> findByTeamId(Long teamId);
    List<Player> findByNameContainingIgnoreCase(String name);
    Page<Player> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
