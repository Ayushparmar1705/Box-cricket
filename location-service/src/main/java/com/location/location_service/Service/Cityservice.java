package com.location.location_service.Service;

import com.location.location_service.Entity.Cityentity;
import com.location.location_service.Entity.Stateentity;
import com.location.location_service.Repositry.Cityrepositry;
import com.location.location_service.Repositry.Staterepositry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Cityservice {

    private final Cityrepositry cityRep;
    private final Staterepositry stateRep;

    public Cityservice(Cityrepositry cityRep, Staterepositry stateRep) {
        this.cityRep = cityRep;
        this.stateRep = stateRep;
    }

    public Cityentity addCity(Cityentity city) {
        Long stateId = (city.getState() != null) ? city.getState().getId() : null;
        if (stateId == null) {
            throw new RuntimeException("State ID is required");
        }

        Stateentity state = stateRep.findById(stateId)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));

        if (cityRep.existsByNameAndStateId(city.getName(), stateId)) {
            throw new RuntimeException("City with name '" + city.getName() + "' already exists in " + state.getName());
        }

        city.setState(state);
        return cityRep.save(city);
    }

    public List<Cityentity> viewCity() {
        return cityRep.findAll();
    }

    public List<Cityentity> viewCity(Boolean isActive) {
        if (isActive != null) {
            return cityRep.findByActive(isActive);
        }
        return cityRep.findAll();
    }

    public List<Cityentity> getCitiesByStateId(Long stateId, Boolean isActive) {
        if (!stateRep.existsById(stateId)) {
            throw new RuntimeException("State not found with id: " + stateId);
        }
        if (isActive != null) {
            return cityRep.findByStateIdAndActive(stateId, isActive);
        }
        return cityRep.findByStateId(stateId);
    }

    public Cityentity getCityById(Long id) {
        return cityRep.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    public Cityentity updateCity(Long id, Cityentity city) {
        Cityentity existing = cityRep.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));

        if (city.getState() != null && city.getState().getId() != null) {
            Stateentity state = stateRep.findById(city.getState().getId())
                    .orElseThrow(() -> new RuntimeException("State not found with id: " + city.getState().getId()));
            existing.setState(state);
        }

        if (city.getName() != null && !city.getName().trim().isEmpty()) {
            Long stateId = existing.getState().getId();
            if (cityRep.existsByNameAndStateIdAndIdNot(city.getName(), stateId, id)) {
                throw new RuntimeException("City with name '" + city.getName() + "' already exists in this state");
            }
            existing.setName(city.getName());
        }

        existing.setActive(city.isActive());

        return cityRep.save(existing);
    }

    public int changeStatus(Long id) {
        Cityentity result = cityRep.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
        if (result.isActive()) {
            result.setActive(false);
            cityRep.save(result);
            return 0;
        } else {
            result.setActive(true);
            cityRep.save(result);
            return 1;
        }
    }

    @Transactional
    public void deleteCity(Long id) {
        if (!cityRep.existsById(id)) {
            throw new RuntimeException("City not found with id: " + id);
        }
        cityRep.deleteById(id);
    }

    public List<Cityentity> searchCities(String name) {
        return cityRep.findByNameContainingIgnoreCase(name);
    }
}
