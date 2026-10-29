package com.gamepulse.service;

import com.gamepulse.dto.PlayerDTO;
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
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamService teamService;

    @Transactional
    public PlayerDTO createPlayer(PlayerDTO dto) {
        Team team = null;
        if (dto.getTeamId() != null) {
            team = teamRepository.findById(dto.getTeamId()).orElse(null);
        }
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
        return teamService.mapPlayerToDTO(player);
    }

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(teamService::mapPlayerToDTO)
                .collect(Collectors.toList());
    }

    public PlayerDTO getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));
        return teamService.mapPlayerToDTO(player);
    }
}
