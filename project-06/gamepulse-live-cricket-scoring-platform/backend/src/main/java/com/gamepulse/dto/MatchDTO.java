package com.gamepulse.dto;

import com.gamepulse.entity.MatchStatus;
import java.time.Instant;

public class MatchDTO {
    private Long id;
    private String teamAName;
    private String teamBName;
    private String venue;
    private Instant matchDate;
    private String format;
    private MatchStatus status;

    public MatchDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTeamAName() { return teamAName; }
    public void setTeamAName(String teamAName) { this.teamAName = teamAName; }

    public String getTeamBName() { return teamBName; }
    public void setTeamBName(String teamBName) { this.teamBName = teamBName; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Instant getMatchDate() { return matchDate; }
    public void setMatchDate(Instant matchDate) { this.matchDate = matchDate; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
}
