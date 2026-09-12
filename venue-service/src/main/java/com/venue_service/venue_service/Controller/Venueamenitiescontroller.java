package com.venue_service.venue_service.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.venue_service.venue_service.Entity.Venueamenities;
import com.venue_service.venue_service.Service.Amenitiesservice;
import com.venue_service.venue_service.dto.request.AmenitiesRequestdto;

@RestController
@RequestMapping("/api/amenities")
public class Venueamenitiescontroller {

    private final Amenitiesservice service;

    public Venueamenitiescontroller(Amenitiesservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createVenue(@RequestBody AmenitiesRequestdto obj) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            System.out.println("Venue amenities controller object = " + obj.toString());
            Venueamenities created = service.createAmenity(obj);
            mapResult.put("status", HttpStatus.CREATED.value());
            mapResult.put("message", "Amenity created successfully");
            mapResult.put("data", created);

            return ResponseEntity.status(HttpStatus.CREATED).body(mapResult);
        } catch (Exception error) {
            mapResult.put("status", HttpStatus.BAD_REQUEST.value());
            mapResult.put("message", "Failed to create amenity: " + error.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }
}
