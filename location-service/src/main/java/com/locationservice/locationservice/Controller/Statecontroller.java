package com.locationservice.locationservice.Controller;
import com.locationservice.locationservice.Dto.RequestDto.Staterequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Stateresponsedto;
import com.locationservice.locationservice.Model.Statemodel;
import com.locationservice.locationservice.Service.Stateservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/state")
public class Statecontroller {
    private Stateservice service;
    public Statecontroller(Stateservice service){
        this.service = service;
    }

    @PostMapping
    @PreAuthorize(("hasRole('SUPER_ADMIN')"))
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody  Staterequestdto state){
        ApiResponse<Void> res = service.create(state);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('OWNER') or hasRole('PLAYER')")
    public ResponseEntity<ApiResponse<List<Stateresponsedto>>> getAllStates(
            @RequestParam(defaultValue = "true") boolean status, @RequestParam(defaultValue = "0") int id) {
        ApiResponse<List<Stateresponsedto>> res = service.getAllStates(status, id);
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
    public ResponseEntity<ApiResponse<Void>> update(@Valid @RequestBody Staterequestdto state, @RequestParam int id){
        ApiResponse<Void> res = service.updateState(state, id);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
    @GetMapping("/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Optional<List<Statemodel>> filter(@RequestParam boolean status){
        Optional<List<Statemodel>> res = service.filter(status);
        return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }
}
