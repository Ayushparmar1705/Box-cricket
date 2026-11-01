package com.facility_service.facility_service.Model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "courts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtEntity implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Integer id;

    @NotNull(message = "Venue ID is required")
    @Column(name = "venue_id", nullable = false)
    @JsonProperty("venue_id")
    @JsonAlias({"venueId", "venue_id"})
    private Integer venueId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", insertable = false, updatable = false)
    @JsonIgnore
    private Venuemodel venue;

    @NotNull(message = "Category ID is required")
    @Column(name = "category_id", nullable = false)
    @JsonProperty("category_id")
    @JsonAlias({"categoryId", "category_id"})
    private Integer categoryId;

    @NotBlank(message = "Court name is required")
    @Column(name = "court_name", nullable = false, length = 100)
    @JsonProperty("court_name")
    @JsonAlias({"courtName", "court_name"})
    private String courtName;

    @NotNull(message = "Surface type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "surface_type", nullable = false)
    @JsonProperty("surface_type")
    @JsonAlias({"surfaceType", "surface_type"})
    private SurfaceType surfaceType;

    @NotNull(message = "Max players is required")
    @Column(name = "max_players", nullable = false)
    @JsonProperty("max_players")
    @JsonAlias({"maxPlayers", "max_players"})
    private Integer maxPlayers;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @JsonProperty("is_active")
    @JsonAlias({"isActive", "is_active", "active"})
    private Boolean isActive = Boolean.TRUE;

    public Boolean getIsActive() {
        return isActive != null ? isActive : Boolean.TRUE;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive != null ? isActive : Boolean.TRUE;
    }

    public boolean isActive() {
        return isActive != null && isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CourtImageEntity> images = new ArrayList<>();

    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Pricingruleentity> pricingRules = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private Date updatedAt;
}

