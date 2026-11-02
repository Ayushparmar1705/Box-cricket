package com.facility_service.facility_service.dto.Requestdto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * ============================================================================
 * Request DTO: SlotRequestDto
 * Description: Data transfer object used for creating a single slot or slot window.
 * Fresher-friendly: clean fields with validation and Jackson aliases.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlotRequestDto {

    @NotNull(message = "Court ID is required")
    @JsonProperty("court_id")
    @JsonAlias({"courtId", "court_id"})
    private Integer courtId;

    @NotNull(message = "Slot date is required (YYYY-MM-DD)")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("slot_date")
    @JsonAlias({"slotDate", "slot_date"})
    private LocalDate slotDate;

    @NotNull(message = "Start time is required (HH:mm:ss)")
    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("start_time")
    @JsonAlias({"startTime", "start_time"})
    private LocalTime startTime;

    @NotNull(message = "End time is required (HH:mm:ss)")
    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("end_time")
    @JsonAlias({"endTime", "end_time"})
    private LocalTime endTime;

    @JsonProperty("price")
    private Double price;

    @JsonProperty("status")
    @Builder.Default
    private String status = "AVAILABLE";
}

