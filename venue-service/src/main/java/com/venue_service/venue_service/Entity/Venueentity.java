package com.venue_service.venue_service.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenueImage> images;
}
