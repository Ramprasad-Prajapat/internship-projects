package com.gamepulse.dto;

import java.util.List;

public class TeamDTO {
    private Long id;
    private String name;
    private String shortName;
    private String logo;
    private String city;
    private Boolean active;
    private List<PlayerDTO> players;

    public TeamDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public List<PlayerDTO> getPlayers() { return players; }
    public void setPlayers(List<PlayerDTO> players) { this.players = players; }

    public static TeamDTOBuilder builder() { return new TeamDTOBuilder(); }

    public static class TeamDTOBuilder {
        private Long id;
        private String name;
        private String shortName;
        private String logo;
        private String city;
        private Boolean active;
        private List<PlayerDTO> players;

        public TeamDTOBuilder id(Long id) { this.id = id; return this; }
        public TeamDTOBuilder name(String name) { this.name = name; return this; }
        public TeamDTOBuilder shortName(String shortName) { this.shortName = shortName; return this; }
        public TeamDTOBuilder logo(String logo) { this.logo = logo; return this; }
        public TeamDTOBuilder city(String city) { this.city = city; return this; }
        public TeamDTOBuilder active(Boolean active) { this.active = active; return this; }
        public TeamDTOBuilder players(List<PlayerDTO> players) { this.players = players; return this; }

        public TeamDTO build() {
            TeamDTO t = new TeamDTO();
            t.id = this.id;
            t.name = this.name;
            t.shortName = this.shortName;
            t.logo = this.logo;
            t.city = this.city;
            t.active = this.active;
            t.players = this.players;
            return t;
        }
    }
}
