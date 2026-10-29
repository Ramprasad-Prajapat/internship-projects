package com.gamepulse.repository;

import com.gamepulse.entity.TournamentTeamStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TournamentTeamStatisticsRepository extends JpaRepository<TournamentTeamStatistics, Long> {
    List<TournamentTeamStatistics> findByTournamentId(Long tournamentId);
    TournamentTeamStatistics findByTournamentIdAndTeamId(Long tournamentId, Long teamId);
}
