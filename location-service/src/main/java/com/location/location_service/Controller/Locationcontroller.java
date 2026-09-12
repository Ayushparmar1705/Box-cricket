package com.location.location_service.Controller;

import com.location.location_service.Dto.CityResponseDto;
import com.location.location_service.Dto.LocationHierarchyDto;
import com.location.location_service.Service.Cityservice;
import com.location.location_service.Service.Locationservice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/location")
public class Locationcontroller {

    private final Locationservice locationService;
    private final Cityservice cityService;

    public Locationcontroller(Locationservice locationService, Cityservice cityService) {
        this.locationService = locationService;
        this.cityService = cityService;
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<LocationHierarchyDto> getHierarchy(
            @RequestParam(value = "activeOnly", required = false, defaultValue = "false") Boolean activeOnly) {
        LocationHierarchyDto result = locationService.getCompleteHierarchy(activeOnly);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search-cities")
    public ResponseEntity<List<CityResponseDto>> searchCities(@RequestParam("q") String query) {
        List<CityResponseDto> results = cityService.searchCities(query).stream()
                .map(cityService::mapToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
}
