package com.location.location_service.Service;

import com.location.location_service.Dto.CityRequestDto;
import com.location.location_service.Dto.CityResponseDto;
import com.location.location_service.Entity.Cityentity;
import com.location.location_service.Entity.Stateentity;
import com.location.location_service.Repositry.Cityrepositry;
import com.location.location_service.Repositry.Staterepositry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Cityservice {

    private final Cityrepositry cityRep;
    private final Staterepositry stateRep;

    public Cityservice(Cityrepositry cityRep, Staterepositry stateRep) {
        this.cityRep = cityRep;
        this.stateRep = stateRep;
    }

    public Cityentity addCity(CityRequestDto dto) {
        Stateentity state = stateRep.findById(dto.getStateId())
                .orElseThrow(() -> new RuntimeException("State not found with id: " + dto.getStateId()));

        if (cityRep.existsByNameAndStateId(dto.getName(), dto.getStateId())) {
            throw new RuntimeException("City with name '" + dto.getName() + "' already exists in " + state.getName());
        }

        Cityentity city = new Cityentity();
        city.setName(dto.getName());
        city.setState(state);
        city.setActive(dto.getActive() != null ? dto.getActive() : true);
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

    public Cityentity updateCity(Long id, CityRequestDto dto) {
        Cityentity city = cityRep.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));

        if (dto.getStateId() != null) {
            Stateentity state = stateRep.findById(dto.getStateId())
                    .orElseThrow(() -> new RuntimeException("State not found with id: " + dto.getStateId()));
            city.setState(state);
        }

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            Long stateId = city.getState().getId();
            if (cityRep.existsByNameAndStateIdAndIdNot(dto.getName(), stateId, id)) {
                throw new RuntimeException("City with name '" + dto.getName() + "' already exists in this state");
            }
            city.setName(dto.getName());
        }

        if (dto.getActive() != null) {
            city.setActive(dto.getActive());
        }

        return cityRep.save(city);
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

    public CityResponseDto mapToResponseDto(Cityentity entity) {
        Stateentity state = entity.getState();
        return CityResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .stateId(state != null ? state.getId() : null)
                .stateName(state != null ? state.getName() : null)
                .countryId((state != null && state.getCountry() != null) ? state.getCountry().getId() : null)
                .countryName((state != null && state.getCountry() != null) ? state.getCountry().getName() : null)
                .active(entity.isActive())
                .created_at(entity.getCreated_at())
                .build();
    }
}
