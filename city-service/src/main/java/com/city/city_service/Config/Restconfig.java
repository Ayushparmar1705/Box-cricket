package com.city.city_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
class RestConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();

    }
}
