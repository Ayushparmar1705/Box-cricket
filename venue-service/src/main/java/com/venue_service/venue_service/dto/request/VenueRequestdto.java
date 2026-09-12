package com.venue_service.venue_service.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalTime;

/**
 * Data Transfer Object for creating or updating a Venue in the Venue Service.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Requestdto {

    @NotNull(message = "Owner ID is required")
    @Positive(message = "Owner ID must be a positive number")
    private Integer ownerId;

    @NotNull(message = "City ID is required")
    @Positive(message = "City ID must be a positive number")
    private Integer cityId;

    @NotBlank(message = "Venue name is required")
    @Size(min = 2, max = 100, message = "Venue name must be between 2 and 100 characters")
    private String venueName;

    private String description;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 500, message = "Address must be between 5 and 500 characters")
    private String address;

    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    private String googleMapLink;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+ -]{7,20}$", message = "Contact number must be valid (7-20 digits)")
    private String contactNumber;

    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Opening time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closingTime;

    @PositiveOrZero(message = "Price per hour must be zero or a positive value")
    private Double pricePerHour;

    @Min(value = 15, message = "Slot duration must be at least 15 minutes")
    @Max(value = 360, message = "Slot duration cannot exceed 360 minutes")
    @Builder.Default
    private Integer slotDurationMinutes = 60;

    private String cancellationPolicy;

    @Builder.Default
    private Boolean isActive = true;

    private String imageUrl;
}
