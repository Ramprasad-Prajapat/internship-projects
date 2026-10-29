package com.gamepulse.controller;

import com.gamepulse.security.TestSecurityConfig;
import com.gamepulse.service.PerformanceMetricsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(HealthController.class)
public class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataSource dataSource;

    @MockBean
    private PerformanceMetricsService metricsService;

    private Connection connection;

    @BeforeEach
    public void setUp() throws Exception {
        connection = Mockito.mock(Connection.class);
    }

    @Test
    public void testHealthEndpoint_success() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.isValid(anyInt())).thenReturn(true);

        mockMvc.perform(get("/api/health")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("GamePulse Backend Engine"))
                .andExpect(jsonPath("$.database.status").value("CONNECTED"));
    }

    @Test
    public void testHealthEndpoint_downWhenDbFails() throws Exception {
        when(dataSource.getConnection()).thenThrow(new RuntimeException("DB Connection Refused"));

        mockMvc.perform(get("/api/health")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("DOWN"))
                .andExpect(jsonPath("$.database.status").value("DISCONNECTED"));
    }

    @Test
    public void testReadinessEndpoint_success() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.isValid(anyInt())).thenReturn(true);

        mockMvc.perform(get("/api/readiness")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY"));
    }

    @Test
    public void testReadinessEndpoint_unhealthy() throws Exception {
        when(dataSource.getConnection()).thenThrow(new RuntimeException("DB Down"));

        mockMvc.perform(get("/api/readiness")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("NOT_READY"));
    }

    @Test
    public void testMetricsEndpoint_success() throws Exception {
        when(metricsService.getMetricsSummary()).thenReturn(Map.of(
                "totalRequests", 15L,
                "averageLatencyMs", 12.5,
                "totalErrors", 0L
        ));

        mockMvc.perform(get("/api/metrics")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRequests").value(15))
                .andExpect(jsonPath("$.averageLatencyMs").value(12.5));
    }
}
