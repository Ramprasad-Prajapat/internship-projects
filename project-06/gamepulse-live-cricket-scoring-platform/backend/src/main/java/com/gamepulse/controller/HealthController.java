package com.gamepulse.controller;

import com.gamepulse.service.PerformanceMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.sql.Connection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @Autowired(required = false)
    private PerformanceMetricsService metricsService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new LinkedHashMap<>();
        
        long startPing = System.currentTimeMillis();
        boolean dbOk = checkDatabase();
        long dbLatencyMs = System.currentTimeMillis() - startPing;

        boolean isHealthy = dbOk;
        status.put("status", isHealthy ? "UP" : "DOWN");
        status.put("service", "GamePulse Backend Engine");
        status.put("timestamp", System.currentTimeMillis());

        Map<String, Object> dbDetails = new LinkedHashMap<>();
        dbDetails.put("status", dbOk ? "CONNECTED" : "DISCONNECTED");
        dbDetails.put("pingLatencyMs", dbLatencyMs);
        status.put("database", dbDetails);

        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memory = new LinkedHashMap<>();
        memory.put("totalMemoryMB", runtime.totalMemory() / (1024 * 1024));
        memory.put("freeMemoryMB", runtime.freeMemory() / (1024 * 1024));
        memory.put("usedMemoryMB", (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024));
        memory.put("maxMemoryMB", runtime.maxMemory() / (1024 * 1024));
        status.put("jvmMemory", memory);

        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        Map<String, Object> threads = new LinkedHashMap<>();
        threads.put("threadCount", threadBean.getThreadCount());
        threads.put("peakThreadCount", threadBean.getPeakThreadCount());
        status.put("threads", threads);

        if (isHealthy) {
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
        }
    }

    @GetMapping("/readiness")
    public ResponseEntity<Map<String, String>> readiness() {
        boolean dbOk = checkDatabase();
        if (dbOk) {
            return ResponseEntity.ok(Map.of("status", "READY"));
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "NOT_READY", "reason", "Database unavailable"));
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> metrics() {
        if (metricsService != null) {
            return ResponseEntity.ok(metricsService.getMetricsSummary());
        }
        return ResponseEntity.ok(Map.of("message", "Metrics service unavailable"));
    }

    private boolean checkDatabase() {
        if (dataSource == null) return true;
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(2);
        } catch (Exception e) {
            return false;
        }
    }
}
