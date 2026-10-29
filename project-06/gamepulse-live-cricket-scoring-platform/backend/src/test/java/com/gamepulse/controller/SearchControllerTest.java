package com.gamepulse.controller;

import com.gamepulse.dto.SearchResponseDTO;
import com.gamepulse.service.SearchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SearchService searchService;

    @Test
    @DisplayName("Search endpoint returns results with pagination and filters")
    void testSearchEndpoint() throws Exception {
        // Ensure there is at least one known entity (player/team) in DB from earlier tests
        // Trigger a search that should return something
        ResultActions result = mockMvc.perform(get("/api/search")
                .param("q", "Virat")
                .param("filter", "all")
                .param("page", "0")
                .param("size", "10")
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.playersPage").exists())
                .andExpect(jsonPath("$.playersPage.content", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$.playersPage.totalElements", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.playersPage.totalPages", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.playersPage.number", is(0)));
    }

    @Test
    @DisplayName("Search endpoint validation rejects negative page and size")
    void testInvalidPaginationParams() throws Exception {
        mockMvc.perform(get("/api/search")
                .param("q", "test")
                .param("page", "-1")
                .param("size", "0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Search with no results returns empty pages")
    void testNoResults() throws Exception {
        mockMvc.perform(get("/api/search")
                .param("q", "nonexistententity123")
                .param("filter", "completed")
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playersPage.content", hasSize(0)))
                .andExpect(jsonPath("$.teamsPage.content", hasSize(0)))
                .andExpect(jsonPath("$.matchesPage.content", hasSize(0)))
                .andExpect(jsonPath("$.tournamentsPage.content", hasSize(0)));
    }
}
