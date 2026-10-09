package com.owner_verification.owner_verification.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class UserServiceClient {

    private final RestClient restClient;

    public UserServiceClient(
            @Value("${AUTH_SERVICE_URL:${auth.service.url:http://auth-service:8080}}") String authServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(authServiceUrl).build();
    }

    /**
     * Call auth-service to add the OWNER role to the user (adds entry into
     * user_roles table)
     */
    public void addOwnerRole(int userId) {
        restClient.post()
                .uri("/api/users/{userId}/roles/add?role=OWNER", userId)
                .retrieve()
                .toBodilessEntity();
    }
}
