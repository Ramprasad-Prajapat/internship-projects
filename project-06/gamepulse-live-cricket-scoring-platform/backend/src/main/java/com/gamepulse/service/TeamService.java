package com.gamepulse.service;

import com.gamepulse.dto.PlayerDTO;
import com.gamepulse.dto.TeamDTO;
import com.gamepulse.entity.Player;
import com.gamepulse.entity.Team;
import com.gamepulse.repository.PlayerRepository;
import com.gamepulse.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Transactional
    public TeamDTO createTeam(TeamDTO dto) {
        Team team = Team.builder()
                .name(dto.getName())
                .shortName(dto.getShortName())
                .logo(dto.getLogo())
                .city(dto.getCity())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        team = teamRepository.save(team);
        return mapToDTO(team);
    }

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + id));
        return mapToDTO(team);
    }

    @Transactional
    public PlayerDTO addPlayerToTeam(Long teamId, PlayerDTO dto) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));
        Player player = Player.builder()
                .name(dto.getName())
                .displayName(dto.getDisplayName() != null ? dto.getDisplayName() : dto.getName())
                .jerseyNumber(dto.getJerseyNumber())
                .role(dto.getRole())
                .battingStyle(dto.getBattingStyle())
                .bowlingStyle(dto.getBowlingStyle())
                .team(team)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        player = playerRepository.save(player);
        return mapPlayerToDTO(player);
    }

    public TeamDTO mapToDTO(Team team) {
        List<PlayerDTO> playerDTOs = playerRepository.findByTeamId(team.getId()).stream()
                .map(this::mapPlayerToDTO)
                .collect(Collectors.toList());

        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .shortName(team.getShortName())
                .logo(team.getLogo())
                .city(team.getCity())
                .active(team.getActive())
                .players(playerDTOs)
                .build();
    }

    public PlayerDTO mapPlayerToDTO(Player player) {
        return PlayerDTO.builder()
                .id(player.getId())
                .name(player.getName())
                .displayName(player.getDisplayName())
                .jerseyNumber(player.getJerseyNumber())
                .role(player.getRole())
                .battingStyle(player.getBattingStyle())
                .bowlingStyle(player.getBowlingStyle())
                .teamId(player.getTeam() != null ? player.getTeam().getId() : null)
                .teamName(player.getTeam() != null ? player.getTeam().getName() : null)
                .active(player.getActive())
                .build();
    }
}
