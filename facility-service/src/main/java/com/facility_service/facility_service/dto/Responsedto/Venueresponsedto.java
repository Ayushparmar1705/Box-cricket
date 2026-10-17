package com.facility_service.facility_service.dto.Responsedto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Venueresponsedto implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    private int id;
    private int owner_id;
    private String name;
    private String city;
    private String description;
    private String address;
    private double longitude;
    private double latitude;
    private String google_map_link;
    private String phone_number;
    private String email;
    private String imageUrl;
    // List of amenity names (e.g. ["WiFi", "Parking", "Restrooms"])
    private List<String> venue_amenities;

    private LocalTime opening_time;
    private LocalTime closing_time;

    private String cancellation_policy;

    @JsonProperty("venue_name")
    public String getVenue_name() {
        return this.name;
    }

    @JsonProperty("city_id")
    public String getCity_id() {
        return this.city;
    }

    @JsonProperty("contact_number")
    public String getContact_number() {
        return this.phone_number;
    }

    @JsonProperty("is_active")
    private boolean is_active;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @JsonProperty("is_active")
    public boolean is_active() {
        return is_active;
    }

    @JsonProperty("is_active")
    public void set_active(boolean is_active) {
        this.is_active = is_active;
    }
}
