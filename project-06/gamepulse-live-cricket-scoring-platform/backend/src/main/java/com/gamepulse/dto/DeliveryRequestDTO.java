package com.gamepulse.dto;

import com.gamepulse.entity.ExtraType;
import com.gamepulse.entity.WicketType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRequestDTO {
    private String clientEventId;
    private Long strikerId;
    private Long nonStrikerId;
    private Long bowlerId;
    private Integer runsOffBat;
    private Integer extraRuns;
    private ExtraType extraType;
    private Boolean isWicket;
    private WicketType wicketType;
    private Long dismissedPlayerId;
    private Long fielderId;
    private Long newBatterId;
    private Long newBowlerId;
    private String commentary;

    // Explicit getters (in case Lombok is not processed)
    public String getClientEventId() { return clientEventId; }
    public Long getStrikerId() { return strikerId; }
    public Long getNonStrikerId() { return nonStrikerId; }
    public Long getBowlerId() { return bowlerId; }
    public Integer getRunsOffBat() { return runsOffBat; }
    public Integer getExtraRuns() { return extraRuns; }
    public ExtraType getExtraType() { return extraType; }
    public Boolean getIsWicket() { return isWicket; }
    public WicketType getWicketType() { return wicketType; }
    public Long getDismissedPlayerId() { return dismissedPlayerId; }
    public Long getFielderId() { return fielderId; }
    public Long getNewBatterId() { return newBatterId; }
    public Long getNewBowlerId() { return newBowlerId; }
    public String getCommentary() { return commentary; }

}
