package com.owner_verification.owner_verification.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.owner_verification.owner_verification.Dto.Requestdto.OwnerDocumentUploadDto;
import com.owner_verification.owner_verification.Enums.DocumentType;
import com.owner_verification.owner_verification.Model.Ownerdocumentsmodel;
import com.owner_verification.owner_verification.Repositry.Ownerdocumentrepositry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class Documentstorageservice {

    @Autowired
    private Ownerdocumentrepositry rep;

    private Cloudinary cloudinary;

    // Constructor injection
    public Documentstorageservice(Ownerdocumentrepositry rep, Cloudinary cloudinary) {
        this.rep = rep;
        this.cloudinary = cloudinary;
    }

    /**
     * Upload file to Cloudinary AND save document record in Database.
     * Easy to understand:
     * Step 1: Upload file bytes to Cloudinary
     * Step 2: Get secure URL
     * Step 3: Save into owner_documents table
     */
    public Ownerdocumentsmodel uploadAndSaveDocument(
            int userId,
            int ownerRequestId,
            DocumentType documentType,
            MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. Upload to Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "box-cricket/owner-documents", "resource_type", "auto"));
        String documentUrl = uploadResult.get("secure_url").toString();

        // 2. Create Model and set fields
        Ownerdocumentsmodel model = new Ownerdocumentsmodel();
        model.setUser_id(userId);
        model.setOwner_request_id(ownerRequestId);
        model.setDocument_type(documentType);
        model.setDocument_url(documentUrl);

        // 3. Save in database
        return rep.save(model);
    }

    /**
     * Save document using existing URL / DTO
     */
    public Ownerdocumentsmodel saveDocument(OwnerDocumentUploadDto dto) {
        Ownerdocumentsmodel model = new Ownerdocumentsmodel();
        model.setUser_id(dto.getUser_id());
        model.setOwner_request_id(dto.getOwner_request_id());
        model.setDocument_type(dto.getDocument_type());
        model.setDocument_url(dto.getDocument_url());
        return rep.save(model);
    }

    /**
     * Get all documents for a specific Owner Request ID
     */
    public List<Ownerdocumentsmodel> getDocumentsByOwnerRequestId(int ownerRequestId) {
        return rep.findByOwnerRequestId(ownerRequestId);
    }

    /**
     * Get all documents for a specific User ID
     */
    public List<Ownerdocumentsmodel> getDocumentsByUserId(int userId) {
        return rep.findByUserId(userId);
    }

    /**
     * Get document by ID
     */
    public Ownerdocumentsmodel getDocumentById(int id) {
        Optional<Ownerdocumentsmodel> optional = rep.findById(id);
        return optional.orElse(null);
    }

    /**
     * Get all documents
     */
    public List<Ownerdocumentsmodel> getAllDocuments() {
        return rep.findAll();
    }
}
