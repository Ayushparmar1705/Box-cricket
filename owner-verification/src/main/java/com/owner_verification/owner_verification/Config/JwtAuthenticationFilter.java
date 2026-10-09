package com.owner_verification.owner_verification.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecretKey key;

    public JwtAuthenticationFilter(
            @Value("${jwt.secret:my-super-secret-key-my-super-secret-key-123456}") String secret) {

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Object userIdClaim = claims.get("userid");
            if (userIdClaim == null) {
                userIdClaim = claims.get("userId");
            }
            String principal = (userIdClaim != null) ? userIdClaim.toString() : claims.getSubject();

            if (principal == null || principal.isBlank()) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid token subject");
                return;
            }

            List<SimpleGrantedAuthority> authorities = new ArrayList<>();

            Object roleClaim = claims.get("role");

            if (roleClaim == null) {
                roleClaim = claims.get("roles");
            }

            if (roleClaim instanceof List<?> roleList) {
                for (Object roleObj : roleList) {
                    if (roleObj == null) {
                        continue;
                    }

                    String role = roleObj.toString()
                            .toUpperCase();

                    if (!role.startsWith("ROLE_")) {
                        role = "ROLE_" + role;
                    }

                    authorities.add(
                            new SimpleGrantedAuthority(role));
                }

            } else if (roleClaim instanceof String roleStr) {
                String role = roleStr.toUpperCase();

                if (!role.startsWith("ROLE_")) {
                    role = "ROLE_" + role;
                }

                authorities.add(
                        new SimpleGrantedAuthority(role));
            }

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, authorities);

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } catch (io.jsonwebtoken.JwtException
                | IllegalArgumentException e) {

            SecurityContextHolder.clearContext();

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT");
            return;
        }

        filterChain.doFilter(request, response);
    }
}