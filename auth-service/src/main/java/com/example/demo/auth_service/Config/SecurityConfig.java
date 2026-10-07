package com.example.demo.auth_service.Config;

import com.example.demo.auth_service.service.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

                http.csrf(csrf -> csrf.disable())

                                .cors(cors -> {
                                })

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // Public APIs - no token needed
                                                .requestMatchers(
                                                                "/error",
                                                                "/api/users/login",
                                                                "/api/users/login/**",
                                                                "/api/users/create",
                                                                "/api/users/create/**")
                                                .permitAll()

                                                // Allow GET user by ID without a token
                                                .requestMatchers(HttpMethod.GET, "/api/users/**")
                                                .permitAll()

                                                // Role APIs
                                                .requestMatchers("/api/roles/**")
                                                .permitAll()

                                                // Allow preflight requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**")
                                                .permitAll()



                                                // Any other API requires a valid JWT
                                                .anyRequest()
                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}