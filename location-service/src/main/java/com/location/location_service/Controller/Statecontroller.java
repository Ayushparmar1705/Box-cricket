package com.location.location_service.Controller;

import com.location.location_service.Entity.Cityentity;
import com.location.location_service.Entity.Stateentity;
import com.location.location_service.Service.Cityservice;
import com.location.location_service.Service.Stateservice;
import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/state")
public class Statecontroller {

    private final Stateservice service;
    private final Cityservice cityService;

    public Statecontroller(Stateservice service, Cityservice cityService) {
        this.service = service;
        this.cityService = cityService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createState(
            @Valid @RequestBody(required = false) Stateentity state,
            BindingResult bindingResult) {
        if (bindingResult != null && bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        if (state == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Stateentity saved = service.addState(state);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "State added successfully");
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

    @GetMapping({ "/", "/view" })
    public ResponseEntity<List<Stateentity>> viewState(
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            List<Stateentity> list = service.viewState(isActive, pageable);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Stateentity result = service.getStateById(id);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Stateentity>> getStatesByCountryId(
            @PathVariable Long countryId,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Stateentity> list = service.getStatesByCountryId(countryId, isActive);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/state-status/{id}")
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
    public ResponseEntity<?> updateState(
            @PathVariable Long id,
            @Valid @RequestBody Stateentity state) {
        try {
            Stateentity updated = service.updateState(id, state);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "State updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}/cities")
    public ResponseEntity<List<Cityentity>> getCitiesByState(
            @PathVariable Long id,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Cityentity> cities = cityService.getCitiesByStateId(id, isActive);
            return ResponseEntity.ok(cities);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteState(@PathVariable Long id) {
        try {
            service.deleteState(id);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "State deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
