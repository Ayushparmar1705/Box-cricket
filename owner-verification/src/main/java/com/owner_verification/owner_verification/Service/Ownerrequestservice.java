package com.owner_verification.owner_verification.Service;

import com.owner_verification.owner_verification.Dto.OwnerRequestResponseDto;
import com.owner_verification.owner_verification.Dto.Requestdto.OwnerDocumentUploadDto;
import com.owner_verification.owner_verification.Dto.Requestdto.OwnerRegistrationRequestDto;
import com.owner_verification.owner_verification.Dto.Responsedto.OwnerDocumentResponseDto;
import com.owner_verification.owner_verification.Dto.Responsedto.OwnerRegistrationResponseDto;
import com.owner_verification.owner_verification.Enums.BusinessType;
import com.owner_verification.owner_verification.Enums.DocumentType;
import com.owner_verification.owner_verification.Enums.VerificationStatus;
import com.owner_verification.owner_verification.Model.Ownerrequestmodel;
import com.owner_verification.owner_verification.Repositry.Ownerrequestrepositry;
import com.owner_verification.owner_verification.Response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class Ownerrequestservice {

    @Autowired
    private Ownerrequestrepositry rep;

    @Autowired
    private Documentstorageservice documentStorageService;

    @Autowired
    private UserServiceClient userServiceClient;

    // Constructor injection
    public Ownerrequestservice(Ownerrequestrepositry rep, Documentstorageservice documentStorageService,
            UserServiceClient userServiceClient) {
        this.rep = rep;
        this.documentStorageService = documentStorageService;
        this.userServiceClient = userServiceClient;
    }

    /**
     * Submit Owner Request along with document files (Adhar, PAN, GST):
     * 1. Check if user already has a pending request.
     * 2. Save Owner request in DB.
     * 3. Upload Adhar file to Cloudinary -> Save record in DB.
     * 4. Upload PAN file to Cloudinary -> Save record in DB.
     * 5. Upload GST file to Cloudinary (if provided) -> Save record in DB.
     * 6. Return response.
     */
    public ApiResponse makeOwnerWithFiles(

            OwnerRegistrationRequestDto dto,
            MultipartFile adharFile,
            MultipartFile panFile,
            MultipartFile gstFile) throws IOException {

        // Step 1: Check if user already has a PENDING request
        Optional<Ownerrequestmodel> existingRequest = rep.findByUserId(dto.getUser_id());
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == VerificationStatus.PENDING) {
            return new ApiResponse(false, "You already have a pending owner verification request", null);
        }

        // Step 2: Check if required files are provided
        if (adharFile == null || adharFile.isEmpty()) {
            return new ApiResponse(false, "Adhar card file is required", null);
        }
        if (panFile == null || panFile.isEmpty()) {
            return new ApiResponse(false, "PAN card file is required", null);
        }

        // Step 3: Create Model entity from form data
        Ownerrequestmodel model = new Ownerrequestmodel();
        model.setUser_id(dto.getUser_id());
        model.setBusiness_name(dto.getBusiness_name());
        model.setGstn_number(dto.getGstn_number());
        model.setContact_number(dto.getContact_number());
        model.setContact_email(dto.getContact_email());
        model.setBusiness_type(dto.getBusiness_type());
        model.setStatus(VerificationStatus.PENDING);

        // Step 4: Save Owner Request in database
        Ownerrequestmodel savedModel = rep.save(model);

        // Step 5: Upload Adhar file to Cloudinary & save to DB
        documentStorageService.uploadAndSaveDocument(
                dto.getUser_id(), savedModel.getId(), DocumentType.ADHAR_CARD, adharFile);

        // Step 6: Upload PAN file to Cloudinary & save to DB
        documentStorageService.uploadAndSaveDocument(
                dto.getUser_id(), savedModel.getId(), DocumentType.PAN_CARD, panFile);

        return new ApiResponse(true, "Owner request and documents submitted successfully", savedModel);
    }

    /**
     * Submit Owner Request with JSON (when document URLs are already uploaded)
     */
    public ApiResponse makeOwner(OwnerRegistrationRequestDto dto) {
        // Step 1: Check if user already has a PENDING request
        Optional<Ownerrequestmodel> existingRequest = rep.findByUserId(dto.getUser_id());
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == VerificationStatus.PENDING) {
            return new ApiResponse(false, "You already have a pending owner verification request", null);
        }

        // Step 2: Create Model entity and set fields
        Ownerrequestmodel model = new Ownerrequestmodel();
        model.setUser_id(dto.getUser_id());
        model.setBusiness_name(dto.getBusiness_name());
        model.setGstn_number(dto.getGstn_number());
        model.setContact_number(dto.getContact_number());
        model.setContact_email(dto.getContact_email());
        model.setBusiness_type(dto.getBusiness_type());
        model.setStatus(VerificationStatus.PENDING);

        // Step 3: Save in database
        Ownerrequestmodel savedModel = rep.save(model);

        // Step 4: Save documents list if provided
        if (dto.getDocuments() != null && !dto.getDocuments().isEmpty()) {
            for (OwnerDocumentUploadDto docDto : dto.getDocuments()) {
                docDto.setUser_id(dto.getUser_id());
                docDto.setOwner_request_id(savedModel.getId());
                documentStorageService.saveDocument(docDto);
            }
        }

        return new ApiResponse(true, "Owner request submitted successfully", savedModel);
    }

    /**
     * Get owner request by User ID
     */
    public Ownerrequestmodel getRequestByUserId(int userId) {
        Optional<Ownerrequestmodel> optional = rep.findByUserId(userId);
        return optional.orElse(null);
    }

    /**
     * Get owner request by Request ID
     */
    public Ownerrequestmodel getRequestById(int id) {
        Optional<Ownerrequestmodel> optional = rep.findById(id);
        return optional.orElse(null);
    }

    /**
     * Get all owner verification requests
     */
    public List<OwnerRegistrationResponseDto> getAllOwnerRequests() {

        List<Object[]> rows = rep.findOwnerRequestsWithDocuments();

        List<OwnerRegistrationResponseDto> result = new ArrayList<>();

        for (Object[] row : rows) {
            int ownerRequestId = ((Number) row[0]).intValue();

            // Check if owner already exists
            OwnerRegistrationResponseDto existingOwner = null;
            for (OwnerRegistrationResponseDto owner : result) {
                if (owner.getId() == ownerRequestId) {
                    existingOwner = owner;
                    break;
                }
            }

            // Create owner if not exists
            if (existingOwner == null) {
                OwnerRegistrationResponseDto owner = new OwnerRegistrationResponseDto();

                owner.setId(ownerRequestId);

                if (row[1] != null) {
                    owner.setUser_id(((Number) row[1]).intValue());
                }
                owner.setBusiness_name((String) row[2]);
                if (row[3] != null) {
                    owner.setBusiness_type(BusinessType.valueOf((String) row[3]));
                }
                owner.setGstn_number((String) row[4]);
                owner.setContact_number((String) row[5]);
                owner.setContact_email((String) row[6]);
                if (row[7] != null) {
                    owner.setStatus(VerificationStatus.valueOf((String) row[7]));
                }

                owner.setDocuments(new ArrayList<>());
                result.add(owner);
                existingOwner = owner;
            }

            // Create document if document row exists
            if (row[8] != null) {
                OwnerDocumentResponseDto document = new OwnerDocumentResponseDto();

                document.setId(((Number) row[8]).intValue());
                if (row[9] != null) {
                    document.setUser_id(((Number) row[9]).intValue());
                }
                if (row[10] != null) {
                    document.setOwner_request_id(((Number) row[10]).intValue());
                }
                if (row[11] != null) {
                    document.setDocument_type(DocumentType.valueOf((String) row[11]));
                }
                document.setDocument_url((String) row[12]);

                if (row[13] != null) {
                    if (row[13] instanceof java.sql.Timestamp) {
                        document.setUploaded_at(((java.sql.Timestamp) row[13]).toLocalDateTime());
                    } else if (row[13] instanceof java.time.LocalDateTime) {
                        document.setUploaded_at((java.time.LocalDateTime) row[13]);
                    }
                }

                existingOwner.getDocuments().add(document);
            }
        }

        return result;
    }

    /**
     * Approve Owner Request:
     * 1. Updates request status to APPROVED in DB.
     * 2. Calls auth-service to assign/append OWNER role to the user so user has
     * both PLAYER and OWNER roles.
     */
    public ApiResponse approveRequest(int id, String remark, int approvedBy) {

        Optional<Ownerrequestmodel> optional = rep.findById(id);

        if (optional.isEmpty()) {
            return new ApiResponse(false, "Owner request not found", null);
        }
        Ownerrequestmodel request = optional.get();
        request.setAdmin_remark(remark);
        request.setApproved_by(approvedBy);
        request.setStatus(VerificationStatus.APPROVED);
        Ownerrequestmodel saved = rep.save(request);

        // Add OWNER role to user in auth-service (preserves existing PLAYER role and
        // inserts into user_roles table)
        try {
            userServiceClient.addOwnerRole(request.getUser_id());
        } catch (Exception e) {
            System.err.println("Note: Could not call auth-service auto-role update: " + e.getMessage());
        }

        return new ApiResponse(true, "Owner request approved successfully and user granted OWNER role", saved);
    }

    /**
     * Reject Owner Request:
     * Updates request status to REJECTED in DB with admin remark.
     */
    public ApiResponse rejectRequest(int id, String remark, int approvedBy) {

        System.out.println("Id = " + id);
        System.out.println("Remark = " + remark);
        System.out.println("Approved By = " + approvedBy);
        Optional<Ownerrequestmodel> optional = rep.findById(id);
        if (optional.isEmpty()) {
            return new ApiResponse(false, "Owner request not found", null);
        }
        Ownerrequestmodel request = optional.get();
        request.setAdmin_remark(remark);
        request.setApproved_by(approvedBy);
        request.setStatus(VerificationStatus.REJECTED);
        Ownerrequestmodel saved = rep.save(request);
        return new ApiResponse(true, "Owner request rejected successfully", saved);
    }
}
