package com.gamepulse.dto;

import java.time.Instant;
import java.util.List;

public class TournamentResponseDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String organizer;
    private String venue;
    private String format;
    private Instant startDate;
    private Instant endDate;
    private Integer oversPerInnings;
    private Integer numberOfTeams;
    private String status;
    private List<Long> teamIds;
    private List<Long> matchIds;

    public TournamentResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Long> getTeamIds() { return teamIds; }
    public void setTeamIds(List<Long> teamIds) { this.teamIds = teamIds; }

    public List<Long> getMatchIds() { return matchIds; }
    public void setMatchIds(List<Long> matchIds) { this.matchIds = matchIds; }

    public static TournamentResponseDTOBuilder builder() { return new TournamentResponseDTOBuilder(); }

    public static class TournamentResponseDTOBuilder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String logoUrl;
        private String organizer;
        private String venue;
        private String format;
        private Instant startDate;
        private Instant endDate;
        private Integer oversPerInnings;
        private Integer numberOfTeams;
        private String status;
        private List<Long> teamIds;
        private List<Long> matchIds;

        public TournamentResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public TournamentResponseDTOBuilder name(String name) { this.name = name; return this; }
        public TournamentResponseDTOBuilder slug(String slug) { this.slug = slug; return this; }
        public TournamentResponseDTOBuilder description(String description) { this.description = description; return this; }
        public TournamentResponseDTOBuilder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public TournamentResponseDTOBuilder organizer(String organizer) { this.organizer = organizer; return this; }
        public TournamentResponseDTOBuilder venue(String venue) { this.venue = venue; return this; }
        public TournamentResponseDTOBuilder format(String format) { this.format = format; return this; }
        public TournamentResponseDTOBuilder startDate(Instant startDate) { this.startDate = startDate; return this; }
        public TournamentResponseDTOBuilder endDate(Instant endDate) { this.endDate = endDate; return this; }
        public TournamentResponseDTOBuilder oversPerInnings(Integer oversPerInnings) { this.oversPerInnings = oversPerInnings; return this; }
        public TournamentResponseDTOBuilder numberOfTeams(Integer numberOfTeams) { this.numberOfTeams = numberOfTeams; return this; }
        public TournamentResponseDTOBuilder status(String status) { this.status = status; return this; }
        public TournamentResponseDTOBuilder teamIds(List<Long> teamIds) { this.teamIds = teamIds; return this; }
        public TournamentResponseDTOBuilder matchIds(List<Long> matchIds) { this.matchIds = matchIds; return this; }

        public TournamentResponseDTO build() {
            TournamentResponseDTO t = new TournamentResponseDTO();
            t.id = this.id;
            t.name = this.name;
            t.slug = this.slug;
            t.description = this.description;
            t.logoUrl = this.logoUrl;
            t.organizer = this.organizer;
            t.venue = this.venue;
            t.format = this.format;
            t.startDate = this.startDate;
            t.endDate = this.endDate;
            t.oversPerInnings = this.oversPerInnings;
            t.numberOfTeams = this.numberOfTeams;
            t.status = this.status;
            t.teamIds = this.teamIds;
            t.matchIds = this.matchIds;
            return t;
        }
    }
}
