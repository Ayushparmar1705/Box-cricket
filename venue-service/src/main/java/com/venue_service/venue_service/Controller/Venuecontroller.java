package com.venue_service.venue_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.venue_service.venue_service.dto.request.VenueRequestdto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Map<String, Object>> addVenue(
            @RequestBody VenueRequestdto venue,
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
    public ResponseEntity<Map<String, Object>> updateVenue(
            @PathVariable int id,
            @RequestBody VenueRequestdto venue,
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
    public ResponseEntity<Map<String, Object>> getVenue(@RequestParam String isActive) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            List<Venueentity> result = service.viewVenues(Boolean.parseBoolean(isActive));

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