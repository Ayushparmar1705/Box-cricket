package com.facility_service.facility_service.dto.Requestdto;

import com.facility_service.facility_service.Model.SurfaceType;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================================
 * Request DTO: CourtRequestDto
 * Description: Data transfer object used when creating a new Court.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtRequestDto {

    @NotNull(message = "Venue ID is required")
    @JsonProperty("venue_id")
    @JsonAlias({"venueId", "venue_id"})
    private Integer venueId;

    @NotNull(message = "Category ID is required")
    @JsonProperty("category_id")
    @JsonAlias({"categoryId", "category_id"})
    private Integer categoryId;

    @NotBlank(message = "Court name is required")
    @JsonProperty("court_name")
    @JsonAlias({"courtName", "court_name"})
    private String courtName;

    @NotNull(message = "Surface type is required")
    @JsonProperty("surface_type")
    @JsonAlias({"surfaceType", "surface_type"})
    private SurfaceType surfaceType;

    @NotNull(message = "Max players is required")
    @JsonProperty("max_players")
    @JsonAlias({"maxPlayers", "max_players"})
    private Integer maxPlayers;

    @JsonProperty("description")
    private String description;

    @JsonProperty("is_active")
    @JsonAlias({"isActive", "is_active", "active"})
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;
}

