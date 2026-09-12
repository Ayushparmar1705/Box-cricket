package com.location.location_service.Controller;

import com.location.location_service.Dto.CityRequestDto;
import com.location.location_service.Dto.CityResponseDto;
import com.location.location_service.Entity.Cityentity;
import com.location.location_service.Service.Cityservice;
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
@RequestMapping("/api/city")
public class Citycontroller {

    private final Cityservice service;

    public Citycontroller(Cityservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCity(
            @Valid @RequestBody(required = false) CityRequestDto dto,
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
            Cityentity saved = service.addCity(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "City added successfully");
            response.put("data", service.mapToResponseDto(saved));
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
    public ResponseEntity<List<CityResponseDto>> viewCity(
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<Cityentity> list = service.viewCity(isActive);
            List<CityResponseDto> result = list.stream()
                    .map(service::mapToResponseDto)
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
            Cityentity result = service.getCityById(id);
            return ResponseEntity.status(HttpStatus.OK).body(service.mapToResponseDto(result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("City not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @GetMapping("/state/{stateId}")
    public ResponseEntity<List<CityResponseDto>> getCitiesByStateId(
            @PathVariable Long stateId,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        try {
            List<CityResponseDto> list = service.getCitiesByStateId(stateId, isActive).stream()
                    .map(service::mapToResponseDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/city-status/{id}")
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
    public ResponseEntity<?> updateCity(
            @PathVariable Long id,
            @Valid @RequestBody CityRequestDto dto) {
        try {
            Cityentity updated = service.updateCity(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("message", "City updated successfully");
            response.put("data", service.mapToResponseDto(updated));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
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
