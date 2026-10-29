package com.gamepulse.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class PerformanceMetricsService {

    private final long startTimeMillis = System.currentTimeMillis();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    private final AtomicLong total4xxErrors = new AtomicLong(0);
    private final AtomicLong total5xxErrors = new AtomicLong(0);
    private final AtomicLong totalDurationMs = new AtomicLong(0);

    private final ConcurrentHashMap<String, EndpointMetric> endpointMetrics = new ConcurrentHashMap<>();

    public void recordRequest(String method, String uri, int statusCode, long durationMs) {
        totalRequests.incrementAndGet();
        totalDurationMs.addAndGet(durationMs);

        if (statusCode >= 400 && statusCode < 500) {
            totalErrors.incrementAndGet();
            total4xxErrors.incrementAndGet();
        } else if (statusCode >= 500) {
            totalErrors.incrementAndGet();
            total5xxErrors.incrementAndGet();
        }

        String key = method + " " + sanitizeUri(uri);
        endpointMetrics.compute(key, (k, existing) -> {
            if (existing == null) {
                existing = new EndpointMetric();
            }
            existing.record(durationMs, statusCode);
            return existing;
        });
    }

    public Map<String, Object> getMetricsSummary() {
        Map<String, Object> metrics = new LinkedHashMap<>();
        long requests = totalRequests.get();
        long duration = totalDurationMs.get();
        long errors = totalErrors.get();
        long uptimeSeconds = (System.currentTimeMillis() - startTimeMillis) / 1000;

        metrics.put("uptimeSeconds", uptimeSeconds);
        metrics.put("totalRequests", requests);
        metrics.put("totalErrors", errors);
        metrics.put("total4xxErrors", total4xxErrors.get());
        metrics.put("total5xxErrors", total5xxErrors.get());
        metrics.put("averageLatencyMs", requests > 0 ? Math.round((double) duration / requests * 100.0) / 100.0 : 0.0);

        List<Map<String, Object>> topEndpoints = new ArrayList<>();
        endpointMetrics.forEach((endpoint, metric) -> {
            Map<String, Object> epMap = new LinkedHashMap<>();
            epMap.put("endpoint", endpoint);
            epMap.put("count", metric.getCount());
            epMap.put("averageLatencyMs", metric.getAverageLatency());
            epMap.put("maxLatencyMs", metric.getMaxLatency());
            epMap.put("errorCount", metric.getErrorCount());
            topEndpoints.add(epMap);
        });

        topEndpoints.sort((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")));
        metrics.put("endpoints", topEndpoints.stream().limit(20).toList());

        return metrics;
    }

    private String sanitizeUri(String uri) {
        if (uri == null) return "/";
        // Replace dynamic IDs e.g. /api/matches/123/analytics -> /api/matches/{id}/analytics
        return uri.replaceAll("/\\d+", "/{id}");
    }

    public static class EndpointMetric {
        private final AtomicLong count = new AtomicLong(0);
        private final AtomicLong totalDuration = new AtomicLong(0);
        private final AtomicLong maxDuration = new AtomicLong(0);
        private final AtomicLong errorCount = new AtomicLong(0);

        public void record(long durationMs, int statusCode) {
            count.incrementAndGet();
            totalDuration.addAndGet(durationMs);
            maxDuration.accumulateAndGet(durationMs, Math::max);
            if (statusCode >= 400) {
                errorCount.incrementAndGet();
            }
        }

        public long getCount() {
            return count.get();
        }

        public double getAverageLatency() {
            long c = count.get();
            return c > 0 ? Math.round((double) totalDuration.get() / c * 100.0) / 100.0 : 0.0;
        }

        public long getMaxLatency() {
            return maxDuration.get();
        }

        public long getErrorCount() {
            return errorCount.get();
        }
    }
}
