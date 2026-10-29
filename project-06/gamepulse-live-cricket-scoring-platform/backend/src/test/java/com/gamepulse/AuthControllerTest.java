package com.gamepulse;

import com.gamepulse.dto.LoginRequest;
import com.gamepulse.dto.RegisterRequest;
import com.gamepulse.entity.User;
import com.gamepulse.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void testRegisterAndLogin() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setName("testuser");
        register.setEmail("test@example.com");
        register.setPassword("Password123!");

        // Register
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(register)))
                .andExpect(status().isOk());

        // Verify stored user password is hashed
        User saved = userRepository.findByEmail("test@example.com").orElseThrow();
        assertThat(saved.getPasswordHash()).isNotEqualTo("Password123!");

        // Login
        LoginRequest login = new LoginRequest();
        login.setEmail("test@example.com");
        login.setPassword("Password123!");

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Expect a JSON containing token field
        assertThat(response).contains("token");
    }
}
