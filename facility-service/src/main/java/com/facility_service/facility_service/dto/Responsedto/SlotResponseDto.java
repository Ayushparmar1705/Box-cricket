package com.facility_service.facility_service.dto.Responsedto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * ============================================================================
 * Response DTO: SlotResponseDto
 * Description: Data returned to clients when querying court booking slots.
 * Includes status, timing, price, and active booking/lock state.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlotResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("court_id")
    private Integer courtId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("slot_date")
    private LocalDate slotDate;

    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("start_time")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("end_time")
    private LocalTime endTime;

    @JsonProperty("price")
    private Double price;

    @JsonProperty("status")
    private String status;

    @JsonProperty("is_available")
    public boolean isAvailable() {
        return "AVAILABLE".equalsIgnoreCase(this.status);
    }

    @JsonProperty("booked_by_name")
    private String bookedByName;

    @JsonProperty("booked_by_phone")
    private String bookedByPhone;

    @JsonProperty("locked_by")
    private Integer lockedBy;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("locked_until")
    private LocalDateTime lockedUntil;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}

