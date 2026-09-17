package com.court_service.court_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "courts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "Venue ID is required")
    @Column(name = "venue_id", nullable = false)
    private Integer venueId;

    @NotNull(message = "Category ID is required")
    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @NotBlank(message = "Court name is required")
    @Column(name = "court_name", nullable = false, length = 100)
    private String courtName;

    @NotNull(message = "Surface type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "surface_type", nullable = false)
    private SurfaceType surfaceType;

    @NotNull(message = "Max players is required")
    @Column(name = "max_players", nullable = false)
    private Integer maxPlayers;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}
