package com.gamepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "deliveries", indexes = {
    @Index(name = "idx_del_innings_seq", columnList = "innings_id, sequenceNumber"),
    @Index(name = "idx_del_client_event", columnList = "clientEventId", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private Integer overNumber;

    @Column(nullable = false)
    private Integer ballNumber;

    @Column(nullable = false)
    private Long sequenceNumber;

    @Column(unique = true)
    private String clientEventId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "striker_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player striker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "non_striker_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player nonStriker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bowler_id", nullable = false)
    @JsonIgnoreProperties("team")
    private Player bowler;

    @Builder.Default
    private Integer runsOffBat = 0;

    @Builder.Default
    private Integer extraRuns = 0;

    @Builder.Default
    private Integer totalRuns = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private ExtraType extraType = ExtraType.NONE;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isLegalDelivery = true;

    @Builder.Default
    private Boolean isWicket = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WicketType wicketType = WicketType.NONE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dismissed_player_id")
    @JsonIgnoreProperties("team")
    private Player dismissedPlayer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fielder_id")
    @JsonIgnoreProperties("team")
    private Player fielder;

    @Column(length = 1000)
    private String commentary;

    @CreationTimestamp
    private Instant timestamp;

    private String createdBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Innings getInnings() { return innings; }
    public void setInnings(Innings innings) { this.innings = innings; }

    public Integer getOverNumber() { return overNumber; }
    public void setOverNumber(Integer overNumber) { this.overNumber = overNumber; }

    public Integer getBallNumber() { return ballNumber; }
    public void setBallNumber(Integer ballNumber) { this.ballNumber = ballNumber; }

    public Long getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Long sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public String getClientEventId() { return clientEventId; }
    public void setClientEventId(String clientEventId) { this.clientEventId = clientEventId; }

    public Player getStriker() { return striker; }
    public void setStriker(Player striker) { this.striker = striker; }

    public Player getNonStriker() { return nonStriker; }
    public void setNonStriker(Player nonStriker) { this.nonStriker = nonStriker; }

    public Player getBowler() { return bowler; }
    public void setBowler(Player bowler) { this.bowler = bowler; }

    public Integer getRunsOffBat() { return runsOffBat; }
    public void setRunsOffBat(Integer runsOffBat) { this.runsOffBat = runsOffBat; }

    public Integer getExtraRuns() { return extraRuns; }
    public void setExtraRuns(Integer extraRuns) { this.extraRuns = extraRuns; }

    public Integer getTotalRuns() { return totalRuns; }
    public void setTotalRuns(Integer totalRuns) { this.totalRuns = totalRuns; }

    public ExtraType getExtraType() { return extraType; }
    public void setExtraType(ExtraType extraType) { this.extraType = extraType; }

    public Boolean getIsLegalDelivery() { return isLegalDelivery; }
    public void setIsLegalDelivery(Boolean isLegalDelivery) { this.isLegalDelivery = isLegalDelivery; }

    public Boolean getIsWicket() { return isWicket; }
    public void setIsWicket(Boolean isWicket) { this.isWicket = isWicket; }

    public WicketType getWicketType() { return wicketType; }
    public void setWicketType(WicketType wicketType) { this.wicketType = wicketType; }

    public Player getDismissedPlayer() { return dismissedPlayer; }
    public void setDismissedPlayer(Player dismissedPlayer) { this.dismissedPlayer = dismissedPlayer; }

    public Player getFielder() { return fielder; }
    public void setFielder(Player fielder) { this.fielder = fielder; }

    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public static DeliveryBuilder builder() {
        return new DeliveryBuilder();
    }

    public static class DeliveryBuilder {
        private Long id;
        private Innings innings;
        private Integer overNumber;
        private Integer ballNumber;
        private Long sequenceNumber;
        private String clientEventId;
        private Player striker;
        private Player nonStriker;
        private Player bowler;
        private Integer runsOffBat = 0;
        private Integer extraRuns = 0;
        private Integer totalRuns = 0;
        private ExtraType extraType = ExtraType.NONE;
        private Boolean isLegalDelivery = true;
        private Boolean isWicket = false;
        private WicketType wicketType = WicketType.NONE;
        private Player dismissedPlayer;
        private Player fielder;
        private String commentary;
        private Instant timestamp;
        private String createdBy;

        public DeliveryBuilder id(Long id) { this.id = id; return this; }
        public DeliveryBuilder innings(Innings innings) { this.innings = innings; return this; }
        public DeliveryBuilder overNumber(Integer overNumber) { this.overNumber = overNumber; return this; }
        public DeliveryBuilder ballNumber(Integer ballNumber) { this.ballNumber = ballNumber; return this; }
        public DeliveryBuilder sequenceNumber(Long sequenceNumber) { this.sequenceNumber = sequenceNumber; return this; }
        public DeliveryBuilder clientEventId(String clientEventId) { this.clientEventId = clientEventId; return this; }
        public DeliveryBuilder striker(Player striker) { this.striker = striker; return this; }
        public DeliveryBuilder nonStriker(Player nonStriker) { this.nonStriker = nonStriker; return this; }
        public DeliveryBuilder bowler(Player bowler) { this.bowler = bowler; return this; }
        public DeliveryBuilder runsOffBat(Integer runsOffBat) { this.runsOffBat = runsOffBat; return this; }
        public DeliveryBuilder extraRuns(Integer extraRuns) { this.extraRuns = extraRuns; return this; }
        public DeliveryBuilder totalRuns(Integer totalRuns) { this.totalRuns = totalRuns; return this; }
        public DeliveryBuilder extraType(ExtraType extraType) { this.extraType = extraType; return this; }
        public DeliveryBuilder isLegalDelivery(Boolean isLegalDelivery) { this.isLegalDelivery = isLegalDelivery; return this; }
        public DeliveryBuilder isWicket(Boolean isWicket) { this.isWicket = isWicket; return this; }
        public DeliveryBuilder wicketType(WicketType wicketType) { this.wicketType = wicketType; return this; }
        public DeliveryBuilder dismissedPlayer(Player dismissedPlayer) { this.dismissedPlayer = dismissedPlayer; return this; }
        public DeliveryBuilder fielder(Player fielder) { this.fielder = fielder; return this; }
        public DeliveryBuilder commentary(String commentary) { this.commentary = commentary; return this; }
        public DeliveryBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public DeliveryBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }

        public Delivery build() {
            Delivery d = new Delivery();
            d.id = this.id;
            d.innings = this.innings;
            d.overNumber = this.overNumber;
            d.ballNumber = this.ballNumber;
            d.sequenceNumber = this.sequenceNumber;
            d.clientEventId = this.clientEventId;
            d.striker = this.striker;
            d.nonStriker = this.nonStriker;
            d.bowler = this.bowler;
            d.runsOffBat = this.runsOffBat;
            d.extraRuns = this.extraRuns;
            d.totalRuns = this.totalRuns;
            d.extraType = this.extraType;
            d.isLegalDelivery = this.isLegalDelivery;
            d.isWicket = this.isWicket;
            d.wicketType = this.wicketType;
            d.dismissedPlayer = this.dismissedPlayer;
            d.fielder = this.fielder;
            d.commentary = this.commentary;
            d.timestamp = this.timestamp;
            d.createdBy = this.createdBy;
            return d;
        }
    }
}
