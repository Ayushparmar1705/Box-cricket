package com.example.demo.auth_service.service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // Example:
        // Authorization: Bearer eyJhbGciOi...

        // 2. If token is not present, continue
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract token
        String token = authHeader.substring(7);

        try {
            // 4. Extract email and role from JWT
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            // Ensure role has ROLE_ prefix which Spring Security expects for hasRole()
            if (role != null && !role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }

            // 5. Create authenticated user with Authorities!
            List<SimpleGrantedAuthority> authorities = role != null 
                    ? Collections.singletonList(new SimpleGrantedAuthority(role)) 
                    : Collections.emptyList();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );

            // 6. Store authentication in Spring Security
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {

            // Invalid token
            SecurityContextHolder.clearContext();
        }

        // 7. Continue to next filter
        filterChain.doFilter(request, response);
    }
}