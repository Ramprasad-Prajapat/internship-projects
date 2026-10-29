package com.gamepulse.dto;

import java.time.Instant;

public class TournamentCreateRequestDTO {
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String organizer;
    private String venue;
    private String format; // T20, ODI, etc.
    private Instant startDate;
    private Instant endDate;
    private Integer oversPerInnings;
    private Integer numberOfTeams;

    public TournamentCreateRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }
    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
    public Integer getOversPerInnings() { return oversPerInnings; }
    public void setOversPerInnings(Integer oversPerInnings) { this.oversPerInnings = oversPerInnings; }
    public Integer getNumberOfTeams() { return numberOfTeams; }
    public void setNumberOfTeams(Integer numberOfTeams) { this.numberOfTeams = numberOfTeams; }
}
