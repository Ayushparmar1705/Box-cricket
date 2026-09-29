package com.location.location_service.Controller;

import com.location.location_service.Entity.Cityentity;
import com.location.location_service.Service.Cityservice;
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
@RequestMapping("/api/city")
public class Citycontroller {

    private final Cityservice service;

    public Citycontroller(Cityservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createCity(
            @Valid @RequestBody(required = false) Cityentity city,
            BindingResult bindingResult) {
        if (bindingResult != null && bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        if (city == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Cityentity saved = service.addCity(city);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "City added successfully");
            response.put("data", saved);
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('PLAYER') or hasRole('OWNER')")
    public ResponseEntity<List<Cityentity>> viewCity(
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Cityentity> list = service.viewCity(isActive);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/get-by-id/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Cityentity result = service.getCityById(id);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("City not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @GetMapping("/state/{stateId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('PLAYER') or hasRole('OWNER')")
    public ResponseEntity<List<Cityentity>> getCitiesByStateId(
            @PathVariable Long stateId,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Cityentity> list = service.getCitiesByStateId(stateId, isActive);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/city-status/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
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
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateCity(
            @PathVariable Long id,
            @Valid @RequestBody Cityentity city) {
        try {
            Cityentity updated = service.updateCity(id, city);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "City updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteCity(@PathVariable Long id) {
        try {
            service.deleteCity(id);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "City deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
