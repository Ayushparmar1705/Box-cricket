package com.facility_service.facility_service.dto.Responsedto;

import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Venueresponsedto {

    private int id;
    private int owner_id;
    private String name;
    private int city;
    private String description;
    private double longitude;
    private double latitude;
    private String google_map_link;
    private String phone_number;
    private String email;
    private List<Venueamenitiesmodel> venue_amenities;
    private Date opening_time;
    private Date closing_time;
    private String cancellation_policy;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
