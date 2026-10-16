package com.facility_service.facility_service.dto.Responsedto;

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
public class Venueamenitiesresponsedto {

    private int id;
    private String venue_amenity;
}
