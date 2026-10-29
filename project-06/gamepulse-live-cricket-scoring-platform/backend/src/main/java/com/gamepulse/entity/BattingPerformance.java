package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batting_performances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BattingPerformance {
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
    private Integer runs = 0;

    @Builder.Default
    private Integer ballsFaced = 0;

    @Builder.Default
    private Integer fours = 0;

    @Builder.Default
    private Integer sixes = 0;

    @Builder.Default
    private Boolean isOut = false;

    private String dismissalText;

    private Integer battingOrder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }

    public Integer getRuns() { return runs; }
    public void setRuns(Integer runs) { this.runs = runs; }

    public Integer getBallsFaced() { return ballsFaced; }
    public void setBallsFaced(Integer ballsFaced) { this.ballsFaced = ballsFaced; }

    public Integer getFours() { return fours; }
    public void setFours(Integer fours) { this.fours = fours; }

    public Integer getSixes() { return sixes; }
    public void setSixes(Integer sixes) { this.sixes = sixes; }

    public Boolean getIsOut() { return isOut; }
    public void setIsOut(Boolean isOut) { this.isOut = isOut; }

    public String getDismissalText() { return dismissalText; }
    public void setDismissalText(String dismissalText) { this.dismissalText = dismissalText; }

    public Integer getBattingOrder() { return battingOrder; }
    public void setBattingOrder(Integer battingOrder) { this.battingOrder = battingOrder; }

    public static BattingPerformanceBuilder builder() { return new BattingPerformanceBuilder(); }

    public static class BattingPerformanceBuilder {
        private Long id;
        private Innings innings;
        private Player player;
        private Integer runs = 0;
        private Integer ballsFaced = 0;
        private Integer fours = 0;
        private Integer sixes = 0;
        private Boolean isOut = false;
        private String dismissalText;
        private Integer battingOrder;

        public BattingPerformanceBuilder id(Long id) { this.id = id; return this; }
        public BattingPerformanceBuilder innings(Innings innings) { this.innings = innings; return this; }
        public BattingPerformanceBuilder player(Player player) { this.player = player; return this; }
        public BattingPerformanceBuilder runs(Integer runs) { this.runs = runs; return this; }
        public BattingPerformanceBuilder ballsFaced(Integer ballsFaced) { this.ballsFaced = ballsFaced; return this; }
        public BattingPerformanceBuilder fours(Integer fours) { this.fours = fours; return this; }
        public BattingPerformanceBuilder sixes(Integer sixes) { this.sixes = sixes; return this; }
        public BattingPerformanceBuilder isOut(Boolean isOut) { this.isOut = isOut; return this; }
        public BattingPerformanceBuilder dismissalText(String dismissalText) { this.dismissalText = dismissalText; return this; }
        public BattingPerformanceBuilder battingOrder(Integer battingOrder) { this.battingOrder = battingOrder; return this; }

        public BattingPerformance build() {
            BattingPerformance b = new BattingPerformance();
            b.id = this.id;
            b.innings = this.innings;
            b.player = this.player;
            b.runs = this.runs;
            b.ballsFaced = this.ballsFaced;
            b.fours = this.fours;
            b.sixes = this.sixes;
            b.isOut = this.isOut;
            b.dismissalText = this.dismissalText;
            b.battingOrder = this.battingOrder;
            return b;
        }
    }
}
