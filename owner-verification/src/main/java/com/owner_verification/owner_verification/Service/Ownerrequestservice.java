package com.owner_verification.owner_verification.Service;

import com.owner_verification.owner_verification.Dto.Requestdto.OwnerDocumentUploadDto;
import com.owner_verification.owner_verification.Dto.Requestdto.OwnerRegistrationRequestDto;
import com.owner_verification.owner_verification.Enums.DocumentType;
import com.owner_verification.owner_verification.Enums.VerificationStatus;
import com.owner_verification.owner_verification.Model.Ownerrequestmodel;
import com.owner_verification.owner_verification.Repositry.Ownerrequestrepositry;
import com.owner_verification.owner_verification.Response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class Ownerrequestservice {

    @Autowired
    private Ownerrequestrepositry rep;

    @Autowired
    private Documentstorageservice documentStorageService;

    // Constructor injection
    public Ownerrequestservice(Ownerrequestrepositry rep, Documentstorageservice documentStorageService) {
        this.rep = rep;
        this.documentStorageService = documentStorageService;
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
        model.setCity(dto.getCity());
        model.setState(dto.getState());
        model.setCountry(dto.getCountry());
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
        model.setCity(dto.getCity());
        model.setState(dto.getState());
        model.setCountry(dto.getCountry());
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
    public List<Ownerrequestmodel> getAllRequests() {
        return rep.findAll();
    }
}
