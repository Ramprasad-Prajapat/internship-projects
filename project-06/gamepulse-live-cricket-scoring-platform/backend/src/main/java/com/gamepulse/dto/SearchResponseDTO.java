package com.gamepulse.dto;

import com.gamepulse.dto.PlayerDTO;
import com.gamepulse.dto.TeamDTO;
import com.gamepulse.dto.MatchDTO;
import com.gamepulse.dto.TournamentDTO;

public class SearchResponseDTO {
    private PageDTO<PlayerDTO> playersPage;
    private PageDTO<TeamDTO> teamsPage;
    private PageDTO<MatchDTO> matchesPage;
    private PageDTO<TournamentDTO> tournamentsPage;

    public SearchResponseDTO() {}
    // Convenience getters for direct list access
    public java.util.List<PlayerDTO> getPlayers() { return playersPage != null ? playersPage.getContent() : java.util.Collections.emptyList(); }
    public java.util.List<TeamDTO> getTeams() { return teamsPage != null ? teamsPage.getContent() : java.util.Collections.emptyList(); }
    public java.util.List<MatchDTO> getMatches() { return matchesPage != null ? matchesPage.getContent() : java.util.Collections.emptyList(); }
    public java.util.List<TournamentDTO> getTournaments() { return tournamentsPage != null ? tournamentsPage.getContent() : java.util.Collections.emptyList(); }

    public PageDTO<PlayerDTO> getPlayersPage() { return playersPage; }
    public void setPlayersPage(PageDTO<PlayerDTO> playersPage) { this.playersPage = playersPage; }

    public PageDTO<TeamDTO> getTeamsPage() { return teamsPage; }
    public void setTeamsPage(PageDTO<TeamDTO> teamsPage) { this.teamsPage = teamsPage; }

    public PageDTO<MatchDTO> getMatchesPage() { return matchesPage; }
    public void setMatchesPage(PageDTO<MatchDTO> matchesPage) { this.matchesPage = matchesPage; }

    public PageDTO<TournamentDTO> getTournamentsPage() { return tournamentsPage; }
    public void setTournamentsPage(PageDTO<TournamentDTO> tournamentsPage) { this.tournamentsPage = tournamentsPage; }
}
