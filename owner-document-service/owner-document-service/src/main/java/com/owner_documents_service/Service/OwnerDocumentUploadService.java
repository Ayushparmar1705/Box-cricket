package com.owner_documents_service.Service;

import com.owner_documents_service.Model.Ownerdocumentmodel;
import com.owner_documents_service.Repositry.Ownerdocumentsrepositry;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class OwnerDocumentUploadService {

    private final Ownerdocumentsrepositry repositry;
    private final CloudinaryService cloudinaryService;

    public OwnerDocumentUploadService(Ownerdocumentsrepositry repositry,
            CloudinaryService cloudinaryService) {
        this.repositry = repositry;
        this.cloudinaryService = cloudinaryService;
    }

    public Ownerdocumentmodel uploadOwnerDocument(MultipartFile file, int requestId) throws IOException {

        Map<String, Object> result = cloudinaryService.upload(file);

        String url = (String) result.get("secure_url");

        Ownerdocumentmodel model = new Ownerdocumentmodel();
        model.setDocumentUrl(url);
        model.setDocumentType(file.getContentType());
        model.setRequestId(requestId);
        model.setCreatedAt(new Date());

        Ownerdocumentmodel save = repositry.save(model);
        return save;
    }

    public List<Ownerdocumentmodel> getOwnerDocumentsById(int requestId) {

        List<Ownerdocumentmodel> findByRequestId = repositry.findByRequestId(requestId);
        if (findByRequestId.isEmpty()) {
            return null;
        }
        return findByRequestId;

    }
}
