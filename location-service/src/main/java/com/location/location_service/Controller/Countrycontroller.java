package com.location.location_service.Controller;

import com.location.location_service.Dto.CountryRequestDto;
import com.location.location_service.Dto.CountryResponseDto;
import com.location.location_service.Dto.StateResponseDto;
import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Service.Countryservice;
import com.location.location_service.Service.Stateservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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
    public ResponseEntity<?> createCountry(
            @Valid @RequestBody(required = false) CountryRequestDto dto,
            BindingResult bindingResult) {
        if (bindingResult != null && bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        if (dto == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Countryentity saved = service.addCountry(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Country added successfully");
            response.put("data", service.mapToResponseDto(saved, false));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @GetMapping("/view")
    public ResponseEntity<List<CountryResponseDto>> viewCountry(
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Countryentity> list = service.viewCountry(isActive);
            List<CountryResponseDto> result = list.stream()
                    .map(c -> service.mapToResponseDto(c, false))
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Countryentity result = service.getCountryById(id);
            return ResponseEntity.status(HttpStatus.OK).body(service.mapToResponseDto(result, true));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Country not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @PutMapping("/country-status/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id) {
        try {
            int result = service.changeStatus(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Status updated successfully");
            response.put("activeStatus", result);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCountry(
            @PathVariable Long id,
            @Valid @RequestBody CountryRequestDto dto) {
        try {
            Countryentity updated = service.updateCountry(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "Country updated successfully");
            response.put("data", service.mapToResponseDto(updated, false));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}/states")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCountry(@PathVariable Long id) {
        try {
            service.deleteCountry(id);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "Country deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
