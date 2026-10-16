package com.facility_service.facility_service.dto.Requestdto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Venueamenitiesrequestdto {

    @NotBlank(message = "Venue amenity name is required")
    private String venue_amenity;
}
