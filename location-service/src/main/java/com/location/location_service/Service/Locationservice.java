package com.location.location_service.Service;

import com.location.location_service.Dto.CityResponseDto;
import com.location.location_service.Dto.CountryResponseDto;
import com.location.location_service.Dto.LocationHierarchyDto;
import com.location.location_service.Dto.StateResponseDto;
import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Repositry.Countryrepositry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Locationservice {

    private final Countryrepositry countryRep;

    public Locationservice(Countryrepositry countryRep) {
        this.countryRep = countryRep;
    }

    @Transactional(readOnly = true)
    public LocationHierarchyDto getCompleteHierarchy(Boolean activeOnly) {
        List<Countryentity> countries = (activeOnly != null && activeOnly)
                ? countryRep.findByActive(true)
                : countryRep.findAll();

        List<CountryResponseDto> countryDtos = countries.stream()
                .map(country -> {
                    List<StateResponseDto> stateDtos = country.getStates().stream()
                            .filter(s -> activeOnly == null || !activeOnly || s.isActive())
                            .map(state -> {
                                List<CityResponseDto> cityDtos = state.getCities().stream()
                                        .filter(c -> activeOnly == null || !activeOnly || c.isActive())
                                        .map(city -> CityResponseDto.builder()
                                                .id(city.getId())
                                                .name(city.getName())
                                                .stateId(state.getId())
                                                .stateName(state.getName())
                                                .countryId(country.getId())
                                                .countryName(country.getName())
                                                .active(city.isActive())
                                                .created_at(city.getCreated_at())
                                                .build())
                                        .collect(Collectors.toList());

                                return StateResponseDto.builder()
                                        .id(state.getId())
                                        .name(state.getName())
                                        .countryId(country.getId())
                                        .countryName(country.getName())
                                        .active(state.isActive())
                                        .created_at(state.getCreated_at())
                                        .cities(cityDtos)
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return CountryResponseDto.builder()
                            .id(country.getId())
                            .name(country.getName())
                            .code(country.getCode())
                            .active(country.isActive())
                            .created_at(country.getCreated_at())
                            .states(stateDtos)
                            .build();
                })
                .collect(Collectors.toList());

        return LocationHierarchyDto.builder()
                .countries(countryDtos)
                .build();
    }
}
