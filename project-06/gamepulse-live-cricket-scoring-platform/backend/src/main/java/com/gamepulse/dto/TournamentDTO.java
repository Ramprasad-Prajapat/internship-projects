package com.gamepulse.dto;

import com.gamepulse.entity.TournamentStatus;
import java.time.Instant;

public class TournamentDTO {
    private Long id;
    private String name;
    private String slug;
    private String format;
    private TournamentStatus status;
    private Instant startDate;
    private Instant endDate;

    public TournamentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public TournamentStatus getStatus() { return status; }
    public void setStatus(TournamentStatus status) { this.status = status; }

    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }

    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
}
