package com.gamepulse.dto;

import com.gamepulse.entity.InningsStatus;
import com.gamepulse.entity.MatchStatus;

import java.util.List;

public class ScorecardResponseDTO {
    private Long matchId;
    private String teamAName;
    private String teamBName;
    private String venue;
    private MatchStatus status;
    private String resultSummary;
    private String winningTeamName;
    private Integer currentInningsNumber;
    private List<InningsDetailsDTO> inningsList;

    public ScorecardResponseDTO() {}

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public String getTeamAName() { return teamAName; }
    public void setTeamAName(String teamAName) { this.teamAName = teamAName; }

    public String getTeamBName() { return teamBName; }
    public void setTeamBName(String teamBName) { this.teamBName = teamBName; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public String getResultSummary() { return resultSummary; }
    public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }

    public String getWinningTeamName() { return winningTeamName; }
    public void setWinningTeamName(String winningTeamName) { this.winningTeamName = winningTeamName; }

    public Integer getCurrentInningsNumber() { return currentInningsNumber; }
    public void setCurrentInningsNumber(Integer currentInningsNumber) { this.currentInningsNumber = currentInningsNumber; }

    public List<InningsDetailsDTO> getInningsList() { return inningsList; }
    public void setInningsList(List<InningsDetailsDTO> inningsList) { this.inningsList = inningsList; }

    public static ScorecardResponseDTOBuilder builder() { return new ScorecardResponseDTOBuilder(); }

    public static class ScorecardResponseDTOBuilder {
        private Long matchId;
        private String teamAName;
        private String teamBName;
        private String venue;
        private MatchStatus status;
        private String resultSummary;
        private String winningTeamName;
        private Integer currentInningsNumber;
        private List<InningsDetailsDTO> inningsList;

        public ScorecardResponseDTOBuilder matchId(Long matchId) { this.matchId = matchId; return this; }
        public ScorecardResponseDTOBuilder teamAName(String teamAName) { this.teamAName = teamAName; return this; }
        public ScorecardResponseDTOBuilder teamBName(String teamBName) { this.teamBName = teamBName; return this; }
        public ScorecardResponseDTOBuilder venue(String venue) { this.venue = venue; return this; }
        public ScorecardResponseDTOBuilder status(MatchStatus status) { this.status = status; return this; }
        public ScorecardResponseDTOBuilder resultSummary(String resultSummary) { this.resultSummary = resultSummary; return this; }
        public ScorecardResponseDTOBuilder winningTeamName(String winningTeamName) { this.winningTeamName = winningTeamName; return this; }
        public ScorecardResponseDTOBuilder currentInningsNumber(Integer currentInningsNumber) { this.currentInningsNumber = currentInningsNumber; return this; }
        public ScorecardResponseDTOBuilder inningsList(List<InningsDetailsDTO> inningsList) { this.inningsList = inningsList; return this; }

        public ScorecardResponseDTO build() {
            ScorecardResponseDTO dto = new ScorecardResponseDTO();
            dto.matchId = this.matchId;
            dto.teamAName = this.teamAName;
            dto.teamBName = this.teamBName;
            dto.venue = this.venue;
            dto.status = this.status;
            dto.resultSummary = this.resultSummary;
            dto.winningTeamName = this.winningTeamName;
            dto.currentInningsNumber = this.currentInningsNumber;
            dto.inningsList = this.inningsList;
            return dto;
        }
    }

    public static class InningsDetailsDTO {
        private Long id;
        private Integer inningsNumber;
        private String battingTeamName;
        private String bowlingTeamName;
        private Integer totalRuns;
        private Integer totalWickets;
        private String totalOversDisplay;
        private Integer legalBallCount;
        private Integer targetRuns;
        private InningsStatus status;
        private PlayerDTO currentStriker;
        private PlayerDTO currentNonStriker;
        private PlayerDTO currentBowler;
        private ExtrasSummaryDTO extras;
        private List<BattingCardDTO> battingTable;
        private List<BowlingCardDTO> bowlingTable;
        private List<PartnershipDTO> partnerships;
        private List<FallOfWicketDTO> fallOfWickets;
        private List<DeliveryResponseDTO> recentDeliveries;

