package com.owner_verification.owner_verification.Dto.Responsedto;

import com.owner_verification.owner_verification.Enums.DocumentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OwnerDocumentResponseDto {
    private int id;
    private int user_id;
    private int owner_request_id;
    private DocumentType document_type; // ADHAR_CARD, PAN_CARD, GST_NUMBER
    private String document_url;
    private LocalDateTime uploaded_at;
}
