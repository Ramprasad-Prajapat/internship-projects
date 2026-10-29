package com.gamepulse.dto;

import com.gamepulse.entity.PlayerRole;

public class PlayerDTO {
    private Long id;
    private String name;
    private String displayName;
    private Integer jerseyNumber;
    private PlayerRole role;
    private String battingStyle;
    private String bowlingStyle;
    private Long teamId;
    private String teamName;
    private Boolean active;

    public PlayerDTO() {}

    public PlayerDTO(Long id, String name, String displayName, Integer jerseyNumber, PlayerRole role,
                     String battingStyle, String bowlingStyle, Long teamId, String teamName, Boolean active) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.jerseyNumber = jerseyNumber;
        this.role = role;
        this.battingStyle = battingStyle;
        this.bowlingStyle = bowlingStyle;
        this.teamId = teamId;
        this.teamName = teamName;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public Integer getJerseyNumber() { return jerseyNumber; }
    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }

    public PlayerRole getRole() { return role; }
    public void setRole(PlayerRole role) { this.role = role; }

    public String getBattingStyle() { return battingStyle; }
    public void setBattingStyle(String battingStyle) { this.battingStyle = battingStyle; }

    public String getBowlingStyle() { return bowlingStyle; }
    public void setBowlingStyle(String bowlingStyle) { this.bowlingStyle = bowlingStyle; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static PlayerDTOBuilder builder() { return new PlayerDTOBuilder(); }

    public static class PlayerDTOBuilder {
        private Long id;
        private String name;
        private String displayName;
        private Integer jerseyNumber;
        private PlayerRole role;
        private String battingStyle;
        private String bowlingStyle;
        private Long teamId;
        private String teamName;
        private Boolean active;

        public PlayerDTOBuilder id(Long id) { this.id = id; return this; }
        public PlayerDTOBuilder name(String name) { this.name = name; return this; }
        public PlayerDTOBuilder displayName(String displayName) { this.displayName = displayName; return this; }
        public PlayerDTOBuilder jerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; return this; }
        public PlayerDTOBuilder role(PlayerRole role) { this.role = role; return this; }
        public PlayerDTOBuilder battingStyle(String battingStyle) { this.battingStyle = battingStyle; return this; }
        public PlayerDTOBuilder bowlingStyle(String bowlingStyle) { this.bowlingStyle = bowlingStyle; return this; }
        public PlayerDTOBuilder teamId(Long teamId) { this.teamId = teamId; return this; }
        public PlayerDTOBuilder teamName(String teamName) { this.teamName = teamName; return this; }
        public PlayerDTOBuilder active(Boolean active) { this.active = active; return this; }

        public PlayerDTO build() {
            PlayerDTO d = new PlayerDTO();
            d.id = this.id;
            d.name = this.name;
            d.displayName = this.displayName;
            d.jerseyNumber = this.jerseyNumber;
            d.role = this.role;
            d.battingStyle = this.battingStyle;
            d.bowlingStyle = this.bowlingStyle;
            d.teamId = this.teamId;
            d.teamName = this.teamName;
            d.active = this.active;
            return d;
        }
    }
}
