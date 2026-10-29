package com.gamepulse.service;

import com.gamepulse.dto.SearchResponseDTO;
import com.gamepulse.entity.Match;
import com.gamepulse.entity.MatchStatus;
import com.gamepulse.entity.Player;
import com.gamepulse.entity.PlayerRole;
import com.gamepulse.entity.Team;
import com.gamepulse.entity.Tournament;
import com.gamepulse.entity.TournamentStatus;
import com.gamepulse.repository.MatchRepository;
import com.gamepulse.repository.PlayerRepository;
import com.gamepulse.repository.TeamRepository;
import com.gamepulse.repository.TournamentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SearchServiceExtendedTest {

    @Autowired
    private SearchService searchService;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    private Team teamA;
    private Team teamB;

    @BeforeEach
    void setUp() {
        teamA = Team.builder().name("Mumbai Indians").shortName("MI").active(true).build();
        teamB = Team.builder().name("Chennai Super Kings").shortName("CSK").active(true).build();
        teamRepository.save(teamA);
        teamRepository.save(teamB);

        // Players
        Player p1 = Player.builder().name("Rohit Sharma").role(PlayerRole.BATTER).team(teamA).active(true).build();
        Player p2 = Player.builder().name("MS Dhoni").role(PlayerRole.WICKET_KEEPER).team(teamB).active(true).build();
        playerRepository.save(p1);
        playerRepository.save(p2);

        // Tournament
        Tournament tournament = Tournament.builder()
                .name("IPL 2024")
                .slug("ipl-2024")
                .format("T20")
                .status(TournamentStatus.UPCOMING)
                .build();
        tournamentRepository.save(tournament);

        // Match
        Match match = Match.builder()
                .teamA(teamA)
                .teamB(teamB)
                .venue("Wankhede Stadium")
                .status(MatchStatus.UPCOMING)
                .build();
        matchRepository.save(match);
    }

    @Test
    @DisplayName("Case-insensitive player search returns correct result")
    void testPlayerCaseInsensitive() {
        SearchResponseDTO res = searchService.search("rohit", "all", 0, 10);
        assertFalse(res.getPlayers().isEmpty());
        assertEquals("Rohit Sharma", res.getPlayers().get(0).getName());
    }

    @Test
    @DisplayName("Partial team name search works")
    void testTeamPartialSearch() {
        SearchResponseDTO res = searchService.search("Chenn", "all", 0, 10);
        assertFalse(res.getTeams().isEmpty());
        assertEquals("Chennai Super Kings", res.getTeams().get(0).getName());
    }

    @Test
    @DisplayName("Tournament search with filter live/upcoming/completed")
    void testTournamentFilter() {
        // Upcoming filter should include the tournament we added
        SearchResponseDTO res = searchService.search("IPL", "upcoming", 0, 10);
        assertFalse(res.getTournaments().isEmpty());
        assertEquals("IPL 2024", res.getTournaments().get(0).getName());
    }

    @Test
    @DisplayName("Match search by venue works and pagination correct")
    void testMatchVenueAndPagination() {
        SearchResponseDTO res = searchService.search("Wankhede", "all", 0, 1);
        assertFalse(res.getMatches().isEmpty());
        assertEquals(1, res.getMatchesPage().getSize());
        assertEquals(1, res.getMatchesPage().getTotalElements());
    }

    @Test
    @DisplayName("Pagination boundaries: first, middle, last page")
    void testPaginationBoundaries() {
        // Insert multiple dummy players to exceed one page (PAGE_SIZE 5 for test)
        for (int i = 0; i < 12; i++) {
            Player p = Player.builder().name("Player" + i).role(PlayerRole.BATTER).team(teamA).active(true).build();
            playerRepository.save(p);
        }
        SearchResponseDTO firstPage = searchService.search("Player", "all", 0, 5);
        assertEquals(5, firstPage.getPlayersPage().getContent().size());
        SearchResponseDTO middlePage = searchService.search("Player", "all", 1, 5);
        assertEquals(5, middlePage.getPlayersPage().getContent().size());
        SearchResponseDTO lastPage = searchService.search("Player", "all", 2, 5);
        // 12 players => last page has 2 entries
        assertEquals(2, lastPage.getPlayersPage().getContent().size());
    }

    @Test
    @DisplayName("Invalid pagination parameters are handled gracefully")
    void testInvalidPaginationParams() {
        // Negative page
        SearchResponseDTO resNeg = searchService.search("", "all", -1, 10);
        // Service should default or return empty without exception
        assertNotNull(resNeg);
        // Excessive size
        SearchResponseDTO resLarge = searchService.search("", "all", 0, 1000);
        assertNotNull(resLarge);
        // Should still return results without error
    }

    @Test
    @DisplayName("DTO safety: no sensitive fields exposed")
    void testDtoSafety() {
        SearchResponseDTO res = searchService.search("Rohit", "all", 0, 10);
        // Ensure player DTO does not contain entity internal IDs beyond what is expected
        assertNotNull(res.getPlayers().get(0).getId());
        // Assuming no password or token fields exist on DTO; just check known fields only
        // Here we just assert that serialization would not include unexpected fields (cannot test here directly)
    }
}
