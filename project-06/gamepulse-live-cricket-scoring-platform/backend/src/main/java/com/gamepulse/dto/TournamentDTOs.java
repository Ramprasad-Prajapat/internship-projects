package com.gamepulse.dto;

import java.time.Instant;
import java.util.List;

public class TournamentDTOs {

    /**
     * DTO representing a group within a tournament.
     */
    public static class GroupDTO {
        private Long id;
        private String name;
        private List<Long> teamIds;
        private List<Long> fixtureIds;

        public GroupDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public List<Long> getTeamIds() { return teamIds; }
        public void setTeamIds(List<Long> teamIds) { this.teamIds = teamIds; }
        public List<Long> getFixtureIds() { return fixtureIds; }
        public void setFixtureIds(List<Long> fixtureIds) { this.fixtureIds = fixtureIds; }
    }

    /**
     * DTO for creating or updating a fixture.
     */
    public static class FixtureDTO {
        private Long id;
        private Long tournamentId;
        private Long homeTeamId;
        private Long awayTeamId;
        private Instant scheduledDate;
        private String venue;
        private Long groupId; // optional
        private String stage; // matches TournamentStage enum

        public FixtureDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getTournamentId() { return tournamentId; }
        public void setTournamentId(Long tournamentId) { this.tournamentId = tournamentId; }
        public Long getHomeTeamId() { return homeTeamId; }
        public void setHomeTeamId(Long homeTeamId) { this.homeTeamId = homeTeamId; }
        public Long getAwayTeamId() { return awayTeamId; }
        public void setAwayTeamId(Long awayTeamId) { this.awayTeamId = awayTeamId; }
        public Instant getScheduledDate() { return scheduledDate; }
        public void setScheduledDate(Instant scheduledDate) { this.scheduledDate = scheduledDate; }
        public String getVenue() { return venue; }
        public void setVenue(String venue) { this.venue = venue; }
        public Long getGroupId() { return groupId; }
        public void setGroupId(Long groupId) { this.groupId = groupId; }
        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }
    }
}
