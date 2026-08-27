package com.city.city_service.Controller;

import com.city.city_service.Entity.Citymodel;
import com.city.city_service.Service.Cityservice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> Createcity(
            @RequestBody(required = false) Citymodel obj,
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (obj == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getName() == null || obj.getName().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "City name is required");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getStateId() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "State ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            service.Addcity(obj, token);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "City added successfully");
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
    public ResponseEntity<List<Citymodel>> viewcity() {
        try {
            List<Citymodel> list = service.viewCity();
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/city-status/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id) {
        try {
            int result = service.changeStatus(id);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }
}
