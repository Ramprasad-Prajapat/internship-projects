package com.gamepulse.controller;

import com.gamepulse.dto.LoginRequest;
import com.gamepulse.dto.RegisterRequest;
import com.gamepulse.entity.User;
import com.gamepulse.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User created = authService.register(request);
        // Do not return password hash
        created.setPasswordHash(null);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticateUser(request);
        String token = authService.generateToken(user);
        return ResponseEntity.ok(new JwtResponse(token, token, user.getEmail(), user.getRole() != null ? user.getRole().name() : "USER", user.getId(), user.getName()));
    }

    // DTO for JWT response
    private static class JwtResponse {
        private final String token;
        private final String jwt;
        private final String email;
        private final String role;
        private final Long id;
        private final String fullName;

        public JwtResponse(String token, String jwt, String email, String role, Long id, String fullName) {
            this.token = token;
            this.jwt = jwt;
            this.email = email;
            this.role = role;
            this.id = id;
            this.fullName = fullName;
        }

        public String getToken() { return token; }
        public String getJwt() { return jwt; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
    }
}
