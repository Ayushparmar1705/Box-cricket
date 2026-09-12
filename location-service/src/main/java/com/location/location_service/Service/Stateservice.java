package com.location.location_service.Service;

import com.location.location_service.Dto.CityResponseDto;
import com.location.location_service.Dto.StateRequestDto;
import com.location.location_service.Dto.StateResponseDto;
import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Entity.Stateentity;
import com.location.location_service.Repositry.Countryrepositry;
import com.location.location_service.Repositry.Staterepositry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Stateservice {

    private final Staterepositry stateRep;
    private final Countryrepositry countryRep;

    public Stateservice(Staterepositry stateRep, Countryrepositry countryRep) {
        this.stateRep = stateRep;
        this.countryRep = countryRep;
    }

    public Stateentity addState(StateRequestDto dto) {
        Countryentity country = countryRep.findById(dto.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + dto.getCountryId()));

        if (stateRep.existsByNameAndCountryId(dto.getName(), dto.getCountryId())) {
            throw new RuntimeException("State with name '" + dto.getName() + "' already exists in " + country.getName());
        }

        Stateentity state = new Stateentity();
        state.setName(dto.getName());
        state.setCountry(country);
        state.setActive(dto.getActive() != null ? dto.getActive() : true);
        return stateRep.save(state);
    }

    public List<Stateentity> viewState() {
        return stateRep.findAll();
    }

    public List<Stateentity> viewState(Boolean isActive) {
        if (isActive != null) {
            return stateRep.findByActive(isActive);
        }
        return stateRep.findAll();
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

    public Stateentity updateState(Long id, StateRequestDto dto) {
        Stateentity state = stateRep.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));

        if (dto.getCountryId() != null) {
            Countryentity country = countryRep.findById(dto.getCountryId())
                    .orElseThrow(() -> new RuntimeException("Country not found with id: " + dto.getCountryId()));
            state.setCountry(country);
        }

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            Long countryId = state.getCountry().getId();
            if (stateRep.existsByNameAndCountryIdAndIdNot(dto.getName(), countryId, id)) {
                throw new RuntimeException("State with name '" + dto.getName() + "' already exists in this country");
            }
            state.setName(dto.getName());
        }

        if (dto.getActive() != null) {
            state.setActive(dto.getActive());
        }

        return stateRep.save(state);
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

    public StateResponseDto mapToResponseDto(Stateentity entity, boolean includeCities) {
        List<CityResponseDto> cityDtos = null;
        if (includeCities && entity.getCities() != null) {
            cityDtos = entity.getCities().stream()
                    .map(c -> CityResponseDto.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .stateId(entity.getId())
                            .stateName(entity.getName())
                            .countryId(entity.getCountry() != null ? entity.getCountry().getId() : null)
                            .countryName(entity.getCountry() != null ? entity.getCountry().getName() : null)
                            .active(c.isActive())
                            .created_at(c.getCreated_at())
                            .build())
                    .collect(Collectors.toList());
        }

        return StateResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .countryId(entity.getCountry() != null ? entity.getCountry().getId() : null)
                .countryName(entity.getCountry() != null ? entity.getCountry().getName() : null)
                .active(entity.isActive())
                .created_at(entity.getCreated_at())
                .cities(cityDtos)
                .build();
    }
}
