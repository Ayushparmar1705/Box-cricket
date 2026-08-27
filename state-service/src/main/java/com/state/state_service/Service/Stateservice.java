package com.state.state_service.Service;

import com.state.state_service.Dto.Countrydto;
import com.state.state_service.Model.Statemodel;
import com.state.state_service.Repositry.Staterepositry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class Stateservice {
    private final Staterepositry rep;
    private final RestTemplate restTemplate;
    private final String countryServiceUrl;

    public Stateservice(
            Staterepositry rep,
            RestTemplate restTemplate,
            @Value("${services.country-service.url}") String countryServiceUrl) {
        this.rep = rep;
        this.restTemplate = restTemplate;
        this.countryServiceUrl = countryServiceUrl;
    }

    public Statemodel Addstate(Statemodel obj, String token) {
        String url = countryServiceUrl + "/api/country/get-by-id/" + obj.getCountryId();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Countrydto> response = restTemplate.exchange(url, HttpMethod.GET, entity, Countrydto.class);
            if (response.getBody() == null) {
                throw new RuntimeException("Country not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Country not found");
        }
        return rep.save(obj);
    }

    public List<Statemodel> viewState() {
        return rep.findAll();
    }

    public Statemodel getStateById(Long id) {
        return rep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
    }

    public int changeStatus(Long id) {
        Statemodel result = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
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
