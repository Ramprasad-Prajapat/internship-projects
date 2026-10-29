package com.gamepulse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tournament_team_statistics",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"tournament_id", "team_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TournamentTeamStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    private Integer played = 0;
    private Integer won = 0;
    private Integer lost = 0;
    private Integer tied = 0;
    private Integer noResult = 0;
    private Integer points = 0;
    private Integer runsFor = 0;
    private Double oversFor = 0.0;
    private Integer runsAgainst = 0;
    private Double oversAgainst = 0.0;
    private Double nrr = 0.0;

    // Explicit getters and setters to ensure compilation without Lombok processing
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tournament getTournament() { return tournament; }
    public void setTournament(Tournament tournament) { this.tournament = tournament; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public Integer getPlayed() { return played; }
    public void setPlayed(Integer played) { this.played = played; }

    public Integer getWon() { return won; }
    public void setWon(Integer won) { this.won = won; }

    public Integer getLost() { return lost; }
    public void setLost(Integer lost) { this.lost = lost; }

    public Integer getTied() { return tied; }
    public void setTied(Integer tied) { this.tied = tied; }

    public Integer getNoResult() { return noResult; }
    public void setNoResult(Integer noResult) { this.noResult = noResult; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getRunsFor() { return runsFor; }
    public void setRunsFor(Integer runsFor) { this.runsFor = runsFor; }

    public Double getOversFor() { return oversFor; }
    public void setOversFor(Double oversFor) { this.oversFor = oversFor; }

    public Integer getRunsAgainst() { return runsAgainst; }
    public void setRunsAgainst(Integer runsAgainst) { this.runsAgainst = runsAgainst; }

    public Double getOversAgainst() { return oversAgainst; }
    public void setOversAgainst(Double oversAgainst) { this.oversAgainst = oversAgainst; }

    public Double getNrr() { return nrr; }
    public void setNrr(Double nrr) { this.nrr = nrr; }

}
