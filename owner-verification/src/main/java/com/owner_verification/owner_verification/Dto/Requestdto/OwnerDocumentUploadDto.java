package com.owner_verification.owner_verification.Dto.Requestdto;

import com.owner_verification.owner_verification.Enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OwnerDocumentUploadDto {
    private int user_id;
    private int owner_request_id;
    private DocumentType document_type; // ADHAR_CARD, PAN_CARD, GST_NUMBER
    private String document_url; // Storage/Cloudinary URL or file path
}
