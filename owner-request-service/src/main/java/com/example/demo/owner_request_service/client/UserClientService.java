package com.example.demo.owner_request_service.client;

import com.example.demo.owner_request_service.dto.UserDto;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UserClientService {
    public Mono<UserDto> changeUserRole(Integer id, String role) {
        WebClient webClient = WebClient.builder()
                .baseUrl("http://localhost:8081").build();
        return webClient.put()
                .uri("/api/users/{id}/role", id)
                .bodyValue(Map.of("role", role))
                .retrieve()
                .bodyToMono(UserDto.class);
    }
}