        public InningsDetailsDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Integer getInningsNumber() { return inningsNumber; }
        public void setInningsNumber(Integer inningsNumber) { this.inningsNumber = inningsNumber; }
        public String getBattingTeamName() { return battingTeamName; }
        public void setBattingTeamName(String battingTeamName) { this.battingTeamName = battingTeamName; }
        public String getBowlingTeamName() { return bowlingTeamName; }
        public void setBowlingTeamName(String bowlingTeamName) { this.bowlingTeamName = bowlingTeamName; }
        public Integer getTotalRuns() { return totalRuns; }
        public void setTotalRuns(Integer totalRuns) { this.totalRuns = totalRuns; }
        public Integer getTotalWickets() { return totalWickets; }
        public void setTotalWickets(Integer totalWickets) { this.totalWickets = totalWickets; }
        public String getTotalOversDisplay() { return totalOversDisplay; }
        public void setTotalOversDisplay(String totalOversDisplay) { this.totalOversDisplay = totalOversDisplay; }
        public Integer getLegalBallCount() { return legalBallCount; }
        public void setLegalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; }
        public Integer getTargetRuns() { return targetRuns; }
        public void setTargetRuns(Integer targetRuns) { this.targetRuns = targetRuns; }
        public InningsStatus getStatus() { return status; }
        public void setStatus(InningsStatus status) { this.status = status; }
        public PlayerDTO getCurrentStriker() { return currentStriker; }
        public void setCurrentStriker(PlayerDTO currentStriker) { this.currentStriker = currentStriker; }
        public PlayerDTO getCurrentNonStriker() { return currentNonStriker; }
        public void setCurrentNonStriker(PlayerDTO currentNonStriker) { this.currentNonStriker = currentNonStriker; }
        public PlayerDTO getCurrentBowler() { return currentBowler; }
        public void setCurrentBowler(PlayerDTO currentBowler) { this.currentBowler = currentBowler; }
        public ExtrasSummaryDTO getExtras() { return extras; }
        public void setExtras(ExtrasSummaryDTO extras) { this.extras = extras; }
        public List<BattingCardDTO> getBattingTable() { return battingTable; }
        public void setBattingTable(List<BattingCardDTO> battingTable) { this.battingTable = battingTable; }
        public List<BowlingCardDTO> getBowlingTable() { return bowlingTable; }
        public void setBowlingTable(List<BowlingCardDTO> bowlingTable) { this.bowlingTable = bowlingTable; }
        public List<PartnershipDTO> getPartnerships() { return partnerships; }
        public void setPartnerships(List<PartnershipDTO> partnerships) { this.partnerships = partnerships; }
        public List<FallOfWicketDTO> getFallOfWickets() { return fallOfWickets; }
        public void setFallOfWickets(List<FallOfWicketDTO> fallOfWickets) { this.fallOfWickets = fallOfWickets; }
        public List<DeliveryResponseDTO> getRecentDeliveries() { return recentDeliveries; }
        public void setRecentDeliveries(List<DeliveryResponseDTO> recentDeliveries) { this.recentDeliveries = recentDeliveries; }

        public static InningsDetailsDTOBuilder builder() { return new InningsDetailsDTOBuilder(); }

        public static class InningsDetailsDTOBuilder {
            private Long id;
            private Integer inningsNumber;
            private String battingTeamName;
            private String bowlingTeamName;
            private Integer totalRuns;
            private Integer totalWickets;
            private String totalOversDisplay;
            private Integer legalBallCount;
            private Integer targetRuns;
            private InningsStatus status;
            private PlayerDTO currentStriker;
            private PlayerDTO currentNonStriker;
            private PlayerDTO currentBowler;
            private ExtrasSummaryDTO extras;
            private List<BattingCardDTO> battingTable;
            private List<BowlingCardDTO> bowlingTable;
            private List<PartnershipDTO> partnerships;
            private List<FallOfWicketDTO> fallOfWickets;
            private List<DeliveryResponseDTO> recentDeliveries;

