package com.gamepulse.filter;

import com.gamepulse.security.CustomUserDetails;
import com.gamepulse.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired(required = false)
    private JwtUtil jwtUtil;

    @Autowired(required = false)
    private com.gamepulse.service.CustomUserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Bypass JWT authentication for analytics endpoint which is public
        return path.matches("/api/matches/\\d+/analytics");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if (jwtUtil != null && authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                io.jsonwebtoken.Claims claims = jwtUtil.validateToken(token).getPayload();
                username = claims.getSubject();
                String role = claims.get("role", String.class);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
                    if (role != null && !role.isBlank()) {
                        String r = role.toUpperCase();
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + r));
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(r));
                    }

                    boolean authenticated = false;
                    if (userDetailsService != null) {
                        try {
                            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
                            if (userDetails != null) {
                                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());
                                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                SecurityContextHolder.getContext().setAuthentication(authToken);
                                authenticated = true;
                            }
                        } catch (Exception _ex) {
                            // User lookup failed, fallback to claims
                        }
                    }

                    if (!authenticated) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                username, null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                // Invalid token; proceed without authentication
            }
        }
        filterChain.doFilter(request, response);
    }
}
