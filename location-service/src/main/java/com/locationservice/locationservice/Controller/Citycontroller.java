package com.locationservice.locationservice.Controller;

import com.locationservice.locationservice.Dto.RequestDto.Cityrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Cityresponsedto;
import com.locationservice.locationservice.Model.Citymodel;
import com.locationservice.locationservice.Service.Cityservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/city")
public class Citycontroller {
    private final Cityservice service;

    public Citycontroller(Cityservice service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody Cityrequestdto city) {
        ApiResponse<Void> res = service.create(city);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('OWNER') or hasRole('PLAYER')")
    public ResponseEntity<ApiResponse<List<Cityresponsedto>>> getAllCities(
            @RequestParam(defaultValue = "true") boolean status, @RequestParam(defaultValue = "0") int id) {
        ApiResponse<List<Cityresponsedto>> res = service.getAllCities(status, id);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> changeStatus(@RequestParam int id) {
        ApiResponse<String> res = service.changeStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> update(@Valid @RequestBody Cityrequestdto city, @RequestParam int id) {
        ApiResponse<Void> res = service.updateCity(city, id);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Optional<List<Citymodel>> filter(@RequestParam boolean status) {
        Optional<List<Citymodel>> res = service.filter(status);
        return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }
}
