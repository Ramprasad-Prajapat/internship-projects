package com.gamepulse;

import com.gamepulse.dto.SearchResponseDTO;
import com.gamepulse.entity.Player;
import com.gamepulse.entity.PlayerRole;
import com.gamepulse.entity.Team;
import com.gamepulse.repository.PlayerRepository;
import com.gamepulse.repository.TeamRepository;
import com.gamepulse.service.SearchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SearchServiceTest {

    @Autowired
    private SearchService searchService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Test
    @DisplayName("Verify global search query matching")
    void testGlobalSearch() {
        Team t = Team.builder().name("Royal Challengers").shortName("RCB").active(true).build();
        teamRepository.save(t);

        Player p = Player.builder().name("Virat Kohli").role(PlayerRole.BATTER).team(t).active(true).build();
        playerRepository.save(p);

        SearchResponseDTO res = searchService.search("Virat");
        assertNotNull(res);
        assertFalse(res.getPlayers().isEmpty());
        assertEquals("Virat Kohli", res.getPlayers().get(0).getName());

        SearchResponseDTO resTeam = searchService.search("Royal");
        assertFalse(resTeam.getTeams().isEmpty());
        assertEquals("Royal Challengers", resTeam.getTeams().get(0).getName());
    }
}
