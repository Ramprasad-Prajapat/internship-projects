package com.gamepulse.repository;

import com.gamepulse.entity.FanPoll;
import com.gamepulse.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FanPollRepository extends JpaRepository<FanPoll, Long> {
    List<FanPoll> findByMatch(Match match);
}
