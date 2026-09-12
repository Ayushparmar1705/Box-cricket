package com.venue_service.venue_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // 1. Allow preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Allow Spring error dispatch
                        .requestMatchers("/error").permitAll()

                        // 3. Amenities endpoints
                        .requestMatchers("/api/venue-amenities/**", "/api/amenities/**")
                        .hasAnyRole("SUPER_ADMIN", "OWNER", "ADMIN")

                        // 4. Venue endpoints
                        .requestMatchers(HttpMethod.GET, "/api/venue/**", "/api/venues/**").permitAll()
                        .requestMatchers("/api/venue/**", "/api/venues/**").hasAnyRole("SUPER_ADMIN", "OWNER", "ADMIN")

                        // 5. All other endpoints require authentication
                        .anyRequest().authenticated())

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
