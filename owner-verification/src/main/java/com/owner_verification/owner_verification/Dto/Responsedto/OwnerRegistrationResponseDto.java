package com.owner_verification.owner_verification.Dto.Responsedto;

import com.owner_verification.owner_verification.Enums.BusinessType;
import com.owner_verification.owner_verification.Enums.VerificationStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OwnerRegistrationResponseDto {
    private int id;
    private int user_id;
    private String business_name;
    private String gstn_number;
    private String contact_number;
    private String contact_email;
    private BusinessType business_type;
    private VerificationStatus status;
    private String admin_remark;
    private int approved_by;
    private LocalDateTime created_at;
    private LocalDateTime approved_at;

    // Attached owner verification documents (Adhar card, Pan card, Gst number)
    private List<OwnerDocumentResponseDto> documents;
}
