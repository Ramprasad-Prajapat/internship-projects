package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String shortName;

    private String logo;
    private String city;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Builder.Default
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("team")
    private List<Player> players = new ArrayList<>();

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

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

    public List<Player> getPlayers() { return players; }
    public void setPlayers(List<Player> players) { this.players = players; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static TeamBuilder builder() { return new TeamBuilder(); }

    public static class TeamBuilder {
        private Long id;
        private String name;
        private String shortName;
        private String logo;
        private String city;
        private Boolean active = true;
        private List<Player> players = new ArrayList<>();
        private Instant createdAt;
        private Instant updatedAt;

        public TeamBuilder id(Long id) { this.id = id; return this; }
        public TeamBuilder name(String name) { this.name = name; return this; }
        public TeamBuilder shortName(String shortName) { this.shortName = shortName; return this; }
        public TeamBuilder logo(String logo) { this.logo = logo; return this; }
        public TeamBuilder city(String city) { this.city = city; return this; }
        public TeamBuilder active(Boolean active) { this.active = active; return this; }
        public TeamBuilder players(List<Player> players) { this.players = players; return this; }
        public TeamBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public TeamBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Team build() {
            Team t = new Team();
            t.id = this.id;
            t.name = this.name;
            t.shortName = this.shortName;
            t.logo = this.logo;
            t.city = this.city;
            t.active = this.active;
            t.players = this.players;
            t.createdAt = this.createdAt;
            t.updatedAt = this.updatedAt;
            return t;
        }
    }
}
