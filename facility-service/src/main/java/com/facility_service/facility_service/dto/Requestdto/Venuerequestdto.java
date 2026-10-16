package com.facility_service.facility_service.dto.Requestdto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;

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
    private String city;

    @NotNull(message = "Venue description required")
    private String description;

    private String address;

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

    // Accepts time in HH:mm:ss format  e.g. "06:00:00"
    @NotNull(message = "Venue opening time required")
    private LocalTime opening_time;

    // Accepts time in HH:mm:ss format  e.g. "23:30:00"
    @NotNull(message = "Venue closing time required")
    private LocalTime closing_time;

    // Comma-separated amenities  e.g. "WiFi, Parking, Restrooms"
    private String venue_amenities;

    @NotNull(message = "Venue cancellation policy required")
    private String cancellation_policy;

    private MultipartFile image;

    private String imageUrl;

    // Aliases to support exact user-requested field names
    public void setVenue_name(String venue_name) {
        if (venue_name != null && !venue_name.isBlank()) {
            this.name = venue_name;
        }
    }

    public void setCity_id(String city_id) {
        if (city_id != null && !city_id.isBlank()) {
            this.city = city_id;
        }
    }

    public void setContact_number(String contact_number) {
        if (contact_number != null && !contact_number.isBlank()) {
            this.phone_number = contact_number;
        }
    }
}
