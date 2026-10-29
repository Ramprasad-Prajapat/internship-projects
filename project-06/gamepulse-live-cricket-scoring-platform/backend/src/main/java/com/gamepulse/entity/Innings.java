package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "innings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Innings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    @JsonIgnoreProperties({"teamA", "teamB"})
    private Match match;

    @Column(nullable = false)
    private Integer inningsNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batting_team_id", nullable = false)
    @JsonIgnoreProperties("players")
    private Team battingTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bowling_team_id", nullable = false)
    @JsonIgnoreProperties("players")
    private Team bowlingTeam;

    @Builder.Default
    private Integer totalRuns = 0;

    @Builder.Default
    private Integer totalWickets = 0;

    @Builder.Default
    private Integer legalBallCount = 0;

    @Builder.Default
    private String totalOversDisplay = "0.0";

    @Builder.Default
    private Integer byes = 0;

    @Builder.Default
    private Integer legByes = 0;

    @Builder.Default
    private Integer wides = 0;

    @Builder.Default
    private Integer noBalls = 0;

    @Builder.Default
    private Integer penalties = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_striker_id")
    @JsonIgnoreProperties("team")
    private Player currentStriker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_non_striker_id")
    @JsonIgnoreProperties("team")
    private Player currentNonStriker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_bowler_id")
    @JsonIgnoreProperties("team")
    private Player currentBowler;

    private Integer targetRuns;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private InningsStatus status = InningsStatus.NOT_STARTED;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Match getMatch() { return match; }
    public void setMatch(Match match) { this.match = match; }

    public Integer getInningsNumber() { return inningsNumber; }
    public void setInningsNumber(Integer inningsNumber) { this.inningsNumber = inningsNumber; }

    public Team getBattingTeam() { return battingTeam; }
    public void setBattingTeam(Team battingTeam) { this.battingTeam = battingTeam; }

    public Team getBowlingTeam() { return bowlingTeam; }
    public void setBowlingTeam(Team bowlingTeam) { this.bowlingTeam = bowlingTeam; }

    public Integer getTotalRuns() { return totalRuns; }
    public void setTotalRuns(Integer totalRuns) { this.totalRuns = totalRuns; }

    public Integer getTotalWickets() { return totalWickets; }
    public void setTotalWickets(Integer totalWickets) { this.totalWickets = totalWickets; }

    public Integer getLegalBallCount() { return legalBallCount; }
    public void setLegalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; }

    public String getTotalOversDisplay() { return totalOversDisplay; }
    public void setTotalOversDisplay(String totalOversDisplay) { this.totalOversDisplay = totalOversDisplay; }

    public Integer getByes() { return byes; }
    public void setByes(Integer byes) { this.byes = byes; }

    public Integer getLegByes() { return legByes; }
    public void setLegByes(Integer legByes) { this.legByes = legByes; }

    public Integer getWides() { return wides; }
    public void setWides(Integer wides) { this.wides = wides; }

    public Integer getNoBalls() { return noBalls; }
    public void setNoBalls(Integer noBalls) { this.noBalls = noBalls; }

    public Integer getPenalties() { return penalties; }
    public void setPenalties(Integer penalties) { this.penalties = penalties; }

    public Player getCurrentStriker() { return currentStriker; }
    public void setCurrentStriker(Player currentStriker) { this.currentStriker = currentStriker; }

    public Player getCurrentNonStriker() { return currentNonStriker; }
    public void setCurrentNonStriker(Player currentNonStriker) { this.currentNonStriker = currentNonStriker; }

    public Player getCurrentBowler() { return currentBowler; }
    public void setCurrentBowler(Player currentBowler) { this.currentBowler = currentBowler; }

    public Integer getTargetRuns() { return targetRuns; }
    public void setTargetRuns(Integer targetRuns) { this.targetRuns = targetRuns; }

    public InningsStatus getStatus() { return status; }
    public void setStatus(InningsStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static InningsBuilder builder() { return new InningsBuilder(); }

    public static class InningsBuilder {
        private Long id;
        private Match match;
        private Integer inningsNumber;
        private Team battingTeam;
        private Team bowlingTeam;
        private Integer totalRuns = 0;
        private Integer totalWickets = 0;
        private Integer legalBallCount = 0;
        private String totalOversDisplay = "0.0";
        private Integer byes = 0;
        private Integer legByes = 0;
        private Integer wides = 0;
        private Integer noBalls = 0;
        private Integer penalties = 0;
        private Player currentStriker;
        private Player currentNonStriker;
        private Player currentBowler;
        private Integer targetRuns;
        private InningsStatus status = InningsStatus.NOT_STARTED;
        private Instant createdAt;
        private Instant updatedAt;

        public InningsBuilder id(Long id) { this.id = id; return this; }
        public InningsBuilder match(Match match) { this.match = match; return this; }
        public InningsBuilder inningsNumber(Integer inningsNumber) { this.inningsNumber = inningsNumber; return this; }
        public InningsBuilder battingTeam(Team battingTeam) { this.battingTeam = battingTeam; return this; }
        public InningsBuilder bowlingTeam(Team bowlingTeam) { this.bowlingTeam = bowlingTeam; return this; }
        public InningsBuilder totalRuns(Integer totalRuns) { this.totalRuns = totalRuns; return this; }
        public InningsBuilder totalWickets(Integer totalWickets) { this.totalWickets = totalWickets; return this; }
        public InningsBuilder legalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; return this; }
        public InningsBuilder totalOversDisplay(String totalOversDisplay) { this.totalOversDisplay = totalOversDisplay; return this; }
        public InningsBuilder byes(Integer byes) { this.byes = byes; return this; }
        public InningsBuilder legByes(Integer legByes) { this.legByes = legByes; return this; }
        public InningsBuilder wides(Integer wides) { this.wides = wides; return this; }
        public InningsBuilder noBalls(Integer noBalls) { this.noBalls = noBalls; return this; }
        public InningsBuilder penalties(Integer penalties) { this.penalties = penalties; return this; }
        public InningsBuilder currentStriker(Player currentStriker) { this.currentStriker = currentStriker; return this; }
        public InningsBuilder currentNonStriker(Player currentNonStriker) { this.currentNonStriker = currentNonStriker; return this; }
        public InningsBuilder currentBowler(Player currentBowler) { this.currentBowler = currentBowler; return this; }
        public InningsBuilder targetRuns(Integer targetRuns) { this.targetRuns = targetRuns; return this; }
        public InningsBuilder status(InningsStatus status) { this.status = status; return this; }
        public InningsBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public InningsBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Innings build() {
            Innings i = new Innings();
            i.id = this.id;
            i.match = this.match;
            i.inningsNumber = this.inningsNumber;
            i.battingTeam = this.battingTeam;
            i.bowlingTeam = this.bowlingTeam;
            i.totalRuns = this.totalRuns;
            i.totalWickets = this.totalWickets;
            i.legalBallCount = this.legalBallCount;
            i.totalOversDisplay = this.totalOversDisplay;
            i.byes = this.byes;
            i.legByes = this.legByes;
            i.wides = this.wides;
            i.noBalls = this.noBalls;
            i.penalties = this.penalties;
            i.currentStriker = this.currentStriker;
            i.currentNonStriker = this.currentNonStriker;
            i.currentBowler = this.currentBowler;
            i.targetRuns = this.targetRuns;
            i.status = this.status;
            i.createdAt = this.createdAt;
            i.updatedAt = this.updatedAt;
            return i;
        }
    }
}
