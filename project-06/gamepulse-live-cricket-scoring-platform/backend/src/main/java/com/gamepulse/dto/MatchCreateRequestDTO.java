package com.gamepulse.dto;

import java.time.Instant;

public class MatchCreateRequestDTO {
    private Long teamAId;
    private Long teamBId;
    private Long tournamentId;
    private String venue;
    private Instant matchDate;
    private String format;
    private Integer totalOvers;

    public MatchCreateRequestDTO() {}

    public Long getTeamAId() { return teamAId; }
    public void setTeamAId(Long teamAId) { this.teamAId = teamAId; }

    public Long getTeamBId() { return teamBId; }
    public void setTeamBId(Long teamBId) { this.teamBId = teamBId; }

    public Long getTournamentId() { return tournamentId; }
    public void setTournamentId(Long tournamentId) { this.tournamentId = tournamentId; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Instant getMatchDate() { return matchDate; }
    public void setMatchDate(Instant matchDate) { this.matchDate = matchDate; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public Integer getTotalOvers() { return totalOvers; }
    public void setTotalOvers(Integer totalOvers) { this.totalOvers = totalOvers; }

    public static MatchCreateRequestDTOBuilder builder() { return new MatchCreateRequestDTOBuilder(); }

    public static class MatchCreateRequestDTOBuilder {
        private Long teamAId;
        private Long teamBId;
        private Long tournamentId;
        private String venue;
        private Instant matchDate;
        private String format;
        private Integer totalOvers;

        public MatchCreateRequestDTOBuilder teamAId(Long teamAId) { this.teamAId = teamAId; return this; }
        public MatchCreateRequestDTOBuilder teamBId(Long teamBId) { this.teamBId = teamBId; return this; }
        public MatchCreateRequestDTOBuilder tournamentId(Long tournamentId) { this.tournamentId = tournamentId; return this; }
        public MatchCreateRequestDTOBuilder venue(String venue) { this.venue = venue; return this; }
        public MatchCreateRequestDTOBuilder matchDate(Instant matchDate) { this.matchDate = matchDate; return this; }
        public MatchCreateRequestDTOBuilder format(String format) { this.format = format; return this; }
        public MatchCreateRequestDTOBuilder totalOvers(Integer totalOvers) { this.totalOvers = totalOvers; return this; }

        public MatchCreateRequestDTO build() {
            MatchCreateRequestDTO m = new MatchCreateRequestDTO();
            m.teamAId = this.teamAId;
            m.teamBId = this.teamBId;
            m.tournamentId = this.tournamentId;
            m.venue = this.venue;
            m.matchDate = this.matchDate;
            m.format = this.format;
            m.totalOvers = this.totalOvers;
            return m;
        }
    }
}