            public InningsDetailsDTOBuilder id(Long id) { this.id = id; return this; }
            public InningsDetailsDTOBuilder inningsNumber(Integer inningsNumber) { this.inningsNumber = inningsNumber; return this; }
            public InningsDetailsDTOBuilder battingTeamName(String battingTeamName) { this.battingTeamName = battingTeamName; return this; }
            public InningsDetailsDTOBuilder bowlingTeamName(String bowlingTeamName) { this.bowlingTeamName = bowlingTeamName; return this; }
            public InningsDetailsDTOBuilder totalRuns(Integer totalRuns) { this.totalRuns = totalRuns; return this; }
            public InningsDetailsDTOBuilder totalWickets(Integer totalWickets) { this.totalWickets = totalWickets; return this; }
            public InningsDetailsDTOBuilder totalOversDisplay(String totalOversDisplay) { this.totalOversDisplay = totalOversDisplay; return this; }
            public InningsDetailsDTOBuilder legalBallCount(Integer legalBallCount) { this.legalBallCount = legalBallCount; return this; }
            public InningsDetailsDTOBuilder targetRuns(Integer targetRuns) { this.targetRuns = targetRuns; return this; }
            public InningsDetailsDTOBuilder status(InningsStatus status) { this.status = status; return this; }
            public InningsDetailsDTOBuilder currentStriker(PlayerDTO currentStriker) { this.currentStriker = currentStriker; return this; }
            public InningsDetailsDTOBuilder currentNonStriker(PlayerDTO currentNonStriker) { this.currentNonStriker = currentNonStriker; return this; }
            public InningsDetailsDTOBuilder currentBowler(PlayerDTO currentBowler) { this.currentBowler = currentBowler; return this; }
            public InningsDetailsDTOBuilder extras(ExtrasSummaryDTO extras) { this.extras = extras; return this; }
            public InningsDetailsDTOBuilder battingTable(List<BattingCardDTO> battingTable) { this.battingTable = battingTable; return this; }
            public InningsDetailsDTOBuilder bowlingTable(List<BowlingCardDTO> bowlingTable) { this.bowlingTable = bowlingTable; return this; }
            public InningsDetailsDTOBuilder partnerships(List<PartnershipDTO> partnerships) { this.partnerships = partnerships; return this; }
            public InningsDetailsDTOBuilder fallOfWickets(List<FallOfWicketDTO> fallOfWickets) { this.fallOfWickets = fallOfWickets; return this; }
            public InningsDetailsDTOBuilder recentDeliveries(List<DeliveryResponseDTO> recentDeliveries) { this.recentDeliveries = recentDeliveries; return this; }

