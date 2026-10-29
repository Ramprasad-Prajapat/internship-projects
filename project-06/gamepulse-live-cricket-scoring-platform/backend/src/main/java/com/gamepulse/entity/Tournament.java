package com.gamepulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 2000)
    private String description;

    private String logoUrl;
    private String organizer;
    private String venue;
    private String format;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private TournamentStatus status = TournamentStatus.DRAFT;

    @Builder.Default
    private Integer oversPerInnings = 20;

    private Integer numberOfTeams;

    private Instant startDate;
    private Instant endDate;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches;

    @ManyToMany
    @JoinTable(
        name = "tournament_teams",
        joinColumns = @JoinColumn(name = "tournament_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<Team> teams;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public TournamentStatus getStatus() { return status; }
    public void setStatus(TournamentStatus status) { this.status = status; }

    public Integer getOversPerInnings() { return oversPerInnings; }
    public void setOversPerInnings(Integer oversPerInnings) { this.oversPerInnings = oversPerInnings; }

    public Integer getNumberOfTeams() { return numberOfTeams; }
    public void setNumberOfTeams(Integer numberOfTeams) { this.numberOfTeams = numberOfTeams; }

    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }

    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<Match> getMatches() { return matches; }
    public void setMatches(List<Match> matches) { this.matches = matches; }

    public List<Team> getTeams() { return teams; }
    public void setTeams(List<Team> teams) { this.teams = teams; }

    public static TournamentBuilder builder() { return new TournamentBuilder(); }

    public static class TournamentBuilder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String logoUrl;
        private String organizer;
        private String venue;
        private String format;
        private TournamentStatus status = TournamentStatus.DRAFT;
        private Integer oversPerInnings = 20;
        private Integer numberOfTeams;
        private Instant startDate;
        private Instant endDate;
        private Instant createdAt;
        private Instant updatedAt;
        private List<Match> matches;
        private List<Team> teams;

        public TournamentBuilder id(Long id) { this.id = id; return this; }
        public TournamentBuilder name(String name) { this.name = name; return this; }
        public TournamentBuilder slug(String slug) { this.slug = slug; return this; }
        public TournamentBuilder description(String description) { this.description = description; return this; }
        public TournamentBuilder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public TournamentBuilder organizer(String organizer) { this.organizer = organizer; return this; }
        public TournamentBuilder venue(String venue) { this.venue = venue; return this; }
        public TournamentBuilder format(String format) { this.format = format; return this; }
        public TournamentBuilder status(TournamentStatus status) { this.status = status; return this; }
        public TournamentBuilder oversPerInnings(Integer oversPerInnings) { this.oversPerInnings = oversPerInnings; return this; }
        public TournamentBuilder numberOfTeams(Integer numberOfTeams) { this.numberOfTeams = numberOfTeams; return this; }
        public TournamentBuilder startDate(Instant startDate) { this.startDate = startDate; return this; }
        public TournamentBuilder endDate(Instant endDate) { this.endDate = endDate; return this; }
        public TournamentBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public TournamentBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public TournamentBuilder matches(List<Match> matches) { this.matches = matches; return this; }
        public TournamentBuilder teams(List<Team> teams) { this.teams = teams; return this; }

        public Tournament build() {
            Tournament t = new Tournament();
            t.id = this.id;
            t.name = this.name;
            t.slug = this.slug;
            t.description = this.description;
            t.logoUrl = this.logoUrl;
            t.organizer = this.organizer;
            t.venue = this.venue;
            t.format = this.format;
            t.status = this.status;
            t.oversPerInnings = this.oversPerInnings;
            t.numberOfTeams = this.numberOfTeams;
            t.startDate = this.startDate;
            t.endDate = this.endDate;
            t.createdAt = this.createdAt;
            t.updatedAt = this.updatedAt;
            t.matches = this.matches;
            t.teams = this.teams;
            return t;
        }
    }
}
