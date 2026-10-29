package com.gamepulse.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "gamepulse.points")
public class PointsConfig {
    private int winPoints = 2;
    private int tiePoints = 1;
    private int noResultPoints = 1;
    private int lossPoints = 0;

    public int getWinPoints() {
        return winPoints;
    }
    public void setWinPoints(int winPoints) {
        this.winPoints = winPoints;
    }
    public int getTiePoints() {
        return tiePoints;
    }
    public void setTiePoints(int tiePoints) {
        this.tiePoints = tiePoints;
    }
    public int getNoResultPoints() {
        return noResultPoints;
    }
    public void setNoResultPoints(int noResultPoints) {
        this.noResultPoints = noResultPoints;
    }
    public int getLossPoints() {
        return lossPoints;
    }
    public void setLossPoints(int lossPoints) {
        this.lossPoints = lossPoints;
    }
}
