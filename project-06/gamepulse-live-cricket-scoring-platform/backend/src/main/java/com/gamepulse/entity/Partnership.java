package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partnerships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partnership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batter1_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player batter1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batter2_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player batter2;

    @Builder.Default
    private Integer runs = 0;

    @Builder.Default
    private Integer balls = 0;

    @Builder.Default
    private Boolean isCurrent = true;

    private Integer wicketNumber;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Player getBatter1() { return batter1; }
    public void setBatter1(Player batter1) { this.batter1 = batter1; }

    public Player getBatter2() { return batter2; }
    public void setBatter2(Player batter2) { this.batter2 = batter2; }

    public Integer getRuns() { return runs; }
    public void setRuns(Integer runs) { this.runs = runs; }

    public Integer getBalls() { return balls; }
    public void setBalls(Integer balls) { this.balls = balls; }

    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }

    public Integer getWicketNumber() { return wicketNumber; }
    public void setWicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; }

    public static PartnershipBuilder builder() { return new PartnershipBuilder(); }

    public static class PartnershipBuilder {
        private Long id;
        private Innings innings;
        private Player batter1;
        private Player batter2;
        private Integer runs = 0;
        private Integer balls = 0;
        private Boolean isCurrent = true;
        private Integer wicketNumber;

        public PartnershipBuilder id(Long id) { this.id = id; return this; }
        public PartnershipBuilder innings(Innings innings) { this.innings = innings; return this; }
        public PartnershipBuilder batter1(Player batter1) { this.batter1 = batter1; return this; }
        public PartnershipBuilder batter2(Player batter2) { this.batter2 = batter2; return this; }
        public PartnershipBuilder runs(Integer runs) { this.runs = runs; return this; }
        public PartnershipBuilder balls(Integer balls) { this.balls = balls; return this; }
        public PartnershipBuilder isCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; return this; }
        public PartnershipBuilder wicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; return this; }

        public Partnership build() {
            Partnership p = new Partnership();
            p.id = this.id;
            p.innings = this.innings;
            p.batter1 = this.batter1;
            p.batter2 = this.batter2;
            p.runs = this.runs;
            p.balls = this.balls;
            p.isCurrent = this.isCurrent;
            p.wicketNumber = this.wicketNumber;
            return p;
        }
    }
}
