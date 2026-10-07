package com.owner_verification.owner_verification.Dto.Requestdto;

import com.owner_verification.owner_verification.Enums.BusinessType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Ownerdocumentrequestdto {
    private int user_id;
    private String business_name;
    private String gstn_number;
    private int city;
    private int country;
    private int state;
    private String contact_number;
    private String contact_email;
    private BusinessType business_type;

    // Documents: Adhar card, Pan card, Gst number
    private List<OwnerDocumentUploadDto> documents;
}
