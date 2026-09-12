package com.venue_service.venue_service.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalTime;
import java.util.Date;

/**
 * Data Transfer Object representing the Venue response in the Venue Service.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Responsedto {

    private Integer id;
    private Integer ownerId;
    private Integer cityId;
    private String venueName;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private String googleMapLink;
    private String contactNumber;
    private String email;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime openingTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime closingTime;

    private Double pricePerHour;
    private Integer slotDurationMinutes;
    private String cancellationPolicy;
    private boolean isActive;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatedAt;

    private String imageUrl;
}
