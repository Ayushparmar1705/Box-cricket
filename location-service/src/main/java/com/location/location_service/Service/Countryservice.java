package com.location.location_service.Service;

import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Repositry.Countryrepositry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Countryservice {

    private final Countryrepositry rep;

    public Countryservice(Countryrepositry rep) {
        this.rep = rep;
    }

    public Countryentity addCountry(Countryentity country) {
        if (rep.existsByCode(country.getCode())) {
            throw new RuntimeException("Country with code '" + country.getCode() + "' already exists");
        }
        if (rep.existsByName(country.getName())) {
            throw new RuntimeException("Country with name '" + country.getName() + "' already exists");
        }

        if (country.getCode() != null) {
            country.setCode(country.getCode().toUpperCase());
        }
        return rep.save(country);
    }

    public List<Countryentity> viewCountry(Boolean isActive) {
        if (isActive != null) {
            return rep.findByActive(isActive);
        }
        return rep.findAll();
    }

    public Countryentity getCountryById(Long id) {
        return rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
    }

    public Countryentity updateCountry(Long id, Countryentity country) {
        Countryentity existing = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));

        if (country.getName() != null && !country.getName().trim().isEmpty()) {
            if (rep.existsByNameAndIdNot(country.getName(), id)) {
                throw new RuntimeException("Country with name '" + country.getName() + "' already exists");
            }
            existing.setName(country.getName());
        }

        if (country.getCode() != null && !country.getCode().trim().isEmpty()) {
            if (rep.existsByCodeAndIdNot(country.getCode(), id)) {
                throw new RuntimeException("Country with code '" + country.getCode() + "' already exists");
            }
            existing.setCode(country.getCode().toUpperCase());
        }

        existing.setActive(country.isActive());

        return rep.save(existing);
    }

    public int changeStatus(Long id) {
        Countryentity result = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
        boolean newStatus = !result.isActive();
        result.setActive(newStatus);
        rep.save(result);
        return newStatus ? 1 : 0;
    }
}
