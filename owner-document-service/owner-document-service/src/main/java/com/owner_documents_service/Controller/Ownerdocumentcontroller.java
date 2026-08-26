package com.owner_documents_service.Controller;

import com.owner_documents_service.Model.Ownerdocumentmodel;
import com.owner_documents_service.Repositry.Ownerdocumentsrepositry;
import com.owner_documents_service.Service.OwnerDocumentUploadService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/owner-documents")

public class Ownerdocumentcontroller {
    private Ownerdocumentsrepositry rep;
    OwnerDocumentUploadService service;

    public Ownerdocumentcontroller(OwnerDocumentUploadService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> getDocuments(@RequestParam("file") MultipartFile file,
            @RequestParam("requestId") int requestId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is missing");
            }
            Ownerdocumentmodel model = service.uploadOwnerDocument(file, requestId);
            return ResponseEntity.status(HttpStatus.CREATED).body(model);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Document upload failed : " + e.getMessage());
        }
    }

    @GetMapping("/get/{requestId}")
    public ResponseEntity<?> getOwnerDocumentsById(@PathVariable int requestId) {
        try {
            List<Ownerdocumentmodel> ownerDocuments = service.getOwnerDocumentsById(requestId);
            if (ownerDocuments == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No documents found for request id : " + requestId);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ownerDocuments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Document upload failed : " + e.getMessage());
        }
    }
}
