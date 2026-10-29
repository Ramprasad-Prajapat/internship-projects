package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "overs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Over {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private Integer overNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bowler_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player bowler;

    @Builder.Default
    private Integer legalBallCount = 0;

    @Builder.Default
    private Integer totalRuns = 0;

    @Builder.Default
    private Integer totalWickets = 0;

    @Builder.Default
    private Boolean isCompleted = false;

    @CreationTimestamp
    private Instant createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Integer getOverNumber() { return overNumber; }
    public void setOverNumber(Integer overNumber) { this.overNumber = overNumber; }

    public Player getBowler() { return bowler; }
    public void setBowler(Player bowler) { this.bowler = bowler; }

    public Integer getLegalBallCount() { return legalBallCount; }
    public void setLegalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; }

    public Integer getTotalRuns() { return totalRuns; }
    public void setTotalRuns(Integer totalRuns) { this.totalRuns = totalRuns; }

    public Integer getTotalWickets() { return totalWickets; }
    public void setTotalWickets(Integer totalWickets) { this.totalWickets = totalWickets; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static OverBuilder builder() { return new OverBuilder(); }

    public static class OverBuilder {
        private Long id;
        private Innings innings;
        private Integer overNumber;
        private Player bowler;
        private Integer legalBallCount = 0;
        private Integer totalRuns = 0;
        private Integer totalWickets = 0;
        private Boolean isCompleted = false;
        private Instant createdAt;

        public OverBuilder id(Long id) { this.id = id; return this; }
        public OverBuilder innings(Innings innings) { this.innings = innings; return this; }
        public OverBuilder overNumber(Integer overNumber) { this.overNumber = overNumber; return this; }
        public OverBuilder bowler(Player bowler) { this.bowler = bowler; return this; }
        public OverBuilder legalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; return this; }
        public OverBuilder totalRuns(Integer totalRuns) { this.totalRuns = totalRuns; return this; }
        public OverBuilder totalWickets(Integer totalWickets) { this.totalWickets = totalWickets; return this; }
        public OverBuilder isCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; return this; }
        public OverBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Over build() {
            Over o = new Over();
            o.id = this.id;
            o.innings = this.innings;
            o.overNumber = this.overNumber;
            o.bowler = this.bowler;
            o.legalBallCount = this.legalBallCount;
            o.totalRuns = this.totalRuns;
            o.totalWickets = this.totalWickets;
            o.isCompleted = this.isCompleted;
            o.createdAt = this.createdAt;
            return o;
        }
    }
}
