package com.facility_service.facility_service.dto.Requestdto;

import com.facility_service.facility_service.Model.Venueamenitiesmodel;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Venuerequestdto {
    @NotNull(message = "Owner name required")
    private int owner_id;
    @NotNull(message = "Venue name required")
    private String name;
    @NotNull(message = "Venue city required")
    private int city;
    @NotNull(message = "Venue description required")
    private String description;
    @NotNull(message = "Venue longitude required")
    private double longitude;
    @NotNull(message = "Venue latitude required")
    private double latitude;
    @NotNull(message = "Venue google map link required")
    private String google_map_link;
    @NotNull(message = "Venue phone number required")
    private String phone_number;
    @NotNull(message = "Venue email required")
    private String email;
    @NotNull(message = "Venue opening time required")
    private Date opening_time;
    @NotNull(message = "Venue closing time required")
    private Date closing_time;
    @NotNull(message = "Venue amenities required")
    private List<Venueamenitiesmodel> venue_amenities;
    @NotNull(message = "Venue cancellation policy required")
    private String cancellation_policy;
}