            public InningsDetailsDTO build() {
                InningsDetailsDTO d = new InningsDetailsDTO();
                d.id = this.id;
                d.inningsNumber = this.inningsNumber;
                d.battingTeamName = this.battingTeamName;
                d.bowlingTeamName = this.bowlingTeamName;
                d.totalRuns = this.totalRuns;
                d.totalWickets = this.totalWickets;
                d.totalOversDisplay = this.totalOversDisplay;
                d.legalBallCount = this.legalBallCount;
                d.targetRuns = this.targetRuns;
                d.status = this.status;
                d.currentStriker = this.currentStriker;
                d.currentNonStriker = this.currentNonStriker;
                d.currentBowler = this.currentBowler;
                d.extras = this.extras;
                d.battingTable = this.battingTable;
                d.bowlingTable = this.bowlingTable;
                d.partnerships = this.partnerships;
                d.fallOfWickets = this.fallOfWickets;
                d.recentDeliveries = this.recentDeliveries;
                return d;
            }
        }
    }

    public static class ExtrasSummaryDTO {
        private Integer byes;
        private Integer legByes;
        private Integer wides;
        private Integer noBalls;
        private Integer penalties;
        private Integer total;

        public ExtrasSummaryDTO() {}

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
        public Integer getTotal() { return total; }
        public void setTotal(Integer total) { this.total = total; }

        public static ExtrasSummaryDTOBuilder builder() { return new ExtrasSummaryDTOBuilder(); }

        public static class ExtrasSummaryDTOBuilder {
            private Integer byes;
            private Integer legByes;
            private Integer wides;
            private Integer noBalls;
            private Integer penalties;
            private Integer total;

            public ExtrasSummaryDTOBuilder byes(Integer byes) { this.byes = byes; return this; }
            public ExtrasSummaryDTOBuilder legByes(Integer legByes) { this.legByes = legByes; return this; }
            public ExtrasSummaryDTOBuilder wides(Integer wides) { this.wides = wides; return this; }
            public ExtrasSummaryDTOBuilder noBalls(Integer noBalls) { this.noBalls = noBalls; return this; }
            public ExtrasSummaryDTOBuilder penalties(Integer penalties) { this.penalties = penalties; return this; }
            public ExtrasSummaryDTOBuilder total(Integer total) { this.total = total; return this; }

            public ExtrasSummaryDTO build() {
                ExtrasSummaryDTO e = new ExtrasSummaryDTO();
                e.byes = this.byes;
                e.legByes = this.legByes;
                e.wides = this.wides;
                e.noBalls = this.noBalls;
                e.penalties = this.penalties;
                e.total = this.total;
                return e;
            }
        }
    }

    public static class BattingCardDTO {
        private Long playerId;
        private String playerName;
        private Integer runs;
        private Integer ballsFaced;
        private Integer fours;
        private Integer sixes;
        private Double strikeRate;
        private Boolean isOut;
        private String dismissalText;
        private Integer battingOrder;

        public BattingCardDTO() {}

        public Long getPlayerId() { return playerId; }
        public void setPlayerId(Long playerId) { this.playerId = playerId; }
        public String getPlayerName() { return playerName; }
        public void setPlayerName(String playerName) { this.playerName = playerName; }
        public Integer getRuns() { return runs; }
        public void setRuns(Integer runs) { this.runs = runs; }
        public Integer getBallsFaced() { return ballsFaced; }
        public void setBallsFaced(Integer ballsFaced) { this.ballsFaced = ballsFaced; }
        public Integer getFours() { return fours; }
        public void setFours(Integer fours) { this.fours = fours; }
        public Integer getSixes() { return sixes; }
        public void setSixes(Integer sixes) { this.sixes = sixes; }
        public Double getStrikeRate() { return strikeRate; }
        public void setStrikeRate(Double strikeRate) { this.strikeRate = strikeRate; }
        public Boolean getIsOut() { return isOut; }
        public void setIsOut(Boolean isOut) { this.isOut = isOut; }
        public String getDismissalText() { return dismissalText; }
        public void setDismissalText(String dismissalText) { this.dismissalText = dismissalText; }
        public Integer getBattingOrder() { return battingOrder; }
        public void setBattingOrder(Integer battingOrder) { this.battingOrder = battingOrder; }

        public static BattingCardDTOBuilder builder() { return new BattingCardDTOBuilder(); }

        public static class BattingCardDTOBuilder {
            private Long playerId;
            private String playerName;
            private Integer runs;
            private Integer ballsFaced;
            private Integer fours;
            private Integer sixes;
            private Double strikeRate;
            private Boolean isOut;
            private String dismissalText;
            private Integer battingOrder;

            public BattingCardDTOBuilder playerId(Long playerId) { this.playerId = playerId; return this; }
            public BattingCardDTOBuilder playerName(String playerName) { this.playerName = playerName; return this; }
            public BattingCardDTOBuilder runs(Integer runs) { this.runs = runs; return this; }
            public BattingCardDTOBuilder ballsFaced(Integer ballsFaced) { this.ballsFaced = ballsFaced; return this; }
            public BattingCardDTOBuilder fours(Integer fours) { this.fours = fours; return this; }
            public BattingCardDTOBuilder sixes(Integer sixes) { this.sixes = sixes; return this; }
            public BattingCardDTOBuilder strikeRate(Double strikeRate) { this.strikeRate = strikeRate; return this; }
            public BattingCardDTOBuilder isOut(Boolean isOut) { this.isOut = isOut; return this; }
            public BattingCardDTOBuilder dismissalText(String dismissalText) { this.dismissalText = dismissalText; return this; }
            public BattingCardDTOBuilder battingOrder(Integer battingOrder) { this.battingOrder = battingOrder; return this; }

            public BattingCardDTO build() {
                BattingCardDTO b = new BattingCardDTO();
                b.playerId = this.playerId;
                b.playerName = this.playerName;
                b.runs = this.runs;
                b.ballsFaced = this.ballsFaced;
                b.fours = this.fours;
                b.sixes = this.sixes;
                b.strikeRate = this.strikeRate;
                b.isOut = this.isOut;
                b.dismissalText = this.dismissalText;
                b.battingOrder = this.battingOrder;
                return b;
            }
        }
    }

    public static class BowlingCardDTO {
        private Long playerId;
        private String playerName;
        private String oversDisplay;
        private Integer legalBallsCount;
        private Integer maidens;
        private Integer runsConceded;
        private Integer wickets;
        private Double economy;
        private Integer wides;
        private Integer noBalls;

        public BowlingCardDTO() {}

        public Long getPlayerId() { return playerId; }
        public void setPlayerId(Long playerId) { this.playerId = playerId; }
        public String getPlayerName() { return playerName; }
        public void setPlayerName(String playerName) { this.playerName = playerName; }
        public String getOversDisplay() { return oversDisplay; }
        public void setOversDisplay(String oversDisplay) { this.oversDisplay = oversDisplay; }
        public Integer getLegalBallsCount() { return legalBallsCount; }
        public void setLegalBallsCount(Integer legalBallsCount) { this.legalBallsCount = legalBallsCount; }
        public Integer getMaidens() { return maidens; }
        public void setMaidens(Integer maidens) { this.maidens = maidens; }
        public Integer getRunsConceded() { return runsConceded; }
        public void setRunsConceded(Integer runsConceded) { this.runsConceded = runsConceded; }
        public Integer getWickets() { return wickets; }
        public void setWickets(Integer wickets) { this.wickets = wickets; }
        public Double getEconomy() { return economy; }
        public void setEconomy(Double economy) { this.economy = economy; }
        public Integer getWides() { return wides; }
        public void setWides(Integer wides) { this.wides = wides; }
        public Integer getNoBalls() { return noBalls; }
        public void setNoBalls(Integer noBalls) { this.noBalls = noBalls; }

        public static BowlingCardDTOBuilder builder() { return new BowlingCardDTOBuilder(); }

        public static class BowlingCardDTOBuilder {
            private Long playerId;
            private String playerName;
            private String oversDisplay;
            private Integer legalBallsCount;
            private Integer maidens;
            private Integer runsConceded;
            private Integer wickets;
            private Double economy;
            private Integer wides;
            private Integer noBalls;

            public BowlingCardDTOBuilder playerId(Long playerId) { this.playerId = playerId; return this; }
            public BowlingCardDTOBuilder playerName(String playerName) { this.playerName = playerName; return this; }
            public BowlingCardDTOBuilder oversDisplay(String oversDisplay) { this.oversDisplay = oversDisplay; return this; }
            public BowlingCardDTOBuilder legalBallsCount(Integer legalBallsCount) { this.legalBallsCount = legalBallsCount; return this; }
            public BowlingCardDTOBuilder maidens(Integer maidens) { this.maidens = maidens; return this; }
            public BowlingCardDTOBuilder runsConceded(Integer runsConceded) { this.runsConceded = runsConceded; return this; }
            public BowlingCardDTOBuilder wickets(Integer wickets) { this.wickets = wickets; return this; }
            public BowlingCardDTOBuilder economy(Double economy) { this.economy = economy; return this; }
            public BowlingCardDTOBuilder wides(Integer wides) { this.wides = wides; return this; }
            public BowlingCardDTOBuilder noBalls(Integer noBalls) { this.noBalls = noBalls; return this; }

            public BowlingCardDTO build() {
                BowlingCardDTO b = new BowlingCardDTO();
                b.playerId = this.playerId;
                b.playerName = this.playerName;
                b.oversDisplay = this.oversDisplay;
                b.legalBallsCount = this.legalBallsCount;
                b.maidens = this.maidens;
                b.runsConceded = this.runsConceded;
                b.wickets = this.wickets;
                b.economy = this.economy;
                b.wides = this.wides;
                b.noBalls = this.noBalls;
                return b;
            }
        }
    }

    public static class PartnershipDTO {
        private Long id;
        private String batter1Name;
        private String batter2Name;
        private Integer runs;
        private Integer balls;
        private Boolean isCurrent;
        private Integer wicketNumber;

        public PartnershipDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getBatter1Name() { return batter1Name; }
        public void setBatter1Name(String batter1Name) { this.batter1Name = batter1Name; }
        public String getBatter2Name() { return batter2Name; }
        public void setBatter2Name(String batter2Name) { this.batter2Name = batter2Name; }
        public Integer getRuns() { return runs; }
        public void setRuns(Integer runs) { this.runs = runs; }
        public Integer getBalls() { return balls; }
        public void setBalls(Integer balls) { this.balls = balls; }
        public Boolean getIsCurrent() { return isCurrent; }
        public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }
        public Integer getWicketNumber() { return wicketNumber; }
        public void setWicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; }

        public static PartnershipDTOBuilder builder() { return new PartnershipDTOBuilder(); }

        public static class PartnershipDTOBuilder {
            private Long id;
            private String batter1Name;
            private String batter2Name;
            private Integer runs;
            private Integer balls;
            private Boolean isCurrent;
            private Integer wicketNumber;

            public PartnershipDTOBuilder id(Long id) { this.id = id; return this; }
            public PartnershipDTOBuilder batter1Name(String batter1Name) { this.batter1Name = batter1Name; return this; }
            public PartnershipDTOBuilder batter2Name(String batter2Name) { this.batter2Name = batter2Name; return this; }
            public PartnershipDTOBuilder runs(Integer runs) { this.runs = runs; return this; }
            public PartnershipDTOBuilder balls(Integer balls) { this.balls = balls; return this; }
            public PartnershipDTOBuilder isCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; return this; }
            public PartnershipDTOBuilder wicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; return this; }

            public PartnershipDTO build() {
                PartnershipDTO p = new PartnershipDTO();
                p.id = this.id;
                p.batter1Name = this.batter1Name;
                p.batter2Name = this.batter2Name;
                p.runs = this.runs;
                p.balls = this.balls;
                p.isCurrent = this.isCurrent;
                p.wicketNumber = this.wicketNumber;
                return p;
            }
        }
    }

    public static class FallOfWicketDTO {
        private Integer wicketNumber;
        private Integer runsAtDismissal;
        private String oversAtDismissal;
        private String dismissedPlayerName;

        public FallOfWicketDTO() {}

        public Integer getWicketNumber() { return wicketNumber; }
        public void setWicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; }
        public Integer getRunsAtDismissal() { return runsAtDismissal; }
        public void setRunsAtDismissal(Integer runsAtDismissal) { this.runsAtDismissal = runsAtDismissal; }
        public String getOversAtDismissal() { return oversAtDismissal; }
        public void setOversAtDismissal(String oversAtDismissal) { this.oversAtDismissal = oversAtDismissal; }
        public String getDismissedPlayerName() { return dismissedPlayerName; }
        public void setDismissedPlayerName(String dismissedPlayerName) { this.dismissedPlayerName = dismissedPlayerName; }

        public static FallOfWicketDTOBuilder builder() { return new FallOfWicketDTOBuilder(); }

        public static class FallOfWicketDTOBuilder {
            private Integer wicketNumber;
            private Integer runsAtDismissal;
            private String oversAtDismissal;
            private String dismissedPlayerName;

            public FallOfWicketDTOBuilder wicketNumber(Integer wicketNumber) { this.wicketNumber = wicketNumber; return this; }
            public FallOfWicketDTOBuilder runsAtDismissal(Integer runsAtDismissal) { this.runsAtDismissal = runsAtDismissal; return this; }
            public FallOfWicketDTOBuilder oversAtDismissal(String oversAtDismissal) { this.oversAtDismissal = oversAtDismissal; return this; }
            public FallOfWicketDTOBuilder dismissedPlayerName(String dismissedPlayerName) { this.dismissedPlayerName = dismissedPlayerName; return this; }

            public FallOfWicketDTO build() {
                FallOfWicketDTO f = new FallOfWicketDTO();
                f.wicketNumber = this.wicketNumber;
                f.runsAtDismissal = this.runsAtDismissal;
                f.oversAtDismissal = this.oversAtDismissal;
                f.dismissedPlayerName = this.dismissedPlayerName;
                return f;
            }
        }
    }
}
