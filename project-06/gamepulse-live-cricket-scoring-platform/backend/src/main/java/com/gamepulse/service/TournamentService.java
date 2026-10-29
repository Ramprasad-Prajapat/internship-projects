package com.gamepulse.service;

import com.gamepulse.dto.TournamentCreateRequestDTO;
import com.gamepulse.dto.TournamentResponseDTO;
import com.gamepulse.dto.TeamRegistrationDTO;
import com.gamepulse.entity.Team;
import com.gamepulse.entity.Tournament;
import com.gamepulse.repository.TeamRepository;
import com.gamepulse.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    @Transactional
    public TournamentResponseDTO createTournament(TournamentCreateRequestDTO dto) {
        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            String base = dto.getName() != null ? dto.getName() : "tournament";
            slug = base.toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis();
        }
        Tournament tournament = Tournament.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .logoUrl(dto.getLogoUrl())
                .organizer(dto.getOrganizer())
                .venue(dto.getVenue())
                .format(dto.getFormat())
                .status(com.gamepulse.entity.TournamentStatus.DRAFT)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .oversPerInnings(dto.getOversPerInnings() != null ? dto.getOversPerInnings() : 20)
                .numberOfTeams(dto.getNumberOfTeams())
                .build();
        tournament = tournamentRepository.save(tournament);
        return mapToResponse(tournament);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    @Transactional
    public TournamentResponseDTO registerTeam(Long tournamentId, TeamRegistrationDTO dto) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        // Initialize list if null
        if (tournament.getTeams() == null) {
            tournament.setTeams(new java.util.ArrayList<>());
        }
        if (!tournament.getTeams().contains(team)) {
            tournament.getTeams().add(team);
        }
        tournament = tournamentRepository.save(tournament);
        return mapToResponse(tournament);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SCORER', 'ADMIN', 'SCORER')")
    @Transactional
    public TournamentResponseDTO removeTeam(Long tournamentId, Long teamId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        if (tournament.getTeams() != null) {
            tournament.getTeams().removeIf(t -> t.getId().equals(teamId));
        }
        tournament = tournamentRepository.save(tournament);
        return mapToResponse(tournament);
    }

    @Transactional(readOnly = true)
    public TournamentResponseDTO getTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        return mapToResponse(tournament);
    }

    @Transactional(readOnly = true)
    public List<TournamentResponseDTO> getAllTournaments() {
        return tournamentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TournamentResponseDTO mapToResponse(Tournament tournament) {
        TournamentResponseDTO resp = new TournamentResponseDTO();
        resp.setId(tournament.getId());
        resp.setName(tournament.getName());
        resp.setSlug(tournament.getSlug());
        resp.setDescription(tournament.getDescription());
        resp.setLogoUrl(tournament.getLogoUrl());
        resp.setOrganizer(tournament.getOrganizer());
        resp.setVenue(tournament.getVenue());
        resp.setFormat(tournament.getFormat());
        resp.setStartDate(tournament.getStartDate());
        resp.setEndDate(tournament.getEndDate());
        resp.setOversPerInnings(tournament.getOversPerInnings());
        resp.setNumberOfTeams(tournament.getNumberOfTeams());
        resp.setStatus(tournament.getStatus() != null ? tournament.getStatus().name() : "DRAFT");
        if (tournament.getTeams() != null) {
            resp.setTeamIds(tournament.getTeams().stream().map(Team::getId).collect(Collectors.toList()));
        }
        if (tournament.getMatches() != null) {
            resp.setMatchIds(tournament.getMatches().stream().map(m -> m.getId()).collect(Collectors.toList()));
        }
        return resp;
    }
}
