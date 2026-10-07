package com.example.demo.auth_service.service;

import java.nio.charset.StandardCharsets;
import java.util.*;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

        private static final String SECRET_KEY = "my-super-secret-key-my-super-secret-key-123456";

        private SecretKey getSigningKey() {
                return Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        }

        // Generate JWT Token with Set of roles
        public String generateToken(String email, int userid, Set<String> role) {
                Map<String, Object> claims = new HashMap<>();
                claims.put("userid", userid);
                claims.put("email", email);
                claims.put("role", role);

                return Jwts.builder()
                                .claims(claims)
                                .subject(email) // email as subject
                                .issuedAt(new Date())
                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + 1000 * 60 * 60))
                                .signWith(getSigningKey())
                                .compact();
        }

        // Overload to support single String role
        public String generateToken(String email, int userid, String role) {
                return generateToken(email, userid, Collections.singleton(role));
        }

        // Extract email from token
        public String extractEmail(String token) {
                Claims claims = Jwts.parser()
                                .verifyWith(getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.getSubject();
        }

        // Extract roles from token (supports array of roles as well as single string)
        public List<String> extractRoles(String token) {
                Claims claims = Jwts.parser()
                                .verifyWith(getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                Object roleClaim = claims.get("role");
                if (roleClaim == null) {
                        roleClaim = claims.get("roles");
                }

                if (roleClaim instanceof List<?> roleList) {
                        List<String> result = new ArrayList<>();
                        for (Object o : roleList) {
                                result.add(o.toString());
                        }
                        return result;
                } else if (roleClaim instanceof String roleStr) {
                        return List.of(roleStr);
                }
                return Collections.emptyList();
        }

        public String extractRole(String token) {
                List<String> roles = extractRoles(token);
                return roles.isEmpty() ? null : roles.get(0);
        }
}