package com.gamepulse.dto;

import java.util.List;

public class PlayingXIDTO {
    private Long matchId;
    private Long teamId;
    private List<MemberDTO> players;
    private Boolean isLocked;

    public PlayingXIDTO() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public List<MemberDTO> getPlayers() { return players; }
    public void setPlayers(List<MemberDTO> players) { this.players = players; }

    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean isLocked) { this.isLocked = isLocked; }

    public static class MemberDTO {
        private Long playerId;
        private String playerName;
        private Boolean isCaptain;
        private Boolean isWicketKeeper;
        private Boolean isSubstitute;

        public MemberDTO() {}

        public Long getPlayerId() { return playerId; }
        public void setPlayerId(Long playerId) { this.playerId = playerId; }

        public String getPlayerName() { return playerName; }
        public void setPlayerName(String playerName) { this.playerName = playerName; }

        public Boolean getIsCaptain() { return isCaptain; }
        public void setIsCaptain(Boolean isCaptain) { this.isCaptain = isCaptain; }

        public Boolean getIsWicketKeeper() { return isWicketKeeper; }
        public void setIsWicketKeeper(Boolean isWicketKeeper) { this.isWicketKeeper = isWicketKeeper; }

        public Boolean getIsSubstitute() { return isSubstitute; }
        public void setIsSubstitute(Boolean isSubstitute) { this.isSubstitute = isSubstitute; }
    }
}
