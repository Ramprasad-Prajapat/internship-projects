package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String displayName;
    private Integer jerseyNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlayerRole role;

    private String battingStyle;
    private String bowlingStyle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties("players")
    private Team team;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

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

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public String getLastNameOrName() {
        if (displayName != null && !displayName.isBlank()) return displayName;
        if (name == null) return "";
        String[] parts = name.split(" ");
        return parts[parts.length - 1];
    }

    public static PlayerBuilder builder() { return new PlayerBuilder(); }

    public static class PlayerBuilder {
        private Long id;
        private String name;
        private String displayName;
        private Integer jerseyNumber;
        private PlayerRole role;
        private String battingStyle;
        private String bowlingStyle;
        private Team team;
        private Boolean active = true;
        private Instant createdAt;
        private Instant updatedAt;

        public PlayerBuilder id(Long id) { this.id = id; return this; }
        public PlayerBuilder name(String name) { this.name = name; return this; }
        public PlayerBuilder displayName(String displayName) { this.displayName = displayName; return this; }
        public PlayerBuilder jerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; return this; }
        public PlayerBuilder role(PlayerRole role) { this.role = role; return this; }
        public PlayerBuilder battingStyle(String battingStyle) { this.battingStyle = battingStyle; return this; }
        public PlayerBuilder bowlingStyle(String bowlingStyle) { this.bowlingStyle = bowlingStyle; return this; }
        public PlayerBuilder team(Team team) { this.team = team; return this; }
        public PlayerBuilder active(Boolean active) { this.active = active; return this; }
        public PlayerBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public PlayerBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Player build() {
            Player p = new Player();
            p.id = this.id;
            p.name = this.name;
            p.displayName = this.displayName;
            p.jerseyNumber = this.jerseyNumber;
            p.role = this.role;
            p.battingStyle = this.battingStyle;
            p.bowlingStyle = this.bowlingStyle;
            p.team = this.team;
            p.active = this.active;
            p.createdAt = this.createdAt;
            p.updatedAt = this.updatedAt;
            return p;
        }
    }
}
