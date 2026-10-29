package com.gamepulse.service;

import com.gamepulse.dto.LoginRequest;
import com.gamepulse.dto.RegisterRequest;
import com.gamepulse.entity.Role;
import com.gamepulse.entity.User;
import com.gamepulse.repository.UserRepository;
import com.gamepulse.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        Role userRole = Role.USER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                userRole = Role.valueOf(request.getRole().toUpperCase());
            } catch (Exception _e) {
                userRole = Role.USER;
            }
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    public User authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found after authentication"));
    }

    public String login(LoginRequest request) {
        User user = authenticateUser(request);
        return generateToken(user);
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole().name() : "USER");
    }
}
