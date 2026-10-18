package com.category.category_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import com.category.category_service.Component.CustomeAccessDeniedHandler;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomeAccessDeniedHandler customeAccessDeniedHandler;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                        CustomeAccessDeniedHandler customeAccessDeniedHandler) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.customeAccessDeniedHandler = customeAccessDeniedHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // Allow preflight requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // Allow error dispatch
                                                .requestMatchers("/error").permitAll()

                                                // Allow public viewing of categories
                                                .requestMatchers(HttpMethod.GET, "/api/category/**", "/api/category")
                                                .permitAll()

                                                // Any other request must be authenticated
                                                .anyRequest().authenticated())

                                .exceptionHandling(
                                                exception -> exception.accessDeniedHandler(customeAccessDeniedHandler))

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

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
}
