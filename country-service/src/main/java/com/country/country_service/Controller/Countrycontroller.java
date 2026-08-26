package com.country.country_service.Controller;

import com.country.country_service.Model.Countrymodel;
import com.country.country_service.Service.Countryservice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/country")
public class Countrycontroller {
    private Countryservice service;

    public Countrycontroller(Countryservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> Createcountry(@RequestBody(required = false) Countrymodel obj) {
        if (obj == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getName() == null || obj.getName().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Country name is required");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getCode() == null || obj.getCode().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Country code is required");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            service.Addcountry(obj);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "Country added succesfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @GetMapping("/view")
    public ResponseEntity<List<Countrymodel>> viewcountry() {
        try {
            List<Countrymodel> list = service.viewCountry();
            return ResponseEntity.status(HttpStatus.CREATED).body(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/country-status/{id}")
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
