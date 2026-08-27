package com.city.city_service.Service;

import com.city.city_service.Dto.Statedto;
import com.city.city_service.Entity.Citymodel;
import com.city.city_service.Repositry.Staterepositry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class Cityservice {
    private final Staterepositry rep;
    private final RestTemplate restTemplate;
    private final String stateServiceUrl;

    public Cityservice(
            Staterepositry rep,
            RestTemplate restTemplate,
            @Value("${services.state-service.url}") String stateServiceUrl) {
        this.rep = rep;
        this.restTemplate = restTemplate;
        this.stateServiceUrl = stateServiceUrl;
    }

    public Citymodel Addcity(Citymodel obj, String token) {
        String url = stateServiceUrl + "/api/state/get-by-id/" + obj.getStateId();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Statedto> response = restTemplate.exchange(url, HttpMethod.GET, entity, Statedto.class);
            if (response.getBody() == null) {
                throw new RuntimeException("State not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("State not found");
        }
        return rep.save(obj);
    }

    public List<Citymodel> viewCity() {
        return rep.findAll();
    }

    public int changeStatus(Long id) {
        Citymodel result = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
        if (result.isActive()) {
            result.setActive(false);
            rep.save(result);
            return 0;
        } else {
            result.setActive(true);
            rep.save(result);
            return 1;
        }
    }
}