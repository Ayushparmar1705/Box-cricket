package com.owner_documents_service.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads a multipart file to Cloudinary and returns the upload result map.
     * The original filename (without extension) is used as the public_id for
     * readability.
     */
    public Map<String, Object> upload(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String publicId = (originalFilename != null)
                ? originalFilename.replaceAll("\\.[^.]+$", "")
                : null;
        return cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "auto",
                        "type", "upload"));
    }
}
