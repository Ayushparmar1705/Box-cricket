package com.locationservice.locationservice.Controller;

import com.locationservice.locationservice.Dto.RequestDto.Countryrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Countryresponsedto;
import com.locationservice.locationservice.Service.Countryservice;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/country")
public class Countrycontroller {
    private final Countryservice service;

    public Countrycontroller(Countryservice service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody Countryrequestdto country) {
        ApiResponse<Void> res = service.create(country);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('OWNER') or hasRole('PLAYER')")
    public ResponseEntity<ApiResponse<List<Countryresponsedto>>> getAllCountries() {
        ApiResponse<List<Countryresponsedto>> res = service.getAllCountries();
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
