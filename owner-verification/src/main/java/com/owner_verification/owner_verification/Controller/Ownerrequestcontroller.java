package com.owner_verification.owner_verification.Controller;

import com.owner_verification.owner_verification.Dto.Requestdto.OwnerRegistrationRequestDto;
import com.owner_verification.owner_verification.Model.Ownerrequestmodel;
import com.owner_verification.owner_verification.Response.ApiResponse;
import com.owner_verification.owner_verification.Service.Ownerrequestservice;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/owner-request")
public class Ownerrequestcontroller {

    private Ownerrequestservice service;

    public Ownerrequestcontroller(Ownerrequestservice service) {
        this.service = service;
    }

    /**
     * Submit Owner Request with direct File Uploads (multipart/form-data)
     * Uploads Adhar, PAN, and GST files to Cloudinary and saves to DB in one
     * request!
     */
    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> createOwnerRequestWithFiles(
            @Valid @ModelAttribute OwnerRegistrationRequestDto dto,
            @RequestParam("adhar_file") MultipartFile adharFile,
            @RequestParam("pan_file") MultipartFile panFile,
            @RequestParam(value = "gst_file", required = false) MultipartFile gstFile,
            Authentication authentication) {

        String principal = authentication != null ? authentication.getName() : null;
        System.out.println("User ID from token principal: " + principal);

        if (dto.getUser_id() == 0) {
            if (dto.getId() > 0) {
                dto.setUser_id(dto.getId());
            } else if (principal != null) {
                try {
                    dto.setUser_id(Integer.parseInt(principal));
                } catch (NumberFormatException ignored) {
                }
            }
        }

        try {

            ApiResponse response = service.makeOwnerWithFiles(dto, adharFile, panFile, gstFile);
            HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Submit Owner Request with JSON body (when document URLs are already uploaded)
     */
    @PostMapping(value = "/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> createOwnerRequestWithJson(
            @Valid @RequestBody OwnerRegistrationRequestDto dto) {
        ApiResponse response = service.makeOwner(dto);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Get the logged-in user's owner request status
     */
    @GetMapping("/my-request")
    public ResponseEntity<ApiResponse> getMyRequest(@RequestParam int userId) {

        Ownerrequestmodel model = service.getRequestByUserId(userId);
        if (model == null) {
            return ResponseEntity.ok(new ApiResponse(false, "No request found for current user", null));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Request fetched successfully", model));
    }

    /**
     * Get all owner verification requests (for admin review)
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getAllRequests() {
        return ResponseEntity
                .ok(new ApiResponse(true, "All requests fetched successfully", service.getAllOwnerRequests()));
    }

    /**
     * Get specific request by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRequestById(@PathVariable int id) {
        Ownerrequestmodel model = service.getRequestById(id);
        if (model == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Request not found", null));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Request found", model));
    }

    /**
     * Approve an owner verification request by ID
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse> approveOwnerRequest(
            @PathVariable int id,
            @RequestParam(required = false, defaultValue = "") String remark,
            @RequestParam(required = false, defaultValue = "0") int approvedBy,
            Authentication authentication) {

        if (approvedBy == 0 && authentication != null && authentication.getName() != null) {
            try {
                approvedBy = Integer.parseInt(authentication.getName());
            } catch (NumberFormatException ignored) {
            }
        }
        ApiResponse response = service.approveRequest(id, remark, approvedBy);
        return ResponseEntity.ok(response);
    }

    /**
     * Reject an owner verification request by ID
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse> rejectOwnerRequest(
            @PathVariable int id,
            @RequestParam(required = false, defaultValue = "") String remark,
            @RequestParam(required = false, defaultValue = "0") int approvedBy,
            Authentication authentication) {

        if (approvedBy == 0 && authentication != null && authentication.getName() != null) {
            try {
                approvedBy = Integer.parseInt(authentication.getName());
            } catch (NumberFormatException ignored) {
            }
        }
        ApiResponse response = service.rejectRequest(id, remark, approvedBy);
        return ResponseEntity.ok(response);
    }
}
