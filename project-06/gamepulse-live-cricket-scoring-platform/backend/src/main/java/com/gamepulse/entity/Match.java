package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_a_id", nullable = false)
    @JsonIgnoreProperties("players")
    private Team teamA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_b_id", nullable = false)
    @JsonIgnoreProperties("players")
    private Team teamB;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    private String venue;
    private Instant matchDate;
    private String format;
    
    @Builder.Default
    private Integer totalOvers = 20;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "toss_winner_id")
    @JsonIgnoreProperties("players")
    private Team tossWinner;

    private String tossDecision; // "BAT" or "BOWLE"

    @Builder.Default
    private Integer currentInningsNumber = 1;

    private String resultSummary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winning_team_id")
    @JsonIgnoreProperties("players")
    private Team winningTeam;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Team getTeamA() { return teamA; }
    public void setTeamA(Team teamA) { this.teamA = teamA; }

    public Team getTeamB() { return teamB; }
    public void setTeamB(Team teamB) { this.teamB = teamB; }

    public Tournament getTournament() { return tournament; }
    public void setTournament(Tournament tournament) { this.tournament = tournament; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Instant getMatchDate() { return matchDate; }
    public void setMatchDate(Instant matchDate) { this.matchDate = matchDate; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public Integer getTotalOvers() { return totalOvers; }
    public void setTotalOvers(Integer totalOvers) { this.totalOvers = totalOvers; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public Team getTossWinner() { return tossWinner; }
    public void setTossWinner(Team tossWinner) { this.tossWinner = tossWinner; }

    public String getTossDecision() { return tossDecision; }
    public void setTossDecision(String tossDecision) { this.tossDecision = tossDecision; }

    public Integer getCurrentInningsNumber() { return currentInningsNumber; }
    public void setCurrentInningsNumber(Integer currentInningsNumber) { this.currentInningsNumber = currentInningsNumber; }

    public String getResultSummary() { return resultSummary; }
    public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }

    public Team getWinningTeam() { return winningTeam; }
    public void setWinningTeam(Team winningTeam) { this.winningTeam = winningTeam; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static MatchBuilder builder() { return new MatchBuilder(); }

    public static class MatchBuilder {
        private Long id;
        private Team teamA;
        private Team teamB;
        private Tournament tournament;
        private String venue;
        private Instant matchDate;
        private String format;
        private Integer totalOvers = 20;
        private MatchStatus status = MatchStatus.SCHEDULED;
        private Team tossWinner;
        private String tossDecision;
        private Integer currentInningsNumber = 1;
        private String resultSummary;
        private Team winningTeam;
        private Instant createdAt;
        private Instant updatedAt;

        public MatchBuilder id(Long id) { this.id = id; return this; }
        public MatchBuilder teamA(Team teamA) { this.teamA = teamA; return this; }
        public MatchBuilder teamB(Team teamB) { this.teamB = teamB; return this; }
        public MatchBuilder tournament(Tournament tournament) { this.tournament = tournament; return this; }
        public MatchBuilder venue(String venue) { this.venue = venue; return this; }
        public MatchBuilder matchDate(Instant matchDate) { this.matchDate = matchDate; return this; }
        public MatchBuilder format(String format) { this.format = format; return this; }
        public MatchBuilder totalOvers(Integer totalOvers) { this.totalOvers = totalOvers; return this; }
        public MatchBuilder status(MatchStatus status) { this.status = status; return this; }
        public MatchBuilder tossWinner(Team tossWinner) { this.tossWinner = tossWinner; return this; }
        public MatchBuilder tossDecision(String tossDecision) { this.tossDecision = tossDecision; return this; }
        public MatchBuilder currentInningsNumber(Integer currentInningsNumber) { this.currentInningsNumber = currentInningsNumber; return this; }
        public MatchBuilder resultSummary(String resultSummary) { this.resultSummary = resultSummary; return this; }
        public MatchBuilder winningTeam(Team winningTeam) { this.winningTeam = winningTeam; return this; }
        public MatchBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public MatchBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Match build() {
            Match m = new Match();
            m.id = this.id;
            m.teamA = this.teamA;
            m.teamB = this.teamB;
            m.tournament = this.tournament;
            m.venue = this.venue;
            m.matchDate = this.matchDate;
            m.format = this.format;
            m.totalOvers = this.totalOvers;
            m.status = this.status;
            m.tossWinner = this.tossWinner;
            m.tossDecision = this.tossDecision;
            m.currentInningsNumber = this.currentInningsNumber;
            m.resultSummary = this.resultSummary;
            m.winningTeam = this.winningTeam;
            m.createdAt = this.createdAt;
            m.updatedAt = this.updatedAt;
            return m;
        }
    }
}
