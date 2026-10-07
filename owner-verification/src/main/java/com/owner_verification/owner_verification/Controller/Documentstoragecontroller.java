// package com.owner_verification.owner_verification.Controller;

// import com.owner_verification.owner_verification.Enums.DocumentType;
// import com.owner_verification.owner_verification.Response.ApiResponse;
// import
// com.owner_verification.owner_verification.Service.Documentstorageservice;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/documents")
// @CrossOrigin(origins = "*")
// public class Documentstoragecontroller {

// @Autowired
// private Documentstorageservice documentStorageService;

// public Documentstoragecontroller(Documentstorageservice
// documentStorageService) {
// this.documentStorageService = documentStorageService;
// }

// /**
// * API 1: Upload a single document file (Image or PDF) to Cloudinary
// * Endpoint: POST /api/documents/upload
// */
// @PostMapping(value = "/upload", consumes =
// MediaType.MULTIPART_FORM_DATA_VALUE)
// public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocument(
// @RequestParam("file") MultipartFile file,
// @RequestParam("document_type") DocumentType documentType) {
// try {
// String url = documentStorageService.uploadFile(file);

// Map<String, Object> data = new HashMap<>();
// data.put("document_type", documentType);
// data.put("document_url", url);

// return ResponseEntity.status(HttpStatus.CREATED)
// .body(new ApiResponse<>(true, "Document uploaded successfully", data));
// } catch (IllegalArgumentException e) {
// return ResponseEntity.badRequest()
// .body(new ApiResponse<>(false, e.getMessage(), null));
// } catch (IOException e) {
// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// .body(new ApiResponse<>(false, "Failed to upload file to Cloudinary: " +
// e.getMessage(), null));
// }
// }
// }
