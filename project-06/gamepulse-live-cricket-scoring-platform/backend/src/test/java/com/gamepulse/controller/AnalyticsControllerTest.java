package com.gamepulse.controller;

import com.gamepulse.dto.MatchAnalyticsDTO;
import com.gamepulse.service.AnalyticsService;
import com.gamepulse.security.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(AnalyticsController.class)
public class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @Test
    public void testGetMatchAnalytics_success() throws Exception {
        Long matchId = 1L;
        MatchAnalyticsDTO dto = new MatchAnalyticsDTO();
        dto.setMatchId(matchId);
        Mockito.when(analyticsService.getMatchAnalytics(matchId)).thenReturn(dto);
        mockMvc.perform(get("/api/matches/{id}/analytics", matchId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.matchId").value(matchId));
    }
}
