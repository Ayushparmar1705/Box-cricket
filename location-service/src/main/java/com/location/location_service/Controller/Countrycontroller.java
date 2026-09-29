package com.location.location_service.Controller;

import com.location.location_service.Entity.Countryentity;
import com.location.location_service.Service.Countryservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/country")
public class Countrycontroller {

    private final Countryservice service;

    public Countrycontroller(Countryservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createCountry(
            @Valid @RequestBody(required = false) Countryentity country,
            BindingResult bindingResult) {
        if (bindingResult != null && bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        if (country == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Countryentity saved = service.addCountry(country);
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
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
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
            @Valid @RequestBody Countryentity country) {
        try {
            Countryentity updated = service.updateCountry(id, country);
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
}
