package com.gamepulse.service;

import com.gamepulse.dto.PageDTO;
import com.gamepulse.dto.PlayerDTO;
import com.gamepulse.dto.TeamDTO;
import com.gamepulse.dto.MatchDTO;
import com.gamepulse.dto.TournamentDTO;
import com.gamepulse.dto.SearchResponseDTO;
import com.gamepulse.entity.Match;
import com.gamepulse.entity.MatchStatus;
import com.gamepulse.entity.Player;
import com.gamepulse.entity.Team;
import com.gamepulse.entity.Tournament;
import com.gamepulse.repository.MatchRepository;
import com.gamepulse.repository.PlayerRepository;
import com.gamepulse.repository.TeamRepository;
import com.gamepulse.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Transactional(readOnly = true)
    public SearchResponseDTO search(String query) {
        return search(query, "all", 0, 10);
    }

    @Transactional(readOnly = true)
    public SearchResponseDTO search(String query, String filter) {
        return search(query, filter, 0, 10);
    }

    @Transactional(readOnly = true)
    public SearchResponseDTO search(String query, String filter, int page, int size) {
        SearchResponseDTO response = new SearchResponseDTO();
        String q = (query == null) ? "" : query.trim();
        // Validate pagination parameters to prevent IllegalArgumentException
        int validPage = page < 0 ? 0 : page;
        int validSize = size <= 0 ? 10 : size;
        PageRequest pageable = PageRequest.of(validPage, validSize);

        // Players
        Page<Player> playerPage = playerRepository.findByNameContainingIgnoreCase(q, pageable);
        List<PlayerDTO> playerDTOs = playerPage.getContent().stream().map(p -> {
            PlayerDTO dto = new PlayerDTO();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setDisplayName(p.getDisplayName());
            dto.setJerseyNumber(p.getJerseyNumber());
            dto.setRole(p.getRole());
            dto.setBattingStyle(p.getBattingStyle());
            dto.setBowlingStyle(p.getBowlingStyle());
            if (p.getTeam() != null) {
                dto.setTeamId(p.getTeam().getId());
                dto.setTeamName(p.getTeam().getName());
            }
            dto.setActive(p.getActive());
            return dto;
        }).collect(Collectors.toList());
        response.setPlayersPage(new PageDTO<>(playerDTOs, playerPage.getNumber(),
                playerPage.getSize(), playerPage.getTotalElements(), playerPage.getTotalPages()));

        // Teams
        Page<Team> teamPage = teamRepository.findByNameContainingIgnoreCase(q, pageable);
        List<TeamDTO> teamDTOs = teamPage.getContent().stream().map(t -> {
            TeamDTO dto = new TeamDTO();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setShortName(t.getShortName());
            dto.setLogo(t.getLogo());
            dto.setCity(t.getCity());
            dto.setActive(t.getActive());
            return dto;
        }).collect(Collectors.toList());
        response.setTeamsPage(new PageDTO<>(teamDTOs, teamPage.getNumber(),
                teamPage.getSize(), teamPage.getTotalElements(), teamPage.getTotalPages()));

        // Tournaments
        Page<Tournament> tournamentPage = tournamentRepository.findByNameContainingIgnoreCase(q, pageable);
        List<TournamentDTO> tournamentDTOs = tournamentPage.getContent().stream().map(t -> {
            TournamentDTO dto = new TournamentDTO();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setSlug(t.getSlug());
            dto.setFormat(t.getFormat());
            dto.setStatus(t.getStatus());
            dto.setStartDate(t.getStartDate());
            dto.setEndDate(t.getEndDate());
            return dto;
        }).collect(Collectors.toList());
        response.setTournamentsPage(new PageDTO<>(tournamentDTOs, tournamentPage.getNumber(),
                tournamentPage.getSize(), tournamentPage.getTotalElements(), tournamentPage.getTotalPages()));

        // Matches - apply filter if provided
        Page<Match> matchPage;
        if (filter != null) {
            String f = filter.toLowerCase();
            if (f.equals("live")) {
                matchPage = matchRepository.findByStatus(MatchStatus.LIVE, pageable);
            } else if (f.equals("upcoming")) {
                matchPage = matchRepository.findByStatus(MatchStatus.UPCOMING, pageable);
            } else if (f.equals("completed")) {
                matchPage = matchRepository.findByStatus(MatchStatus.COMPLETED, pageable);
            } else {
                matchPage = matchRepository.findAll(pageable);
            }
        } else {
            matchPage = matchRepository.findAll(pageable);
        }

        List<MatchDTO> matchDTOs = matchPage.getContent().stream().map(m -> {
            MatchDTO dto = new MatchDTO();
            dto.setId(m.getId());
            dto.setTeamAName(m.getTeamA() != null ? m.getTeamA().getName() : null);
            dto.setTeamBName(m.getTeamB() != null ? m.getTeamB().getName() : null);
            dto.setVenue(m.getVenue());
            dto.setMatchDate(m.getMatchDate());
            dto.setFormat(m.getFormat());
            dto.setStatus(m.getStatus());
            return dto;
        }).collect(Collectors.toList());
        response.setMatchesPage(new PageDTO<>(matchDTOs, matchPage.getNumber(),
                matchPage.getSize(), matchPage.getTotalElements(), matchPage.getTotalPages()));

        return response;
    }
}
