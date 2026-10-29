package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bowling_performances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BowlingPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player player;

    @Builder.Default
    private Integer legalBallsCount = 0;

    @Builder.Default
    private String oversDisplay = "0.0";

    @Builder.Default
    private Integer runsConceded = 0;

    @Builder.Default
    private Integer wickets = 0;

    @Builder.Default
    private Integer maidens = 0;

    @Builder.Default
    private Integer wides = 0;

    @Builder.Default
    private Integer noBalls = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }

    public Integer getLegalBallsCount() { return legalBallsCount; }
    public void setLegalBallsCount(Integer legalBallsCount) { this.legalBallsCount = legalBallsCount; }

    public String getOversDisplay() { return oversDisplay; }
    public void setOversDisplay(String oversDisplay) { this.oversDisplay = oversDisplay; }

    public Integer getRunsConceded() { return runsConceded; }
    public void setRunsConceded(Integer runsConceded) { this.runsConceded = runsConceded; }

    public Integer getWickets() { return wickets; }
    public void setWickets(Integer wickets) { this.wickets = wickets; }

    public Integer getMaidens() { return maidens; }
    public void setMaidens(Integer maidens) { this.maidens = maidens; }

    public Integer getWides() { return wides; }
    public void setWides(Integer wides) { this.wides = wides; }

    public Integer getNoBalls() { return noBalls; }
    public void setNoBalls(Integer noBalls) { this.noBalls = noBalls; }

    public static BowlingPerformanceBuilder builder() { return new BowlingPerformanceBuilder(); }

    public static class BowlingPerformanceBuilder {
        private Long id;
        private Innings innings;
        private Player player;
        private Integer legalBallsCount = 0;
        private String oversDisplay = "0.0";
        private Integer runsConceded = 0;
        private Integer wickets = 0;
        private Integer maidens = 0;
        private Integer wides = 0;
        private Integer noBalls = 0;

        public BowlingPerformanceBuilder id(Long id) { this.id = id; return this; }
        public BowlingPerformanceBuilder innings(Innings innings) { this.innings = innings; return this; }
        public BowlingPerformanceBuilder player(Player player) { this.player = player; return this; }
        public BowlingPerformanceBuilder legalBallsCount(Integer legalBallsCount) { this.legalBallsCount = legalBallsCount; return this; }
        public BowlingPerformanceBuilder oversDisplay(String oversDisplay) { this.oversDisplay = oversDisplay; return this; }
        public BowlingPerformanceBuilder runsConceded(Integer runsConceded) { this.runsConceded = runsConceded; return this; }
        public BowlingPerformanceBuilder wickets(Integer wickets) { this.wickets = wickets; return this; }
        public BowlingPerformanceBuilder maidens(Integer maidens) { this.maidens = maidens; return this; }
        public BowlingPerformanceBuilder wides(Integer wides) { this.wides = wides; return this; }
        public BowlingPerformanceBuilder noBalls(Integer noBalls) { this.noBalls = noBalls; return this; }

        public BowlingPerformance build() {
            BowlingPerformance b = new BowlingPerformance();
            b.id = this.id;
            b.innings = this.innings;
            b.player = this.player;
            b.legalBallsCount = this.legalBallsCount;
            b.oversDisplay = this.oversDisplay;
            b.runsConceded = this.runsConceded;
            b.wickets = this.wickets;
            b.maidens = this.maidens;
            b.wides = this.wides;
            b.noBalls = this.noBalls;
            return b;
        }
    }
}
