package com.owner_verification.owner_verification.Dto.Requestdto;

import com.owner_verification.owner_verification.Enums.BusinessType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OwnerRegistrationRequestDto {
    private int user_id;
    @NotNull(message = "business name required")
    private String business_name;
    @NotNull(message = "gstn number required")
    private String gstn_number;
    @NotNull(message = "city name required")
    private int city;
    @NotNull(message = "country name required")
    private int country;
    @NotNull(message = "state name required")
    private int state;
    @NotNull(message = "contact number required")
    private String contact_number;
    @NotNull(message = "contact email required")
    private String contact_email;
    @NotNull(message = "business type required")
    private BusinessType business_type;

    // List of uploaded owner documents: Adhar card, Pan card, Gst number
    private List<OwnerDocumentUploadDto> documents;

    // Helper setters/getters so Spring Form Data binder binds both userId and user_id
    public void setUserId(int userId) {
        this.user_id = userId;
    }

    public int getUserId() {
        return this.user_id;
    }
}
