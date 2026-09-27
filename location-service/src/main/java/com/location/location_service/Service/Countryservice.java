package com.location.location_service.Service;

import com.location.location_service.Dto.CountryRequestDto;
import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Repositry.Countryrepositry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Countryservice {

    private final Countryrepositry rep;

    public Countryservice(Countryrepositry rep) {
        this.rep = rep;
    }

    public Countryentity addCountry(CountryRequestDto dto) {
        if (rep.existsByCode(dto.getCode())) {
            throw new RuntimeException("Country with code '" + dto.getCode() + "' already exists");
        }
        if (rep.existsByName(dto.getName())) {
            throw new RuntimeException("Country with name '" + dto.getName() + "' already exists");
        }

        Countryentity country = new Countryentity();
        country.setName(dto.getName());
        country.setCode(dto.getCode().toUpperCase());
        country.setActive(dto.getActive() != null ? dto.getActive() : true);
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

    public Countryentity updateCountry(Long id, CountryRequestDto dto) {
        Countryentity country = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            if (rep.existsByNameAndIdNot(dto.getName(), id)) {
                throw new RuntimeException("Country with name '" + dto.getName() + "' already exists");
            }
            country.setName(dto.getName());
        }

        if (dto.getCode() != null && !dto.getCode().trim().isEmpty()) {
            if (rep.existsByCodeAndIdNot(dto.getCode(), id)) {
                throw new RuntimeException("Country with code '" + dto.getCode() + "' already exists");
            }
            country.setCode(dto.getCode().toUpperCase());
        }

        if (dto.getActive() != null) {
            country.setActive(dto.getActive());
        }

        return rep.save(country);
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
