package com.facility_service.facility_service.Config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Enterprise Security Configuration for Facility Service.
 *
 * Architecture Principles:
 * 1. Stateless Authentication: Uses JWT Bearer tokens; no HTTP session state is
 * stored.
 * 2. Separation of Concerns:
 * - SecurityConfig enforces coarse-grained transport & URL security (public vs
 * authenticated).
 * - Controllers enforce fine-grained role permissions
 * using @PreAuthorize("hasAnyRole(...)").
 * 3. Uniform Error Handling: Returns standard JSON contracts for 401
 * Unauthorized and 403 Forbidden.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Common infrastructure endpoints permitted without authentication.
     */
    private static final String[] PUBLIC_COMMON_ENDPOINTS = {
            "/error",
            "/actuator/health",
            "/actuator/info"
    };

    /**
     * Public GET endpoints for browsing venues, courts, and pricing rules.
     */
    private static final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/venues",
            "/api/venues/**",
            "/api/court/**",
            "/api/courts/**",
            "/api/pricing/**"
    };

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 1. Disable CSRF for stateless REST microservices
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Enable Cross-Origin Resource Sharing (CORS)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Stateless Session Management (never create HTTP sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Standard JSON Exception Handling for API clients (401 & 403)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(unauthorizedEntryPoint())
                        .accessDeniedHandler(forbiddenAccessDeniedHandler())
                )

                // 5. Coarse-grained URL Authorization
                // Role-based authorization (@hasAnyRole / @hasRole) is handled directly inside Controllers
                .authorizeHttpRequests(auth -> auth
                        // Always allow CORS pre-flight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Common infrastructure endpoints
                        .requestMatchers(PUBLIC_COMMON_ENDPOINTS).permitAll()

                        // Public browsing endpoints (GET only)
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()

                        // All mutating actions and other endpoints require authentication
                        .anyRequest().authenticated()
                )

                // 6. JWT Filter to validate Bearer token before standard username/password authentication
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    /**
     * CORS Configuration allowing cross-origin calls from frontend and external
     * clients.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Entry point for unauthenticated requests attempting to access protected
     * resources (HTTP 401).
     */
    private AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            String message = authException != null && authException.getMessage() != null
                    ? authException.getMessage().replace("\"", "\\\"")
                    : "Full authentication is required to access this resource";
            response.getWriter().write(String.format(
                    "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"%s\",\"path\":\"%s\"}",
                    message,
                    request.getRequestURI()));
        };
    }

    /**
     * Handler for authenticated requests that lack sufficient role permissions
     * (HTTP 403).
     */
    private AccessDeniedHandler forbiddenAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            String message = accessDeniedException != null && accessDeniedException.getMessage() != null
                    ? accessDeniedException.getMessage().replace("\"", "\\\"")
                    : "You do not have permission to access this resource";
            response.getWriter().write(String.format(
                    "{\"status\":403,\"error\":\"Forbidden\",\"message\":\"%s\",\"path\":\"%s\"}",
                    message,
                    request.getRequestURI()));
        };
    }
}
