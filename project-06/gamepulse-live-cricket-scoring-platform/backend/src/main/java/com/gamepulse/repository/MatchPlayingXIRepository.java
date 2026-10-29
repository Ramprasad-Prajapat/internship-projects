package com.gamepulse.repository;

import com.gamepulse.entity.MatchPlayingXI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchPlayingXIRepository extends JpaRepository<MatchPlayingXI, Long> {
    List<MatchPlayingXI> findByMatchIdAndTeamId(Long matchId, Long teamId);
    List<MatchPlayingXI> findByMatchId(Long matchId);
    void deleteByMatchIdAndTeamId(Long matchId, Long teamId);
}
