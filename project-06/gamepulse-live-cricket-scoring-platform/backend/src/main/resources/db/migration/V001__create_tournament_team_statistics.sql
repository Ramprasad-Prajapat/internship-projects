CREATE TABLE IF NOT EXISTS tournaments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    format VARCHAR(50),
    status VARCHAR(50) DEFAULT 'UPCOMING',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(10),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tournament_team_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    lost INT DEFAULT 0,
    tied INT DEFAULT 0,
    no_result INT DEFAULT 0,
    points INT DEFAULT 0,
    runs_for INT DEFAULT 0,
    overs_for DOUBLE DEFAULT 0,
    runs_against INT DEFAULT 0,
    overs_against DOUBLE DEFAULT 0,
    nrr DOUBLE DEFAULT 0,
    CONSTRAINT uq_tournament_team UNIQUE (tournament_id, team_id),
    CONSTRAINT fk_tts_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_tts_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
