package com.example.demo.owner_request_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.owner_request_service.Model.Ownerrequestmodel;
import com.example.demo.owner_request_service.Service.Ownerrequestservice;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/owner-requests")
public class Ownerrequestcontroller {

    @Autowired
    private Ownerrequestservice service;

    @PostMapping
    public ResponseEntity<Ownerrequestmodel> createRequest(@Valid @RequestBody Ownerrequestmodel data) {
        String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("Principal: " + principal.toString());
        Integer userId = Integer.parseInt(principal);

        Ownerrequestmodel created = service.createOwnerRequest(data, userId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Ownerrequestmodel>> getAllRequests() {
        List<Ownerrequestmodel> list = service.getOwnerRequest();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> approveRequest(
            @PathVariable Integer id,
            @RequestParam String status) {
        String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer adminId = Integer.parseInt(principal);

        service.Approveownerrequest(id, status, adminId);
        return ResponseEntity.ok("Owner request status updated successfully");
    }
}
