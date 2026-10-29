package com.gamepulse.repository;

import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Partnership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartnershipRepository extends JpaRepository<Partnership, Long> {
    List<Partnership> findByInningsOrderByIdAsc(Innings innings);
    Optional<Partnership> findByInningsAndIsCurrentTrue(Innings innings);
    void deleteByInnings(Innings innings);
}
