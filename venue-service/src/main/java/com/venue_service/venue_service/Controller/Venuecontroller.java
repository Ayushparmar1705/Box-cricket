package com.venue_service.venue_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import com.venue_service.venue_service.Entity.Venueentity;
import com.venue_service.venue_service.Service.Venueservice;

@RestController
@RequestMapping("/api/venue")
public class Venuecontroller {

    private final Venueservice service;

    public Venuecontroller(Venueservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> addVenue(
            @RequestBody Venueentity venue,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Venueentity savedVenue = service.addVenue(venue, file);
            mapResult.put("status", 201);
            mapResult.put("message", "Venue created successfully");
            mapResult.put("data", savedVenue);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapResult);
        } catch (RuntimeException err) {
            mapResult.put("status", 400);
            mapResult.put("message", "Venue creation failed: " + err.getMessage());
            System.out.println(err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> updateVenue(
            @PathVariable int id,
            @RequestBody Venueentity venue,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Venueentity updatedVenue = service.updateVenue(id, venue, file);
            mapResult.put("status", 200);
            mapResult.put("message", "Venue updated successfully");
            mapResult.put("data", updatedVenue);
            return ResponseEntity.status(HttpStatus.OK).body(mapResult);
        } catch (RuntimeException err) {
            mapResult.put("status", 400);
            mapResult.put("message", "Venue update failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }

    @GetMapping("/view")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('PLAYER') or hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> getVenue(@RequestParam String isActive,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "100") int size) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            List<Venueentity> result = service.viewVenues(Boolean.parseBoolean(isActive), pageable);

            mapResult.put("status", 201);
            mapResult.put("message", result);

        } catch (RuntimeException err) {
            mapResult.put("status", 400);
            mapResult.put("message", "Venue creation failed: " + err.getMessage());
            System.out.println(err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(mapResult);
    }

    @PutMapping("/venue-status/{id}/{status}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable int id,
            @PathVariable boolean status) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Venueentity venue = service.changeStatus(id, status);
            mapResult.put("status", 200);
            mapResult.put("message", "Venue status updated successfully");
            mapResult.put("data", venue);
            return ResponseEntity.status(HttpStatus.OK).body(mapResult);
        } catch (RuntimeException err) {
            mapResult.put("status", 400);
            mapResult.put("message", "Venue status change failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }
}