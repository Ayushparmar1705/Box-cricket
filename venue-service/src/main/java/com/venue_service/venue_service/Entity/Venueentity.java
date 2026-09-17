package com.venue_service.venue_service.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;



@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Venueentity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;

    @Column(name = "owner_id", nullable = false)
    private int ownerId;

    @Column(name = "city_id", nullable = false)
    private int cityId;

    @NotBlank(message = "Venue name is required")
    @Size(min = 2, max = 100, message = "Venue name must be between 2 and 100 characters")
    @Column(name = "venue_name", nullable = false)
    private String venueName;

    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "longitude")
    private double longitude;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "google_map_link")
    private String googleMapLink;

    @NotBlank(message = "Contact number is required")
    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Email(message = "Invalid email format")
    @Column(name = "email")
    private String email;

    @NotNull(message = "Opening time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @JsonFormat(pattern = "HH:mm")
    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @JsonFormat(pattern = "HH:mm")
    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @CreationTimestamp

    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToMany
    @JoinTable(
        name = "venue_amenities",
        joinColumns = @JoinColumn(name = "venue_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenityentity> amenities = new ArrayList<>();

    public Venueentity( int ownerId, int cityId, String venueName, String address, double longitude, double latitude, String googleMapLink, String contactNumber, String email, LocalTime openingTime, LocalTime closingTime, String cancellationPolicy, String imageUrl) {

        this.ownerId = ownerId;
        this.cityId = cityId;
        this.venueName = venueName;
        this.address = address;
        this.longitude = longitude;
        this.latitude = latitude;
        this.googleMapLink = googleMapLink;
        this.contactNumber = contactNumber;
        this.email = email;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.cancellationPolicy = cancellationPolicy;
        this.imageUrl = imageUrl;
    }
}
