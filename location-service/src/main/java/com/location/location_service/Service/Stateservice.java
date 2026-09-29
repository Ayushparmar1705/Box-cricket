package com.location.location_service.Service;

import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Entity.Stateentity;
import com.location.location_service.Repositry.Countryrepositry;
import com.location.location_service.Repositry.Staterepositry;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Stateservice {

    private final Staterepositry stateRep;
    private final Countryrepositry countryRep;

    public Stateservice(Staterepositry stateRep, Countryrepositry countryRep) {
        this.stateRep = stateRep;
        this.countryRep = countryRep;
    }

    public Stateentity addState(Stateentity state) {
        Long countryId = (state.getCountry() != null) ? state.getCountry().getId() : null;
        if (countryId == null) {
            throw new RuntimeException("Country ID is required");
        }

        Countryentity country = countryRep.findById(countryId)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + countryId));

        if (stateRep.existsByNameAndCountryId(state.getName(), countryId)) {
            throw new RuntimeException(
                    "State with name '" + state.getName() + "' already exists in " + country.getName());
        }

        state.setCountry(country);
        return stateRep.save(state);
    }

    public List<Stateentity> viewState(Boolean isActive, Pageable pageable) {
        return stateRep.findByActive(isActive, pageable);
    }

    public List<Stateentity> getStatesByCountryId(Long countryId, Boolean isActive) {
        if (!countryRep.existsById(countryId)) {
            throw new RuntimeException("Country not found with id: " + countryId);
        }
        if (isActive != null) {
            return stateRep.findByCountryIdAndActive(countryId, isActive);
        }
        return stateRep.findByCountryId(countryId);
    }

    public Stateentity getStateById(Long id) {
        return stateRep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
    }

    public Stateentity updateState(Long id, Stateentity state) {
        Stateentity existing = stateRep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));

        if (state.getCountry() != null && state.getCountry().getId() != null) {
            Countryentity country = countryRep.findById(state.getCountry().getId())
                    .orElseThrow(() -> new RuntimeException("Country not found with id: " + state.getCountry().getId()));
            existing.setCountry(country);
        }

        if (state.getName() != null && !state.getName().trim().isEmpty()) {
            Long countryId = existing.getCountry().getId();
            if (stateRep.existsByNameAndCountryIdAndIdNot(state.getName(), countryId, id)) {
                throw new RuntimeException("State with name '" + state.getName() + "' already exists in this country");
            }
            existing.setName(state.getName());
        }

        existing.setActive(state.isActive());

        return stateRep.save(existing);
    }

    public int changeStatus(Long id) {
        Stateentity result = stateRep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
        if (result.isActive()) {
            result.setActive(false);
            stateRep.save(result);
            return 0;
        } else {
            result.setActive(true);
            stateRep.save(result);
            return 1;
        }
    }

    @Transactional
    public void deleteState(Long id) {
        if (!stateRep.existsById(id)) {
            throw new RuntimeException("State not found with id: " + id);
        }
        stateRep.deleteById(id);
    }
}
