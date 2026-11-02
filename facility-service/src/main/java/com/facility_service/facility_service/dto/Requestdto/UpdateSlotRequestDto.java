package com.facility_service.facility_service.dto.Requestdto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Request DTO: UpdateSlotRequestDto
 * Description: Data transfer object used for updating slot status or booking info.
 * All fields are optional to allow partial updates.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSlotRequestDto {

    @JsonProperty("status")
    private String status;

    @JsonProperty("price")
    private Double price;

    @JsonProperty("booked_by_name")
    @JsonAlias({"bookedByName", "booked_by_name"})
    private String bookedByName;

    @JsonProperty("booked_by_phone")
    @JsonAlias({"bookedByPhone", "booked_by_phone"})
    private String bookedByPhone;

    @JsonProperty("locked_by")
    @JsonAlias({"lockedBy", "locked_by"})
    private Integer lockedBy;

    @JsonProperty("locked_until")
    @JsonAlias({"lockedUntil", "locked_until"})
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lockedUntil;
}

