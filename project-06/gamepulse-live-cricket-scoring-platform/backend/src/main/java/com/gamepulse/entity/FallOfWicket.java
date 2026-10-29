package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "fall_of_wickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FallOfWicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private Integer wicketNumber;

    @Column(nullable = false)
    private Integer runsAtDismissal;

    @Column(nullable = false)
    private String oversAtDismissal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dismissed_player_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player dismissedPlayer;

    @CreationTimestamp
    private Instant timestamp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Integer getWicketNumber() { return wicketNumber; }
    public void setWicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; }

    public Integer getRunsAtDismissal() { return runsAtDismissal; }
    public void setRunsAtDismissal(Integer runsAtDismissal) { this.runsAtDismissal = runsAtDismissal; }

    public String getOversAtDismissal() { return oversAtDismissal; }
    public void setOversAtDismissal(String oversAtDismissal) { this.oversAtDismissal = oversAtDismissal; }

    public Player getDismissedPlayer() { return dismissedPlayer; }
    public void setDismissedPlayer(Player dismissedPlayer) { this.dismissedPlayer = dismissedPlayer; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public static FallOfWicketBuilder builder() { return new FallOfWicketBuilder(); }

    public static class FallOfWicketBuilder {
        private Long id;
        private Innings innings;
        private Integer wicketNumber;
        private Integer runsAtDismissal;
        private String oversAtDismissal;
        private Player dismissedPlayer;
        private Instant timestamp;

        public FallOfWicketBuilder id(Long id) { this.id = id; return this; }
        public FallOfWicketBuilder innings(Innings innings) { this.innings = innings; return this; }
        public FallOfWicketBuilder wicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; return this; }
        public FallOfWicketBuilder runsAtDismissal(Integer runsAtDismissal) { this.runsAtDismissal = runsAtDismissal; return this; }
        public FallOfWicketBuilder oversAtDismissal(String oversAtDismissal) { this.oversAtDismissal = oversAtDismissal; return this; }
        public FallOfWicketBuilder dismissedPlayer(Player dismissedPlayer) { this.dismissedPlayer = dismissedPlayer; return this; }
        public FallOfWicketBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public FallOfWicket build() {
            FallOfWicket f = new FallOfWicket();
            f.id = this.id;
            f.innings = this.innings;
            f.wicketNumber = this.wicketNumber;
            f.runsAtDismissal = this.runsAtDismissal;
            f.oversAtDismissal = this.oversAtDismissal;
            f.dismissedPlayer = this.dismissedPlayer;
            f.timestamp = this.timestamp;
            return f;
        }
    }
}
