package com.gamepulse.dto;

import com.gamepulse.entity.ExtraType;
import com.gamepulse.entity.InningsStatus;
import com.gamepulse.entity.MatchStatus;
import com.gamepulse.entity.WicketType;

import java.time.Instant;

public class DeliveryResponseDTO {
    private Long id;
    private Long sequenceNumber;
    private Integer overNumber;
    private Integer ballNumber;
    private String strikerName;
    private String nonStrikerName;
    private String bowlerName;
    private Integer runsOffBat;
    private Integer extraRuns;
    private Integer totalRuns;
    private ExtraType extraType;
    private Boolean isLegalDelivery;
    private Boolean isWicket;
    private WicketType wicketType;
    private String dismissedPlayerName;
    private String fielderName;
    private String commentary;
    private Instant timestamp;
    private String inningsScoreDisplay; // e.g. "145/3 (18.2)"
    private Integer targetRuns;
    private InningsStatus inningsStatus;
    private MatchStatus matchStatus;

    public DeliveryResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Long sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public Integer getOverNumber() { return overNumber; }
    public void setOverNumber(Integer overNumber) { this.overNumber = overNumber; }

    public Integer getBallNumber() { return ballNumber; }
    public void setBallNumber(Integer ballNumber) { this.ballNumber = ballNumber; }

    public String getStrikerName() { return strikerName; }
    public void setStrikerName(String strikerName) { this.strikerName = strikerName; }

    public String getNonStrikerName() { return nonStrikerName; }
    public void setNonStrikerName(String nonStrikerName) { this.nonStrikerName = nonStrikerName; }

    public String getBowlerName() { return bowlerName; }
    public void setBowlerName(String bowlerName) { this.bowlerName = bowlerName; }

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

    public String getDismissedPlayerName() { return dismissedPlayerName; }
    public void setDismissedPlayerName(String dismissedPlayerName) { this.dismissedPlayerName = dismissedPlayerName; }

    public String getFielderName() { return fielderName; }
    public void setFielderName(String fielderName) { this.fielderName = fielderName; }

    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getInningsScoreDisplay() { return inningsScoreDisplay; }
    public void setInningsScoreDisplay(String inningsScoreDisplay) { this.inningsScoreDisplay = inningsScoreDisplay; }

    public Integer getTargetRuns() { return targetRuns; }
    public void setTargetRuns(Integer targetRuns) { this.targetRuns = targetRuns; }

    public InningsStatus getInningsStatus() { return inningsStatus; }
    public void setInningsStatus(InningsStatus inningsStatus) { this.inningsStatus = inningsStatus; }

    public MatchStatus getMatchStatus() { return matchStatus; }
    public void setMatchStatus(MatchStatus matchStatus) { this.matchStatus = matchStatus; }

    public static DeliveryResponseDTOBuilder builder() { return new DeliveryResponseDTOBuilder(); }

    public static class DeliveryResponseDTOBuilder {
        private Long id;
        private Long sequenceNumber;
        private Integer overNumber;
        private Integer ballNumber;
        private String strikerName;
        private String nonStrikerName;
        private String bowlerName;
        private Integer runsOffBat;
        private Integer extraRuns;
        private Integer totalRuns;
        private ExtraType extraType;
        private Boolean isLegalDelivery;
        private Boolean isWicket;
        private WicketType wicketType;
        private String dismissedPlayerName;
        private String fielderName;
        private String commentary;
        private Instant timestamp;
        private String inningsScoreDisplay;
        private Integer targetRuns;
        private InningsStatus inningsStatus;
        private MatchStatus matchStatus;

        public DeliveryResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public DeliveryResponseDTOBuilder sequenceNumber(Long sequenceNumber) { this.sequenceNumber = sequenceNumber; return this; }
        public DeliveryResponseDTOBuilder overNumber(Integer overNumber) { this.overNumber = overNumber; return this; }
        public DeliveryResponseDTOBuilder ballNumber(Integer ballNumber) { this.ballNumber = ballNumber; return this; }
        public DeliveryResponseDTOBuilder strikerName(String strikerName) { this.strikerName = strikerName; return this; }
        public DeliveryResponseDTOBuilder nonStrikerName(String nonStrikerName) { this.nonStrikerName = nonStrikerName; return this; }
        public DeliveryResponseDTOBuilder bowlerName(String bowlerName) { this.bowlerName = bowlerName; return this; }
        public DeliveryResponseDTOBuilder runsOffBat(Integer runsOffBat) { this.runsOffBat = runsOffBat; return this; }
        public DeliveryResponseDTOBuilder extraRuns(Integer extraRuns) { this.extraRuns = extraRuns; return this; }
        public DeliveryResponseDTOBuilder totalRuns(Integer totalRuns) { this.totalRuns = totalRuns; return this; }
        public DeliveryResponseDTOBuilder extraType(ExtraType extraType) { this.extraType = extraType; return this; }
        public DeliveryResponseDTOBuilder isLegalDelivery(Boolean isLegalDelivery) { this.isLegalDelivery = isLegalDelivery; return this; }
        public DeliveryResponseDTOBuilder isWicket(Boolean isWicket) { this.isWicket = isWicket; return this; }
        public DeliveryResponseDTOBuilder wicketType(WicketType wicketType) { this.wicketType = wicketType; return this; }
        public DeliveryResponseDTOBuilder dismissedPlayerName(String dismissedPlayerName) { this.dismissedPlayerName = dismissedPlayerName; return this; }
        public DeliveryResponseDTOBuilder fielderName(String fielderName) { this.fielderName = fielderName; return this; }
        public DeliveryResponseDTOBuilder commentary(String commentary) { this.commentary = commentary; return this; }
        public DeliveryResponseDTOBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public DeliveryResponseDTOBuilder inningsScoreDisplay(String inningsScoreDisplay) { this.inningsScoreDisplay = inningsScoreDisplay; return this; }
        public DeliveryResponseDTOBuilder targetRuns(Integer targetRuns) { this.targetRuns = targetRuns; return this; }
        public DeliveryResponseDTOBuilder inningsStatus(InningsStatus inningsStatus) { this.inningsStatus = inningsStatus; return this; }
        public DeliveryResponseDTOBuilder matchStatus(MatchStatus matchStatus) { this.matchStatus = matchStatus; return this; }

        public DeliveryResponseDTO build() {
            DeliveryResponseDTO d = new DeliveryResponseDTO();
            d.id = this.id;
            d.sequenceNumber = this.sequenceNumber;
            d.overNumber = this.overNumber;
            d.ballNumber = this.ballNumber;
            d.strikerName = this.strikerName;
            d.nonStrikerName = this.nonStrikerName;
            d.bowlerName = this.bowlerName;
            d.runsOffBat = this.runsOffBat;
            d.extraRuns = this.extraRuns;
            d.totalRuns = this.totalRuns;
            d.extraType = this.extraType;
            d.isLegalDelivery = this.isLegalDelivery;
            d.isWicket = this.isWicket;
            d.wicketType = this.wicketType;
            d.dismissedPlayerName = this.dismissedPlayerName;
            d.fielderName = this.fielderName;
            d.commentary = this.commentary;
            d.timestamp = this.timestamp;
            d.inningsScoreDisplay = this.inningsScoreDisplay;
            d.targetRuns = this.targetRuns;
            d.inningsStatus = this.inningsStatus;
            d.matchStatus = this.matchStatus;
            return d;
        }
    }
}
