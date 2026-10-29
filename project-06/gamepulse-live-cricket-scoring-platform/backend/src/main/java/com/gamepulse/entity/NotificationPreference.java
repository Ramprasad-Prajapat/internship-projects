package com.gamepulse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private Boolean matchStartAlerts = true;
    private Boolean wicketAlerts = true;
    private Boolean milestoneAlerts = true;
    private Boolean matchCompletionAlerts = true;
    private Boolean tournamentAlerts = true;
    private Boolean pollAlerts = true;
    private Boolean systemAlerts = true;

    public NotificationPreference() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Boolean getMatchStartAlerts() { return matchStartAlerts; }
    public void setMatchStartAlerts(Boolean matchStartAlerts) { this.matchStartAlerts = matchStartAlerts; }

    public Boolean getWicketAlerts() { return wicketAlerts; }
    public void setWicketAlerts(Boolean wicketAlerts) { this.wicketAlerts = wicketAlerts; }

    public Boolean getMilestoneAlerts() { return milestoneAlerts; }
    public void setMilestoneAlerts(Boolean milestoneAlerts) { this.milestoneAlerts = milestoneAlerts; }

    public Boolean getMatchCompletionAlerts() { return matchCompletionAlerts; }
    public void setMatchCompletionAlerts(Boolean matchCompletionAlerts) { this.matchCompletionAlerts = matchCompletionAlerts; }

    public Boolean getTournamentAlerts() { return tournamentAlerts; }
    public void setTournamentAlerts(Boolean tournamentAlerts) { this.tournamentAlerts = tournamentAlerts; }

    public Boolean getPollAlerts() { return pollAlerts; }
    public void setPollAlerts(Boolean pollAlerts) { this.pollAlerts = pollAlerts; }

    public Boolean getSystemAlerts() { return systemAlerts; }
    public void setSystemAlerts(Boolean systemAlerts) { this.systemAlerts = systemAlerts; }
}
