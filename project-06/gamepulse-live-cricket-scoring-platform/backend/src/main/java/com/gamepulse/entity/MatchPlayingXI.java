package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "match_playing_xi", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"match_id", "team_id", "player_id"})
})
public class MatchPlayingXI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    @JsonIgnoreProperties({"teamA", "teamB"})
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnoreProperties("players")
    private Team team;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player player;

    private Boolean isCaptain = false;
    private Boolean isWicketKeeper = false;
    private Boolean isSubstitute = false;
    private Boolean isLocked = false;

    public MatchPlayingXI() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Match getMatch() { return match; }
    public void setMatch(Match match) { this.match = match; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }

    public Boolean getIsCaptain() { return isCaptain; }
    public void setIsCaptain(Boolean isCaptain) { this.isCaptain = isCaptain; }

    public Boolean getIsWicketKeeper() { return isWicketKeeper; }
    public void setIsWicketKeeper(Boolean isWicketKeeper) { this.isWicketKeeper = isWicketKeeper; }

    public Boolean getIsSubstitute() { return isSubstitute; }
    public void setIsSubstitute(Boolean isSubstitute) { this.isSubstitute = isSubstitute; }

    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean isLocked) { this.isLocked = isLocked; }

    public static MatchPlayingXIBuilder builder() { return new MatchPlayingXIBuilder(); }

    public static class MatchPlayingXIBuilder {
        private Long id;
        private Match match;
        private Team team;
        private Player player;
        private Boolean isCaptain = false;
        private Boolean isWicketKeeper = false;
        private Boolean isSubstitute = false;
        private Boolean isLocked = false;

        public MatchPlayingXIBuilder id(Long id) { this.id = id; return this; }
        public MatchPlayingXIBuilder match(Match match) { this.match = match; return this; }
        public MatchPlayingXIBuilder team(Team team) { this.team = team; return this; }
        public MatchPlayingXIBuilder player(Player player) { this.player = player; return this; }
        public MatchPlayingXIBuilder isCaptain(Boolean isCaptain) { this.isCaptain = isCaptain; return this; }
        public MatchPlayingXIBuilder isWicketKeeper(Boolean isWicketKeeper) { this.isWicketKeeper = isWicketKeeper; return this; }
        public MatchPlayingXIBuilder isSubstitute(Boolean isSubstitute) { this.isSubstitute = isSubstitute; return this; }
        public MatchPlayingXIBuilder isLocked(Boolean isLocked) { this.isLocked = isLocked; return this; }

        public MatchPlayingXI build() {
            MatchPlayingXI xi = new MatchPlayingXI();
            xi.id = this.id;
            xi.match = this.match;
            xi.team = this.team;
            xi.player = this.player;
            xi.isCaptain = this.isCaptain;
            xi.isWicketKeeper = this.isWicketKeeper;
            xi.isSubstitute = this.isSubstitute;
            xi.isLocked = this.isLocked;
            return xi;
        }
    }
}
