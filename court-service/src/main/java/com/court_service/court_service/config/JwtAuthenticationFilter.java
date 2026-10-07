package com.court_service.court_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private static final String SECRET_KEY = "my-super-secret-key-my-super-secret-key-123456";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String subject = claims.getSubject();
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();

            Object roleClaim = claims.get("role");
            if (roleClaim == null) {
                roleClaim = claims.get("roles");
            }

            if (roleClaim instanceof List<?> roleList) {
                for (Object roleObj : roleList) {
                    String r = roleObj.toString().toUpperCase();
                    if (!r.startsWith("ROLE_")) {
                        r = "ROLE_" + r;
                    }
                    authorities.add(new SimpleGrantedAuthority(r));
                }
            } else if (roleClaim instanceof String roleStr) {
                String r = roleStr.toUpperCase();
                if (!r.startsWith("ROLE_")) {
                    r = "ROLE_" + r;
                }
                authorities.add(new SimpleGrantedAuthority(r));
            }

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    subject,
                    null,
                    authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
