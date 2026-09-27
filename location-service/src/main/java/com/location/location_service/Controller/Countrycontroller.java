package com.location.location_service.Controller;

import com.location.location_service.Dto.CountryRequestDto;
import com.location.location_service.Dto.StateResponseDto;
import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Service.Countryservice;
import com.location.location_service.Service.Stateservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/country")
public class Countrycontroller {

    private final Countryservice service;
    private final Stateservice stateService;

    public Countrycontroller(Countryservice service, Stateservice stateService) {
        this.service = service;
        this.stateService = stateService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createCountry(@Valid @RequestBody CountryRequestDto dto) {
        try {
            Countryentity saved = service.addCountry(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Country added successfully");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "message", e.getMessage()));
        }
    }

    @GetMapping({ "", "/view" })
    @PreAuthorize("hasRole('SUPER_ADMIN') OR hasRole('PLAYER') OR hasRole('OWNER')")
    public ResponseEntity<List<Countryentity>> viewCountry(
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "status", required = false) String status) {
        if (status != null) {
            isActive = "active".equalsIgnoreCase(status);
        }
        return ResponseEntity.ok(service.viewCountry(isActive));
    }

    @GetMapping({ "/{id}", "/get-by-id/{id}" })
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getCountryById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", 404, "message", e.getMessage()));
        }
    }

    @PutMapping("/country-status/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> changeStatus(@PathVariable Long id) {
        try {
            int result = service.changeStatus(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Status updated successfully");
            response.put("activeStatus", result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", 404, "message", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateCountry(
            @PathVariable Long id,
            @Valid @RequestBody CountryRequestDto dto) {
        try {
            Countryentity updated = service.updateCountry(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Country updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", 400, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteCountry(@PathVariable Long id) {
        try {
            service.changeStatus(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Country deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", 400, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/states")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<StateResponseDto>> getStatesByCountry(
            @PathVariable Long id,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<StateResponseDto> states = stateService.getStatesByCountryId(id, isActive).stream()
                    .map(s -> stateService.mapToResponseDto(s, false))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(states);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
