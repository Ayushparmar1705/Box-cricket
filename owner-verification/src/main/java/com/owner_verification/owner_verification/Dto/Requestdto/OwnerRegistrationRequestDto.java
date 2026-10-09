package com.owner_verification.owner_verification.Dto.Requestdto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private int id;

    @JsonProperty("user_id")
    @JsonAlias({"userId", "user_id", "id"})
    private int user_id;

    @NotNull(message = "business name required")
    @JsonProperty("business_name")
    @JsonAlias({"businessName", "business_name"})
    private String business_name;

    @NotNull(message = "gstn number required")
    @JsonProperty("gstn_number")
    @JsonAlias({"gstnNumber", "gstn_number"})
    private String gstn_number;

    @NotNull(message = "contact number required")
    @JsonProperty("contact_number")
    @JsonAlias({"contactNumber", "contact_number"})
    private String contact_number;

    @NotNull(message = "contact email required")
    @JsonProperty("contact_email")
    @JsonAlias({"contactEmail", "contact_email"})
    private String contact_email;

    @NotNull(message = "business type required")
    @JsonProperty("business_type")
    @JsonAlias({"businessType", "business_type"})
    private BusinessType business_type;

    // List of uploaded owner documents: Adhar card, Pan card, Gst number
    private List<OwnerDocumentUploadDto> documents;

    // Helper setters/getters so Spring Form Data binder binds userId, user_id, and id
    public void setUserId(int userId) {
        this.user_id = userId;
    }

    public int getUserId() {
        return this.user_id;
    }
}
